"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, BarChart3, Store, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/analyze", label: "Check", icon: Camera },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/marketplace", label: "Market", icon: Store },
  { href: "/knowledge", label: "Learn", icon: BookOpen },
  { href: "/credential/demo-alex-smith", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl backdrop-saturate-180 border-t border-slate-200/60 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] safe-area-pb">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href + "/"));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all duration-200 active:scale-90",
                isActive
                  ? "text-[#0070BA] font-semibold"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
              )}
            >
              {/* Apple-style soft pill indicator under active tab */}
              {isActive && (
                <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-blue-50/80 -z-10 animate-in fade-in zoom-in-95 duration-150" />
              )}
              <Icon className={cn("w-5 h-5 transition-transform", isActive ? "scale-105 text-[#0070BA]" : "text-slate-400")} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
