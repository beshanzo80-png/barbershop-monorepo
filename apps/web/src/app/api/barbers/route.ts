import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@barbershop/db';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const available = searchParams.get('available') === 'true';
    const specialty = searchParams.get('specialty');
    const date = searchParams.get('date');

    const where: any = { isActive: true };
    if (specialty) where.specialties = { has: specialty };

    const barbers = await prisma.barber.findMany({
      where,
      include: {
        user: { select: { name: true, avatar: true, phone: true, email: true } },
        schedules: { where: { isActive: true } },
        chairs: { where: { isActive: true } },
        reviews: { take: 3, orderBy: { createdAt: 'desc' }, include: { customer: { select: { user: { select: { name: true, avatar: true } } } } } },
        services: { include: { service: true } },
        portfolio: { orderBy: { sortOrder: 'asc' }, take: 6 },
      },
      orderBy: { rating: 'desc' },
    });

    // Get user's favorites
    let favoriteBarberIds: string[] = [];
    const session = await auth();
    if (session?.user?.id) {
      const favorites = await prisma.favorite.findMany({
        where: { userId: session.user.id, barberId: { not: null } },
        select: { barberId: true },
      });
      favoriteBarberIds = favorites.map(f => f.barberId!).filter(Boolean);
    }

    let result = barbers.map(b => ({
      ...b,
      isFavorite: favoriteBarberIds.includes(b.id),
      user: b.user,
      reviews: b.reviews.map(r => ({
        ...r,
        customerName: r.customer.user.name,
        customerAvatar: r.customer.user.avatar,
      })),
    }));

    // If date provided, check real-time availability
    if (date && available) {
      const dayOfWeek = new Date(date).getDay();
      
      result = result.map(barber => {
        const schedule = barber.schedules.find(s => s.dayOfWeek === dayOfWeek && s.isActive);
        if (!schedule) return { ...barber, isAvailable: false, availableSlots: [] };

        // For now, just mark as available if they have schedule
        // Real-time slots would come from socket or separate endpoint
        return { ...barber, isAvailable: true };
      }).filter(b => b.isAvailable);
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('GET barbers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, phone, bio, experienceYears, specialties, commissionRate, hireDate } = body;

    // Create user first
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role: 'BARBER',
        isActive: true,
      },
    });

    // Create barber profile
    const barber = await prisma.barber.create({
      data: {
        userId: user.id,
        bio,
        experienceYears: experienceYears || 0,
        specialties: specialties || [],
        commissionRate: commissionRate || 40,
        hireDate: hireDate ? new Date(hireDate) : new Date(),
      },
    });

    return NextResponse.json({ barber });
  } catch (error) {
    console.error('POST barber error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}