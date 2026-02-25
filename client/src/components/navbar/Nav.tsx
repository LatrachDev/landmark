'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Assets
import whiteLogo from '@/assets/logotype/white.png';
import mainLogo from '@/assets/logotype/main.png';

const Nav = memo(() => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnimating, setMenuAnimating] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === '/';

  const navLinks = useMemo(() => [
    { name: 'ACCUEIL', path: '/' },
    { name: 'PROJETS', path: '/projects' },
    { name: 'SERVICES', path: '/services' },
    { name: 'À PROPOS DE NOUS', path: '/about' },
    { name: 'BLOG', path: '/blog' },
  ], []);



  // Scroll logic
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const scrollY = window.scrollY;

        // Background color threshold
        let scrollThreshold;
        if (window.innerWidth >= 1280) scrollThreshold = 1300;
        else if (window.innerWidth >= 768) scrollThreshold = 1100;
        else scrollThreshold = 700;
        setScrolled(scrollY > scrollThreshold);
      }, 10);
    };

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleScroll, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearTimeout(scrollTimer);
      clearTimeout(resizeTimer);
    };
  }, [isHome]);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [menuOpen]);

  const shouldUseDarkColors = scrolled || !isHome;

  const openMenu = useCallback(() => {
    setMenuOpen(true);
    setMenuVisible(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setMenuAnimating(true));
    });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuAnimating(false);
    setMenuOpen(false);
    const timer = setTimeout(() => setMenuVisible(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = useCallback(() => {
    if (menuOpen) closeMenu();
    else openMenu();
  }, [menuOpen, openMenu, closeMenu]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) closeMenu();
    };
    if (menuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [menuOpen, closeMenu]);

  return (
    <>
      <nav
        className={`w-full sticky top-0 font-jost z-50 ${!isHome
            ? 'bg-white'
            : scrolled
              ? 'bg-white shadow-sm'
              : 'bg-transparent backdrop-blur-sm'
          } transition-all duration-500 ease-in-out`}
      >
        <div className="w-[90%] m-auto">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center py-4 sm:px-6 z-60 relative" aria-label="Landmark - Retour à l'accueil">
              <img
                src={shouldUseDarkColors || menuOpen ? mainLogo.src : whiteLogo.src}
                alt="Landmark - Agence Marketing Digital"
                className="w-28 sm:w-40"
                loading="eager"
                width="160"
                height="60"
              />
            </Link>

            {/* Desktop Nav */}
            <div className={`hidden xl:flex items-center space-x-8 ${shouldUseDarkColors ? 'text-black' : 'text-white'
              }`}>
              <div className="flex justify-between space-x-8">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`text-sm md:text-base relative group whitespace-nowrap ${pathname === link.path ? 'font-semibold' : ''
                      }`}
                    aria-current={pathname === link.path ? 'page' : undefined}
                  >
                    {link.name}
                    <span
                      className={`absolute bottom-0 left-0 ${pathname === link.path ? 'w-full' : 'w-0'
                        } h-0.5 bg-[#445EF2] transition-all duration-300 group-hover:w-full`}
                      aria-hidden="true"
                    ></span>
                  </Link>
                ))}
              </div>
              <Link
                href="/contact"
                className={`bg-transparent ${shouldUseDarkColors ? 'text-black border-black' : 'text-white border-white'
                  } border text-sm md:text-base px-4 py-1.5 transition-all duration-300 hover:border-[#445EF2] hover:bg-[#445EF2] hover:text-white whitespace-nowrap`}
                aria-label="Demander une consultation gratuite"
              >
                CONSULTATION GRATUITE
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`xl:hidden z-60 relative ${shouldUseDarkColors || menuOpen ? 'text-black' : 'text-white'
                } focus:outline-none focus:ring-2 focus:ring-[#445EF2] focus:ring-offset-2 rounded`}
              onClick={toggleMenu}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className={`w-6 h-6 transform transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuVisible && (
        <div
          id="mobile-menu"
          className={`xl:hidden fixed inset-0 z-40 pt-20 font-jost bg-white transform transition-transform duration-500 ease-in-out ${menuAnimating ? 'translate-y-0' : '-translate-y-full'
            }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <div className="flex flex-col justify-center items-center h-full px-8">
            <h2 id="mobile-menu-title" className="sr-only">Menu de navigation</h2>

            <div className="flex flex-col space-y-8 text-center">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-xl sm:text-2xl relative block group text-black hover:text-[#445EF2] ${pathname === link.path ? 'font-semibold' : ''
                    } transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#445EF2] focus:ring-offset-2 rounded ${menuAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                    }`}
                  style={{
                    transitionDelay: menuAnimating ? `${150 + index * 60}ms` : '0ms',
                    transitionProperty: 'opacity, transform',
                    transitionDuration: '400ms',
                    transitionTimingFunction: 'ease-out',
                  }}
                  onClick={closeMenu}
                  aria-current={pathname === link.path ? 'page' : undefined}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 ${pathname === link.path ? 'w-full' : 'w-0'
                      } h-0.5 bg-[#445EF2] transition-all duration-300 group-hover:w-full`}
                    aria-hidden="true"
                  ></span>
                </Link>
              ))}

              <Link
                href="/contact"
                className={`bg-transparent text-black border-black border text-sm sm:text-xl px-6 py-3 transition-all duration-500 hover:bg-[#445EF2] hover:border-[#445EF2] hover:text-white mt-8 focus:outline-none focus:ring-2 focus:ring-[#445EF2] focus:ring-offset-2 rounded ${menuAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                style={{
                  transitionDelay: menuAnimating ? `${150 + navLinks.length * 60}ms` : '0ms',
                  transitionProperty: 'opacity, transform, background-color, border-color, color',
                  transitionDuration: '400ms',
                  transitionTimingFunction: 'ease-out',
                }}
                onClick={closeMenu}
                aria-label="Demander une consultation gratuite"
              >
                CONSULTATION GRATUITE
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

Nav.displayName = 'Nav';

export default Nav;