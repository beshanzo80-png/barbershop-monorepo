import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'ioredis';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

config();

const prisma = new PrismaClient();

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
  barberId?: string;
}

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const PORT = parseInt(process.env.SOCKET_PORT || '3002', 10);

// Redis clients for adapter
const pubClient = createClient(REDIS_URL);
const subClient = pubClient.duplicate();

const io = new Server({
  cors: {
    origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  adapter: createAdapter(pubClient, subClient),
});

// Authentication middleware
io.use(async (socket: AuthenticatedSocket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication required'));
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; role: string; barberId?: string };
    
    socket.userId = decoded.sub;
    socket.userRole = decoded.role;
    socket.barberId = decoded.barberId;
    
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
});

// Connection handling
io.on('connection', async (socket: AuthenticatedSocket) => {
  console.log(`Client connected: ${socket.id} (User: ${socket.userId}, Role: ${socket.userRole})`);

  // Join user's personal room for notifications
  socket.join(`user:${socket.userId}`);

  // Barber joins their own room for real-time updates
  if (socket.userRole === 'BARBER' && socket.barberId) {
    socket.join(`barber:${socket.barberId}`);
  }

  // Admin joins admin room
  if (socket.userRole === 'ADMIN' || socket.userRole === 'SUPER_ADMIN') {
    socket.join('admins');
  }

  // Handle availability subscription
  socket.on('availability:subscribe', async (date: string) => {
    try {
      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        socket.emit('error', { message: 'Invalid date format. Use YYYY-MM-DD' });
        return;
      }

      socket.join(`availability:${date}`);
      
      // Send current availability
      const slots = await getAvailableSlotsForDate(date);
      socket.emit('availability:update', { date, slots });
    } catch (error) {
      console.error('Availability subscribe error:', error);
      socket.emit('error', { message: 'Failed to subscribe to availability' });
    }
  });

  socket.on('availability:unsubscribe', (date: string) => {
    socket.leave(`availability:${date}`);
  });

  // Handle appointment tracking
  socket.on('appointment:track', (appointmentId: string) => {
    socket.join(`appointment:${appointmentId}`);
  });

  socket.on('appointment:untrack', (appointmentId: string) => {
    socket.leave(`appointment:${appointmentId}`);
  });

  // Handle walk-in queue
  socket.on('queue:join', async (data: { serviceId: string; customerId: string }) => {
    if (socket.userRole !== 'CUSTOMER') return;
    
    // Add to queue logic would go here
    socket.join('walkin-queue');
    socket.emit('queue:update', { position: 1, estimatedWait: 15 });
  });

  socket.on('queue:leave', () => {
    socket.leave('walkin-queue');
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected: ${socket.id} (${reason})`);
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// Helper function to get available slots for a date
async function getAvailableSlotsForDate(date: string) {
  const targetDate = new Date(date);
  const dayOfWeek = targetDate.getDay(); // 0 = Sunday

  // Get all active barbers with their schedules for this day
  const barbers = await prisma.barber.findMany({
    where: {
      isActive: true,
      schedules: {
        some: {
          dayOfWeek,
          isActive: true,
        },
      },
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      schedules: {
        where: { dayOfWeek, isActive: true },
      },
      chairs: { where: { isActive: true } },
      services: { include: { service: true } },
    },
  });

  const allSlots: any[] = [];

  for (const barber of barbers) {
    const schedule = barber.schedules[0];
    if (!schedule) continue;

    const { startTime, endTime, breakStart, breakEnd } = schedule;
    const serviceDuration = 30; // Default slot interval
    const slotInterval = 30;

    // Get existing appointments for this barber on this date
    const appointments = await prisma.appointment.findMany({
      where: {
        barberId: barber.id,
        status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
        startTime: {
          gte: new Date(`${date}T00:00:00`),
          lt: new Date(`${date}T23:59:59`),
        },
      },
      select: { startTime: true, endTime: true },
    });

    const bookedSlots = appointments.map(a => ({
      start: a.startTime.toTimeString().slice(0, 5),
      end: a.endTime.toTimeString().slice(0, 5),
    }));

    // Generate time slots
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    let currentMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    const breakStartMin = breakStart ? breakStart.split(':').map(Number).reduce((h, m) => h * 60 + m) : -1;
    const breakEndMin = breakEnd ? breakEnd.split(':').map(Number).reduce((h, m) => h * 60 + m) : -1;

    while (currentMinutes + serviceDuration <= endMinutes) {
      const slotStartMin = currentMinutes;
      const slotEndMin = currentMinutes + serviceDuration;

      // Check break time
      let inBreak = false;
      if (breakStartMin !== -1 && breakEndMin !== -1) {
        if (slotStartMin >= breakStartMin && slotEndMin <= breakEndMin) {
          inBreak = true;
        } else if (slotStartMin < breakEndMin && slotEndMin > breakStartMin) {
          inBreak = true;
        }
      }

      // Check booked slots
      let isBooked = false;
      if (!inBreak) {
        for (const booked of bookedSlots) {
          const [bStartH, bStartM] = booked.start.split(':').map(Number);
          const [bEndH, bEndM] = booked.end.split(':').map(Number);
          const bookedStartMin = bStartH * 60 + bStartM;
          const bookedEndMin = bEndH * 60 + bEndM;

          if (slotStartMin < bookedEndMin && slotEndMin > bookedStartMin) {
            isBooked = true;
            break;
          }
        }
      }

      if (!inBreak) {
        const hour = Math.floor(slotStartMin / 60).toString().padStart(2, '0');
        const min = (slotStartMin % 60).toString().padStart(2, '0');
        const time = `${hour}:${min}`;

        // Assign chair if available
        const availableChair = barber.chairs.find(c => c.isActive);
        
        allSlots.push({
          time,
          timeFormatted: time,
          available: !isBooked,
          barberId: barber.id,
          barberName: barber.user.name,
          barberAvatar: barber.user.avatar,
          chairId: availableChair?.id,
          chairNumber: availableChair?.number,
        });
      }

      currentMinutes += slotInterval;
    }
  }

  return allSlots.sort((a, b) => a.time.localeCompare(b.time));
}

// Broadcast functions for external use
export function broadcastAvailabilityUpdate(date: string, slots: any[]) {
  io.to(`availability:${date}`).emit('availability:update', { date, slots });
}

export function broadcastAppointmentStatus(appointmentId: string, status: string, barberId?: string) {
  io.to(`appointment:${appointmentId}`).emit('appointment:status', { appointmentId, status, barberId });
  if (barberId) {
    io.to(`barber:${barberId}`).emit('appointment:status', { appointmentId, status, barberId });
  }
  io.to('admins').emit('appointment:status', { appointmentId, status, barberId });
}

export function broadcastNewAppointment(appointment: any) {
  io.to(`barber:${appointment.barberId}`).emit('appointment:new', appointment);
  io.to('admins').emit('appointment:new', appointment);
}

export function broadcastNotification(userId: string, notification: any) {
  io.to(`user:${userId}`).emit('notification:new', notification);
}

export function broadcastQueueUpdate(position: number, estimatedWait: number) {
  io.to('walkin-queue').emit('queue:update', { position, estimatedWait });
}

// Start server
const httpServer = new HttpServer();
io.attach(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.io server running on port ${PORT}`);
  console.log(`📡 Ready for real-time connections`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  io.close();
  await pubClient.quit();
  await subClient.quit();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  io.close();
  await pubClient.quit();
  await subClient.quit();
  await prisma.$disconnect();
  process.exit(0);
});

export { io };