import webPush from 'web-push';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { formatDate, formatTime, formatCurrency } from '@barbershop/utils';

const prisma = new PrismaClient();

// ==================== CONFIGURATION ====================

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@premiumbarber.com';

const NETGSM_USERCODE = process.env.NETGSM_USERCODE || '';
const NETGSM_PASSWORD = process.env.NETGSM_PASSWORD || '';
const NETGSM_HEADER = process.env.NETGSM_HEADER || 'BRBRAL';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'Premium Barber <noreply@premiumbarber.com>';

// Initialize web-push
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

// ==================== TYPES ====================

type NotificationType = 
  | 'APPOINTMENT_CONFIRMED'
  | 'APPOINTMENT_REMINDER_24H'
  | 'APPOINTMENT_REMINDER_2H'
  | 'APPOINTMENT_CANCELLED'
  | 'APPOINTMENT_RESCHEDULED'
  | 'REVIEW_REQUEST'
  | 'PROMOTION'
  | 'LOYALTY_REWARD'
  | 'SYSTEM';

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface SMSTemplate {
  message: string;
}

// ==================== TEMPLATE GENERATORS ====================

function generateAppointmentConfirmedTemplate(data: {
  customerName: string;
  barberName: string;
  date: Date;
  time: string;
  services: string[];
  totalPrice: number;
  appointmentUrl: string;
}): EmailTemplate {
  const serviceList = data.services.map(s => `<li>${s}</li>`).join('');
  
  return {
    subject: `Randevunuz Onaylandı - ${data.barberName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #D4A843; color: #0D0D0D; padding: 30px; text-align; border-radius: 12px 12px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 12px 12px; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
          .detail-label { color: #888; }
          .detail-value { font-weight: 600; color: #333; }
          .price { color: #D4A843; font-size: 1.2em; font-weight: bold; }
          .btn { display: inline-block; background: #D4A843; color: #0D0D0D; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #888; font-size: 0.85em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✂️ Premium Barber</h1>
            <p>Randevunuz Onaylandı!</p>
          </div>
          <div class="content">
            <p>Merhaba <strong>${data.customerName}</strong>,</p>
            <p>Randevunuz başarıyla onaylandı. Detaylar aşağıdadır:</p>
            
            <div class="detail-row">
              <span class="detail-label">Berber</span>
              <span class="detail-value">${data.barberName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Tarih</span>
              <span class="detail-value">${formatDate(data.date, 'EEEE, d MMMM yyyy')}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Saat</span>
              <span class="detail-value">${data.time}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Hizmetler</span>
              <span class="detail-value">
                <ul style="margin: 0; padding-left: 20px;">${serviceList}</ul>
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Toplam Tutar</span>
              <span class="detail-value price">${formatCurrency(data.totalPrice)}</span>
            </div>
            
            <a href="${data.appointmentUrl}" class="btn">Randevuyu Görüntüle</a>
            
            <p style="margin-top: 30px; color: #888; font-size: 0.9em;">
              <strong>Not:</strong> Randevunuzdan en az 1 saat önce iptal veya değişiklik yapabilirsiniz. 
              Randevu saatinizden 10 dakika önce lütfen salonumuzda olunuz.
            </p>
          </div>
          <div class="footer">
            <p>Premium Barber | İstanbul, Kadıköy, Moda Cd. No:123</p>
            <p>Bu e-posta otomatik gönderilmiştir, lütfen yanıtlamayınız.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Premium Barber - Randevu Onayı

Merhaba ${data.customerName},

Randevunuz onaylandı:
Berber: ${data.barberName}
Tarih: ${formatDate(data.date, 'EEEE, d MMMM yyyy')}
Saat: ${data.time}
Hizmetler: ${data.services.join(', ')}
Toplam: ${formatCurrency(data.totalPrice)}

Detaylar: ${data.appointmentUrl}
    `,
  };
}

