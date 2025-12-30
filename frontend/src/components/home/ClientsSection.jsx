import React, { useEffect, useRef } from 'react';
import { clients } from '../../data/mock';
import ScrollReveal from '../ui/ScrollReveal';

const ClientsSection = () => {
  const scrollRef = useRef(null);

  // Duplicate clients for seamless loop
  const duplicatedClients = [...clients, ...clients];

  return (
    <section className="py-20 bg-[#07172a] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050d17] via-[#07172a] to-[#050d17]" />

      <div className="relative z-10">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-block text-[#3B82F6] text-sm font-semibold tracking-widest uppercase mb-4">
              Trusted By
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Our Clients
            </h2>
          </div>
        </ScrollReveal>

        {/* Infinite Scroll Container */}
        <div className="relative">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#07172a] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#07172a] to-transparent z-10" />

          {/* Scrolling Content */}
          <div className="flex overflow-hidden">
            <div 
              ref={scrollRef}
              className="flex items-center gap-12 animate-marquee"
            >
              {duplicatedClients.map((client, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 group"
                >
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-8 py-4 hover:border-[#3B82F6]/50 transition-all duration-300 hover:bg-white/10">
                    <div className="w-10 h-10 bg-[#3B82F6]/20 rounded-lg flex items-center justify-center">
                      <span className="text-[#3B82F6] font-bold text-lg">
                        {client.charAt(0)}
                      </span>
                    </div>
                    <span className="text-white font-medium whitespace-nowrap">
                      {client}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
