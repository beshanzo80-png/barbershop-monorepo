import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@barbershop/db';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const activeOnly = searchParams.get('active') !== 'false';

    const where: any = {};
    if (category) where.category = category;
    if (activeOnly) where.isActive = true;

    const services = await prisma.service.findMany({
      where,
      include: {
        barberServices: {
          include: { barber: { include: { user: { select: { name: true, avatar: true } } } } },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });

    // Get user's favorites if authenticated
    let favoriteServiceIds: string[] = [];
    const session = await auth();
    if (session?.user?.id) {
      const favorites = await prisma.favorite.findMany({
        where: { userId: session.user.id, serviceId: { not: null } },
        select: { serviceId: true },
      });
      favoriteServiceIds = favorites.map(f => f.serviceId!).filter(Boolean);
    }

    return NextResponse.json({
      data: services.map(s => ({
        ...s,
        isFavorite: favoriteServiceIds.includes(s.id),
        barbers: s.barberServices.map(bs => ({
          id: bs.barber.id,
          name: bs.barber.user.name,
          avatar: bs.barber.user.avatar,
          customPrice: bs.price ? Number(bs.price) : null,
          rating: bs.barber.rating,
        })),
      })),
    });
  } catch (error) {
    console.error('GET services error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}