function generateReminderTemplate(data: {
  customerName: string;
  barberName: string;
  date: Date;
  time: string;
  hoursUntil: number;
  appointmentUrl: string;
}): EmailTemplate {
  const hoursText = data.hoursUntil === 24 ? '24 saat' : '2 saat';
  
  return {
    subject: `⏰ Hatırlatma: ${hoursText} sonra randevunuz var`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #F59E0B; color: #0D0D0D; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 12px 12px; }
          .alert { background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
          .time { font-size: 2em; font-weight: bold; color: #D4A843; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Premium Barber</h1>
            <p>Randevu Hatırlatması</p>
          </div>
          <div class="content">
            <p>Merhaba <strong>${data.customerName}</strong>,</p>
            <div class="alert">
              <p style="margin: 0; color: #92400E;">Randevunuza <span class="time">${hoursText}</span> kaldı!</p>
            </div>
            <p><strong>Berber:</strong> ${data.barberName}</p>
            <p><strong>Tarih:</strong> ${formatDate(data.date, 'EEEE, d MMMM yyyy')}</p>
            <p><strong>Saat:</strong> ${data.time}</p>
            <p style="text-align: center; margin-top: 30px;">
              <a href="${data.appointmentUrl}" style="background: #D4A843; color: #0D0D0D; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Randevu Detayları
              </a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Premium Barber - Randevu Hatırlatması

Merhaba ${data.customerName},

Randevunuza ${hoursText} kaldı!

Berber: ${data.barberName}
Tarih: ${formatDate(data.date, 'EEEE, d MMMM yyyy')}
Saat: ${data.time}

Detaylar: ${data.appointmentUrl}
    `,
  };
}

function generateSMSTemplate(type: NotificationType, data: any): SMSTemplate {
  const templates: Record<NotificationType, string> = {
    APPOINTMENT_CONFIRMED: `Premium Barber: Randevunuz onaylandı. ${data.barberName} - ${formatDate(data.date, 'd MMM')} ${data.time}. Detay: ${data.appointmentUrl}`,
    APPOINTMENT_REMINDER_24H: `Premium Barber: Yarın randevunuz var. ${data.barberName} - ${data.time}. İptal/değişiklik için: ${data.appointmentUrl}`,
    APPOINTMENT_REMINDER_2H: `Premium Barber: 2 saat sonra randevunuz. ${data.barberName} - ${data.time}. Salonumuzda 10 dk önce olunuz.`,
    APPOINTMENT_CANCELLED: `Premium Barber: Randevunuz iptal edildi. ${data.barberName} - ${formatDate(data.date, 'd MMM')}. Yeni randevu: ${data.appointmentUrl}`,
    APPOINTMENT_RESCHEDULED: `Premium Barber: Randevunuz yenilendi. Yeni: ${data.barberName} - ${formatDate(data.date, 'd MMM')} ${data.time}. Detay: ${data.appointmentUrl}`,
    REVIEW_REQUEST: `Premium Barber: ${data.barberName} ile randevunuz nasıldı? Değerlendirin: ${data.appointmentUrl}`,
    PROMOTION: `Premium Barber: ${data.title}. ${data.message} Detay: ${data.appointmentUrl}`,
    LOYALTY_REWARD: `Premium Barber: ${data.points} sadakat puanı kazandınız! Toplam: ${data.totalPoints} puan.`,
    SYSTEM: `Premium Barber: ${data.message}`,
  };

  return { message: templates[type] || `Premium Barber: ${data.message}` };
}

// ==================== NOTIFICATION SERVICE ====================

export class NotificationService {
  /**
   * Create notification in database
   */
  static async createNotification(userId: string, type: NotificationType, title: string, message: string, data?: any) {
    return prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data ? JSON.parse(JSON.stringify(data)) : null,
      },
    });
  }

  /**
   * Send push notification via Web Push
   */
  static async sendPushNotification(userId: string, title: string, body: string, data?: any) {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (subscriptions.length === 0) return { sent: 0, failed: 0 };

    const payload = JSON.stringify({
      title,
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      data: data || {},
      actions: [
        { action: 'view', title: 'Görüntüle' },
        { action: 'dismiss', title: 'Kapat' },
      ],
      requireInteraction: true,
    });

    let sent = 0;
    let failed = 0;

    for (const sub of subscriptions) {
      try {
        await webPush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys,
          },
          payload
        );
        sent++;
      } catch (error: any) {
        failed++;
        if (error.statusCode === 410 || error.statusCode === 404) {
          // Subscription expired, delete it
          await prisma.pushSubscription.deleteMany({
            where: { endpoint: sub.endpoint },
          });
        }
        console.error('Push notification failed:', error);
      }
    }

    return { sent, failed };
  }

  /**
   * Send email via Resend
   */
  static async sendEmail(to: string, template: EmailTemplate) {
    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping email');
      return { success: false, reason: 'Not configured' };
    }

    try {
      const response = await axios.post('https://api.resend.com/emails', {
        from: EMAIL_FROM,
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      }, {
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      return { success: true, id: response.data.id };
    } catch (error: any) {
      console.error('Email send failed:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Send SMS via Netgsm
   */
  static async sendSMS(phone: string, message: string) {
    if (!NETGSM_USERCODE || !NETGSM_PASSWORD) {
      console.warn('Netgsm credentials not configured, skipping SMS');
      return { success: false, reason: 'Not configured' };
    }

    try {
      // Format phone: +905551234567 -> 5551234567
      const formattedPhone = phone.replace('+90', '');
      
      const params = new URLSearchParams({
        usercode: NETGSM_USERCODE,
        password: NETGSM_PASSWORD,
        header: NETGSM_HEADER,
        msg: message,
        no: formattedPhone,
      });

      const response = await axios.post('https://api.netgsm.com.tr/sms/send/xml', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      // Netgsm returns XML, check for success
      const success = response.data.includes('<status>0</status>');
      return { success, response: response.data };
    } catch (error: any) {
      console.error('SMS send failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send notification via all channels
   */
  static async sendNotification(userId: string, type: NotificationType, data: any) {
    const results = {
      db: false,
      push: { sent: 0, failed: 0 },
      email: { success: false },
      sms: { success: false },
    };

    // Generate templates
    let title = '';
    let message = '';
    let emailTemplate: EmailTemplate | null = null;
    let smsTemplate: SMSTemplate | null = null;

    switch (type) {
      case 'APPOINTMENT_CONFIRMED':
        title = 'Randevunuz Onaylandı';
        message = `Randevunuz ${data.barberName} ile ${formatDate(data.date, 'd MMM')} ${data.time} olarak onaylandı.`;
        emailTemplate = generateAppointmentConfirmedTemplate(data);
        smsTemplate = generateSMSTemplate(type, data);
        break;
      case 'APPOINTMENT_REMINDER_24H':
        title = 'Yarın Randevunuz Var';
        message = `Yarın ${data.time} randevunuz var.`;
        emailTemplate = generateReminderTemplate({ ...data, hoursUntil: 24 });
        smsTemplate = generateSMSTemplate(type, data);
        break;
      case 'APPOINTMENT_REMINDER_2H':
        title = '2 Saat Sonra Randevunuz';
        message = `2 saat sonra ${data.barberName} ile randevunuz var.`;
        emailTemplate = generateReminderTemplate({ ...data, hoursUntil: 2 });
        smsTemplate = generateSMSTemplate(type, data);
        break;
      case 'APPOINTMENT_CANCELLED':
        title = 'Randevu İptal Edildi';
        message = `Randevunuz iptal edildi. Yeni randevu alabilirsiniz.`;
        smsTemplate = generateSMSTemplate(type, data);
        break;
      case 'APPOINTMENT_RESCHEDULED':
        title = 'Randevu Yenilendi';
        message = `Randevunuz ${formatDate(data.date, 'd MMM')} ${data.time} olarak yenilendi.`;
        smsTemplate = generateSMSTemplate(type, data);
        break;
      case 'REVIEW_REQUEST':
        title = 'Değerlendirme İsteği';
        message = 'Randevunuz nasıldı? Değerlendirmenizi bekliyoruz.';
        smsTemplate = generateSMSTemplate(type, data);
        break;
      case 'PROMOTION':
        title = data.title || 'Özel Teklif';
        message = data.message;
        break;
      case 'LOYALTY_REWARD':
        title = 'Puan Kazandınız!';
        message = `${data.points} sadakat puanı hesabınıza eklendi. Toplam: ${data.totalPoints} puan.`;
        smsTemplate = generateSMSTemplate(type, data);
        break;
      default:
        title = 'Bildirim';
        message = data.message || 'Yeni bir bildiriminiz var.';
    }

    // 1. Save to database
    try {
      await this.createNotification(userId, type, title, message, data);
      results.db = true;
    } catch (error) {
      console.error('DB notification failed:', error);
    }

    // 2. Send push notification
    results.push = await this.sendPushNotification(userId, title, message, data);

    // 3. Send email if template exists and user has email
    if (emailTemplate) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
      if (user?.email) {
        results.email = await this.sendEmail(user.email, emailTemplate);
      }
    }

    // 4. Send SMS if template exists and user has phone
    if (smsTemplate) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { phone: true } });
      if (user?.phone) {
        results.sms = await this.sendSMS(user.phone, smsTemplate.message);
      }
    }

    return results;
  }

  /**
   * Save push subscription
   */
  static async savePushSubscription(userId: string, subscription: PushSubscription) {
    return prisma.pushSubscription.upsert({
      where: { userId_endpoint: { userId, endpoint: subscription.endpoint } },
      update: { keys: subscription.keys },
      create: { userId, endpoint: subscription.endpoint, keys: subscription.keys },
    });
  }

  /**
   * Delete push subscription
   */
  static async deletePushSubscription(userId: string, endpoint: string) {
    return prisma.pushSubscription.deleteMany({
      where: { userId, endpoint },
    });
  }

  /**
   * Schedule reminder notifications
   */
  static async scheduleReminders(appointmentId: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        customer: { select: { userId: true } },
        barber: { select: { user: { select: { name: true } } } },
        services: { include: { service: true } },
      },
    });

    if (!appointment) return;

    const startTime = new Date(appointment.startTime);
    const now = new Date();

    // Schedule 24h reminder
    const reminder24h = new Date(startTime.getTime() - 24 * 60 * 60 * 1000);
    if (reminder24h > now) {
      // In production, use a job queue like BullMQ
      console.log(`Schedule 24h reminder for appointment ${appointmentId} at ${reminder24h}`);
    }

    // Schedule 2h reminder
    const reminder2h = new Date(startTime.getTime() - 2 * 60 * 60 * 1000);
    if (reminder2h > now) {
      console.log(`Schedule 2h reminder for appointment ${appointmentId} at ${reminder2h}`);
    }
  }
}

// ==================== HELPER FUNCTIONS ====================

export function generateAppointmentReminderData(appointment: any) {
  return {
    customerName: appointment.customer?.user?.name || 'Müşteri',
    barberName: appointment.barber?.user?.name || 'Berber',
    date: appointment.startTime,
    time: formatTime(appointment.startTime),
    services: appointment.services?.map((s: any) => s.service?.name) || [],
    totalPrice: appointment.finalPrice,
    appointmentUrl: `${process.env.NEXTAUTH_URL}/appointments/${appointment.id}`,
    points: Math.floor(appointment.finalPrice),
    totalPoints: 0, // Would fetch from DB
  };
}

export const notificationService = NotificationService;