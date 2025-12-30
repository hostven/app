import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollReveal from '../components/ui/ScrollReveal';
import ZigZagSection from '../components/services/ZigZagSection';
import { services } from '../data/mock';
import { ArrowRight, ArrowLeft, CheckCircle, Monitor, ShoppingCart, Palette, TrendingUp, Figma, Smartphone } from 'lucide-react';

const iconMap = {
  Monitor: Monitor,
  ShoppingCart: ShoppingCart,
  Palette: Palette,
  TrendingUp: TrendingUp,
  Figma: Figma,
  Smartphone: Smartphone,
};

const ServicePage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const service = services.find(s => s.id === serviceId);
  const currentIndex = services.findIndex(s => s.id === serviceId);
  const prevService = currentIndex > 0 ? services[currentIndex - 1] : null;
  const nextService = currentIndex < services.length - 1 ? services[currentIndex + 1] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  if (!service) {
    return (
      <div className="min-h-screen bg-[#07172a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Service Not Found</h1>
          <Link to="/" className="text-[#3B82F6] hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[service.icon] || Monitor;

  return (
    <div className="min-h-screen bg-[#07172a]">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url('${service.heroImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'grayscale(50%)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#07172a] via-[#07172a]/90 to-[#07172a]" />
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#3B82F6]/10 rounded-full blur-[150px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <ScrollReveal>
              <div className="flex items-center gap-2 text-sm mb-8">
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
                <span className="text-gray-600">/</span>
                <Link to="/#services" className="text-gray-400 hover:text-white transition-colors">Services</Link>
                <span className="text-gray-600">/</span>
                <span className="text-[#3B82F6]">{service.title}</span>
              </div>
            </ScrollReveal>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Content */}
              <div>
                <ScrollReveal>
                  <div className="w-16 h-16 bg-[#3B82F6] rounded-2xl flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {service.title}
                  </h1>
                  <p className="text-gray-400 text-xl leading-relaxed mb-8">
                    {service.shortDesc}
                  </p>
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-3 bg-[#3B82F6] text-white px-8 py-4 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#3B82F6]/30"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </ScrollReveal>
              </div>

              {/* Image */}
              <ScrollReveal direction="right" delay={200}>
                <div className="relative">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                    <img
                      src={service.heroImage}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Floating Badge */}
                  <div className="absolute -bottom-6 -left-6 bg-[#07172a] border border-white/10 rounded-xl p-4 shadow-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="text-white font-semibold block">150+ Projects</span>
                        <span className="text-gray-400 text-sm">Delivered Successfully</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Full Description */}
        <section className="py-24 bg-[#050d17]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <ScrollReveal>
              <div className="prose prose-lg prose-invert max-w-none">
                {service.fullDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-400 leading-relaxed mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-[#07172a]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="inline-block text-[#3B82F6] text-sm font-semibold tracking-widest uppercase mb-4">
                  What's Included
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Key Features
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.features.map((feature, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#3B82F6]/50 transition-all duration-500 hover:-translate-y-1 h-full">
                    <div className="w-10 h-10 bg-[#3B82F6]/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#3B82F6] transition-all duration-500">
                      <CheckCircle className="w-5 h-5 text-[#3B82F6] group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-white font-medium">{feature}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 bg-[#050d17]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="inline-block text-[#3B82F6] text-sm font-semibold tracking-widest uppercase mb-4">
                  How We Work
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Our Process
                </h2>
              </div>
            </ScrollReveal>

            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#3B82F6]/0 via-[#3B82F6]/50 to-[#3B82F6]/0 hidden lg:block" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                {service.process.map((step, index) => (
                  <ScrollReveal key={index} delay={index * 100}>
                    <div className="group relative text-center">
                      {/* Step Number */}
                      <div className="relative mx-auto mb-6">
                        <div className="w-16 h-16 bg-[#050d17] border-2 border-[#3B82F6] rounded-full flex items-center justify-center relative z-10 group-hover:bg-[#3B82F6] transition-all duration-500 group-hover:scale-110">
                          <span className="text-2xl font-bold text-[#3B82F6] group-hover:text-white transition-colors duration-500">
                            {step.step}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#3B82F6] transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Other Services */}
        <section className="py-24 bg-[#07172a]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="inline-block text-[#3B82F6] text-sm font-semibold tracking-widest uppercase mb-4">
                  Explore More
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Other Services
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.filter(s => s.id !== serviceId).slice(0, 3).map((otherService, index) => {
                const OtherIcon = iconMap[otherService.icon] || Monitor;
                return (
                  <ScrollReveal key={otherService.id} delay={index * 100}>
                    <Link
                      to={`/services/${otherService.id}`}
                      className="group block bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#3B82F6]/50 transition-all duration-500"
                    >
                      <div className="w-12 h-12 bg-[#3B82F6]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#3B82F6] transition-all duration-500">
                        <OtherIcon className="w-6 h-6 text-[#3B82F6] group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#3B82F6] transition-colors">
                        {otherService.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">{otherService.shortDesc}</p>
                      <span className="text-[#3B82F6] text-sm font-medium flex items-center gap-2">
                        Learn More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-12 bg-[#050d17] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {prevService ? (
                <Link
                  to={`/services/${prevService.id}`}
                  className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
                  <div>
                    <span className="text-xs text-gray-500 block">Previous Service</span>
                    <span className="font-medium">{prevService.title}</span>
                  </div>
                </Link>
              ) : <div />}

              {nextService ? (
                <Link
                  to={`/services/${nextService.id}`}
                  className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-right"
                >
                  <div>
                    <span className="text-xs text-gray-500 block">Next Service</span>
                    <span className="font-medium">{nextService.title}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : <div />}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[#07172a]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                Let's discuss how our {service.title.toLowerCase()} services can help you achieve your business goals.
              </p>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 bg-[#3B82F6] text-white px-8 py-4 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#3B82F6]/30"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServicePage;
