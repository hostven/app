import React from 'react';
import { Users, Target, Eye, Zap, Puzzle, HeartHandshake } from 'lucide-react';
import { whyChooseUs } from '../../data/mock';
import ScrollReveal from '../ui/ScrollReveal';

const iconMap = {
  Users: Users,
  Target: Target,
  Eye: Eye,
  Zap: Zap,
  Puzzle: Puzzle,
  HeartHandshake: HeartHandshake,
};

const WhyChooseUsSection = () => {
  return (
    <section className="py-24 bg-[#050d17] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3B82F6]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3B82F6]/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <ScrollReveal>
              <span className="inline-block text-[#3B82F6] text-sm font-semibold tracking-widest uppercase mb-4">
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                We're Not Just Developers,
                <br />
                <span className="text-[#3B82F6]">We're Partners</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Choosing the right digital partner is crucial for your success. Here's why 
                businesses trust NioDelta Web Studio to bring their vision to life and drive 
                real results.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-gray-300 text-sm">150+ Projects Completed</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse" />
                  <span className="text-gray-300 text-sm">98% Client Satisfaction</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whyChooseUs.map((item, index) => {
              const IconComponent = iconMap[item.icon] || Users;
              return (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="group relative bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6 hover:border-[#3B82F6]/50 transition-all duration-500 hover:-translate-y-1">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-[#3B82F6]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#3B82F6] transition-all duration-500">
                      <IconComponent className="w-6 h-6 text-[#3B82F6] group-hover:text-white transition-colors duration-500" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>

                    {/* Hover Accent */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#3B82F6]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
