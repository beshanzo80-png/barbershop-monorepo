'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@barbershop/ui';
import { Scissors, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const loginSchema = z.object({
  identifier: z.string().min(1, 'E-posta veya telefon gerekli'),
  password: z.string().min(1, 'Şifre gerekli'),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '', remember: false },
  });

  const handleSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo: Admin kontrolü
      if (data.identifier === 'admin@premiumbarber.com' || data.identifier === '+905550000000') {
        // Mock admin session
        localStorage.setItem('admin-auth', JSON.stringify({
          user: { id: '1', name: 'Admin', email: 'admin@premiumbarber.com', role: 'ADMIN' },
          accessToken: 'mock-admin-token',
        }));
        toast.success('Admin girişi başarılı!');
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('Yetkisiz erişim. Sadece admin girişi yapabilirsiniz.');
      }
    } catch {
      setError('Giriş başarısız. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gold-primary flex items-center justify-center">
            <Scissors className="w-10 h-10 text-text-on-gold" />
          </div>
          <CardTitle className="text-2xl">Admin Panel</CardTitle>
          <CardDescription>Premium Barber yönetim paneline giriş</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-error-bg border border-error/30 flex items-center gap-2 text-error text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <Input
              label="E-posta veya Telefon"
              placeholder="admin@premiumbarber.com"
              type="text"
              icon={<Mail className="h-4 w-4" />}
              {...form.register('identifier')}
              error={form.formState.errors.identifier?.message}
            />

            <Input
              label="Şifre"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              icon={<Lock className="h-4 w-4" />}
              {...form.register('password')}
              error={form.formState.errors.password?.message}
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </Input>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...form.register('remember')}
                  className="w-4 h-4 rounded border-border-default text-gold-primary focus:ring-gold-primary"
                />
                <span className="text-sm text-text-secondary">Beni hatırla</span>
              </label>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={isLoading}>
              Giriş Yap
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-text-muted">
            <p>Demo: admin@premiumbarber.com / Test123!</p>
            <p className="mt-1"><a href="/" className="text-gold-primary hover:text-gold-light">← Müşteri sitesine dön</a></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}