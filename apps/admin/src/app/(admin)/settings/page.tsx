'use client';

import * as React from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
  Button, Input, Switch, Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Badge, Separator
} from '@barbershop/ui';
import {
  Settings, Bell, Shield, Palette, Globe, Database, CreditCard,
  Users, Scissors, Clock, Save, AlertTriangle, CheckCircle, Calendar, Mail, Target
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const SETTINGS_TABS = [
  { id: 'general', label: 'Genel', icon: Settings },
  { id: 'booking', label: 'Randevu', icon: Calendar },
  { id: 'notifications', label: 'Bildirimler', icon: Bell },
  { id: 'appearance', label: 'Görünüm', icon: Palette },
  { id: 'payments', label: 'Ödemeler', icon: CreditCard },
  { id: 'integrations', label: 'Entegrasyonlar', icon: Database },
] as const;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState('general');
  const [saving, setSaving] = React.useState(false);

  const generalSettings = {
    shopName: 'Premium Barber',
    shopPhone: '+905551234567',
    shopAddress: 'İstanbul, Kadıköy, Moda Cd. No:123',
    shopEmail: 'info@premiumbarber.com',
    shopWebsite: 'https://premiumbarber.com',
    timezone: 'Europe/Istanbul',
    language: 'tr',
    currency: 'TRY',
  };

  const bookingSettings = {
    advanceDays: 60,
    minHours: 1,
    slotInterval: 30,
    allowWalkIn: true,
    requireConfirmation: true,
    autoCancelMinutes: 15,
    maxServicesPerBooking: 5,
  };

  const notificationSettings = {
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: true,
    reminder24h: true,
    reminder2h: true,
    confirmationEmail: true,
    confirmationSms: true,
    marketingEmails: false,
  };

  const appearanceSettings = {
    darkMode: true,
    primaryColor: '#D4A843',
    compactMode: false,
    animations: true,
  };

  const paymentSettings = {
    iyzicoEnabled: true,
    iyzicoApiKey: '********',
    iyzicoSecretKey: '********',
    onlineDiscount: 10,
    cashEnabled: true,
    cardEnabled: true,
    loyaltyEnabled: true,
    pointsPerTl: 1,
  };

  const integrationSettings = {
    whatsappNumber: '+905551234567',
    whatsappEnabled: true,
    googleMapsUrl: 'https://maps.google.com/?q=Premium+Barber',
    instagramUrl: 'https://instagram.com/premiumbarber',
    facebookUrl: 'https://facebook.com/premiumbarber',
    webhookUrl: 'https://api.premiumbarber.com/webhooks',
    apiKey: 'sk_live_************',
  };

  const handleSave = async (tab: string) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    toast.success(`${SETTINGS_TABS.find(t => t.id === tab)?.label} ayarları kaydedildi`);
  };

  function SettingsSection({ title, icon: Icon, children, action }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; action?: React.ReactNode }) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-gold-primary" />
            {title}
          </CardTitle>
          {action}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    );
  }

  function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4 border-b border-border-subtle/50 last:border-0">
        <div className="flex-1">
          <p className="font-medium text-text-primary">{label}</p>
          {description && <p className="text-sm text-text-muted mt-0.5">{description}</p>}
        </div>
        <div className="flex items-center gap-2">{children}</div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <Settings className="h-7 w-7 text-gold-primary" />
          Sistem Ayarları
        </h1>
        <p className="text-text-secondary">Uygulama yapılandırmasını yönetin</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 bg-bg-tertiary p-1">
          {SETTINGS_TABS.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center justify-center gap-2 px-4 py-3 min-h-[50px]">
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-6 animate-in fade-in-0">
          <SettingsSection title="Mağaza Bilgileri" icon={Settings} action={
            <Button onClick={() => handleSave('general')} loading={saving} variant="gold" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Kaydet
            </Button>
          }>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Mağaza Adı" defaultValue={generalSettings.shopName} />
                <Input label="Telefon" type="tel" defaultValue={generalSettings.shopPhone} />
              </div>
              <Input label="Adres" defaultValue={generalSettings.shopAddress} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="E-posta" type="email" defaultValue={generalSettings.shopEmail} />
                <Input label="Web Sitesi" defaultValue={generalSettings.shopWebsite} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select defaultValue={generalSettings.timezone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Istanbul">İstanbul (UTC+3)</SelectItem>
                    <SelectItem value="Europe/Ankara">Ankara (UTC+3)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue={generalSettings.language}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tr">Türkçe</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue={generalSettings.currency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TRY">Türk Lirası (₺)</SelectItem>
                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection title="Güvenlik" icon={Shield}>
            <div className="space-y-4">
              <SettingRow label="İki Faktörlü Doğrulama" description="Yönetici hesapları için zorunlu 2FA">
                <Button variant="outline" size="sm">Etkinleştir</Button>
              </SettingRow>
              <SettingRow label="Şifre Politikası" description="Minimum 8 karakter, büyük/küçük harf, rakam, özel karakter">
                <Badge variant="success">Aktif</Badge>
              </SettingRow>
              <SettingRow label="Oturum Süresi" description="Kullanıcı ne kadar süre inaktif kalırsa çıkış yapılır">
                <Select defaultValue="24h">
                  <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 Saat</SelectItem>
                    <SelectItem value="8h">8 Saat</SelectItem>
                    <SelectItem value="24h">24 Saat</SelectItem>
                    <SelectItem value="7d">7 Gün</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="API Anahtarı" description="Harici entegrasyonlar için API anahtarı">
                <div className="flex items-center gap-2">
                  <Input defaultValue="sk_live_****************" readOnly className="flex-1" />
                  <Button variant="ghost" size="sm">Kopyala</Button>
                  <Button variant="ghost" size="sm">Yenile</Button>
                </div>
              </SettingRow>
            </div>
          </SettingsSection>
        </TabsContent>

        {/* Booking */}
        <TabsContent value="booking" className="space-y-6 animate-in fade-in-0">
          <SettingsSection title="Randevu Kuralları" icon={Calendar} action={
            <Button onClick={() => handleSave('booking')} loading={saving} variant="gold" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Kaydet
            </Button>
          }>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="İleri Randevu (Gün)" type="number" defaultValue={bookingSettings.advanceDays} />
                <Input label="Minimum Önceden (Saat)" type="number" defaultValue={bookingSettings.minHours} />
                <Input label="Slot Aralığı (Dk)" type="number" defaultValue={bookingSettings.slotInterval} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Maks. Hizmet/Randevu" type="number" defaultValue={bookingSettings.maxServicesPerBooking} />
                <Input label="Otomatik İptal (Dk)" type="number" defaultValue={bookingSettings.autoCancelMinutes} />
              </div>
              <Separator className="my-4" />
              <div className="space-y-3">
                <SettingRow label="Gelen Müşteriye İzin Ver" description="Randevusuz gelen müşterilerin kuyruğa alınması" children={<Switch defaultChecked={bookingSettings.allowWalkIn} />} />
                <SettingRow label="Onay Bekleme" description="Randevular varsayılan olarak onay beklemede başlar" children={<Switch defaultChecked={bookingSettings.requireConfirmation} />} />
              </div>
            </div>
          </SettingsSection>

          <SettingsSection title="Çalışma Saatleri" icon={Clock}>
            <div className="p-4 bg-bg-tertiary rounded-lg">
              <p className="text-text-secondary text-sm mb-4">Berber bazlı çalışma saatleri <a href="/barbers" className="text-gold-primary hover:underline">Berberler</a> sayfasından yönetilebilir.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map(day => (
                  <div key={day} className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                    <span className="font-medium">{day}</span>
                    <div className="flex items-center gap-2">
                      <Input placeholder="09:00" className="w-24" defaultValue={day === 'Pazar' ? '' : '09:00'} />
                      <span className="text-text-muted">-</span>
                      <Input placeholder="19:00" className="w-24" defaultValue={day === 'Pazar' ? '' : '19:00'} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SettingsSection>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6 animate-in fade-in-0">
          <SettingsSection title="Kanal Ayarları" icon={Bell} action={
            <Button onClick={() => handleSave('notifications')} loading={saving} variant="gold" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Kaydet
            </Button>
          }>
            <div className="space-y-3">
              <SettingRow label="E-posta Bildirimleri" description="Sistem e-postalarının gönderilmesi" children={<Switch defaultChecked={notificationSettings.emailEnabled} />} />
              <SettingRow label="SMS Bildirimleri" description="Randevu hatırlatmaları için SMS" children={<Switch defaultChecked={notificationSettings.smsEnabled} />} />
              <SettingRow label="Push Bildirimleri" description="Mobil/web push bildirimleri" children={<Switch defaultChecked={notificationSettings.pushEnabled} />} />
            </div>
          </SettingsSection>

          <SettingsSection title="Hatırlatma Zamanlaması" icon={Clock}>
            <div className="space-y-3">
              <SettingRow label="24 Saat Önce" description="Randevudan 24 saat önce hatırlatma gönder" children={<Switch defaultChecked={notificationSettings.reminder24h} />} />
              <SettingRow label="2 Saat Önce" description="Randevudan 2 saat önce hatırlatma gönder" children={<Switch defaultChecked={notificationSettings.reminder2h} />} />
            </div>
          </SettingsSection>

          <SettingsSection title="Otomatik Mesajlar" icon={Mail}>
            <div className="space-y-3">
              <SettingRow label="Randevu Onayı E-postası" children={<Switch defaultChecked={notificationSettings.confirmationEmail} />} />
              <SettingRow label="Randevu Onayı SMS" children={<Switch defaultChecked={notificationSettings.confirmationSms} />} />
              <SettingRow label="Pazarlama E-postaları" description="Kampanya ve duyuru mailleri (müşteri izni şart)" children={<Switch defaultChecked={notificationSettings.marketingEmails} />} />
            </div>
          </SettingsSection>

          <SettingsSection title="SMS Sağlayıcı (Netgsm)" icon={Database}>
            <div className="space-y-4">
              <Input label="Kullanıcı Kodu" placeholder="NETGSM_USERCODE" />
              <Input label="Şifre" type="password" placeholder="NETGSM_PASSWORD" />
              <Input label="Başlık (Header)" placeholder="BRBRAL" maxLength={11} />
              <Button variant="outline" size="sm">Test SMS Gönder</Button>
            </div>
          </SettingsSection>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-6 animate-in fade-in-0">
          <SettingsSection title="Tema" icon={Palette} action={
            <Button onClick={() => handleSave('appearance')} loading={saving} variant="gold" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Kaydet
            </Button>
          }>
            <div className="space-y-3">
              <SettingRow label="Koyu Tema" description="Sistem tercihine göre otomatik" children={<Switch defaultChecked={appearanceSettings.darkMode} />} />
              <SettingRow label="Animasyonlar" description="Sayfa geçişleri ve mikro etkileşimler" children={<Switch defaultChecked={appearanceSettings.animations} />} />
              <SettingRow label="Kompakt Mod" description="Daha yoğun bilgi görünümü" children={<Switch defaultChecked={appearanceSettings.compactMode} />} />
              <SettingRow label="Marka Rengi" description="Ana vurgulama rengi (Gold)">
                <Input defaultValue={appearanceSettings.primaryColor} type="color" className="w-12 h-10 rounded-lg cursor-pointer border-0 p-0" />
              </SettingRow>
            </div>
          </SettingsSection>
        </TabsContent>

        {/* Payments */}
        <TabsContent value="payments" className="space-y-6 animate-in fade-in-0">
          <SettingsSection title="İyzico Entegrasyonu" icon={CreditCard} action={
            <Button onClick={() => handleSave('payments')} loading={saving} variant="gold" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Kaydet
            </Button>
          }>
            <div className="space-y-4">
              <SettingRow label="İyzico Aktif" description="Online ödeme kabul et" children={<Switch defaultChecked={paymentSettings.iyzicoEnabled} />} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="API Key" type="password" defaultValue={paymentSettings.iyzicoApiKey} />
                <Input label="Secret Key" type="password" defaultValue={paymentSettings.iyzicoSecretKey} />
              </div>
              <Button variant="outline" size="sm">Bağlantıyı Test Et</Button>
            </div>
          </SettingsSection>

          <SettingsSection title="Ödeme Yöntemleri" icon={CreditCard}>
            <div className="space-y-3">
              <SettingRow label="Nakit" children={<Switch defaultChecked={paymentSettings.cashEnabled} />} />
              <SettingRow label="Kredi/Banka Kartı (POS)" children={<Switch defaultChecked={paymentSettings.cardEnabled} />} />
              <SettingRow label="Online Ödeme (İyzico)" children={<Switch defaultChecked={paymentSettings.iyzicoEnabled} />} />
              <SettingRow label="Sadakat Puanları" children={<Switch defaultChecked={paymentSettings.loyaltyEnabled} />} />
            </div>
          </SettingsSection>

          <SettingsSection title="İndirim ve Sadakat" icon={Target}>
            <div className="space-y-4">
              <SettingRow label="Online Ödeme İndirimi (%)" description="Online ödeme yapan müşterilere otomatik indirim" children={
                <Select defaultValue={paymentSettings.onlineDiscount.toString()}>
                  <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20].map(v => <SelectItem key={v} value={v.toString()}>{v}%</SelectItem>)}
                  </SelectContent>
                </Select>
              } />
              <SettingRow label="TL Başına Puan" description="1 TL = X Puan kazancı" children={
                <Input type="number" defaultValue={paymentSettings.pointsPerTl} className="w-[100px]" />
              } />
            </div>
          </SettingsSection>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6 animate-in fade-in-0">
          <SettingsSection title="WhatsApp Business" icon={MessageSquare} action={
            <Button onClick={() => handleSave('integrations')} loading={saving} variant="gold" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Kaydet
            </Button>
          }>
            <div className="space-y-4">
              <SettingRow label="WhatsApp Aktif" children={<Switch defaultChecked={integrationSettings.whatsappEnabled} />} />
              <Input label="WhatsApp Numarası" placeholder="+905551234567" defaultValue={integrationSettings.whatsappNumber} />
              <Button variant="outline" size="sm">Bağlantıyı Test Et</Button>
            </div>
          </SettingsSection>

          <SettingsSection title="Sosyal Medya" icon={Globe}>
            <div className="space-y-4">
              <Input label="Google Maps URL" defaultValue={integrationSettings.googleMapsUrl} />
              <Input label="Instagram URL" defaultValue={integrationSettings.instagramUrl} />
              <Input label="Facebook URL" defaultValue={integrationSettings.facebookUrl} />
            </div>
          </SettingsSection>

          <SettingsSection title="Webhook & API" icon={Database}>
            <div className="space-y-4">
              <Input label="Webhook URL" defaultValue={integrationSettings.webhookUrl} />
              <div className="flex items-center gap-2">
                <Input defaultValue={integrationSettings.apiKey} readOnly className="flex-1" />
                <Button variant="ghost" size="sm">Kopyala</Button>
                <Button variant="ghost" size="sm" onClick={() => toast.success('Yeni API anahtarı oluşturuldu')}>Yenile</Button>
              </div>
              <div className="p-4 bg-warning-bg border border-warning/30 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-warning mr-2" />
                <span className="text-sm text-warning">Webhook güvenliği için imza doğrulama (HMAC-SHA256) kullanın.</span>
              </div>
            </div>
          </SettingsSection>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Need to import MessageSquare
import { MessageSquare } from 'lucide-react';