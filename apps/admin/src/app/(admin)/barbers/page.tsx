'use client';

import * as React from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
  Badge, Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Avatar, AvatarImage, AvatarFallback
} from '@barbershop/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus, Edit, Trash2, Search, Star, MapPin, Clock,
  Calendar, User, Scissors, Award, Shield, AlertCircle
} from 'lucide-react';
import { cn } from '@barbershop/utils';
import { formatCurrency } from '@barbershop/utils';

const MOCK_BARBERS = [
  { id: '1', name: 'Ahmet Usta', email: 'ahmet@premiumbarber.com', phone: '+905551111111', avatar: null, specialties: ['Klasik Kesim', 'Fade', 'Sakal Tasarımı'], experience: 15, rating: 4.9, reviews: 127, commission: 45, hireDate: '2018-03-15', active: true, schedule: { mon: '09:00-19:00', tue: '09:00-19:00', wed: '09:00-19:00', thu: '09:00-19:00', fri: '09:00-19:00', sat: '09:00-19:00', sun: '10:00-14:00' } },
  { id: '2', name: 'Mehmet Usta', email: 'mehmet@premiumbarber.com', phone: '+905552222222', avatar: null, specialties: ['Sakal Tasarımı', 'Geleneksel Tıraş', 'Cilt Bakımı'], experience: 10, rating: 4.8, reviews: 89, commission: 40, hireDate: '2020-01-10', active: true, schedule: { mon: '09:00-19:00', tue: '09:00-19:00', wed: '09:00-19:00', thu: '09:00-19:00', fri: '09:00-19:00', sat: '09:00-19:00', sun: 'Kapalı' } },
  { id: '3', name: 'Can Usta', email: 'can@premiumbarber.com', phone: '+905553333333', avatar: null, specialties: ['Modern Kesim', 'Saç Boyama', 'Creative Styles'], experience: 5, rating: 4.7, reviews: 56, commission: 35, hireDate: '2022-06-01', active: true, schedule: { mon: '09:00-19:00', tue: '09:00-19:00', wed: '09:00-19:00', thu: '09:00-19:00', fri: '09:00-19:00', sat: '09:00-19:00', sun: 'Kapalı' } },
];

const SPECIALTIES = ['Klasik Kesim', 'Fade', 'Taper', 'Sakal Tasarımı', 'Geleneksel Tıraş', 'Cilt Bakımı', 'Saç Boyama', 'Sakal Boyama', 'Kaş Düzenleme', 'Çocuk Kesimi', 'Creative Styles', 'Modern Kesim'];

const barberSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter'),
  email: z.string().email('Geçerli e-posta'),
  phone: z.string().regex(/^\+905\d{9}$/, 'Geçerli telefon (+905xxxxxxxxx)'),
  specialties: z.array(z.string()).min(1, 'En az bir uzmanlık seçin'),
  experience: z.number().min(0).max(50),
  commission: z.number().min(0).max(100),
  hireDate: z.string().min(1, 'İşe başlama tarihi gerekli'),
  active: z.boolean(),
});

type BarberForm = z.infer<typeof barberSchema>;

function BarberCard({ barber }: { barber: typeof MOCK_BARBERS[0] }) {
  const initials = barber.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={barber.avatar || undefined} alt={barber.name} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-text-primary">{barber.name}</h3>
                <p className="text-text-secondary text-sm">{barber.email}</p>
                <p className="text-text-muted text-sm">{barber.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={barber.active ? 'success' : 'outline'}>{barber.active ? 'Aktif' : 'Pasif'}</Badge>
                <Badge variant="gold" className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  {barber.rating}
                </Badge>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {barber.specialties.map((spec, i) => (
                <Badge key={i} variant="outline" size="sm">{spec}</Badge>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-6 text-sm text-text-muted">
              <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5" />{barber.experience} yıl deneyim</span>
              <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" />İşe başlama: {barber.hireDate}</span>
              <span className="flex items-center gap-1">%{barber.commission} komisyon</span>
              <span className="flex items-center gap-1">({barber.reviews} değerlendirme)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BarberFormDialog({ barber, onClose, onSubmit }: { barber?: typeof MOCK_BARBERS[0]; onClose: () => void; onSubmit: (data: BarberForm) => void }) {
  const form = useForm<BarberForm>({
    resolver: zodResolver(barberSchema),
    defaultValues: barber || {
      name: '', email: '', phone: '', specialties: [], experience: 0, commission: 40,
      hireDate: new Date().toISOString().split('T')[0], active: true,
    },
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>{barber ? 'Berber Düzenle' : 'Yeni Berber Ekle'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Ad Soyad" {...form.register('name')} error={form.formState.errors.name?.message} />
            <Input label="E-posta" type="email" {...form.register('email')} error={form.formState.errors.email?.message} />
          </div>
          <Input label="Telefon" type="tel" placeholder="+905551234567" {...form.register('phone')} error={form.formState.errors.phone?.message} />
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Uzmanlık Alanları</label>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map(spec => (
                <label key={spec} className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={spec}
                    checked={form.watch('specialties').includes(spec)}
                    onChange={(e) => {
                      const current = form.watch('specialties');
                      if (e.target.checked) form.setValue('specialties', [...current, spec], { shouldValidate: true });
                      else form.setValue('specialties', current.filter(s => s !== spec), { shouldValidate: true });
                    }}
                    className="w-4 h-4 rounded border-border-default text-gold-primary focus:ring-gold-primary"
                  />
                  <span className="text-sm text-text-secondary">{spec}</span>
                </label>
              ))}
            </div>
            {form.formState.errors.specialties && (
              <p className="mt-1 text-sm text-error">{form.formState.errors.specialties.message}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input label="Deneyim (Yıl)" type="number" {...form.register('experience', { valueAsNumber: true })} />
            <Input label="Komisyon %" type="number" {...form.register('commission', { valueAsNumber: true })} />
            <Input label="İşe Başlama" type="date" {...form.register('hireDate')} />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...form.register('active')} className="w-4 h-4 rounded border-border-default text-gold-primary focus:ring-gold-primary" />
            <span className="text-sm text-text-secondary">Aktif</span>
          </label>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>İptal</Button>
            <Button type="submit" variant="gold">{barber ? 'Güncelle' : 'Ekle'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function BarbersPage() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingBarber, setEditingBarber] = React.useState<typeof MOCK_BARBERS[0] | null>(null);

  const filteredBarbers = MOCK_BARBERS.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'ACTIVE' && b.active) || (statusFilter === 'INACTIVE' && !b.active);
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (data: BarberForm) => {
    console.log('Save barber:', data);
    setDialogOpen(false);
    setEditingBarber(null);
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Berber Yönetimi</h1>
          <p className="text-text-secondary">Berber profillerini ve çalışma programlarını yönetin</p>
        </div>
        <Button onClick={() => { setEditingBarber(null); setDialogOpen(true); }} variant="gold">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Berber
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input placeholder="Berber ara..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter} className="w-[160px]">
              <SelectTrigger><SelectValue placeholder="Durum" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tümü</SelectItem>
                <SelectItem value="ACTIVE">Aktif</SelectItem>
                <SelectItem value="INACTIVE">Pasif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredBarbers.map(barber => (
          <BarberCard key={barber.id} barber={barber} />
        ))}
      </div>

      <BarberFormDialog
        barber={editingBarber}
        onClose={() => { setDialogOpen(false); setEditingBarber(null); }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}