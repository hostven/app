import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor, ShoppingCart, Palette, TrendingUp, Figma, Settings, ArrowRight } from 'lucide-react';
import { services } from '../../data/mock';
import ScrollReveal from '../ui/ScrollReveal';

const iconMap = {
  Monitor: Monitor,
  ShoppingCart: ShoppingCart,
  Palette: Palette,
  TrendingUp: TrendingUp,
  Figma: Figma,
  Settings: Settings,
};

const ServicesSection = () => {
  return (
    <section className="py-24 bg-[#07172a] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3B82F6]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#3B82F6]/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block text-[#3B82F6] text-sm font-semibold tracking-widest uppercase mb-4">
              Our Services
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              What We Do
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              From concept to launch, we deliver comprehensive digital solutions 
              that help businesses thrive in the digital age.
            </p>
          </div>
        </ScrollReveal>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Monitor;
            return (
              <ScrollReveal key={service.id} delay={index * 100}>
                <Link
                  to={`/services/${service.id}`}
                  className="group block relative bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-8 hover:border-[#3B82F6]/50 transition-all duration-500 overflow-hidden h-full"
                >
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="w-14 h-14 bg-[#3B82F6]/10 rounded-xl flex items-center justify-center group-hover:bg-[#3B82F6] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <IconComponent className="w-7 h-7 text-[#3B82F6] group-hover:text-white transition-colors duration-500" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#3B82F6]/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#3B82F6] transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  {/* Link Arrow */}
                  <div className="flex items-center gap-2 text-[#3B82F6] font-medium">
                    <span className="text-sm">Learn More</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#3B82F6]/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
