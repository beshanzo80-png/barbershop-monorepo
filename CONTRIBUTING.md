# Katkıda Bulunma Rehberi

Premium Barber projesine katkıda bulunmak isteyenler için rehber.

## 🚀 Hızlı Başlangıç

```bash
# 1. Fork yapın ve klonlayın
git clone https://github.com/your-username/barbershop-monorepo.git
cd barbershop-monorepo

# 2. Bağımlılıkları yükleyin
pnpm install

# 3. Environment dosyasını kopyalayın
cp .env.example .env

# 4. Veritabanını hazırlayın
pnpm db:generate
pnpm db:push
pnpm db:seed

# 5. Geliştirme sunucusunu başlatın
pnpm dev
```

## 🌿 Branch Stratejisi

- `main` - Production branch (korumalı)
- `develop` - Geliştirme branch'i
- `feature/*` - Yeni özellikler
- `fix/*` - Hata düzeltmeleri
- `hotfix/*` - Acil prod düzeltmeleri
- `release/*` - Release hazırlığı

## 📝 Commit Mesaj Formatı

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat` - Yeni özellik
- `fix` - Hata düzeltmesi
- `docs` - Dokümantasyon
- `style` - Kod formatı (noktalı virgül, boşluklar)
- `refactor` - Kod yeniden düzenleme
- `test` - Test ekleme/düzeltme
- `chore` - Bakım işleri
- `perf` - Performans iyileştirmesi
- `ci` - CI/CD değişiklikleri

### Scopes
- `web` - Müşteri uygulaması
- `admin` - Admin paneli
- `ui` - UI bileşen kütüphanesi
- `db` - Veritabanı/Prisma
- `auth` - Kimlik doğrulama
- `booking` - Randevu sistemi
- `payments` - Ödeme entegrasyonu
- `notifications` - Bildirimler
- `socket` - Real-time server

### Examples
```
feat(booking): add 4-step wizard for appointment booking
fix(auth): resolve Google OAuth redirect issue
docs(api): update payment webhook documentation
refactor(ui): extract ServiceCard into molecule component
test(web-hooks): add unit tests for useBookingStore
chore(deps): update Next.js to 14.2.0
```

## 🔧 Geliştirme Kuralları

### Kod Standartları
- TypeScript strict mode aktif
- ESLint + Prettier zorunlu
- Tailwind CSS sınıfları `cn()` yardımcı fonksiyonu ile birleştirilmeli
- React Hook Form + Zod kullanılmalı
- Server Components tercih edilmeli, Client Component minimum olmalı

### Dosya Organizasyonu
```
src/
├── app/              # Next.js App Router sayfaları
├── components/       # Sayfaya özel bileşenler
├── hooks/            # Custom hook'lar
├── lib/              # Yardımcı fonksiyonlar
├── stores/           # Zustand store'lar
└── types/            # TypeScript tipleri
```

### UI Bileşenleri (Atomic Design)
- **Atoms** - Temel bileşenler (Button, Input, Card, vb.)
- **Molecules** - Atom kombinasyonları (ServiceCard, TimeSlot, vb.)
- **Organisms** - Karmaşık bileşenler (BookingFlow, ServiceSelector, vb.)
- **Templates** - Sayfa şablonları
- **Pages** - Tam sayfalar

### Veritabanı Değişiklikleri
```bash
# 1. Schema'yı güncelleyin
# packages/database/prisma/schema.prisma

# 2. Migration oluşturun
pnpm db:migrate

# 3. Client'ı yeniden üretin
pnpm db:generate
```

## 🧪 Test Yazma

### Unit Testler
```bash
# Tüm testleri çalıştır
pnpm test

# Watch mode
pnpm test:watch

# Coverage raporu
pnpm test --coverage
```

### E2E Testler (Playwright)
```bash
cd apps/web
pnpm playwright test
```

### Test Yapısı
- `*.test.ts` - Unit testler
- `*.spec.ts` - Integration testler
- `__mocks__/` - Mock dosyaları

## 🎨 UI/UX Prensipleri

### Renk Kullanımı
- Dark theme varsayılan
- Gold (`#D4A843`) primary accent
- Semantic colors: success, warning, error, info
- WCAG AA kontrast oranları

### Responsive Breakpoints
- Mobile-first: 375px, 414px, 768px, 1024px+
- Container max-width: 680px (content), 1200px (full)

### Animasyonlar
- Framer Motion kullanın
- `prefers-reduced-motion` saygısı
- 150-350ms transition süreleri

## ♿ Erişilebilirlik (a11y)

- Semantic HTML etiketleri
- ARIA labels ve roles
- Klavye navigasyonu (Tab, Enter, Escape, Arrow keys)
- Focus visible states (Gold outline)
- Ekran okuyucu testleri (VoiceOver, TalkBack)
- Renk kontrastı WCAG AA

## 🔐 Güvenlik

- Environment variables `.env` dosyasında, asla kodda
- SQL injection koruması (Prisma ORM)
- XSS koruması (React auto-escaping)
- CSRF koruması (NextAuth.js)
- Rate limiting (middleware)
- CSP headers (next.config.js)

## 📦 Release Süreci

1. `develop` branch'inde tüm testler geçmeli
2. Version bump: `pnpm changeset`
3. PR açın `main` branch'ine
3. CI/CD pipeline başarıyla tamamlanmalı
4. Tag oluşturun: `git tag v1.0.0`
5. GitHub Release oluşturun
6. Vercel/Railway otomatik deploy eder

## 🤝 Code Review Checklist

- [ ] TypeScript hatası yok mu?
- [ ] ESLint/Prettier uyuyor mu?
- [ ] Testler yazılmış mı?
- [ ] Breaking change var mı?
- [ ] Dokümantasyon güncellendi mi?
- [ ] Performans etkisi var mı?
- [ ] Güvenlik açığı riski var mı?
- [ ] a11y standartları karşılanıyor mu?

## 📞 İletişim

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: dev@premiumbarber.com

## 📄 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.