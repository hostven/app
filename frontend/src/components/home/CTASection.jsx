import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Mail, Phone } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

const CTASection = () => {
  return (
    <section className="py-24 bg-[#050d17] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/10 via-transparent to-[#3B82F6]/5" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-16 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-[100px]" />
          
          {/* Floating Shapes */}
          <div className="absolute top-10 right-10 w-20 h-20 border border-[#3B82F6]/20 rounded-2xl animate-float" />
          <div className="absolute bottom-10 left-10 w-16 h-16 border border-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />

          <div className="relative z-10 text-center">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 bg-[#3B82F6]/20 text-[#3B82F6] text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <MessageCircle className="w-4 h-4" />
                Let's Talk
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Let Us Build Something
                <br />
                <span className="text-[#3B82F6]">Great Together</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
                Ready to take your digital presence to the next level? Let's discuss 
                your project and explore how we can help you achieve your goals.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link
                  to="/contact"
                  className="group relative inline-flex items-center gap-3 bg-[#3B82F6] text-white px-8 py-4 font-semibold overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#3B82F6]/30"
                >
                  <span className="relative z-10">Start Your Project</span>
                  <ArrowRight className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                </Link>
                <a
                  href="mailto:hello@niodelta.com"
                  className="group inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 font-semibold transition-all duration-300"
                >
                  <Mail className="w-5 h-5" />
                  <span>hello@niodelta.com</span>
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm">Free Consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#3B82F6]" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#3B82F6]" />
                  <span className="text-sm">24h Response Time</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
