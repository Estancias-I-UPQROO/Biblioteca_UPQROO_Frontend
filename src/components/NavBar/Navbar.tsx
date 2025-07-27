import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- HOOKS ADICIONALES ---

/**
 * Hook para detectar si el ancho de la pantalla coincide con una media query.
 * @param query La media query de CSS a evaluar (ej. "(max-width: 1159px)")
 * @returns {boolean} True si la query coincide, false en caso contrario.
 */
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Establece el valor inicial
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);
    
    // Escucha cambios en el tamaño de la ventana
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

/**
 * Hook para detectar si el dispositivo es táctil.
 * @returns {boolean} True si es un dispositivo táctil.
 */
const useIsTouchDevice = (): boolean => {
  const [isTouch, setIsTouch] = useState<boolean>(false);
  useEffect(() => {
    const onTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouch(onTouch);
  }, []);
  return isTouch;
};


// --- COMPONENTE NAVBAR ---

export const Navbar = () => {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 1159px)");
  const isTouchDevice = useIsTouchDevice();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Cierra menús al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
  }, [location.pathname]);

  // Cierra menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Enfoca el input de búsqueda al mostrarse
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Cierra el menú de escritorio si se cambia a vista móvil con un menú abierto
  useEffect(() => {
    if (isMobile) {
      setActiveMenu(null);
    }
  }, [isMobile]);

  const clearTimeout = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleSmoothScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Buscando:", searchQuery);
    }
    setShowSearch(false);
    setIsMobileMenuOpen(false);
  };

  // --- Estilos y Componentes Internos (sin cambios) ---
  const navItemClass = (path: string) =>
    location.pathname === path
      ? "text-orange-600 font-semibold border-b-2 border-orange-500"
      : "text-gray-800 hover:text-orange-500 font-medium";

  const submenuItemClass = (path: string) =>
    location.pathname === path
      ? "text-orange-600 font-medium bg-gray-50"
      : "text-gray-700 hover:text-orange-500 hover:bg-gray-50";

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <div className="h-full flex items-center">
      <Link
        to={to}
        className={`px-4 ${navItemClass(to)} transition-colors duration-150 h-full flex items-center`}
        onClick={() => {
          setIsMobileMenuOpen(false);
          setActiveMenu(null);
          handleSmoothScroll();
        }}
      >
        {label}
      </Link>
    </div>
  );

  // --- COMPONENTE DESKTOPDROPDOWN MODIFICADO ---
  const DesktopDropdown = ({
    menu,
    links,
  }: {
    menu: string;
    links: { to: string; label: string }[];
  }) => {
    const handleMouseEnter = () => {
      // Activa el hover solo en dispositivos no táctiles
      if (!isTouchDevice) {
        clearTimeout();
        setActiveMenu(menu);
      }
    };

    const handleMouseLeave = () => {
      // Activa el leave solo en dispositivos no táctiles
      if (!isTouchDevice) {
        timeoutRef.current = window.setTimeout(() => {
          setActiveMenu(null);
        }, 200);
      }
    };

    const handleClick = () => {
      // Alterna la visibilidad del menú al hacer clic
      setActiveMenu(activeMenu === menu ? null : menu);
    };

    return (
      <div
        className="relative h-full flex items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          onClick={handleClick}
          className={`px-4 ${navItemClass(links[0].to)} flex items-center h-full relative z-10 cursor-pointer`}
        >
          {menu.toUpperCase()} <span className="ml-1">▾</span>
        </button>

        <AnimatePresence>
          {activeMenu === menu && (
            <motion.ul
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50"
              onMouseEnter={handleMouseEnter} // Mantiene el menú abierto al mover el cursor sobre él
              onMouseLeave={handleMouseLeave}
            >
              {links.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`block py-2 px-5 ${submenuItemClass(to)} transition-colors duration-150 text-sm`}
                    onClick={() => {
                      setActiveMenu(null);
                      handleSmoothScroll();
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const MobileDropdown = ({
    menu,
    links,
  }: {
    menu: string;
    links: { to: string; label: string }[];
  }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="border-l-2 border-gray-100 pl-2">
        <button
          className="w-full text-left py-2 px-4 font-semibold text-gray-800 hover:text-orange-500 flex justify-between items-center"
          onClick={() => setOpen(!open)}
        >
          <span>{menu.toUpperCase()}</span>
          <span>{open ? "▴" : "▾"}</span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pl-6 overflow-hidden"
            >
              {links.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="block py-2 text-sm text-gray-700 hover:text-orange-500 transition-colors duration-150"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSmoothScroll();
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50" ref={menuRef}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center h-full z-10" onClick={handleSmoothScroll}>
          <img src="/public/Upqroo_Logo.png" alt="Logo" className="h-12 w-auto"/>
        </Link>
        
        {/* RENDERIZADO CONDICIONAL: DESKTOP vs MOBILE */}
        {isMobile ? (
          // --- VISTA MÓVIL ---
          <button
            className="p-1 hover:bg-gray-100 transition-colors duration-150"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        ) : (
          // --- VISTA ESCRITORIO ---
          <div className="flex items-center gap-1">
            <div className="relative" ref={searchRef}>
              {showSearch ? (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 200 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white"
                >
                  <form onSubmit={handleSearch} className="flex items-center border-b-2 border-orange-500">
                    <input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar..." className="w-full px-2 py-1 text-sm focus:outline-none" />
                    <button type="submit" className="text-orange-500 hover:text-orange-700 p-1"><Search size={18} /></button>
                  </form>
                </motion.div>
              ) : (
                <button onClick={() => setShowSearch(true)} className="p-1 text-gray-700 hover:text-orange-500 transition-colors duration-150" aria-label="Buscar"><Search size={20} /></button>
              )}
            </div>
            <div className="flex items-center h-full text-sm font-medium ml-2">
              <NavLink to="/" label="INICIO" />
              <DesktopDropdown menu="acerca de nosotros" links={[{ to: "/filosofia", label: "Filosofía" }, { to: "/lineamientos", label: "Lineamientos" }]}/>
              <NavLink to="/servicios" label="SERVICIOS" />
              <DesktopDropdown menu="recursos electrónicos" links={[{ to: "/base-de-datos", label: "Base de datos" }, { to: "/bibliotecas-digitales", label: "Bibliotecas digitales" }, { to: "/revistas-electronicas", label: "Revistas electrónicas" }, { to: "/ebooks", label: "E-books" }, { to: "/diccionarios", label: "Diccionarios" }, { to: "/normas", label: "Normas y guías" }, { to: "/formacion-autodidacta", label: "Formación autodidacta" }]}/>
              <NavLink to="/catalogo" label="CATÁLOGO" />
              <NavLink to="/ayuda" label="AYUDA" />
            </div>
          </div>
        )}
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white border-t border-gray-200 px-4 pt-2 pb-4 space-y-2 overflow-hidden"
          >
            <form onSubmit={handleSearch} className="flex items-center border-b-2 border-orange-500 mb-3">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar..." className="w-full px-2 py-1 text-sm focus:outline-none"/>
              <button type="submit" className="text-orange-500 hover:text-orange-700 p-1"><Search size={18} /></button>
            </form>

            <NavLink to="/" label="INICIO" />
            <MobileDropdown menu="acerca de nosotros" links={[{ to: "/filosofia", label: "Filosofía" }, { to: "/lineamientos", label: "Lineamientos" }]}/>
            <NavLink to="/servicios" label="SERVICIOS" />
            <MobileDropdown menu="recursos electrónicos" links={[{ to: "/base-de-datos", label: "Base de datos" }, { to: "/bibliotecas-digitales", label: "Bibliotecas digitales" }, { to: "/revistas-electronicas", label: "Revistas electrónicas" }, { to: "/ebooks", label: "E-books" }, { to: "/diccionarios", label: "Diccionarios" }, { to: "/normas", label: "Normas y guías" }, { to: "/formacion-autodidacta", label: "Formación autodidacta" }]}/>
            <NavLink to="/catalogo" label="CATÁLOGO" />
            <NavLink to="/ayuda" label="AYUDA" />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};