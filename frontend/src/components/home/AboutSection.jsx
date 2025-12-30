import React from 'react';
import { Link } from 'react-router-dom';
import { aboutContent } from '../../data/mock';
import ScrollReveal from '../ui/ScrollReveal';
import { ArrowRight } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="py-24 bg-[#050d17] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#3B82F6]/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image Grid */}
          <ScrollReveal direction="left">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1519217651866-847339e674d4?w=400"
                      alt="Creative workspace"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="aspect-square rounded-2xl bg-[#3B82F6] flex items-center justify-center p-6">
                    <div className="text-center">
                      <span className="text-5xl font-bold text-white block">5+</span>
                      <span className="text-white/80 text-sm">Years of Excellence</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-square rounded-2xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=400"
                      alt="Team collaboration"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1558655146-d09347e92766?w=400"
                      alt="Design work"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-[#07172a] border border-white/10 rounded-xl p-4 shadow-2xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {aboutContent.team.slice(0, 3).map((member, i) => (
                      <img
                        key={i}
                        src={member.image}
                        alt={member.name}
                        className="w-10 h-10 rounded-full border-2 border-[#07172a]"
                      />
                    ))}
                  </div>
                  <div>
                    <span className="text-white font-semibold block text-sm">Expert Team</span>
                    <span className="text-gray-400 text-xs">20+ Professionals</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right - Content */}
          <div>
            <ScrollReveal direction="right">
              <span className="inline-block text-[#3B82F6] text-sm font-semibold tracking-widest uppercase mb-4">
                About Us
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                About NioDelta
                <br />
                <span className="text-[#3B82F6]">Web Studio</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                {aboutContent.story.substring(0, 400)}...
              </p>

              {/* Mission */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                <h4 className="text-white font-semibold mb-2">Our Mission</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {aboutContent.mission}
                </p>
              </div>

              <Link
                to="/about"
                className="group inline-flex items-center gap-3 bg-[#3B82F6] text-white px-6 py-3 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#3B82F6]/30"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
