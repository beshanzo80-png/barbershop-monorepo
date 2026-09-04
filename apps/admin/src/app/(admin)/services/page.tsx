'use client';

import * as React from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
  Badge, Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Tabs, TabsList, TabsTrigger, TabsContent
} from '@barbershop/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus, Edit, Trash2, Search, Filter, Scissors, Package,
  Tag, DollarSign, Clock, ArrowUpDown, ChevronUp, ChevronDown
} from 'lucide-react';
import { cn } from '@barbershop/utils';
import { formatCurrency } from '@barbershop/utils';

const MOCK_SERVICES = [
  { id: '1', name: 'Saç Kesimi', description: 'Klasik veya modern saç kesimi, şekillendirme ve fınış', duration: 30, price: 150, category: 'HAIRCUT', active: true, sortOrder: 1 },
  { id: '2', name: 'Sakal Tıraşı', description: 'Geleneksel usta tıraşı, sıcak bez ile cilt bakımı', duration: 20, price: 80, category: 'BEARD', active: true, sortOrder: 2 },
  { id: '3', name: 'Saç + Sakal Kombo', description: 'Saç kesimi ve sakal tıraşı paketi', duration: 45, price: 200, category: 'PACKAGE', active: true, sortOrder: 3 },
  { id: '4', name: 'Saç Boyama', description: 'Profesyonel saç boyama (kök/tam)', duration: 45, price: 180, category: 'COLORING', active: true, sortOrder: 4 },
  { id: '5', name: 'Sakal Boyama', description: 'Doğal görünümde sakal boyama', duration: 15, price: 60, category: 'COLORING', active: true, sortOrder: 5 },
  { id: '6', name: 'Cilt Bakımı', description: 'Derin temizlik, peeling, mask ve nemlendirme', duration: 25, price: 120, category: 'TREATMENT', active: true, sortOrder: 6 },
  { id: '7', name: 'Kaş Düzenleme', description: 'Kaş şekillendirme ve tıraş', duration: 10, price: 40, category: 'TREATMENT', active: true, sortOrder: 7 },
  { id: '8', name: 'Çocuk Kesimi (0-12 yaş)', description: 'Çocuklara özel saç kesimi', duration: 20, price: 100, category: 'KIDS', active: true, sortOrder: 8 },
];

const CATEGORIES = [
  { value: 'HAIRCUT', label: 'Saç Kesimi', icon: Scissors },
  { value: 'BEARD', label: 'Sakal', icon: Package },
  { value: 'COLORING', label: 'Boya', icon: Tag },
  { value: 'TREATMENT', label: 'Bakım', icon: Scissors },
  { value: 'PACKAGE', label: 'Paketler', icon: Package },
  { value: 'KIDS', label: 'Çocuk', icon: Scissors },
];

const serviceSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter'),
  description: z.string().optional(),
  duration: z.number().min(5).max(480),
  price: z.number().min(0),
  category: z.enum(['HAIRCUT', 'BEARD', 'COLORING', 'TREATMENT', 'PACKAGE', 'KIDS']),
  active: z.boolean(),
  sortOrder: z.number().min(0),
});

type ServiceForm = z.infer<typeof serviceSchema>;

const CATEGORY_LABELS: Record<string, string> = {
  HAIRCUT: 'Saç Kesimi', BEARD: 'Sakal', COLORING: 'Boya',
  TREATMENT: 'Bakım', PACKAGE: 'Paketler', KIDS: 'Çocuk',
};

