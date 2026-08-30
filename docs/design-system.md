# Nutmeg — Design System

**Version:** 1.0  
**Date:** 2026-08-28  
**Status:** Draft — pending review  
**Repository:** `docs/design-system.md`

---

## 1. Design Philosophy

Nutmeg follows an **Apple-inspired luxury aesthetic** with dark glassmorphism. The design prioritizes:

- **Premium feel**: Champagne gold accents on true black create a high-end, sophisticated atmosphere.
- **Clarity**: Generous whitespace, clear typography, intuitive navigation.
- **Motion**: Rich Framer Motion animations that feel fluid and responsive.
- **Focus**: Full-screen exercise views during sessions minimize distractions.
- **Accessibility**: High contrast, readable typography, touch-friendly targets.

**Reference:** Apple's product pages, Linear, Notion — not a typical "sports app" bright/loud aesthetic.

---

## 2. Color Palette

### 2.1 Primary Colors

| Role | Name | Hex | Usage |
|---|---|---|---|
| Background | True Black | `#000000` | Main app background, OLED-friendly |
| Surface | Graphite | `#111827` | Cards, panels, modals |
| Surface Elevated | Zinc 900 | `#18181b` | Elevated cards, hover states |
| Accent | **Champagne Gold** | `#F7E7CE` | Primary CTAs, progress rings, highlights |
| Accent Muted | Champagne Gold (20%) | `#F7E7CE33` | Subtle highlights, borders |

### 2.2 Gradient Accents (4-Color Luxury Gradients)

```css
/* Primary luxury gradient */
.bg-luxury-gradient {
  background: linear-gradient(135deg, #F7E7CE 0%, #D4AF37 25%, #C9B037 50%, #B8860B 100%);
}

/* Progress ring gradient */
.progress-gradient {
  background: linear-gradient(90deg, #F7E7CE, #D4AF37, #C9B037, #B8860B);
}

/* Card hover gradient */
.card-hover-gradient {
  background: linear-gradient(145deg, #111827 0%, #18181b 100%);
}

/* Timer ring gradient */
.timer-gradient {
  background: conic-gradient(from 0deg, #F7E7CE, #D4AF37, #C9B037, #B8860B, #F7E7CE);
}
```

### 2.3 Text Colors

| Role | Name | Hex | Usage |
|---|---|---|---|
| Primary | White | `#FFFFFF` | Headings, body text |
| Secondary | Gray 300 | `#D1D5DB` | Subtitles, labels |
| Tertiary | Gray 500 | `#6B7280` | Placeholders, hints |
| Muted | Gray 600 | `#4B5563` | Disabled states |
| Error | Red 400 | `#F87171` | Error messages |
| Success | Emerald 400 | `#34D399` | Success states |

### 2.4 Semantic Colors

| Role | Hex | Usage |
|---|---|---|
| Primary | `#F7E7CE` | Main CTAs, active states |
| Secondary | `#374151` | Secondary buttons, borders |
| Success | `#059669` | Completion, positive feedback |
| Warning | `#D97706` | Caution, near-miss streaks |
| Error | `#DC2626` | Errors, failed actions |
| Info | `#2563EB` | Informational messages |

---

## 3. Typography

### 3.1 Font Family

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Primary:** Inter (loaded from Google Fonts or local)  
**Fallback:** System font stack for performance

### 3.2 Type Scale

| Role | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| Display | 48px / 3rem | 700 | 1.1 | Hero text, milestone titles |
| H1 | 36px / 2.25rem | 700 | 1.2 | Page titles |
| H2 | 30px / 1.875rem | 600 | 1.3 | Section headers |
| H3 | 24px / 1.5rem | 600 | 1.4 | Card titles |
| H4 | 20px / 1.25rem | 600 | 1.4 | Subsections |
| Body Large | 18px / 1.125rem | 400 | 1.6 | Body text, descriptions |
| Body | 16px / 1rem | 400 | 1.5 | Standard body text |
| Body Small | 14px / 0.875rem | 400 | 1.5 | Captions, hints |
| Caption | 12px / 0.75rem | 400 | 1.4 | Labels, metadata |
| Micro | 10px / 0.625rem | 500 | 1.3 | Badges, tags |

