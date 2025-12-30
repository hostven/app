import React from 'react';
import ScrollReveal from '../ui/ScrollReveal';

const ZigZagSection = ({ content }) => {
  if (!content || content.length === 0) return null;

  return (
    <section className="py-24 bg-[#050d17] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#3B82F6]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#3B82F6]/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="space-y-32">
          {content.map((item, index) => {
            const isReversed = index % 2 !== 0;
            
            return (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  isReversed ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content Side */}
                <ScrollReveal 
                  direction={isReversed ? 'right' : 'left'} 
                  delay={100}
                  className={isReversed ? 'lg:order-2' : 'lg:order-1'}
                >
                  <div className="space-y-6">
                    {/* Section Number */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#3B82F6]/20 rounded-xl flex items-center justify-center">
                        <span className="text-[#3B82F6] font-bold text-lg">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-[#3B82F6]/50 to-transparent" />
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-lg leading-relaxed">
                      {item.description}
                    </p>

                    {/* Stats */}
                    {item.stats && (
                      <div className="flex gap-8 pt-4">
                        {item.stats.map((stat, statIndex) => (
                          <div key={statIndex} className="group">
                            <div className="relative">
                              <span className="text-4xl font-bold text-[#3B82F6] group-hover:text-white transition-colors duration-300">
                                {stat.value}
                              </span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollReveal>

                {/* Image Side */}
                <ScrollReveal 
                  direction={isReversed ? 'left' : 'right'} 
                  delay={200}
                  className={isReversed ? 'lg:order-1' : 'lg:order-2'}
                >
                  <div className="relative group">
                    {/* Main Image */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07172a]/60 via-transparent to-transparent" />
                    </div>

                    {/* Decorative Elements */}
                    <div className={`absolute -z-10 w-full h-full rounded-2xl bg-[#3B82F6]/10 ${
                      isReversed ? '-left-4 -bottom-4' : '-right-4 -bottom-4'
                    }`} />
                    
                    {/* Floating Accent */}
                    <div className={`absolute w-20 h-20 bg-[#3B82F6] rounded-xl flex items-center justify-center shadow-lg shadow-[#3B82F6]/30 ${
                      isReversed ? '-left-6 -top-6' : '-right-6 -top-6'
                    } animate-float`} style={{ animationDelay: `${index * 0.5}s` }}>
                      <span className="text-white text-3xl font-bold">{index + 1}</span>
                    </div>

                    {/* Corner Dots */}
                    <div className={`absolute ${isReversed ? 'right-4 bottom-4' : 'left-4 bottom-4'}`}>
                      <div className="grid grid-cols-3 gap-2">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-[#3B82F6]/30 rounded-full" />
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ZigZagSection;