function ServiceFormDialog({ service, onClose, onSubmit }: { service?: typeof MOCK_SERVICES[0]; onClose: () => void; onSubmit: (data: ServiceForm) => void }) {
  const form = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service || { name: '', description: '', duration: 30, price: 0, category: 'HAIRCUT', active: true, sortOrder: 0 },
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{service ? 'Hizmet Düzenle' : 'Yeni Hizmet Ekle'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Hizmet Adı" {...form.register('name')} error={form.formState.errors.name?.message} />
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Açıklama</label>
            <textarea
              {...form.register('description')}
              className="w-full px-4 py-3 bg-bg-tertiary border border-border-default rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold-primary min-h-[80px] resize-none"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Süre (dk)" type="number" {...form.register('duration', { valueAsNumber: true })} error={form.formState.errors.duration?.message} />
            <Input label="Fiyat" type="number" {...form.register('price', { valueAsNumber: true })} error={form.formState.errors.price?.message} />
            <Select {...form.register('category')} onValueChange={form.setValue('category')}>
              <SelectTrigger><SelectValue placeholder="Kategori" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Sıralama" type="number" {...form.register('sortOrder', { valueAsNumber: true })} />
            <label className="flex items-center gap-2 cursor-pointer pt-6">
              <input type="checkbox" {...form.register('active')} className="w-4 h-4 rounded border-border-default text-gold-primary focus:ring-gold-primary" />
              <span className="text-sm text-text-secondary">Aktif</span>
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>İptal</Button>
            <Button type="submit" variant="gold">{service ? 'Güncelle' : 'Ekle'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ServicesPage() {
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<'ALL' | string>('ALL');
  const [activeFilter, setActiveFilter] = React.useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<typeof MOCK_SERVICES[0] | null>(null);
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'sortOrder', direction: 'asc' });

  const filteredServices = MOCK_SERVICES.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || s.category === categoryFilter;
    const matchesActive = activeFilter === 'ALL' || (activeFilter === 'ACTIVE' && s.active) || (activeFilter === 'INACTIVE' && !s.active);
    return matchesSearch && matchesCategory && matchesActive;
  }).sort((a, b) => {
    const aVal = a[sortConfig.key as keyof typeof a];
    const bVal = b[sortConfig.key as keyof typeof b];
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSubmit = (data: ServiceForm) => {
    console.log('Save service:', data);
    setDialogOpen(false);
    setEditingService(null);
  };

  const activeCount = MOCK_SERVICES.filter(s => s.active).length;
  const totalRevenue = MOCK_SERVICES.reduce((sum, s) => sum + s.price, 0);
  const avgDuration = Math.round(MOCK_SERVICES.reduce((sum, s) => sum + s.duration, 0) / MOCK_SERVICES.length);

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Hizmet Yönetimi</h1>
          <p className="text-text-secondary">Hizmetleri, kategorileri ve fiyatlandırmayı yönetin</p>
        </div>
        <Button onClick={() => { setEditingService(null); setDialogOpen(true); }} variant="gold">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Hizmet
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="stat-card"><CardContent className="p-4"><p className="text-text-secondary text-sm">Toplam Hizmet</p><p className="text-2xl font-bold text-text-primary">{MOCK_SERVICES.length}</p></CardContent></Card>
        <Card className="stat-card"><CardContent className="p-4"><p className="text-text-secondary text-sm">Aktif</p><p className="text-2xl font-bold text-success">{activeCount}</p></CardContent></Card>
        <Card className="stat-card"><CardContent className="p-4"><p className="text-text-secondary text-sm">Ort. Süre</p><p className="text-2xl font-bold text-text-primary">{avgDuration} dk</p></CardContent></Card>
        <Card className="stat-card"><CardContent className="p-4"><p className="text-text-secondary text-sm">Toplam Fiyat</p><p className="text-2xl font-bold text-gold-primary">{formatCurrency(totalRevenue)}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input placeholder="Hizmet ara..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter} className="w-[160px]">
              <SelectTrigger><SelectValue placeholder="Kategori" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tüm Kategoriler</SelectItem>
                {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={activeFilter} onValueChange={setActiveFilter} className="w-[140px]">
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

      <Card>
        <CardContent className="p-0">
          <div className="table-container">
            <table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-border-subtle bg-bg-tertiary/50">
                  {['Sıra', 'Hizmet', 'Kategori', 'Süre', 'Fiyat', 'Durum', 'İşlemler'].map((header, i) => (
                    <TableHead key={header} className="px-4 py-3 text-left text-sm font-medium text-text-muted cursor-pointer hover:text-gold-primary"
                      onClick={() => ['sortOrder', 'name', 'category', 'duration', 'price', 'active', ''][i] && handleSort(['sortOrder', 'name', 'category', 'duration', 'price', 'active', ''][i])}
                    >
                      <div className="flex items-center gap-1">
                        {header}
                        {sortConfig.key === ['sortOrder', 'name', 'category', 'duration', 'price', 'active', ''][i] && (
                          sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4 text-gold-primary" /> : <ChevronDown className="h-4 w-4 text-gold-primary" />
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service, index) => (
                  <TableRow key={service.id} className="border-b border-border-subtle/50 hover:bg-bg-tertiary/30">
                    <TableCell className="px-4 py-3 text-text-muted">{service.sortOrder}</TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="font-medium text-text-primary">{service.name}</div>
                      {service.description && <div className="text-sm text-text-muted line-clamp-1">{service.description}</div>}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant="outline" size="sm">{CATEGORY_LABELS[service.category]}</Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-text-secondary">
                      <Clock className="h-3.5 w-3.5 inline mr-1" />
                      {service.duration} dk
                    </TableCell>
                    <TableCell className="px-4 py-3 font-semibold text-gold-primary">{formatCurrency(service.price)}</TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant={service.active ? 'success' : 'outline'}>{service.active ? 'Aktif' : 'Pasif'}</Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingService(service); setDialogOpen(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-error hover:text-error/80">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ServiceFormDialog
        service={editingService}
        onClose={() => { setDialogOpen(false); setEditingService(null); }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}