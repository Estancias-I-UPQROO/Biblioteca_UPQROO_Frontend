import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
const BASE_URL_C = import.meta.env.VITE_API_URL_Categorias_Recursos_Electronicos;

type Categoria = {
  ID_Categoria_Recursos_Electronicos: string;
  Nombre: string;
};

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

const useIsTouchDevice = (): boolean => {
  const [isTouch, setIsTouch] = useState<boolean>(false);
  useEffect(() => {
    const onTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouch(onTouch);
  }, []);
  return isTouch;
};

export const Navbar = () => {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 1160px)");
  const isTouchDevice = useIsTouchDevice();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [categoriaLinks, setCategoriaLinks] = useState<{ to: string; label: string }[]>([]);

  // Fetch categorías desde la base de datos
  const categoriasAgregadas = useRef(false);

  useEffect(() => {
  const fetchData = async () => {
    try {
      // Obtener categorías
      const { data: categorias } = await axios.get<Categoria[]>(`${BASE_URL_C}/get-categorias`);
      
      // Mapear categorías a links
      const links = categorias.map((cat) => ({
        to: `/recursos-electronicos/${cat.ID_Categoria_Recursos_Electronicos}`,
        label: cat.Nombre,
      }));
      setCategoriaLinks(links);

      // Agregar sugerencias de búsqueda si no se han agregado
      if (!categoriasAgregadas.current) {
        const categorySuggestions = categorias.map((cat) => ({
          title: cat.Nombre,
          link: `/recursos-electronicos/${cat.ID_Categoria_Recursos_Electronicos}`,
          type: 'categoría',
        }));
        setSearchSuggestions(prev => [...prev, ...categorySuggestions]);
        categoriasAgregadas.current = true;
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
      if (axios.isAxiosError(err)) {
        console.error("Detalles del error:", err.response?.data);
      }
    }
  };

  fetchData();
}, []);

  const [searchSuggestions, setSearchSuggestions] = useState<
    { title: string; link: string; type: string }[]
  >([
    { title: 'Renovación en línea', link: '/renovacion', type: 'servicio' },
    { title: 'Sugerencias de material de compra', link: '/solicitud-compra', type: 'servicio' },
    { title: 'Guía de uso de Digitalia Hispánica', link: '/guia_de_uso_digitalia_hispanica.pdf', type: 'ayuda' },
    { title: 'Guía de Acceso a Pearson Higher Education', link: '/Guia_acceso_PHE.pdf', type: 'ayuda' },
    { title: 'Lineamientos de la biblioteca', link: '/Lineamientos_para_el_funcionamiento_de_la_biblioteca_de_la_Universidad_Politecnica_de_Quintana_roo.pdf', type: 'lineamiento' },
  ]);

  const filteredSuggestions = searchQuery.trim()
    ? searchSuggestions.filter(s =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
  }, [location.pathname]);

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

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Buscando:", searchQuery);
    }
    setShowSearch(false);
  };

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

  const DesktopDropdown = ({ menu, links }: { menu: string; links: { to: string; label: string }[] }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
      if (!isTouchDevice) {
        clearTimeout();
        setActiveMenu(menu);
      }
    };

    const handleMouseLeave = () => {
      if (!isTouchDevice) {
        timeoutRef.current = window.setTimeout(() => {
          setActiveMenu(null);
        }, 200);
      }
    };

    const handleClick = () => {
      setActiveMenu(activeMenu === menu ? null : menu);
    };

    return (
      <div
        ref={dropdownRef}
        className="relative h-full flex items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          onClick={handleClick}
          className={`px-4 ${links.some((link) => location.pathname === link.to)
            ? "text-orange-600 font-semibold border-b-2 border-orange-500"
            : "text-gray-800 hover:text-orange-500 font-medium"
            } flex items-center h-full relative z-10 cursor-pointer`}
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
              onMouseEnter={handleMouseEnter}
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

  const MobileDropdown = ({ menu, links }: { menu: string; links: { to: string; label: string }[] }) => {
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
          <img src="/public/Upqroo_Logo.png" alt="Logo" className="h-12 w-auto" />
        </Link>

        {isMobile ? (
          <button
            className="p-1 hover:bg-gray-100 transition-colors duration-150"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        ) : (
          <div className="flex items-center gap-1 flex-nowrap">
            <div className="relative" ref={searchRef} style={{ minWidth: 0 }}>
              {showSearch ? (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 200 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ minWidth: 200, maxWidth: 200 }}
                >
                  <form onSubmit={handleSearch} className="flex items-center border-b-2 border-orange-500 bg-white w-[200px] px-2 py-1">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar..."
                      className="w-full text-sm focus:outline-none"
                    />
                    <button type="submit" className="text-orange-500 hover:text-orange-700 p-1">
                      <Search size={18} />
                    </button>
                  </form>
                </motion.div>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-1 text-gray-700 hover:text-orange-500"
                  aria-label="Buscar"
                >
                  <Search size={20} />
                </button>
              )}
              <AnimatePresence>
                {showSearch && filteredSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-full mt-2 w-[200px] bg-white border rounded shadow-lg z-50 max-h-72 overflow-y-auto"
                  >
                    <ul>
                      {filteredSuggestions.map((sug, idx) => (
                        <li key={idx} className="px-3 py-2 hover:bg-gray-100 cursor-pointer list-none text-sm"
                          onClick={() => {
                            setShowSearch(false);
                            setSearchQuery("");
                            if (sug.link.endsWith(".pdf")) {
                              window.open(sug.link, "_blank");
                            } else {
                              window.location.href = sug.link;
                            }
                          }}
                        >
                          {sug.title}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center h-full text-sm font-medium ml-2">
              <NavLink to="/" label="INICIO" />
              <DesktopDropdown
                menu="acerca de nosotros"
                links={[
                  { to: "/filosofia", label: "Filosofía" },
                  { to: "/lineamientos", label: "Lineamientos" },
                ]}
              />
              <NavLink to="/servicios" label="SERVICIOS" />
              <DesktopDropdown menu="recursos electrónicos" links={categoriaLinks} />
              <NavLink to="/catalogo" label="CATÁLOGO" />
              <NavLink to="/ayuda" label="AYUDA" />
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white border-t border-gray-200 px-4 pt-2 pb-4 space-y-2 overflow-hidden"
          >
            <div className="relative">
              <form onSubmit={handleSearch} className="flex items-center border-b-2 border-orange-500 mb-3 bg-white px-2 py-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full text-sm focus:outline-none"
                />
                <button type="submit" className="text-orange-500 hover:text-orange-700 p-1">
                  <Search size={18} />
                </button>
              </form>
              <AnimatePresence>
                {searchQuery.trim() && filteredSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-2 bg-white border rounded shadow-md z-40 max-h-72 overflow-y-auto absolute w-full"
                  >
                    <ul className="text-sm text-gray-800">
                      {filteredSuggestions.map((sug, idx) => (
                        <li
                          key={idx}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setSearchQuery("");
                            if (sug.link.endsWith(".pdf")) {
                              window.open(sug.link, "_blank");
                            } else {
                              window.location.href = sug.link;
                            }
                          }}
                        >
                          {sug.title}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink to="/" label="INICIO" />
            <MobileDropdown
              menu="acerca de nosotros"
              links={[
                { to: "/filosofia", label: "Filosofía" },
                { to: "/lineamientos", label: "Lineamientos" },
              ]}
            />
            <NavLink to="/servicios" label="SERVICIOS" />
            <MobileDropdown menu="recursos electrónicos" links={categoriaLinks} />
            <NavLink to="/catalogo" label="CATÁLOGO" />
            <NavLink to="/ayuda" label="AYUDA" />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
