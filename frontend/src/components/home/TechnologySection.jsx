import React, { useState } from 'react';
import { technologies } from '../../data/mock';
import ScrollReveal from '../ui/ScrollReveal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const TechnologySection = () => {
  const [hoveredTech, setHoveredTech] = useState(null);

  const techCategories = [
  { key: 'frontend', label: 'Frontend', color: '#3B82F6' },
  { key: 'backend', label: 'Backend', color: '#10B981' },
  { key: 'mobile', label: 'Mobile App', color: '#8B5CF6' }];


  return (
    <section className="py-24 bg-[#07172a] relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5 animate-spinSlow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 animate-spinSlow" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/5 animate-spinSlow" style={{ animationDuration: '40s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block text-[#3B82F6] text-sm font-semibold tracking-widest uppercase mb-4">
              Tech Stack
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Technology We Use
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              We leverage cutting-edge technologies to build fast, scalable, and future-proof solutions.
            </p>
          </div>
        </ScrollReveal>

        {/* Technology Tabs */}
        <ScrollReveal delay={100}>
          <Tabs defaultValue="frontend" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 bg-white/5 border border-white/10 rounded-xl p-1 mb-12">
              {techCategories.map((cat) =>
              <TabsTrigger
                key={cat.key}
                value={cat.key}
                className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white transition-all duration-300 !font-medium !text-sm px-3 py-3 !rounded-[10px] text-gray-400">

                  {cat.label}
                </TabsTrigger>
              )}
            </TabsList>

            {techCategories.map((cat) =>
            <TabsContent key={cat.key} value={cat.key} className="mt-0">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {technologies[cat.key].map((tech, index) =>
                <div
                  key={index}
                  className="group relative"
                  onMouseEnter={() => setHoveredTech(tech.name)}
                  onMouseLeave={() => setHoveredTech(null)}>

                      <div className={`relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-[#3B82F6]/50 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 ${
                  hoveredTech === tech.name ? 'shadow-lg shadow-[#3B82F6]/20' : ''}`
                  }>
                        <span className="text-4xl mb-4 block transform group-hover:scale-125 transition-transform duration-500">
                          {tech.icon}
                        </span>
                        <span className="text-white font-medium text-sm">{tech.name}</span>
                        
                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-2xl bg-[#3B82F6]/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
                      </div>
                    </div>
                )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </ScrollReveal>
      </div>
    </section>);

};

export default TechnologySection;