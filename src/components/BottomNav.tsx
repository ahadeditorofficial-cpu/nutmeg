"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Timer,
  MessageSquare,
  Users,
  TrendingUp,
} from "lucide-react";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sessions", label: "Sessions", icon: Timer },
  { href: "/coach", label: "AI Coach", icon: MessageSquare },
  { href: "/team", label: "Team", icon: Users },
  { href: "/progress", label: "Progress", icon: TrendingUp },
];

const CHAMPAGNE_GOLD = "#F7E7CE";
const CHAMPAGNE_GOLD_RGB = "247, 231, 206";

interface BottomNavProps {
  currentPath?: string;
}

export function BottomNav({ currentPath }: BottomNavProps) {
  const pathname = usePathname();
  const activePath = currentPath || pathname;

  const getActiveItem = () => {
    return NAV_ITEMS.find((item) => activePath.startsWith(item.href)) || NAV_ITEMS[0];
  };

  const activeItem = getActiveItem();
  const activeIndex = NAV_ITEMS.findIndex((item) => item.href === activeItem.href);

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="fixed bottom-0 left-0 right-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-md">
        <motion.div
          className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/50 p-1.5"
          style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 40px rgba(247, 231, 206, 0.1)" }}
        >
          {/* Active indicator background */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              layoutId="activeIndicator"
              className="absolute inset-y-1.5 rounded-xl"
              style={{
                background: `linear-gradient(135deg, rgba(${CHAMPAGNE_GOLD_RGB}, 0.15) 0%, rgba(${CHAMPAGNE_GOLD_RGB}, 0.05) 100%)`,
                border: `1px solid rgba(${CHAMPAGNE_GOLD_RGB}, 0.3)`,
                boxShadow: `0 0 20px rgba(${CHAMPAGNE_GOLD_RGB}, 0.15), inset 0 1px 0 rgba(${CHAMPAGNE_GOLD_RGB}, 0.2)`,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 0.8,
              }}
            />
          </AnimatePresence>

          <div className="relative flex items-center justify-around" role="tablist">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === activeItem.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={item.label}
                  className="relative flex flex-col items-center gap-1.5 px-3 py-2.5 min-w-[60px] touch-target"
                  style={{ minHeight: "48px", minWidth: "60px" }}
                >
                  <AnimatePresence mode="wait">
                    {/* Inactive icon */}
                    {!isActive && (
                      <motion.div
                        key="inactive"
                        initial={{ opacity: 0, scale: 0.8, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <Icon
                          className="w-5 h-5 text-gray-400 transition-colors duration-200 [stroke-width:2]"
                          aria-hidden="true"
                        />
                      </motion.div>
                    )}

                    {/* Active icon */}
                    {isActive && (
                      <motion.div
                        key="active"
                        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                        transition={{ duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }}
                      >
                        <Icon
                          className="w-6 h-6 text-[#F7E7CE] transition-colors duration-200 [stroke-width:2.5] drop-shadow-[0_0_8px_rgba(247,231,206,0.6)]"
                          aria-hidden="true"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    {/* Inactive label */}
                    {!isActive && (
                      <motion.span
                        key="inactive-label"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="text-[11px] font-medium text-gray-500 tracking-wider uppercase transition-colors duration-200"
                      >
                        {item.label}
                      </motion.span>
                    )}

                    {/* Active label */}
                    {isActive && (
                      <motion.span
                        key="active-label"
                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: [0.68, -0.55, 0.265, 1.55] }}
                        className="text-[11px] font-semibold tracking-wider uppercase text-[#F7E7CE]"
                        style={{
                          textShadow: `0 0 8px rgba(${CHAMPAGNE_GOLD_RGB}, 0.5)`,
                        }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Active indicator dot */}
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        key="dot"
                        initial={{ opacity: 0, scale: 0, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0, y: -4 }}
                        transition={{ delay: 0.1, duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }}
                        className="absolute bottom-1 left-1/2 -translate-x-1/2"
                        aria-hidden="true"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: CHAMPAGNE_GOLD,
                            boxShadow: `0 0 8px ${CHAMPAGNE_GOLD}, 0 0 16px rgba(${CHAMPAGNE_GOLD_RGB}, 0.5)`,
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Focus visible ring for accessibility */}
                  <span
                    className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7E7CE]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Safe area inset for mobile */}
      <div className="h-safe-area-inset-bottom" aria-hidden="true" />
    </motion.nav>
  );
}