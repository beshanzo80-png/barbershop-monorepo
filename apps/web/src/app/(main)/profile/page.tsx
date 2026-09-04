'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Badge, Avatar, AvatarFallback, Tabs, TabsList, TabsTrigger, TabsContent } from '@barbershop/ui';
import { useAuthStore } from '@barbershop/web-hooks';
import { useProfile, useUpdateProfile } from '@barbershop/web-hooks';
import { User, Settings, Award, Heart, Bell, LogOut, Edit2, Camera } from 'lucide-react';
import { formatCurrency } from '@barbershop/utils';
import { toast } from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter').max(100),
  email: z.string().email('Geçerli bir e-posta').optional().or(z.literal('')),
  phone: z.string().regex(/^\+905\d{9}$/, 'Geçerli bir Türkiye telefon numarası'),
  birthDate: z.string().optional(),
  marketingConsent: z.boolean().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const LOYALTY_TIERS = [
  { name: 'Bronze', minPoints: 0, discount: 0, color: '#CD7F32', icon: '🥉' },
  { name: 'Silver', minPoints: 500, discount: 5, color: '#C0C0C0', icon: '🥈' },
  { name: 'Gold', minPoints: 1500, discount: 10, color: '#D4A843', icon: '🥇' },
  { name: 'Platinum', minPoints: 3000, discount: 15, color: '#E5E4E2', icon: '💎' },
];

function getCurrentTier(points: number) {
  return LOYALTY_TIERS.slice().reverse().find(t => points >= t.minPoints) || LOYALTY_TIERS[0];
}