### 3.3 Letter Spacing

```css
.text-tight { letter-spacing: -0.02em; }
.text-normal { letter-spacing: 0; }
.text-wide { letter-spacing: 0.05em; }
.text-wider { letter-spacing: 0.1em; } /* Uppercase labels */
```

---

## 4. Spacing System

### 4.1 Base Grid

Combined approach: **8px base grid** with **4px granularity** and **fluid responsive spacing**.

```css
:root {
  /* Base units */
  --space-1: 4px;   /* 0.25rem */
  --space-2: 8px;   /* 0.5rem */
  --space-3: 12px;  /* 0.75rem */
  --space-4: 16px;  /* 1rem */
  --space-5: 20px;  /* 1.25rem */
  --space-6: 24px;  /* 1.5rem */
  --space-8: 32px;  /* 2rem */
  --space-10: 40px; /* 2.5rem */
  --space-12: 48px; /* 3rem */
  --space-16: 64px; /* 4rem */
  --space-20: 80px; /* 5rem */
  --space-24: 96px; /* 6rem */
  --space-32: 128px; /* 8rem */
}

/* Fluid spacing for larger screens */
@media (min-width: 768px) {
  :root {
    --space-4: 20px;
    --space-6: 28px;
    --space-8: 36px;
  }
}
```

### 4.2 Component Spacing

| Component | Padding | Gap |
|---|---|---|
| Card | 24px (mobile) / 32px (desktop) | 16px |
| Button | 12px 24px | — |
| Input | 12px 16px | — |
| Section | 24px | 24px |
| Container | 20px (sides) | — |

---

## 5. Border Radius

### 5.1 Radius Scale

| Name | Value | Usage |
|---|---|---|
| `rounded-sm` | 4px | Buttons, tags, badges |
| `rounded` | 8px | Cards, inputs, modals |
| `rounded-md` | 12px | Elevated cards, panels |
| `rounded-lg` | 16px | Large cards, containers |
| `rounded-xl` | 20px | Hero sections, featured cards |
| `rounded-2xl` | 24px | Full-screen overlays, timer |
| `rounded-full` | 9999px | Avatars, progress rings |

### 5.2 Contextual Usage

```css
/* Small: dense UI elements */
.tag, .badge, .chip { border-radius: 4px; }

/* Medium: standard cards and inputs */
.card, .input, .button { border-radius: 8px; }

/* Large: elevated surfaces */
.modal, .panel, .feature-card { border-radius: 16px; }

/* XL: immersive experiences */
.timer-screen, .onboarding-slide { border-radius: 24px; }
```

---

## 6. Glassmorphism

### 6.1 Subtle Glass Effect

```css
.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-elevated {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}
```

### 6.2 Glass Variants

| Variant | Blur | Opacity | Border | Shadow |
|---|---|---|---|---|
| Subtle | 8px | 3% | 8% white | None |
| Medium | 12px | 5% | 12% white | Soft |
| Strong | 16px | 8% | 16% white | Medium |
| Premium | 20px | 10% | 20% white | Pronounced |

**Usage:** Subtle for most cards, Premium for timer screen and onboarding.

---

## 7. Shadows & Elevation

### 7.1 Shadow Scale

```css
.shadow-subtle {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.shadow-medium {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.shadow-strong {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.shadow-glow {
  box-shadow: 0 0 40px rgba(247, 231, 206, 0.15);
}
```

### 7.2 Elevation Levels

| Level | Shadow | Usage |
|---|---|---|
| 0 (Flat) | None | Backgrounds |
| 1 (Raised) | Subtle | Cards, inputs |
| 2 (Elevated) | Medium | Modals, dropdowns |
| 3 (Floating) | Strong | Floating buttons, toasts |
| 4 (Overlay) | Glow + Strong | Timer screen, hero elements |

---

## 8. Components

### 8.1 Buttons

