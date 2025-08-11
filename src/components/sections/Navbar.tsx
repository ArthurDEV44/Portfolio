'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Mail, Calculator, Menu, X } from 'lucide-react';

const navigation = [
  { 
    name: "Accueil", 
    href: "/",
    icon: Home
  },
  { 
    name: "Tarifs", 
    href: "/tarifs",
    icon: Calculator
  },
  { 
    name: "Contact", 
    href: "/contact",
    icon: Mail
  }
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-4 py-4">
          <div className="flex items-center justify-between h-16">

            {/* Navigation centrée - Desktop */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="bg-zinc-900/50 backdrop-blur-md rounded-full border border-zinc-700/50 px-1 py-1">
                <div className="flex items-center gap-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 group ${
                        (item.href === '/' && pathname === '/') ||
                        (item.href !== '/' && pathname === item.href)
                          ? 'text-white bg-zinc-800/80'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                      }`}
                    >
                      <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Bouton hamburger - Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-zinc-900/50 backdrop-blur-md rounded-full border border-zinc-700/50 p-3 text-zinc-400 hover:text-white transition-colors"
                aria-label="Menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-16 left-4 right-4 bg-zinc-900/95 backdrop-blur-md rounded-2xl border border-zinc-700/50 p-4">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleMenuClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    (item.href === '/' && pathname === '/') ||
                    (item.href !== '/' && pathname === item.href)
                      ? 'text-white bg-zinc-800/80'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 