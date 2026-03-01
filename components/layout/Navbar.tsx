'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Anchor,
  BookOpen,
  ClipboardList,
  Users,
  Menu,
  X,
  LogIn,
  UserPlus,
  User,
  LogOut,
  LayoutDashboard,
  FilePlus,
  FileText,
  BarChart3,
  Settings,
} from 'lucide-react';
import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = status === 'authenticated';
  const isAdmin = session?.user?.role === 'ADMIN';
  const onboardingStatus = session?.user?.onboardingStatus;

  // Public links - always visible
  const publicLinks: NavLink[] = [
    { href: '/', label: 'בית', icon: Anchor },
    { href: '/knowledge', label: 'מאגר ידע', icon: BookOpen },
  ];

  // Authenticated user links
  const userLinks: NavLink[] = [];
  if (isAuthenticated) {
    if (onboardingStatus !== 'APPROVED') {
      userLinks.push({ href: '/onboarding', label: 'ה-Onboarding שלי', icon: Users });
    }
    userLinks.push(
      { href: '/reports/new', label: 'דוח חדש', icon: FilePlus },
      { href: '/reports', label: 'הדוחות שלי', icon: ClipboardList },
    );
  }

  // Admin links
  const adminLinks: NavLink[] = [];
  if (isAdmin) {
    adminLinks.push(
      { href: '/admin', label: 'דשבורד', icon: LayoutDashboard },
      { href: '/admin/knowledge', label: 'ניהול תוכן', icon: Settings },
      { href: '/admin/reports', label: 'כל הדוחות', icon: FileText },
      { href: '/admin/statistics', label: 'סטטיסטיקות', icon: BarChart3 },
    );
  }

  const allLinks = [...publicLinks, ...userLinks, ...adminLinks];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  const linkClassName = (href: string) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
      isActive(href)
        ? 'bg-ocean-blue text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  const mobileLinkClassName = (href: string) =>
    `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
      isActive(href)
        ? 'bg-ocean-blue text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Anchor className="w-8 h-8 text-ocean-blue" />
            <span className="text-xl font-bold text-ocean-blue">שוברים גלים</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href} className={linkClassName(link.href)}>
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}

            {userLinks.length > 0 && (
              <>
                <div className="w-px h-6 bg-gray-300 mx-2" />
                {userLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link key={link.href} href={link.href} className={linkClassName(link.href)}>
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  );
                })}
              </>
            )}

            {adminLinks.length > 0 && (
              <>
                <div className="w-px h-6 bg-gray-300 mx-2" />
                {adminLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link key={link.href} href={link.href} className={linkClassName(link.href)}>
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{link.label}</span>
                    </Link>
                  );
                })}
              </>
            )}
          </div>

          {/* Auth Area (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium text-sm">{session.user.name}</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">יציאה</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  <span>התחברות</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-2 px-4 py-2 bg-ocean-blue text-white hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>הרשמה</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="תפריט"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-1">
              {allLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={mobileLinkClassName(link.href)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}

              <div className="border-t border-gray-200 mt-2 pt-2 flex flex-col gap-1">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className={mobileLinkClassName('/profile')}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">{session.user.name}</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="flex items-center gap-2 px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">יציאה</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>התחברות</span>
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 bg-ocean-blue text-white hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>הרשמה</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