```tsx
// Primary Button
<button className="
  px-6 py-3 rounded-lg
  bg-gradient-to-r from-[#F7E7CE] to-[#D4AF37]
  text-black font-semibold
  hover:opacity-90 hover:scale-[1.02]
  active:scale-[0.98]
  transition-all duration-200
  shadow-lg shadow-[#F7E7CE]/20
">
  Start Session
</button>

// Secondary Button
<button className="
  px-6 py-3 rounded-lg
  bg-white/5 backdrop-blur-md
  border border-white/10
  text-white font-medium
  hover:bg-white/10 hover:border-white/20
  transition-all duration-200
">
  View Details
</button>

// Ghost Button
<button className="
  px-4 py-2 rounded-md
  text-gray-400 hover:text-white
  hover:bg-white/5
  transition-all duration-200
">
  Skip
</button>
```

### 8.2 Cards

```tsx
// Standard Card
<div className="
  rounded-xl
  bg-[#111827]
  border border-white/5
  p-6
  hover:border-white/10
  transition-all duration-300
">
  {/* Card content */}
</div>

// Glass Card
<div className="
  rounded-2xl
  bg-white/5 backdrop-blur-xl
  border border-white/10
  p-6
  shadow-lg
">
  {/* Card content */}
</div>

// Luxury Gradient Card
<div className="
  rounded-2xl
  bg-gradient-to-br from-[#111827] to-[#18181b]
  border border-white/10
  p-6
  relative
  overflow-hidden
">
  {/* Optional gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-tr from-[#F7E7CE]/5 to-transparent pointer-events-none" />
  {/* Card content */}
</div>
```

### 8.3 Progress Ring (Timer)

```tsx
// Dual-ring progress with luxury gradient
<div className="relative w-64 h-64">
  {/* Background ring */}
  <svg className="w-full h-full transform -rotate-90">
    <circle
      cx="128" cy="128" r="112"
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="8"
      fill="none"
    />
  </svg>
  
  {/* Progress ring */}
  <svg className="w-full h-full transform -rotate-90">
    <circle
      cx="128" cy="128" r="112"
      stroke="url(#luxuryGradient)"
      strokeWidth="8"
      fill="none"
      strokeDasharray={`${circumference} ${circumference}`}
      strokeDashoffset={offset}
      strokeLinecap="round"
      className="transition-all duration-1000 ease-linear"
    />
  </svg>
  
  {/* Inner ring (rest timer) */}
  <svg className="absolute inset-0 w-48 h-48 transform -rotate-90 mx-auto mt-8">
    <circle
      cx="96" cy="96" r="80"
      stroke="rgba(255,255,255,0.05)"
      strokeWidth="6"
      fill="none"
    />
    <circle
      cx="96" cy="96" r="80"
      stroke="url(#luxuryGradient)"
      strokeWidth="6"
      fill="none"
      strokeDasharray={`${innerCircumference} ${innerCircumference}`}
      strokeDashoffset={innerOffset}
      strokeLinecap="round"
      className="transition-all duration-1000 ease-linear"
    />
  </svg>
  
  {/* Center content */}
  <div className="absolute inset-0 flex flex-col items-center justify-center">
    <span className="text-6xl font-bold text-white">45</span>
    <span className="text-sm text-gray-400 mt-2">seconds</span>
  </div>
  
  {/* Gradient definition */}
  <defs>
    <linearGradient id="luxuryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#F7E7CE" />
      <stop offset="33%" stopColor="#D4AF37" />
      <stop offset="66%" stopColor="#C9B037" />
      <stop offset="100%" stopColor="#B8860B" />
    </linearGradient>
  </defs>
</div>
```

### 8.4 Inputs

```tsx
<input
  className="
    w-full px-4 py-3 rounded-lg
    bg-white/5 backdrop-blur-md
    border border-white/10
    text-white placeholder-gray-500
    focus:outline-none focus:border-[#F7E7CE]/50 focus:ring-1 focus:ring-[#F7E7CE]/30
    transition-all duration-200
  "
  placeholder="Enter your name"
/>
```

