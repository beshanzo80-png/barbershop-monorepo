import { PrismaClient, Role, ServiceCategory, AppointmentStatus, PaymentStatus, NotificationType, LoyaltyTransactionType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash password for test users
  const hashedPassword = await bcrypt.hash('Test123!', 12);

  // ==================== SETTINGS ====================
  console.log('📝 Creating settings...');
  const settings = [
    { key: 'shop_name', value: 'Premium Barber', category: 'general', description: 'Dükkan adı' },
    { key: 'shop_phone', value: '+905551234567', category: 'general', description: 'Dükkan telefonu' },
    { key: 'shop_address', value: 'İstanbul, Kadıköy, Moda Cd. No:123', category: 'general', description: 'Dükkan adresi' },
    { key: 'shop_whatsapp', value: '+905551234567', category: 'general', description: 'WhatsApp Business numarası' },
    { key: 'booking_advance_days', value: 60, category: 'booking', description: 'Kaç gün önceden randevu alınabilir' },
    { key: 'booking_min_hours', value: 1, category: 'booking', description: 'Minimum kaç saat öncesine kadar randevu alınabilir' },
    { key: 'slot_interval_minutes', value: 30, category: 'booking', description: 'Randevu slot aralığı (dk)' },
    { key: 'reminder_24h_enabled', value: true, category: 'notification', description: '24 saat hatırlatma aktif' },
    { key: 'reminder_2h_enabled', value: true, category: 'notification', description: '2 saat hatırlatma aktif' },
    { key: 'gold_color', value: '#D4A843', category: 'appearance', description: 'Marka rengi (Gold)' },
    { key: 'dark_bg', value: '#0D0D0D', category: 'appearance', description: 'Koyu tema arka plan' },
    { key: 'online_payment_discount', value: 10, category: 'payment', description: 'Online ödeme indirimi (%)' },
    { key: 'loyalty_points_per_tl', value: 1, category: 'payment', description: '1 TL = 1 Puan' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }

  // ==================== LOYALTY TIERS ====================
  console.log('🏆 Creating loyalty tiers...');
  const tiers = [
    { name: 'Bronze', minPoints: 0, discount: 0, benefits: ['Randevu alma', 'Favori berber kaydetme'], color: '#CD7F32', icon: '🥉' },
    { name: 'Silver', minPoints: 500, discount: 5, benefits: ['%5 indirim', 'Öncelikli destek', 'Ücretsiz kaş düzeltme'], color: '#C0C0C0', icon: '🥈' },
    { name: 'Gold', minPoints: 1500, discount: 10, benefits: ['%10 indirim', 'Ücretsiz sakal tıraşı', 'Erken randevu erişimi', 'Özel hediyeler'], color: '#D4A843', icon: '🥇' },
    { name: 'Platinum', minPoints: 3000, discount: 15, benefits: ['%15 indirim', 'Tüm hizmetlerde indirim', 'VIP koltuk garantisi', 'Kişisel danışman', 'Yıl dönümü hediyesi'], color: '#E5E4E2', icon: '💎' },
  ];

  for (const tier of tiers) {
    await prisma.loyaltyTier.upsert({
      where: { name: tier.name },
      update: tier,
      create: tier,
    });
  }

  // ==================== USERS ====================
  console.log('👤 Creating users...');
  
  // Admin
  const admin = await prisma.user.upsert({
    where: { phone: '+905550000000' },
    update: {},
    create: {
      phone: '+905550000000',
      email: 'admin@premiumbarber.com',
      passwordHash: hashedPassword,
      name: 'Admin User',
      role: Role.ADMIN,
      isActive: true,
      emailVerified: new Date(),
      phoneVerified: new Date(),
    },
  });

  // Barbers
  const barberUsers = await Promise.all([
    prisma.user.upsert({
      where: { phone: '+905551111111' },
      update: {},
      create: {
        phone: '+905551111111',
        email: 'ahmet@premiumbarber.com',
        passwordHash: hashedPassword,
        name: 'Ahmet Usta',
        role: Role.BARBER,
        isActive: true,
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { phone: '+905552222222' },
      update: {},
      create: {
        phone: '+905552222222',
        email: 'mehmet@premiumbarber.com',
        passwordHash: hashedPassword,
        name: 'Mehmet Usta',
        role: Role.BARBER,
        isActive: true,
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { phone: '+905553333333' },
      update: {},
      create: {
        phone: '+905553333333',
        email: 'can@premiumbarber.com',
        passwordHash: hashedPassword,
        name: 'Can Usta',
        role: Role.BARBER,
        isActive: true,
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
    }),
  ]);

  // Customers
  const customerUsers = await Promise.all([
    prisma.user.upsert({
      where: { phone: '+905554444444' },
      update: {},
      create: {
        phone: '+905554444444',
        email: 'ali@example.com',
        passwordHash: hashedPassword,
        name: 'Ali Yılmaz',
        role: Role.CUSTOMER,
        isActive: true,
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { phone: '+905555555555' },
      update: {},
      create: {
        phone: '+905555555555',
        email: 'veli@example.com',
        passwordHash: hashedPassword,
        name: 'Veli Demir',
        role: Role.CUSTOMER,
        isActive: true,
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
    }),
  ]);

  // ==================== BARBERS ====================
  console.log('✂️ Creating barber profiles...');
  const barbers = await Promise.all([
    prisma.barber.upsert({
      where: { userId: barberUsers[0].id },
      update: {},
      create: {
        userId: barberUsers[0].id,
        bio: '15 yıllık deneyimle klasik ve modern kesimlerde uzman. Fade ve taper tekniklerinde ustalaşmış.',
        experienceYears: 15,
        specialties: ['Klasik Kesim', 'Fade', 'Taper', 'Sakal Tasarımı'],
        rating: 4.9,
        reviewCount: 127,
        commissionRate: 45,
        hireDate: new Date('2018-03-15'),
        isActive: true,
      },
    }),
    prisma.barber.upsert({
      where: { userId: barberUsers[1].id },
      update: {},
      create: {
        userId: barberUsers[1].id,
        bio: 'Sakal tasarımı ve cilt bakımı konusunda uzman. Geleneksel usta tıraşı deneyimi sunar.',
        experienceYears: 10,
        specialties: ['Sakal Tasarımı', 'Geleneksel Tıraş', 'Cilt Bakımı', 'Kaş Düzenleme'],
        rating: 4.8,
        reviewCount: 89,
        commissionRate: 40,
        hireDate: new Date('2020-01-10'),
        isActive: true,
      },
    }),
    prisma.barber.upsert({
      where: { userId: barberUsers[2].id },
      update: {},
      create: {
        userId: barberUsers[2].id,
        bio: 'Genç ve dinamik berber. Modern trendler, renk uygulamaları ve yaratıcı stiller konusunda uzman.',
        experienceYears: 5,
        specialties: ['Modern Kesim', 'Saç Boyama', 'Creative Styles', 'Çocuk Kesimi'],
        rating: 4.7,
        reviewCount: 56,
        commissionRate: 35,
        hireDate: new Date('2022-06-01'),
        isActive: true,
      },
    }),
  ]);

  // ==================== BARBER SCHEDULES ====================
  console.log('📅 Creating barber schedules...');
  // All barbers work Mon-Sat 09:00-19:00, break 13:00-14:00
  for (const barber of barbers) {
    for (let day = 1; day <= 6; day++) { // Mon-Sat
      await prisma.barberSchedule.upsert({
        where: { barberId_dayOfWeek: { barberId: barber.id, dayOfWeek: day } },
        update: {},
        create: {
          barberId: barber.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '19:00',
          breakStart: '13:00',
          breakEnd: '14:00',
          isActive: true,
        },
      });
    }
    // Sunday - only Ahmet works half day
    if (barber.user.name === 'Ahmet Usta') {
      await prisma.barberSchedule.upsert({
        where: { barberId_dayOfWeek: { barberId: barber.id, dayOfWeek: 0 } },
        update: {},
        create: {
          barberId: barber.id,
          dayOfWeek: 0,
          startTime: '10:00',
          endTime: '14:00',
          isActive: true,
        },
      });
    }
  }

  // ==================== CHAIRS ====================
  console.log('🪑 Creating chairs...');
  const chairs = await Promise.all([
    prisma.chair.upsert({
      where: { number: 1 },
      update: {},
      create: { number: 1, name: 'VIP Koltuk 1', isActive: true, barberId: barbers[0].id },
    }),
    prisma.chair.upsert({
      where: { number: 2 },
      update: {},
      create: { number: 2, name: 'VIP Koltuk 2', isActive: true, barberId: barbers[0].id },
    }),
    prisma.chair.upsert({
      where: { number: 3 },
      update: {},
      create: { number: 3, name: 'Standart Koltuk 1', isActive: true, barberId: barbers[1].id },
    }),
    prisma.chair.upsert({
      where: { number: 4 },
      update: {},
      create: { number: 4, name: 'Standart Koltuk 2', isActive: true, barberId: barbers[1].id },
    }),
    prisma.chair.upsert({
      where: { number: 5 },
      update: {},
      create: { number: 5, name: 'Standart Koltuk 3', isActive: true, barberId: barbers[2].id },
    }),
    prisma.chair.upsert({
      where: { number: 6 },
      update: {},
      create: { number: 6, name: 'Yedek Koltuk', isActive: true, barberId: null },
    }),
  ]);

  // ==================== SERVICES ====================
  console.log('✂️ Creating services...');
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: 'service-haircut' },
      update: {},
      create: {
        id: 'service-haircut',
        name: 'Saç Kesimi',
        description: 'Klasik veya modern saç kesimi, şekillendirme ve fınış',
        duration: 30,
        price: 150.00,
        category: ServiceCategory.HAIRCUT,
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-beard' },
      update: {},
      create: {
        id: 'service-beard',
        name: 'Sakal Tıraşı',
        description: 'Geleneksel usta tıraşı, sıcak bez ile cilt bakımı',
        duration: 20,
        price: 80.00,
        category: ServiceCategory.BEARD,
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-combo' },
      update: {},
      create: {
        id: 'service-combo',
        name: 'Saç + Sakal Kombo',
        description: 'Saç kesimi ve sakal tıraşı paketi',
        duration: 45,
        price: 200.00,
        category: ServiceCategory.PACKAGE,
        sortOrder: 3,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-hair-color' },
      update: {},
      create: {
        id: 'service-hair-color',
        name: 'Saç Boyama',
        description: 'Profesyonel saç boyama (kök/tam)',
        duration: 45,
        price: 180.00,
        category: ServiceCategory.COLORING,
        sortOrder: 4,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-beard-color' },
      update: {},
      create: {
        id: 'service-beard-color',
        name: 'Sakal Boyama',
        description: 'Doğal görünümde sakal boyama',
        duration: 15,
        price: 60.00,
        category: ServiceCategory.COLORING,
        sortOrder: 5,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-skin-care' },
      update: {},
      create: {
        id: 'service-skin-care',
        name: 'Cilt Bakımı',
        description: 'Derin temizlik, peeling, mask ve nemlendirme',
        duration: 25,
        price: 120.00,
        category: ServiceCategory.TREATMENT,
        sortOrder: 6,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-eyebrow' },
      update: {},
      create: {
        id: 'service-eyebrow',
        name: 'Kaş Düzenleme',
        description: 'Kaş şekillendirme ve tıraş',
        duration: 10,
        price: 40.00,
        category: ServiceCategory.TREATMENT,
        sortOrder: 7,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-kids' },
      update: {},
      create: {
        id: 'service-kids',
        name: 'Çocuk Kesimi (0-12 yaş)',
        description: 'Çocuklara özel saç kesimi',
        duration: 20,
        price: 100.00,
        category: ServiceCategory.KIDS,
        sortOrder: 8,
        isActive: true,
      },
    }),
  ]);

  // ==================== BARBER SERVICES ====================
  console.log('🔗 Linking barbers to services...');
  // All barbers can do all services, but with different prices for senior barber
  for (const barber of barbers) {
    for (const service of services) {
      const customPrice = barber.user.name === 'Ahmet Usta' && service.category === ServiceCategory.HAIRCUT 
        ? service.price + 20 
        : null;
      
      await prisma.barberService.upsert({
        where: { barberId_serviceId: { barberId: barber.id, serviceId: service.id } },
        update: {},
        create: {
          barberId: barber.id,
          serviceId: service.id,
          customPrice,
        },
      });
    }
  }

  // ==================== CUSTOMERS ====================
  console.log('👥 Creating customer profiles...');
  await Promise.all([
    prisma.customer.upsert({
      where: { userId: customerUsers[0].id },
      update: {},
      create: {
        userId: customerUsers[0].id,
        loyaltyPoints: 350,
        totalVisits: 5,
        totalSpent: 850.00,
        birthDate: new Date('1990-05-15'),
        preferredBarberId: barbers[0].id,
        marketingConsent: true,
      },
    }),
    prisma.customer.upsert({
      where: { userId: customerUsers[1].id },
      update: {},
      create: {
        userId: customerUsers[1].id,
        loyaltyPoints: 1200,
        totalVisits: 12,
        totalSpent: 2400.00,
        birthDate: new Date('1985-11-22'),
        preferredBarberId: barbers[1].id,
        marketingConsent: true,
      },
    }),
  ]);

  // ==================== SAMPLE APPOINTMENTS ====================
  console.log('📋 Creating sample appointments...');
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(14, 30, 0, 0);

  const dayAfterTomorrow = new Date(now);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  dayAfterTomorrow.setHours(10, 0, 0, 0);

  // Past completed appointment for loyalty points
  const pastDate = new Date(now);
  pastDate.setDate(pastDate.getDate() - 7);
  pastDate.setHours(15, 0, 0, 0);

  const completedAppt = await prisma.appointment.create({
    data: {
      customerId: customerUsers[0].id,
      barberId: barbers[0].id,
      chairId: chairs[0].id,
      status: AppointmentStatus.COMPLETED,
      startTime: pastDate,
      endTime: new Date(pastDate.getTime() + 45 * 60 * 1000),
      totalDuration: 45,
      totalPrice: 200.00,
      discount: 0,
      finalPrice: 200.00,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: PaymentMethod.CASH,
      services: {
        create: [
          { serviceId: services[0].id, price: 150.00, duration: 30, sortOrder: 1 },
          { serviceId: services[1].id, price: 80.00, duration: 20, sortOrder: 2 },
        ],
      },
    },
  });

  // Loyalty transaction for completed appointment
  await prisma.loyaltyTransaction.create({
    data: {
      customerId: customerUsers[0].id,
      appointmentId: completedAppt.id,
      type: LoyaltyTransactionType.EARN,
      points: 200,
      balanceAfter: 350,
      description: 'Randevu tamamlandı',
    },
  });

  // Upcoming confirmed appointment
  await prisma.appointment.create({
    data: {
      customerId: customerUsers[0].id,
      barberId: barbers[0].id,
      chairId: chairs[1].id,
      status: AppointmentStatus.CONFIRMED,
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 30 * 60 * 1000),
      totalDuration: 30,
      totalPrice: 150.00,
      discount: 0,
      finalPrice: 150.00,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.CASH,
      services: {
        create: [
          { serviceId: services[0].id, price: 150.00, duration: 30, sortOrder: 1 },
        ],
      },
    },
  });

  // Another upcoming appointment
  await prisma.appointment.create({
    data: {
      customerId: customerUsers[1].id,
      barberId: barbers[1].id,
      chairId: chairs[2].id,
      status: AppointmentStatus.CONFIRMED,
      startTime: dayAfterTomorrow,
      endTime: new Date(dayAfterTomorrow.getTime() + 20 * 60 * 1000),
      totalDuration: 20,
      totalPrice: 80.00,
      discount: 0,
      finalPrice: 80.00,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.ONLINE,
      services: {
        create: [
          { serviceId: services[1].id, price: 80.00, duration: 20, sortOrder: 1 },
        ],
      },
    },
  });

  // ==================== NOTIFICATIONS ====================
  console.log('🔔 Creating notifications...');
  await prisma.notification.createMany({
    data: [
      {
        userId: customerUsers[0].id,
        type: NotificationType.APPOINTMENT_CONFIRMED,
        title: 'Randevunuz Onaylandı',
        message: 'Ahmet Usta ile 14:30 randevunuz onaylandı.',
        data: { appointmentId: completedAppt.id, actionUrl: '/appointments' },
        isRead: true,
        readAt: new Date(),
      },
      {
        userId: customerUsers[1].id,
        type: NotificationType.APPOINTMENT_REMINDER_24H,
        title: 'Yarın Randevunuz Var',
        message: 'Mehmet Usta ile saat 10:00 randevunuz var.',
        data: { actionUrl: '/appointments' },
        isRead: false,
      },
    ],
  });

  // ==================== FAVORITES ====================
  console.log('⭐ Creating favorites...');
  await prisma.favorite.createMany({
    data: [
      { userId: customerUsers[0].id, barberId: barbers[0].id },
      { userId: customerUsers[0].id, serviceId: services[0].id },
      { userId: customerUsers[1].id, barberId: barbers[1].id },
      { userId: customerUsers[1].id, serviceId: services[1].id },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Database seed completed successfully!');
  console.log('');
  console.log('Test Accounts:');
  console.log('  Admin: +905550000000 / Test123!');
  console.log('  Ahmet Usta: +905551111111 / Test123!');
  console.log('  Mehmet Usta: +905552222222 / Test123!');
  console.log('  Can Usta: +905553333333 / Test123!');
  console.log('  Ali Yılmaz: +905554444444 / Test123!');
  console.log('  Veli Demir: +905555555555 / Test123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });