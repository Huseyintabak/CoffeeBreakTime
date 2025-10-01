# ☕ Coffee Timer Web Uygulaması - Proje Dokümantasyonu

## 🎯 Proje Özeti

**Coffee Timer**, kullanıcıların kahve molası zamanlamalarını yönetmelerine yardımcı olan interaktif bir web uygulamasıdır. Kullanıcı belirlediği süre boyunca görsel bardak animasyonu izler, süre bitiminde bildirim alır ve yeni bir döngü başlatabilir.

## 🚀 Özellikler

### Ana Özellikler
- ⏰ **Özelleştirilebilir Süre Girişi** - Dakika/saniye seçimi
- 🥤 **Gerçek Zamanlı Bardak Animasyonu** - Kahve seviyesinin azalması
- 🔔 **Akıllı Bildirim Sistemi** - Tarayıcı bildirimleri
- 🔄 **Döngüsel Süreç** - Otomatik yeniden başlatma
- 📱 **Responsive Tasarım** - Tüm cihazlarda uyumlu
- 🌙 **Dark/Light Mode** - Kullanıcı tercihi

### Gelişmiş Özellikler
- 📊 **İstatistik Takibi** - Günlük/haftalık molalar
- 🎵 **Ses Efektleri** - Tamamlanma sesi
- 💾 **Yerel Depolama** - Tercihler ve geçmiş
- 🔒 **PWA Desteği** - Offline çalışma
- 🎨 **Özelleştirilebilir Tema** - Bardak renkleri

## 🛠️ Teknoloji Stack'i

### Frontend
```json
{
  "framework": "Next.js 14 (App Router)",
  "styling": "TailwindCSS + Framer Motion",
  "state": "Zustand",
  "icons": "Lucide React",
  "typescript": "TypeScript 5.0+"
}
```

### Backend & Storage
```json
{
  "api": "Next.js API Routes",
  "database": "Local Storage + IndexedDB",
  "notifications": "Web Notifications API",
  "pwa": "Next-PWA"
}
```

### Geliştirme Araçları
```json
{
  "bundler": "Turbopack",
  "linting": "ESLint + Prettier",
  "testing": "Jest + React Testing Library",
  "deployment": "Vercel"
}
```

## 📁 Proje Yapısı

```
coffee-timer/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Ana sayfa
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global stiller
│   ├── components/            # React bileşenleri
│   │   ├── Timer/             # Timer bileşenleri
│   │   │   ├── TimerDisplay.tsx
│   │   │   ├── TimeInput.tsx
│   │   │   └── Controls.tsx
│   │   ├── CoffeeCup/         # Bardak animasyonu
│   │   │   ├── CoffeeCup.tsx
│   │   │   └── CoffeeLevel.tsx
│   │   ├── Notification/      # Bildirim sistemi
│   │   │   └── NotificationManager.tsx
│   │   └── UI/                # Genel UI bileşenleri
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       └── ThemeToggle.tsx
│   ├── hooks/                 # Custom React hooks
│   │   ├── useTimer.ts
│   │   ├── useNotification.ts
│   │   └── useLocalStorage.ts
│   ├── store/                 # Zustand store
│   │   └── timerStore.ts
│   ├── utils/                 # Yardımcı fonksiyonlar
│   │   ├── timeUtils.ts
│   │   ├── animationUtils.ts
│   │   └── storageUtils.ts
│   └── types/                 # TypeScript tipleri
│       └── timer.ts
├── public/                    # Statik dosyalar
│   ├── icons/                 # PWA ikonları
│   └── sounds/                # Ses dosyaları
├── next.config.js             # Next.js konfigürasyonu
├── tailwind.config.js         # Tailwind konfigürasyonu
├── package.json
└── README.md
```

## 🎨 Tasarım Sistemi

### Renk Paleti
```css
/* Light Theme */
--primary: #8B4513;      /* Kahve rengi */
--secondary: #D2691E;    /* Açık kahve */
--accent: #CD853F;       /* Vurgu rengi */
--background: #FFF8DC;   /* Krem */
--surface: #FFFFFF;      /* Beyaz */

/* Dark Theme */
--primary: #CD853F;      /* Açık kahve */
--secondary: #DEB887;    /* Buğday */
--accent: #F4A460;       /* Kumlu */
--background: #2C1810;   /* Koyu kahve */
--surface: #3C2418;      /* Orta kahve */
```

### Tipografi
```css
--font-primary: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Spacing Scale
```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
```

## 🔧 Geliştirme Adımları

### 1. Proje Kurulumu
```bash
# Proje oluştur
npx create-next-app@latest coffee-timer --typescript --tailwind --app

# Gerekli paketleri yükle
npm install zustand framer-motion lucide-react next-pwa
npm install -D @types/node

# PWA konfigürasyonu
npm install next-pwa
```

### 2. Temel Yapı Oluşturma
```bash
# Klasör yapısını oluştur
mkdir -p src/{components/{Timer,CoffeeCup,Notification,UI},hooks,store,utils,types}
```

### 3. Core Components Geliştirme

#### Timer Store (Zustand)
```typescript
// src/store/timerStore.ts
interface TimerState {
  duration: number;
  remaining: number;
  isRunning: boolean;
  isCompleted: boolean;
  startTimer: (duration: number) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
}
```

#### Custom Hooks
```typescript
// src/hooks/useTimer.ts
export const useTimer = () => {
  const { duration, remaining, isRunning, startTimer, pauseTimer, resetTimer, tick } = useTimerStore();
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && remaining > 0) {
      interval = setInterval(tick, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, remaining, tick]);
  
  return { duration, remaining, isRunning, startTimer, pauseTimer, resetTimer };
};
```

### 4. Animasyon Sistemi

#### Coffee Cup Component
```typescript
// src/components/CoffeeCup/CoffeeCup.tsx
import { motion } from 'framer-motion';

const CoffeeCup = ({ level }: { level: number }) => {
  return (
    <motion.div className="coffee-cup">
      <motion.div 
        className="coffee-level"
        animate={{ height: `${level}%` }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </motion.div>
  );
};
```

### 5. Bildirim Sistemi
```typescript
// src/hooks/useNotification.ts
export const useNotification = () => {
  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
  };

  return { requestPermission, showNotification };
};
```

## 🎯 MVP Özellikleri (Minimum Viable Product)

### Phase 1: Temel Fonksiyonalite
- [x] Süre girişi (dakika/saniye)
- [x] Timer çalıştırma/durdurma
- [x] Basit bardak animasyonu
- [x] Temel bildirim sistemi
- [x] Responsive tasarım

### Phase 2: Gelişmiş Özellikler
- [ ] Ses efektleri
- [ ] Dark/Light mode
- [ ] Yerel depolama
- [ ] İstatistik takibi
- [ ] PWA özellikleri

### Phase 3: Premium Özellikler
- [ ] Çoklu timer desteği
- [ ] Sosyal paylaşım
- [ ] Özelleştirilebilir temalar
- [ ] Gelişmiş analitik

## 🚀 Deployment Stratejisi

### Geliştirme Ortamı
```bash
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run start        # Production sunucusu
npm run lint         # ESLint kontrolü
```

### Production Deployment
```bash
# Vercel deployment
vercel --prod

# Environment variables
NEXT_PUBLIC_APP_NAME=Coffee Timer
NEXT_PUBLIC_VERSION=1.0.0
```

## 📱 PWA Konfigürasyonu

### Service Worker
```javascript
// public/sw.js
const CACHE_NAME = 'coffee-timer-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

### Web App Manifest
```json
{
  "name": "Coffee Timer",
  "short_name": "CoffeeTimer",
  "description": "Kahve molası zamanlayıcısı",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFF8DC",
  "theme_color": "#8B4513",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## 🧪 Test Stratejisi

### Unit Tests
```typescript
// __tests__/hooks/useTimer.test.ts
import { renderHook, act } from '@testing-library/react';
import { useTimer } from '../src/hooks/useTimer';