### 8.5 Icons

Using **lucide-react** with consistent sizing:

```tsx
import { Timer, TrendingUp, Users, MessageSquare } from 'lucide-react';

// Standard size
<Timer className="w-5 h-5 text-[#F7E7CE]" />

// Large (timer screen)
<Timer className="w-12 h-12 text-[#F7E7CE]/80" />

// With animation
<motion.div
  animate={{ rotate: [0, 10, -10, 0] }}
  transition={{ duration: 0.5 }}
>
  <Timer className="w-6 h-6 text-[#F7E7CE]" />
</motion.div>
```

---

## 9. Animations & Motion

### 9.1 Design Tokens

```typescript
// lib/animations/tokens.ts
export const animation = {
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
  },
  ease: {
    linear: 'linear',
    spring: 'spring(damping:15,stiffness:200)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  variants: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
    stagger: {
      animate: {
        transition: {
          staggerChildren: 0.05,
        },
      },
    },
  },
};
```

### 9.2 Usage Patterns

```tsx
// Page transitions
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  {/* Page content */}
</motion.div>

// Staggered list items
<motion.ul variants={animation.variants.stagger}>
  {items.map((item, i) => (
    <motion.li
      key={i}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05, duration: 0.2 }}
    >
      {item}
    </motion.li>
  ))}
</motion.ul>

// Interactive hover
<motion.button
  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
  whileTap={{ scale: 0.98 }}
>
  Click me
</motion.button>

// Skeleton loading
<motion.div
  animate={{ opacity: [0.4, 0.8, 0.4] }}
  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
  className="h-4 bg-white/10 rounded w-full"
/>
```

### 9.3 Performance Considerations

- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly for complex animations
- Respect `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Layout Patterns

### 10.1 Dashboard Layout

```
┌─────────────────────────────────────────┐
│  Logo          Streak 🔥 12    [Profile] │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  TODAY'S SESSION                │   │
│  │  Day 8: First Touch Mastery     │   │
│  │  ⚽ Striker • 60 min            │   │
│  │                                 │   │
│  │  [Start Session]                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ Progress │ │ Streak   │ │Rank    │ │
│  │  33%     │ │ 12 days  │ │#3      │ │
│  └──────────┘ └──────────┘ └────────┘ │
│                                         │
│  UPCOMING DAYS                          │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │Day 9 │ │Day 10│ │Day 11│ │Day 12│  │
│  │⚽    │ │💪    │ │🧠    │ │⚽    │  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
│                                         │
│  [AI Coach]  [Team]  [Progress]        │
└─────────────────────────────────────────┘
```

### 10.2 Timer Screen Layout

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│         [Exercise Image/Diagram]        │
│                                         │
│            Background Layer             │
│                                         │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │        45 : 00                  │   │
│  │      [Progress Ring]            │   │
│  │                                 │   │
│  │    "3, 2, 1, GO!"               │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│         [Skip]     [Pause]              │
│                                         │
└─────────────────────────────────────────┘
```

### 10.3 Team Dashboard Layout

```
┌─────────────────────────────────────────┐
│  Team: "The Strikers"    [Join Co-op]  │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┐ ┌─────────────┐      │
│  │  Ahad       │  │  Friend 1   │      │
│  │  🔥 12 days │  │  🔥 10 days │      │
│  │  85% done   │  │  80% done   │      │
│  │  ⭐ 7.5     │  │  ⭐ 6.8     │      │
│  │  [View]     │  │  [View]     │      │
│  └─────────────┘ └─────────────┘      │
│                                         │
│  ┌─────────────┐ ┌─────────────┐      │
│  │  Friend 2   │  │  Friend 3   │      │
│  │  🔥 8 days  │  │  🔥 11 days │      │
│  │  78% done   │  │  82% done   │      │
│  │  ⭐ 7.2     │  │  ⭐ 7.8     │      │
│  └─────────────┘ └─────────────┘      │
│                                         │
│  Position Subgroups: [Strikers] [Midi] │
└─────────────────────────────────────────┘
```