function getNextTier(points: number) {
  return LOYALTY_TIERS.find(t => points < t.minPoints);
}

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  
  const [activeTab, setActiveTab] = React.useState<'profile' | 'loyalty' | 'settings'>('profile');
  const [isEditing, setIsEditing] = React.useState(false);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      birthDate: profile?.birthDate ? new Date(profile.birthDate).toISOString().split('T')[0] : '',
      marketingConsent: profile?.marketingConsent || false,
    },
  });

  const handleSubmit = async (data: ProfileForm) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success('Profil güncellendi');
      setIsEditing(false);
    } catch (error) {
      toast.error('Güncelleme başarısız');
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const currentTier = getCurrentTier(profile?.loyaltyPoints || 0);
  const nextTier = getNextTier(profile?.loyaltyPoints || 0);
  const progressToNext = nextTier 
    ? ((profile?.loyaltyPoints || 0) - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints) * 100
    : 100;

  return (
    <div className="container py-6">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-3xl">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text-primary">{user?.name}</h1>
              <p className="text-text-secondary">{user?.phone}</p>
              {user?.email && <p className="text-text-muted text-sm">{user.email}</p>}
            </div>
            <Badge variant="gold" className="text-lg px-4 py-2">
              {currentTier.icon} {currentTier.name}
            </Badge>
          </div>

          {/* Loyalty Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-text-primary">Sadakat Puanları</span>
              <span className="text-lg font-bold text-gold-primary">{profile?.loyaltyPoints || 0} puan</span>
            </div>
            <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gold-primary rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressToNext, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>{currentTier.name}</span>
              {nextTier && (
                <span>{nextTier.minPoints - (profile?.loyaltyPoints || 0)} puan sonra {nextTier.name}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 bg-bg-tertiary">
          <TabsTrigger value="profile" className="py-3 flex items-center justify-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="py-3 flex items-center justify-center gap-2">
            <Award className="h-4 w-4" />
            Sadakat
          </TabsTrigger>
          <TabsTrigger value="settings" className="py-3 flex items-center justify-center gap-2">
            <Settings className="h-4 w-4" />
            Ayarlar
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 animate-in fade-in-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit2 className="h-5 w-5" />
                Kişisel Bilgiler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <Input
                  label="Ad Soyad"
                  {...form.register('name')}
                  error={form.formState.errors.name?.message}
                  disabled={!isEditing}
                />
                <Input
                  label="Telefon"
                  type="tel"
                  inputMode="tel"
                  {...form.register('phone')}
                  error={form.formState.errors.phone?.message}
                  disabled={!isEditing}
                />
                <Input
                  label="E-posta"
                  type="email"
                  {...form.register('email')}
                  error={form.formState.errors.email?.message}
                  disabled={!isEditing}
                />
                <Input
                  label="Doğum Tarihi"
                  type="date"
                  {...form.register('birthDate')}
                  disabled={!isEditing}
                />
                
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="marketing"
                    {...form.register('marketingConsent')}
                    className="w-4 h-4 mt-0.5 rounded border-border-default text-gold-primary focus:ring-gold-primary"
                    disabled={!isEditing}
                  />
                  <label htmlFor="marketing" className="text-sm text-text-secondary">
                    Kampanya ve duyuru bildirimleri almak istiyorum
                  </label>
                </div>

                {!isEditing ? (
                  <Button variant="secondary" onClick={() => setIsEditing(true)} className="w-full">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Düzenle
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1" loading={updateProfile.isPending}>
                      Kaydet
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { form.reset(); setIsEditing(false); }} className="flex-1">
                      İptal
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="h-8 w-8 mx-auto text-gold-primary mb-2" />
                <p className="text-2xl font-bold text-text-primary">{profile?.totalVisits || 0}</p>
                <p className="text-text-muted text-sm">Toplam Ziyaret</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 mx-auto text-gold-primary mb-2" />
                <p className="text-2xl font-bold text-text-primary">{formatCurrency(profile?.totalSpent || 0)}</p>
                <p className="text-text-muted text-sm">Toplam Harcama</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Bell className="h-8 w-8 mx-auto text-gold-primary mb-2" />
                <p className="text-2xl font-bold text-text-primary">{currentTier.discount}%</p>
                <p className="text-text-muted text-sm">İndirim Oranı</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Loyalty Tab */}
        <TabsContent value="loyalty" className="space-y-4 animate-in fade-in-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-gold-primary" />
                Sadakat Programı
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {LOYALTY_TIERS.map((tier) => (
                  <div
                    key={tier.name}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      tier.name === currentTier.name
                        ? 'border-gold-primary bg-gold-subtle/30'
                        : 'border-border-subtle'
                    }`}
                  >
                    <div className="text-center">
                      <span className="text-3xl">{tier.icon}</span>
                      <h4 className="font-semibold mt-1">{tier.name}</h4>
                      <p className="text-gold-primary font-bold">{tier.discount}% indirim</p>
                      <p className="text-xs text-text-muted mt-1">Min. {tier.minPoints} puan</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border-subtle pt-4">
                <h4 className="font-medium mb-3">Avantajlar</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  {currentTier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-gold-primary" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4 animate-in fade-in-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Hesap Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium text-text-primary">Bildirimler</h4>
                <label className="flex items-center justify-between">
                  <span className="text-text-secondary">Push bildirimleri</span>
                  <input type="checkbox" className="w-5 h-5 rounded border-border-default text-gold-primary focus:ring-gold-primary" defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-text-secondary">SMS hatırlatmaları</span>
                  <input type="checkbox" className="w-5 h-5 rounded border-border-default text-gold-primary focus:ring-gold-primary" defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-text-secondary">E-posta bildirimleri</span>
                  <input type="checkbox" className="w-5 h-5 rounded border-border-default text-gold-primary focus:ring-gold-primary" />
                </label>
              </div>

              <div className="border-t border-border-subtle pt-4 space-y-3">
                <h4 className="font-medium text-text-primary">Güvenlik</h4>
                <Button variant="outline" className="w-full justify-start">
                  Şifre Değiştir
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  İki Faktörlü Doğrulama
                </Button>
              </div>

              <div className="border-t border-border-subtle pt-4 space-y-3">
                <h4 className="font-medium text-text-primary">Uygulama</h4>
                <label className="flex items-center justify-between">
                  <span className="text-text-secondary">Koyu tema</span>
                  <input type="checkbox" className="w-5 h-5 rounded border-border-default text-gold-primary focus:ring-gold-primary" defaultChecked disabled />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-text-secondary">Haptik geri bildirim</span>
                  <input type="checkbox" className="w-5 h-5 rounded border-border-default text-gold-primary focus:ring-gold-primary" defaultChecked />
                </label>
              </div>

              <div className="border-t border-error/30 pt-4">
                <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Çıkış Yap
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}