describe('useTimer', () => {
  it('should start timer correctly', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      result.current.startTimer(60);
    });
    
    expect(result.current.isRunning).toBe(true);
    expect(result.current.duration).toBe(60);
  });
});
```

### E2E Tests
```typescript
// cypress/integration/timer.spec.ts
describe('Timer Functionality', () => {
  it('should complete a timer cycle', () => {
    cy.visit('/');
    cy.get('[data-testid="time-input"]').type('5');
    cy.get('[data-testid="start-button"]').click();
    cy.get('[data-testid="coffee-level"]').should('have.attr', 'style', 'height: 0%');
  });
});
```

## 📊 Performans Optimizasyonu

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Optimizasyon Teknikleri
```typescript
// Lazy loading
const CoffeeCup = lazy(() => import('./CoffeeCup'));

// Memoization
const TimerDisplay = memo(({ remaining }: { remaining: number }) => {
  return <div>{formatTime(remaining)}</div>;
});

// Code splitting
const Statistics = lazy(() => import('./Statistics'));
```

## 🔒 Güvenlik ve Privacy

### Data Protection
- Kullanıcı verileri sadece localStorage'da saklanır
- Hiçbir kişisel veri sunucuya gönderilmez
- PWA offline çalışır

### Notification Permissions
- Kullanıcı onayı olmadan bildirim gönderilmez
- Permission durumu açıkça belirtilir
- Kullanıcı istediğinde devre dışı bırakabilir

## 📈 Analytics ve Monitoring

### User Analytics
```typescript
// src/utils/analytics.ts
export const trackTimerStart = (duration: number) => {
  // Google Analytics veya custom analytics
  gtag('event', 'timer_start', {
    duration: duration
  });
};

export const trackTimerComplete = (duration: number) => {
  gtag('event', 'timer_complete', {
    duration: duration
  });
};
```

### Performance Monitoring
```typescript
// src/utils/performance.ts
export const measurePerformance = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0];
    console.log('Page Load Time:', navigation.loadEventEnd - navigation.loadEventStart);
  }
};
```

## 🎨 UI/UX Best Practices

### Accessibility
- ARIA labels tüm interaktif elementlerde
- Keyboard navigation desteği
- Screen reader uyumluluğu
- High contrast mode desteği

### Mobile Optimization
- Touch-friendly button sizes (min 44px)
- Swipe gestures için destek
- Viewport meta tag optimizasyonu
- iOS Safari özel gereksinimler

### Animation Guidelines
- 60fps smooth animations
- Respect `prefers-reduced-motion`
- Meaningful transitions
- Loading states için skeleton screens

## 🚀 Gelecek Geliştirmeler

### Version 2.0 Features
- **Sosyal Özellikler**: Arkadaşlarla timer paylaşımı
- **AI Önerileri**: Kişiselleştirilmiş mola önerileri
- **Gamification**: Başarı rozetleri ve streak'ler
- **Integration**: Calendar apps ile entegrasyon

### Technical Improvements
- **Offline Sync**: Service worker ile veri senkronizasyonu
- **Push Notifications**: Background notifications
- **Advanced Analytics**: Kullanıcı davranış analizi
- **A/B Testing**: Farklı UI varyantları test etme

## 📚 Kaynaklar ve Referanslar

### Design Resources
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design](https://material.io/design)
- [Framer Motion Documentation](https://www.framer.com/motion/)

### Technical Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Web Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [PWA Documentation](https://web.dev/progressive-web-apps/)

### Inspiration
- [Pomodoro Timer Apps](https://pomofocus.io/)
- [Focus Timer Apps](https://focus.gg/)
- [Meditation Apps](https://www.headspace.com/)

---

## 🚨 Hata Yönetimi ve Edge Case'ler

### Kritik Hata Senaryoları
```typescript
// src/utils/errorHandling.ts
export enum TimerError {
  INVALID_DURATION = 'INVALID_DURATION',
  NOTIFICATION_DENIED = 'NOTIFICATION_DENIED',
  BROWSER_NOT_SUPPORTED = 'BROWSER_NOT_SUPPORTED',
  STORAGE_ERROR = 'STORAGE_ERROR',
  AUDIO_ERROR = 'AUDIO_ERROR'
}

