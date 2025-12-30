import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { services } from '../../data/mock';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services', hasDropdown: true },
    { name: 'Portfolio', path: '/#portfolio' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#07172a]/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-[#3B82F6] rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white/20 rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xl tracking-tight">NioDelta</span>
              <span className="text-[#3B82F6] text-xs tracking-widest uppercase">Web Studio</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                {link.hasDropdown ? (
                  <button
                    className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors duration-300 py-2"
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    {link.name}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    className={`relative text-gray-300 hover:text-white transition-colors duration-300 py-2 ${
                      location.pathname === link.path ? 'text-white' : ''
                    }`}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-[#3B82F6] transition-all duration-300 ${
                      location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </Link>
                )}

                {/* Services Dropdown */}
                {link.hasDropdown && (
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${
                      isServicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
                    }`}
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    <div className="bg-[#0a1f35] border border-white/10 rounded-xl shadow-2xl shadow-black/50 p-4 min-w-[280px]">
                      {services.map((service, index) => (
                        <Link
                          key={service.id}
                          to={`/services/${service.id}`}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-300 group/item"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="w-10 h-10 bg-[#3B82F6]/20 rounded-lg flex items-center justify-center group-hover/item:bg-[#3B82F6]/30 transition-colors">
                            <span className="text-[#3B82F6]">●</span>
                          </div>
                          <div>
                            <span className="text-white text-sm font-medium block">{service.title}</span>
                            <span className="text-gray-500 text-xs">{service.shortDesc}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link
              to="/contact"
              className="relative inline-flex items-center gap-2 bg-[#3B82F6] text-white px-6 py-3 font-medium overflow-hidden group"
            >
              <span className="relative z-10">Get Started</span>
              <span className="relative z-10 transform group-hover:translate-x-1 transition-transform">→</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-20 bg-[#07172a]/98 backdrop-blur-lg transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <nav className="flex flex-col p-6 gap-2">
          {navLinks.map((link, index) => (
            <div key={link.name}>
              {link.hasDropdown ? (
                <div>
                  <button
                    className="w-full flex items-center justify-between text-white text-lg py-4 border-b border-white/10"
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                  >
                    {link.name}
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ${isServicesOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                    <div className="py-2 pl-4">
                      {services.map((service) => (
                        <Link
                          key={service.id}
                          to={`/services/${service.id}`}
                          className="block text-gray-400 py-3 hover:text-[#3B82F6] transition-colors"
                        >
                          {service.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to={link.path}
                  className="block text-white text-lg py-4 border-b border-white/10 hover:text-[#3B82F6] transition-colors"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center justify-center gap-2 bg-[#3B82F6] text-white px-6 py-4 font-medium"
          >
            Get Started
            <span>→</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
