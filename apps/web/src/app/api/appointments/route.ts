import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@barbershop/database';
import { z } from 'zod';
import { getIyzicoService, createBarbershopPaymentRequest } from '@barbershop/payments';
import { NotificationService } from '@barbershop/notifications';

const createAppointmentSchema = z.object({
  serviceIds: z.array(z.string()).min(1, 'En az bir hizmet seçin'),
  barberId: z.string().min(1, 'Berber seçin'),
  chairId: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Geçerli tarih girin (YYYY-MM-DD)'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Geçerli saat girin (HH:MM)'),
  phone: z.string().regex(/^\+905\d{9}$/, 'Geçerli telefon numarası'),
  email: z.string().email('Geçerli e-posta').optional().or(z.literal('')),
  notes: z.string().max(500).optional(),
  paymentMethod: z.enum(['CASH', 'CARD', 'ONLINE', 'LOYALTY_POINTS', 'MIXED']),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {
      customer: { userId: session.user.id },
    };

    if (status) where.status = status;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          barber: { include: { user: { select: { name: true, avatar: true } } } },
          chair: true,
          services: { include: { service: true } },
          review: true,
        },
        orderBy: { startTime: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.appointment.count({ where }),
    ]);

    return NextResponse.json({
      data: appointments,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('GET appointments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createAppointmentSchema.parse(body);

    // Get customer
    const customer = await prisma.customer.findUnique({
      where: { userId: session.user.id },
    });
    if (!customer) {
      return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 });
    }

    // Validate services and calculate totals
    const services = await prisma.service.findMany({
      where: { id: { in: validated.serviceIds } },
    });

    if (services.length !== validated.serviceIds.length) {
      return NextResponse.json({ error: 'Invalid services' }, { status: 400 });
    }

    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);
    const totalPrice = services.reduce((sum, s) => sum + Number(s.price), 0);

    // Apply online discount
    let discount = 0;
    let finalPrice = totalPrice;
    if (validated.paymentMethod === 'ONLINE') {
      const settings = await prisma.setting.findUnique({ where: { key: 'online_payment_discount' } });
      const discountPercent = settings ? Number(settings.value) : 10;
      discount = (totalPrice * discountPercent) / 100;
      finalPrice = totalPrice - discount;
    }

    // Check availability
    const startTime = new Date(`${validated.date}T${validated.time}:00`);
    const endTime = new Date(startTime.getTime() + totalDuration * 60000);

    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        barberId: validated.barberId,
        status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    if (conflictingAppointment) {
      return NextResponse.json({ error: 'Bu saat dilimi dolu' }, { status: 409 });
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        customerId: customer.id,
        barberId: validated.barberId,
        chairId: validated.chairId,
        status: validated.paymentMethod === 'ONLINE' ? 'PENDING' : 'CONFIRMED',
        startTime,
        endTime,
        totalDuration,
        totalPrice,
        discount,
        finalPrice,
        paymentStatus: validated.paymentMethod === 'ONLINE' ? 'PENDING' : 'PENDING',
        paymentMethod: validated.paymentMethod,
        notes: validated.notes,
        services: {
          create: services.map((s, i) => ({
            serviceId: s.id,
            price: Number(s.price),
            duration: s.duration,
            sortOrder: i,
          })),
        },
      },
      include: {
        barber: { include: { user: { select: { name: true } } } },
        services: { include: { service: true } },
      },
    });

    // If online payment, initialize payment
    if (validated.paymentMethod === 'ONLINE') {
      try {
        const iyzico = getIyzicoService();
        const paymentRequest = createBarbershopPaymentRequest({
          appointmentId: appointment.id,
          appointmentUuid: appointment.id,
          customer: {
            id: session.user.id,
            name: session.user.name,
            email: validated.email || session.user.email || '',
            phone: validated.phone,
          },
          services: services.map(s => ({ id: s.id, name: s.name, price: Number(s.price) })),
          totalPrice: finalPrice,
          callbackUrl: `${process.env.NEXTAUTH_URL}/api/payments/callback`,
          clientIp: request.headers.get('x-forwarded-for') || 'unknown',
        });

        const payment = await iyzico.initializePayment(paymentRequest);

        // Update appointment with payment info
        await prisma.appointment.update({
          where: { id: appointment.id },
          data: { paymentId: payment.paymentId },
        });

        return NextResponse.json({
          appointment,
          paymentUrl: payment.callbackUrl,
          token: payment.token,
        });
      } catch (error) {
        console.error('Payment initialization failed:', error);
        // Don't fail appointment creation, just return appointment
      }
    }

    // Send confirmation notification
    try {
      await NotificationService.sendNotification(customer.userId, 'APPOINTMENT_CONFIRMED', {
        customerName: session.user.name,
        barberName: appointment.barber.user.name,
        date: appointment.startTime,
        time: validated.time,
        services: services.map(s => s.name),
        totalPrice: finalPrice,
        appointmentUrl: `${process.env.NEXTAUTH_URL}/appointments/${appointment.id}`,
      });
    } catch (error) {
      console.error('Notification failed:', error);
    }

    return NextResponse.json({ appointment });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    console.error('POST appointment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}