### 10.4 Onboarding Flow (4 Pages)

```
Page 1: Basic Info
┌─────────────────────────────────────────┐
│  Step 1 of 4                            │
│                                         │
│  What's your name?                      │
│  ┌─────────────────────────────────┐   │
│  │  Enter your name                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  How old are you?                       │
│  [===●=================]  25 years     │
│                                         │
│  Height & Weight                        │
│  [175 cm] [70 kg]                       │
│                                         │
│  [Continue]                             │
└─────────────────────────────────────────┘

Page 2: Fitness Profile
┌─────────────────────────────────────────┐
│  Step 2 of 4                            │
│                                         │
│  Skill Level                            │
│  ┌──────┐ ┌──────┐ ┌──────┐           │
│  │Beg   │ │Int    │ │Adv   │           │
│  │●     │ │      │ │      │           │
│  └──────┘ └──────┘ └──────┘           │
│                                         │
│  Position                               │
│  ⚽ Striker  🎯 Midfielder  🛡️ Defender│
│                                         │
│  Dominant Foot                          │
│  [Left ●] [Right] [Both]                │
│                                         │
│  [Continue]                             │
└─────────────────────────────────────────┘

Page 3: Baseline Test
┌─────────────────────────────────────────┐
│  Step 3 of 4                            │
│                                         │
│  Let's test your baseline fitness       │
│                                         │
│  Push-ups (max in 1 min)                │
│  ┌─────────────────────────────────┐   │
│  │  [====●==========]  25 reps     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Sit-ups (max in 1 min)                 │
│  ┌─────────────────────────────────┐   │
│  │  [=======●=====]  35 reps       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  12-min run (optional)                  │
│  ┌─────────────────────────────────┐   │
│  │  [1800 m]  ⏭️ Skip              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Continue]                             │
└─────────────────────────────────────────┘

Page 4: Preferences
┌─────────────────────────────────────────┐
│  Step 4 of 4                            │
│                                         │
│  Training time per day                  │
│  ┌─────────────────────────────────┐   │
│  │  [==●================]  60 min  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Equipment available                    │
│  ☐ Ball  ☑ Shoes  ☐ Cones  ☑ Wall     │
│  ☑ Ground  ☐ Stairs  ☐ Goal            │
│                                         │
│  Training context                       │
│  [Solo ●] [With Friends] [Both]        │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Create Team   |   Join Team    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Start Your 60 Days]                   │
└─────────────────────────────────────────┘
```

---

## 11. Screen Specifications

### 11.1 Dashboard

