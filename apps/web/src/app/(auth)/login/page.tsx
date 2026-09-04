'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription, Tabs, TabsList, TabsTrigger, Tab, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@barbershop/ui';
import { useAuthStore } from '@barbershop/web-hooks';
import { Mail, Phone, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const loginSchema = z.object({
  identifier: z.string().min(1, 'E-posta veya telefon gerekli'),
  password: z.string().min(1, 'Şifre gerekli'),
  remember: z.boolean().optional(),
});

const registerSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter').max(100),
  phone: z.string().regex(/^\+905\d{9}$/, 'Geçerli bir Türkiye telefon numarası giriniz (+905xxxxxxxxx)'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz').optional().or(z.literal('')),
  password: z.string().min(8, 'Şifre en az 8 karakter').regex(/[A-Z]/, 'En az 1 büyük harf').regex(/[a-z]/, 'En az 1 küçük harf').regex(/[0-9]/, 'En az 1 rakam').regex(/[^A-Za-z0-9]/, 'En az 1 özel karakter'),
  confirmPassword: z.string(),
  marketingConsent: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const redirect = searchParams.get('redirect') || '/';
  
  const [activeTab, setActiveTab] = React.useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = React.useState({ login: false, register: false });
  const [isLoading, setIsLoading] = React.useState(false);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '', remember: false },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', phone: '', email: '', password: '', confirmPassword: '', marketingConsent: false },
  });

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      // Demo: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const user = {
        id: '1',
        email: data.identifier.includes('@') ? data.identifier : null,
        phone: data.identifier.includes('@') ? '+905551234567' : data.identifier,
        name: 'Demo Kullanıcı',
        avatar: null,
        role: 'CUSTOMER' as const,
        emailVerified: new Date(),
        phoneVerified: new Date(),
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setAuth(user, 'mock-access-token', 'mock-refresh-token');
      toast.success('Giriş başarılı!');
      router.push(redirect);
      router.refresh();
    } catch (error) {
      toast.error('Giriş başarısız. Bilgilerinizi kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      // Demo: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: '2',
        email: data.email || null,
        phone: data.phone,
        name: data.name,
        avatar: null,
        role: 'CUSTOMER' as const,
        emailVerified: data.email ? new Date().toISOString() : null,
        phoneVerified: new Date().toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setAuth(user, 'mock-access-token', 'mock-refresh-token');
      toast.success('Kayıt başarılı! Hoş geldiniz.');
      router.push(redirect);
      router.refresh();
    } catch (error) {
      toast.error('Kayıt başarısız. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gold-primary flex items-center justify-center">
            <svg className="w-10 h-10 text-text-on-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <CardTitle className="text-2xl">Premium Barber</CardTitle>
          <CardDescription>Profesyonel erkek kuaförü randevu sistemi</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
            <TabsList className="grid grid-cols-2 bg-bg-tertiary">
              <TabsTrigger value="login" className="py-3">Giriş Yap</TabsTrigger>
              <TabsTrigger value="register" className="py-3">Kayıt Ol</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <Input
                  label="E-posta veya Telefon"
                  placeholder="ornek@email.com veya +905551234567"
                  type="text"
                  icon={<Mail className="h-4 w-4" />}
                  {...loginForm.register('identifier')}
                  error={loginForm.formState.errors.identifier?.message}
                />
                
                <Input
                  label="Şifre"
                  placeholder="••••••••"
                  type={showPassword.login ? 'text' : 'password'}
                  icon={<Lock className="h-4 w-4" />}
                  {...loginForm.register('password')}
                  error={loginForm.formState.errors.password?.message}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(prev => ({ ...prev, login: !prev.login }))}
                    aria-label={showPassword.login ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  >
                    {showPassword.login ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </Input>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...loginForm.register('remember')}
                      className="w-4 h-4 rounded border-border-default text-gold-primary focus:ring-gold-primary"
                    />
                    <span className="text-sm text-text-secondary">Beni hatırla</span>
                  </label>
                  <a href="/auth/forgot-password" className="text-sm text-gold-primary hover:text-gold-light">
                    Şifremi unuttum
                  </a>
                </div>

                <Button type="submit" className="w-full" size="lg" loading={isLoading}>
                  Giriş Yap
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            {/* Register Form */}
            <TabsContent value="register">
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                <Input
                  label="Ad Soyad"
                  placeholder="Ahmet Yılmaz"
                  icon={<User className="h-4 w-4" />}
                  {...registerForm.register('name')}
                  error={registerForm.formState.errors.name?.message}
                />
                
                <Input
                  label="Telefon"
                  placeholder="+905551234567"
                  type="tel"
                  inputMode="tel"
                  icon={<Phone className="h-4 w-4" />}
                  {...registerForm.register('phone')}
                  error={registerForm.formState.errors.phone?.message}
                />
                
                <Input
                  label="E-posta (Opsiyonel)"
                  placeholder="ornek@email.com"
                  type="email"
                  icon={<Mail className="h-4 w-4" />}
                  {...registerForm.register('email')}
                  error={registerForm.formState.errors.email?.message}
                />
                
                <Input
                  label="Şifre"
                  placeholder="••••••••"
                  type={showPassword.register ? 'text' : 'password'}
                  icon={<Lock className="h-4 w-4" />}
                  {...registerForm.register('password')}
                  error={registerForm.formState.errors.password?.message}
                  hint="En az 8 karakter, 1 büyük harf, 1 küçük harf, 1 rakam, 1 özel karakter"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(prev => ({ ...prev, register: !prev.register }))}
                    aria-label={showPassword.register ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  >
                    {showPassword.register ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </Input>

                <Input
                  label="Şifre Tekrar"
                  placeholder="••••••••"
                  type={showPassword.register ? 'text' : 'password'}
                  {...registerForm.register('confirmPassword')}
                  error={registerForm.formState.errors.confirmPassword?.message}
                />

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...registerForm.register('marketingConsent')}
                    className="w-4 h-4 mt-0.5 rounded border-border-default text-gold-primary focus:ring-gold-primary"
                  />
                  <span className="text-sm text-text-secondary">
                    Kampanya ve duyuru mailleri almak istiyorum
                  </span>
                </label>

                <Button type="submit" className="w-full" size="lg" loading={isLoading}>
                  Hesap Oluştur
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-text-muted">
            <p>Hesabınız var mı? <a href="#" className="text-gold-primary hover:text-gold-light ml-1 font-medium" onClick={(e) => { e.preventDefault(); setActiveTab('login'); }}>Giriş yapın</a></p>
            <p className="mt-2">Hesabınız yok mu? <a href="#" className="text-gold-primary hover:text-gold-light ml-1 font-medium" onClick={(e) => { e.preventDefault(); setActiveTab('register'); }}>Kayıt olun</a></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}