export const handleTimerError = (error: TimerError) => {
  switch (error) {
    case TimerError.INVALID_DURATION:
      return 'Lütfen geçerli bir süre girin (1-1440 dakika)';
    case TimerError.NOTIFICATION_DENIED:
      return 'Bildirimler için izin vermeniz gerekiyor';
    case TimerError.BROWSER_NOT_SUPPORTED:
      return 'Tarayıcınız bu özelliği desteklemiyor';
    default:
      return 'Beklenmeyen bir hata oluştu';
  }
};
```

### Edge Case Senaryoları
- **Çok Uzun Süreler**: 24 saat üzeri süreler için uyarı
- **Negatif Süreler**: Input validation ve sanitization
- **Browser Tab Deactivation**: Visibility API ile background handling
- **Network Kesintileri**: Offline mode ve sync stratejisi
- **Storage Quota**: LocalStorage limit aşımı durumu
- **Memory Leaks**: Timer cleanup ve garbage collection

## 🎭 Kullanıcı Akış Diyagramları

### Ana Kullanıcı Yolculuğu
```
[Sayfa Yükleme] → [Bildirim İzni] → [Süre Girişi] → [Timer Başlatma] 
     ↓
[Animasyon İzleme] → [Bildirim Alma] → [Yeni Döngü] → [İstatistik Görme]
```

### Hata Akışları
```
[Geçersiz Süre] → [Uyarı Mesajı] → [Düzeltme] → [Tekrar Deneme]
[İzin Reddi] → [Alternatif Yöntem] → [Manuel Kontrol]
[Browser Uyumsuzluğu] → [Fallback Mode] → [Temel Timer]
```

## 🔄 API Tasarımı ve Data Flow

### State Management Architecture
```typescript
// src/store/timerStore.ts - Detaylı Zustand Store
interface TimerStore {
  // State
  duration: number;
  remaining: number;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  startTime: Date | null;
  endTime: Date | null;
  cycles: TimerCycle[];
  
  // Actions
  setDuration: (duration: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  completeTimer: () => void;
  addCycle: (cycle: TimerCycle) => void;
  
  // Computed
  progress: number;
  formattedTime: string;
  coffeeLevel: number;
}

interface TimerCycle {
  id: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  completed: boolean;
  notes?: string;
}
```

### Data Persistence Strategy
```typescript
// src/utils/storage.ts
export class TimerStorage {
  private static STORAGE_KEY = 'coffee-timer-data';
  
  static save(data: TimerData): boolean {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  }
  
  static load(): TimerData | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Load error:', error);
      return null;
    }
  }
  
  static clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
```

## 🌐 Browser Compatibility ve Fallback'ler

### Desteklenen Tarayıcılar
```typescript
// src/utils/browserSupport.ts
export const BrowserSupport = {
  notifications: 'Notification' in window,
  serviceWorker: 'serviceWorker' in navigator,
  webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
  localStorage: typeof Storage !== 'undefined',
  indexedDB: 'indexedDB' in window,
  webGL: 'WebGLRenderingContext' in window
};

export const getFallbackStrategy = () => {
  if (!BrowserSupport.notifications) {
    return {
      notifications: 'visual-alerts',
      audio: BrowserSupport.webAudio ? 'web-audio' : 'html-audio'
    };
  }
  return null;
};
```

### Progressive Enhancement
- **Level 1**: Temel HTML/CSS timer (tüm tarayıcılar)
- **Level 2**: JavaScript animasyonları (ES6+ tarayıcılar)
- **Level 3**: PWA özellikleri (modern tarayıcılar)
- **Level 4**: Advanced features (en yeni tarayıcılar)

## 🔧 Gelişmiş Deployment Pipeline

### CI/CD Pipeline (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy Coffee Timer

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test
      - run: npm run lint
      - run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: .next/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Environment Configuration
```typescript
// src/config/environment.ts
export const config = {
  development: {
    apiUrl: 'http://localhost:3000',
    analytics: false,
    debug: true
  },
  production: {
    apiUrl: 'https://coffee-timer.vercel.app',
    analytics: true,
    debug: false
  },
  staging: {
    apiUrl: 'https://coffee-timer-staging.vercel.app',
    analytics: true,
    debug: true
  }
};
```

## 📱 PWA Detayları ve Offline Stratejisi

### Service Worker Stratejisi
```javascript
// public/sw.js - Gelişmiş Service Worker
const CACHE_NAME = 'coffee-timer-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/sounds/notification.mp3'
];

