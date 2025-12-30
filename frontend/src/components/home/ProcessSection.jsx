import React from 'react';
import { processSteps } from '../../data/mock';
import ScrollReveal from '../ui/ScrollReveal';

const ProcessSection = () => {
  return (
    <section className="py-24 bg-[#07172a] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block text-[#3B82F6] text-sm font-semibold tracking-widest uppercase mb-4">
              How We Work
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Our Process
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              A proven approach that delivers exceptional results
            </p>
          </div>
        </ScrollReveal>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#3B82F6]/0 via-[#3B82F6]/50 to-[#3B82F6]/0 hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {processSteps.map((step, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="group relative text-center">
                  {/* Step Number */}
                  <div className="relative mx-auto mb-6">
                    <div className="w-16 h-16 bg-[#07172a] border-2 border-[#3B82F6] rounded-full flex items-center justify-center relative z-10 group-hover:bg-[#3B82F6] transition-all duration-500 group-hover:scale-110">
                      <span className="text-2xl font-bold text-[#3B82F6] group-hover:text-white transition-colors duration-500">
                        {step.step}
                      </span>
                    </div>
                    {/* Pulse Effect */}
                    <div className="absolute inset-0 rounded-full bg-[#3B82F6]/30 animate-ping opacity-0 group-hover:opacity-100" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#3B82F6] transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
