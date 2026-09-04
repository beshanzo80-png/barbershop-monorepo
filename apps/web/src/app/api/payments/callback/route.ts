import { NextRequest, NextResponse } from 'next/server';
import { getIyzicoService } from '@barbershop/payments';
import { prisma } from '@barbershop/database';
import { NotificationService } from '@barbershop/notifications';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = formData.get('token') as string;

    if (!token) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/booking?error=missing_token`);
    }

    // Retrieve payment result
    const iyzico = getIyzicoService();
    const result = await iyzico.retrievePayment(token);

    if (result.status !== 'success') {
      console.error('Payment failed:', result.errorMessage);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/booking?error=payment_failed`);
    }

    // Find appointment by paymentId
    const appointment = await prisma.appointment.findFirst({
      where: { paymentId: result.paymentId },
      include: {
        customer: { select: { userId: true } },
        barber: { include: { user: { select: { name: true } } } },
        services: { include: { service: true } },
      },
    });

    if (!appointment) {
      console.error('Appointment not found for payment:', result.paymentId);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/booking?error=appointment_not_found`);
    }

    // Update appointment status
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentMethod: 'ONLINE',
      },
    });

    // Send confirmation notification
    try {
      await NotificationService.sendNotification(appointment.customer.userId, 'APPOINTMENT_CONFIRMED', {
        customerName: appointment.customer.user?.name || 'Müşteri',
        barberName: appointment.barber.user.name,
        date: appointment.startTime,
        time: appointment.startTime.toTimeString().slice(0, 5),
        services: appointment.services.map(s => s.service.name),
        totalPrice: appointment.finalPrice,
        appointmentUrl: `${process.env.NEXTAUTH_URL}/appointments/${appointment.id}`,
      });
    } catch (error) {
      console.error('Notification failed:', error);
    }

    // Redirect to success page
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/appointments/${appointment.id}?success=true`);
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/booking?error=callback_error`);
  }
}

export async function GET(request: NextRequest) {
  // Handle GET callback (some payment gateways redirect with GET)
  return POST(request);
}