// Cache strategies
const CACHE_STRATEGIES = {
  static: 'cache-first',
  api: 'network-first',
  images: 'cache-first',
  fonts: 'cache-first'
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
  } else if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg)$/)) {
    event.respondWith(cacheFirstStrategy(request));
  } else {
    event.respondWith(staleWhileRevalidateStrategy(request));
  }
});
```

### Offline Data Sync
```typescript
// src/utils/offlineSync.ts
export class OfflineSync {
  private static SYNC_QUEUE = 'sync-queue';
  
  static queueAction(action: SyncAction) {
    const queue = this.getQueue();
    queue.push({
      ...action,
      timestamp: Date.now(),
      id: crypto.randomUUID()
    });
    this.saveQueue(queue);
  }
  
  static async processQueue() {
    if (!navigator.onLine) return;
    
    const queue = this.getQueue();
    const results = await Promise.allSettled(
      queue.map(action => this.syncAction(action))
    );
    
    // Remove successful actions
    const newQueue = queue.filter((_, index) => 
      results[index].status === 'rejected'
    );
    
    this.saveQueue(newQueue);
  }
}
```

## 🎨 UI/UX Detayları ve Wireframe Önerileri

### Ana Sayfa Layout
```
┌─────────────────────────────────────┐
│  ☕ Coffee Timer        🌙 [Theme]  │
├─────────────────────────────────────┤
│                                     │
│        🥤 [Coffee Cup]              │
│         (Animated)                  │
│                                     │
│    ⏰ 25:00 / 25:00                 │
│    ████████████░░░░ 80%             │
│                                     │
│  ┌─────────┐ ┌─────────┐            │
│  │  Start  │ │  Reset  │            │
│  └─────────┘ └─────────┘            │
│                                     │
│  📊 [Statistics] 🔧 [Settings]      │
└─────────────────────────────────────┘
```

### Mobile Responsive Breakpoints
```css
/* Tailwind breakpoints */
sm: '640px',   /* Mobile landscape */
md: '768px',   /* Tablet */
lg: '1024px',  /* Desktop */
xl: '1280px',  /* Large desktop */
2xl: '1536px'  /* Extra large */
```

## 📊 Analytics ve User Behavior Tracking

### Event Tracking Schema
```typescript
// src/utils/analytics.ts
export interface AnalyticsEvent {
  event: string;
  category: 'timer' | 'ui' | 'error' | 'performance';
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

export const trackEvent = (event: AnalyticsEvent) => {
  // Google Analytics 4
  gtag('event', event.event, {
    event_category: event.category,
    event_label: event.label,
    value: event.value
  });
  
  // Custom analytics
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  }).catch(console.error);
};
```

### Key Metrics
- **Timer Completion Rate**: Başlatılan timer'ların tamamlanma oranı
- **Average Session Duration**: Ortalama kullanım süresi
- **Feature Adoption**: Özellik kullanım oranları
- **Error Rate**: Hata oranları ve türleri
- **Performance Metrics**: Core Web Vitals

## 🎯 Sonuç

Bu proje, modern web teknolojileri kullanarak kullanıcı dostu bir kahve molası zamanlayıcısı oluşturmayı hedefliyor. MVP'den başlayarak, kullanıcı geri bildirimlerine göre sürekli geliştirilecek ve PWA özellikleri ile native app deneyimi sunacak.

**Proje Süresi**: 2-3 hafta (MVP), 4-6 hafta (Full Version)
**Takım Büyüklüğü**: 1-2 developer
**Teknoloji Karmaşıklığı**: Orta seviye
**Kullanıcı Hedefi**: Kahve severler, remote çalışanlar, odaklanma sorunu yaşayanlar

### Geliştirme Öncelikleri
1. **Phase 1 (MVP)**: Temel timer + animasyon + bildirim
2. **Phase 2**: PWA + offline + istatistik
3. **Phase 3**: Advanced features + analytics
4. **Phase 4**: Social features + AI recommendations

> "Kahve molası almak için bile teknoloji gerekiyor artık - en azından güzel görünsün." - Maestro
