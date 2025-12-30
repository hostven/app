import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Github, ArrowUpRight } from 'lucide-react';
import { services, companyInfo } from '../../data/mock';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Github, href: '#', label: 'Github' },
  ];

  return (
    <footer className="bg-[#050d17] border-t border-white/5">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#3B82F6] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl">NioDelta</span>
                <span className="text-[#3B82F6] text-xs tracking-widest uppercase">Web Studio</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Crafting exceptional digital experiences that drive growth and inspire users. Your trusted partner for web design, development, and digital strategy.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-white/5 hover:bg-[#3B82F6] border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/services/${service.id}`}
                    className="text-gray-400 hover:text-[#3B82F6] transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-[#3B82F6]/50 rounded-full group-hover:bg-[#3B82F6] transition-colors" />
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Portfolio', path: '/#portfolio' },
                { name: 'Contact', path: '/contact' },
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-[#3B82F6] transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-[#3B82F6]/50 rounded-full group-hover:bg-[#3B82F6] transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="flex items-start gap-3 text-gray-400 hover:text-[#3B82F6] transition-colors duration-300 group"
                >
                  <Mail className="w-5 h-5 mt-0.5 text-[#3B82F6]" />
                  <span className="text-sm">{companyInfo.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${companyInfo.phone}`}
                  className="flex items-start gap-3 text-gray-400 hover:text-[#3B82F6] transition-colors duration-300 group"
                >
                  <Phone className="w-5 h-5 mt-0.5 text-[#3B82F6]" />
                  <span className="text-sm">{companyInfo.phone}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 mt-0.5 text-[#3B82F6]" />
                  <span className="text-sm">{companyInfo.address}</span>
                </div>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-8">
              <h5 className="text-white font-medium mb-3 text-sm">Subscribe to Newsletter</h5>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                />
                <button className="bg-[#3B82F6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-lg transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} NioDelta Web Studio. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-gray-500 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