- **Background:** True black (#000000)
- **Cards:** Graphite (#111827) with subtle glass effect
- **Accent:** Champagne Gold (#F7E7CE) for progress rings, active states
- **Typography:** Inter, white primary text, gray secondary
- **Spacing:** 24px padding, 16px gaps
- **Radius:** 16px for cards, 8px for buttons
- **Animation:** Fade in on load, staggered list items

### 11.2 Timer Screen

- **Background:** Full-screen exercise image with dark overlay (60% opacity)
- **Timer:** Large numeric display (72px) with dual progress rings
- **Controls:** Minimal — Skip, Pause buttons at bottom
- **TTS:** English voice cues ("3, 2, 1, go", "rest")
- **Radius:** 24px for timer container
- **Animation:** Smooth ring transitions, pulse on exercise change

### 11.3 AI Coach Chat

- **Floating Bubble:** Bottom-right, 56px diameter, Champagne Gold gradient
- **Chat Panel:** Slide-over from right, glassmorphism, 400px width
- **Messages:** User (right, gold background), Coach (left, gray background)
- **Input:** Bottom-fixed, glass-style input field
- **Typing Indicator:** Three animated dots with "Coach is thinking..."

### 11.4 Team Dashboard

- **Layout:** Grid of member cards (2 columns mobile, 3 columns desktop)
- **Card Design:** Glass effect, member photo, streak, progress, rating
- **Leaderboard:** Optional toggle to switch between card grid and ranked list
- **Position Filter:** Chip selector for position subgroups

---

## 12. Responsive Breakpoints

```css
/* Tailwind config */
theme: {
  screens: {
    'sm': '640px',   /* Large phones */
    'md': '768px',   /* Tablets */
    'lg': '1024px',  /* Laptops */
    'xl': '1280px',  /* Desktops */
  }
}
```

### 12.1 Mobile-First Strategy

- Base styles for mobile (max 375px)
- Enhance for tablet (768px+)
- Full layout for desktop (1024px+)
- All three devices (tablet, phone, laptop) given equal priority per PRD

---

## 13. Iconography

Using **lucide-react** with consistent stroke-width and sizing:

| Icon | Usage |
|---|---|
| `Timer` | Session start, countdown |
| `TrendingUp` | Streak, progress |
| `Users` | Team, co-op |
| `MessageSquare` | AI Coach |
| `CheckCircle` | Completion, success |
| `XCircle` | Error, skip |
| `Pause` | Pause session |
| `Play` | Start session |
| `SkipForward` | Skip exercise |
| `Star` | Rating, favorites |
| ` Trophy` | Achievements |
| `Settings` | Preferences |

---

## 14. Asset Guidelines

### 14.1 Images

- **Format:** WebP preferred, PNG fallback
- **Max size:** 500KB per image (optimize with Squoosh/TinyPNG)
- **Dimensions:** Responsive srcset for different breakpoints
- **Exercise diagrams:** SVG preferred for scalability

### 14.2 Icons

- Use lucide-react (already installed)
- Consistent 24px default size
- Stroke width: 2px
- Color: Inherit from parent, accent color for highlights

### 14.3 Empty State Illustrations

- Custom illustrations for each empty state
- Style: Minimal, line-art with gold accents
- Size: 120-160px
- Format: SVG for scalability

---

## 15. Accessibility

### 15.1 Contrast Ratios

- **Normal text:** Minimum 4.5:1 (white on black = 21:1 ✓)
- **Large text:** Minimum 3:1
- **UI elements:** Minimum 3:1
- **Accent on dark:** Champagne Gold (#F7E7CE) on Black (#000000) = 15:1 ✓

### 15.2 Touch Targets

- Minimum: 44×44px (iOS HIG)
- Recommended: 48×48px
- All interactive elements meet this standard

### 15.3 Screen Reader

- All icons have aria-labels
- Progress rings announce percentage
- Timer announces remaining time
- Form inputs have associated labels

---

## 16. Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-bg: #000000;
  --color-surface: #111827;
  --color-surface-elevated: #18181b;
  --color-accent: #F7E7CE;
  --color-accent-muted: rgba(247, 231, 206, 0.2);
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #D1D5DB;
  --color-text-tertiary: #6B7280;
  --color-border: rgba(255, 255, 255, 0.08);
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  
  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 40px rgba(247, 231, 206, 0.15);
  
  /* Animation */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: spring(damping: 15, stiffness: 200);
}
```

---

## 17. Appendix: Decision Log

| Decision | Answer |
|---|---|
| Accent color | Champagne Gold (#F7E7CE) — luxurious, premium, not green |
| Dark palette | True black (#000000) + gray cards (#111827) |
| Font family | Inter |
| Glassmorphism | Subtle (8px blur, 3% white overlay, thin border) |
| Spacing system | Combined 8px grid + 4px granularity + fluid responsive |
| Border radius | Small (4-8px standard, up to 24px for immersive screens) |
| Animations | Rich — Framer Motion everywhere, spring physics |
| Icons | lucide-react |
| Timer screen | Full-screen exercise + overlay timer |
| Progress ring | Dual ring, luxury 4-color gradient, fluid liquid cards |
| Dashboard | Today's session prominent + stats below |
| Coach chat | Both floating bubble + dedicated page |
| Team dashboard | Cards per member |
| Onboarding | 4 pages, card-based steps + interactive sliders, premium |
| Empty states | Illustration + CTA |
| Loading states | Skeleton screens |
