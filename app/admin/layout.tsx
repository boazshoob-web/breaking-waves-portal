'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  BarChart3,
  UsersRound,
  Layers,
  Anchor,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const sidebarLinks = [
  { href: '/admin', label: 'דשבורד', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'ניהול משתמשים', icon: UsersRound },
  { href: '/admin/teams', label: 'ניהול צוותים', icon: Anchor },
  { href: '/admin/participants', label: 'ניהול משתתפים', icon: Users },
  { href: '/admin/knowledge', label: 'ניהול תוכן', icon: BookOpen },
  { href: '/admin/knowledge/categories', label: 'קטגוריות', icon: Layers, indent: true },
  { href: '/admin/onboarding', label: 'Onboarding', icon: UsersRound },
  { href: '/admin/reports', label: 'כל הדוחות', icon: ClipboardList },
  { href: '/admin/statistics', label: 'סטטיסטיקות', icon: BarChart3 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-ocean-blue text-white py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-1 rounded hover:bg-white/20 transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-bold">ממשק ניהול</span>
          </div>
          <Link href="/" className="text-sm hover:underline opacity-80">
            חזרה לאתר ←
          </Link>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          } fixed lg:static inset-y-0 right-0 top-0 lg:top-auto z-40 w-64 bg-white shadow-lg lg:shadow-none border-l border-gray-200 transition-transform duration-200 lg:min-h-[calc(100vh-7rem)]`}
        >
          <nav className="p-4 space-y-1 mt-16 lg:mt-0">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href, link.exact);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    link.indent ? 'pr-8' : ''
                  } ${
                    active
                      ? 'bg-ocean-blue text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
