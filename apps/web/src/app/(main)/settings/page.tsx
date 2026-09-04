'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Switch, Separator } from '@barbershop/ui';
import { Settings, Bell, Shield, Palette, Smartphone, Globe, Trash2, Download, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [notifications, setNotifications] = React.useState({
    push: true,
    sms: true,
    email: false,
    reminders24h: true,
    reminders2h: true,
    promotions: false,
  });

  const [appearance, setAppearance] = React.useState({
    darkMode: true,
    hapticFeedback: true,
    reduceMotion: false,
  });

  const [appSettings, setAppSettings] = React.useState({
    language: 'tr',
    autoPlayVideos: false,
    dataSaver: false,
  });

  const handleClearCache = () => {
    if (confirm('Önbellek temizlenecek. Emin misiniz?')) {
      // Clear caches
      toast.success('Önbellek temizlendi');
    }
  };

  const handleExportData = () => {
    toast.success('Verileriniz hazırlanıyor...');
  };

  const handleDeleteAccount = () => {
    if (confirm('Hesabınız kalıcı olarak silinecek. Bu işlem geri alınamaz. Emin misiniz?')) {
      if (prompt('Hesabı silmeyi onaylamak için "SİL" yazın:') === 'SİL') {
        toast.success('Hesap silme talebi alındı');
      }
    }
  };

  const settingGroups = [
    {
      title: 'Bildirimler',
      icon: Bell,
      items: [
        { key: 'push', label: 'Push Bildirimleri', description: 'Uygulama içi anlık bildirimler' },
        { key: 'sms', label: 'SMS Hatırlatmaları', description: 'Randevu öncesi SMS ile hatırlatma' },
        { key: 'email', label: 'E-posta Bildirimleri', description: 'Önemli güncellemeler için e-posta' },
        { key: 'reminders24h', label: '24 Saat Önce Hatırlat', description: 'Randevudan 24 saat önce' },
        { key: 'reminders2h', label: '2 Saat Önce Hatırlat', description: 'Randevudan 2 saat önce' },
        { key: 'promotions', label: 'Kampanya Bildirimleri', description: 'Özel teklifler ve indirimler' },
      ],
    },
    {
      title: 'Güvenlik ve Gizlilik',
      icon: Shield,
      items: [
        { key: 'twoFactor', label: 'İki Faktörlü Doğrulama', description: 'Ekstra güvenlik katmanı', action: 'enable' },
        { key: 'loginHistory', label: 'Giriş Geçmişi', description: 'Son girişlerinizi görüntüleyin', action: 'view' },
        { key: 'activeSessions', label: 'Aktif Oturumlar', description: 'Diğer cihazlardan çıkış yapın', action: 'manage' },
        { key: 'dataExport', label: 'Verilerimi İndir', description: 'Kişisel verilerinizin kopyası', action: 'download' },
        { key: 'deleteAccount', label: 'Hesabı Sil', description: 'Hesabınızı kalıcı olarak silin', action: 'delete', destructive: true },
      ],
    },
    {
      title: 'Görünüm',
      icon: Palette,
      items: [
        { key: 'darkMode', label: 'Koyu Tema', description: 'Sistem temasına göre otomatik', type: 'switch' },
        { key: 'hapticFeedback', label: 'Haptik Geri Bildirim', description: 'Dokunmatik titreme efekti', type: 'switch' },
        { key: 'reduceMotion', label: 'Hareketleri Azalt', description: 'Animasyonları minimize et', type: 'switch' },
      ],
    },
    {
      title: 'Uygulama',
      icon: Smartphone,
      items: [
        { key: 'language', label: 'Dil', description: 'Uygulama dili', type: 'select', options: ['tr', 'en', 'de', 'ar'] },
        { key: 'autoPlayVideos', label: 'Videoları Otomatik Oynat', description: 'Wi-Fi bağlıyken', type: 'switch' },
        { key: 'dataSaver', label: 'Veri Tasarrufu', description: 'Düşük kalite görseller', type: 'switch' },
        { key: 'clearCache', label: 'Önbelleği Temizle', description: 'Geçici dosyaları sil', type: 'action' },
      ],
    },
  ];

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <Settings className="h-7 w-7 text-gold-primary" />
          Ayarlar
        </h1>
        <p className="text-text-secondary">Uygulama tercihlerinizi yönetin</p>
      </div>

      <div className="space-y-6">
        {settingGroups.map((group) => (
          <Card key={group.title}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <group.icon className="h-5 w-5 text-gold-primary" />
                {group.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.items.map((item) => {
                if (item.type === 'switch') {
                  return (
                    <label className="flex items-center justify-between cursor-pointer" key={item.key}>
                      <div>
                        <p className="font-medium text-text-primary">{item.label}</p>
                        <p className="text-sm text-text-muted">{item.description}</p>
                      </div>
                      <Switch
                        checked={appearance[item.key] || notifications[item.key] || appSettings[item.key]}
                        onCheckedChange={(checked) => {
                          if (item.key in notifications) setNotifications(prev => ({ ...prev, [item.key]: checked }));
                          else if (item.key in appearance) setAppearance(prev => ({ ...prev, [item.key]: checked }));
                          else setAppSettings(prev => ({ ...prev, [item.key]: checked }));
                        }}
                      />
                    </label>
                  );
                }
                
                if (item.type === 'select') {
                  return (
                    <div className="flex items-center justify-between" key={item.key}>
                      <div>
                        <p className="font-medium text-text-primary">{item.label}</p>
                        <p className="text-sm text-text-muted">{item.description}</p>
                      </div>
                      <select
                        value={appSettings[item.key]}
                        onChange={(e) => setAppSettings(prev => ({ ...prev, [item.key]: e.target.value }))}
                        className="px-3 py-2 bg-bg-tertiary border border-border-default rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-gold-primary"
                      >
                        {item.options?.map(opt => (
                          <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (item.action) {
                  const isDestructive = item.destructive;
                  return (
                    <Button
                      key={item.key}
                      variant={isDestructive ? 'destructive' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => {
                        if (item.key === 'clearCache') handleClearCache();
                        else if (item.key === 'dataExport') handleExportData();
                        else if (item.key === 'deleteAccount') handleDeleteAccount();
                        else toast.info(`${item.label} - Yakında eklenecek`);
                      }}
                    >
                      {item.label}
                      {item.action === 'download' && <Download className="h-4 w-4 ml-2" />}
                      {item.action === 'delete' && <Trash2 className="h-4 w-4 ml-2" />}
                      {item.action === 'view' && <Info className="h-4 w-4 ml-2" />}
                    </Button>
                  );
                }

                return (
                  <div className="flex items-center justify-between" key={item.key}>
                    <div>
                      <p className="font-medium text-text-primary">{item.label}</p>
                      <p className="text-sm text-text-muted">{item.description}</p>
                    </div>
                    <Button variant="ghost" size="sm">Yönet</Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* App Info */}
      <Card className="border-border-subtle">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">✂️</span>
            <span className="font-bold text-xl text-text-primary">Premium Barber</span>
          </div>
          <p className="text-text-secondary mb-4">Sürüm 1.0.0</p>
          <div className="flex items-center justify-center gap-4 text-sm text-text-muted">
            <a href="/privacy" className="hover:text-gold-primary">Gizlilik Politikası</a>
            <span>•</span>
            <a href="/terms" className="hover:text-gold-primary">Kullanım Koşulları</a>
            <span>•</span>
            <a href="/support" className="hover:text-gold-primary">Destek</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}