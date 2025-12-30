import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollReveal from '../components/ui/ScrollReveal';
import { aboutContent, stats } from '../data/mock';
import { ArrowRight, Target, Eye, Heart, Users, Award, Lightbulb, Handshake, Rocket, CheckCircle } from 'lucide-react';

const AboutPage = () => {
  const [activeValue, setActiveValue] = useState(0);

  const valueIcons = [Award, Heart, Lightbulb, Handshake, Rocket];

  return (
    <div className="min-h-screen bg-[#07172a]">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#3B82F6]/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#3B82F6]/5 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Content */}
              <div>
                <ScrollReveal>
                  <span className="inline-block text-[#3B82F6] text-sm font-semibold tracking-widest uppercase mb-4">
                    About Us
                  </span>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    We're NioDelta
                    <br />
                    <span className="text-[#3B82F6]">Web Studio</span>
                  </h1>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                    A passionate team of designers, developers, and strategists dedicated to creating 
                    exceptional digital experiences that drive real business results.
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <span className="text-3xl font-bold text-[#3B82F6]">{stat.value}</span>
                        <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              </div>

              {/* Image Grid */}
              <ScrollReveal direction="right" delay={200}>
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
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-24 bg-[#050d17]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto">
                <span className="inline-block text-[#3B82F6] text-sm font-semibold tracking-widest uppercase mb-4">
                  Our Story
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                  The Journey Behind NioDelta
                </h2>
                <div className="prose prose-lg prose-invert max-w-none">
                  <p className="text-gray-400 leading-relaxed mb-6">
                    {aboutContent.story}
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Our journey has been marked by continuous growth, learning, and adaptation. From our humble beginnings 
                    with a handful of clients to now serving businesses across the globe, every step has been driven by our 
                    unwavering commitment to excellence and our genuine passion for what we do.
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    We've weathered industry changes, embraced new technologies, and constantly evolved our processes to 
                    deliver better results for our clients. Through economic challenges and technological revolutions, 
                    NioDelta has remained steadfast in our mission to create digital experiences that truly make a difference.
                  </p>
                  <p className="text-gray-400 leading-relaxed">
                    Today, we stand as a testament to what's possible when passion meets expertise. Our portfolio spans 
                    industries from healthcare to e-commerce, fintech to education, and our team has grown to include some 
                    of the most talented individuals in the industry. But despite our growth, we've never lost sight of what 
                    matters most: the success of our clients and the quality of our work.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 bg-[#07172a]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <ScrollReveal>
                <div className="bg-gradient-to-br from-[#3B82F6]/20 to-transparent border border-[#3B82F6]/30 rounded-2xl p-8 h-full">
                  <div className="w-14 h-14 bg-[#3B82F6] rounded-xl flex items-center justify-center mb-6">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    {aboutContent.mission}
                  </p>
                  <p className="text-gray-400 leading-relaxed mt-4">
                    We believe that every business, regardless of size, deserves access to world-class digital solutions. 
                    Our mission drives us to democratize excellence in web design and development, making it accessible 
                    and affordable without compromising on quality.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-2xl p-8 h-full">
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                    <Eye className="w-7 h-7 text-[#3B82F6]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    {aboutContent.vision}
                  </p>
                  <p className="text-gray-400 leading-relaxed mt-4">
                    We envision a future where digital excellence is the norm, not the exception. A world where every 
                    interaction between businesses and their customers is seamless, intuitive, and delightful. We're 
                    working to make that vision a reality, one project at a time.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-24 bg-[#050d17]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="inline-block text-[#3B82F6] text-sm font-semibold tracking-widest uppercase mb-4">
                  Our Values
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  What We Stand For
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                  Our values aren't just words on a wall—they're the principles that guide every decision we make 
                  and every project we undertake.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid lg:grid-cols-5 gap-4">
              {aboutContent.values.map((value, index) => {
                const IconComponent = valueIcons[index];
                return (
                  <ScrollReveal key={index} delay={index * 100}>
                    <div
                      className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-500 ${
                        activeValue === index
                          ? 'bg-[#3B82F6] scale-105'
                          : 'bg-white/5 border border-white/10 hover:border-[#3B82F6]/50'
                      }`}
                      onClick={() => setActiveValue(index)}
                    >
                      <IconComponent className={`w-8 h-8 mb-4 ${
                        activeValue === index ? 'text-white' : 'text-[#3B82F6]'
                      }`} />
                      <h3 className={`text-lg font-bold mb-2 ${
                        activeValue === index ? 'text-white' : 'text-white'
                      }`}>
                        {value.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${
                        activeValue === index ? 'text-white/80' : 'text-gray-400'
                      }`}>
                        {value.desc}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-[#07172a]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="inline-block text-[#3B82F6] text-sm font-semibold tracking-widest uppercase mb-4">
                  Our Team
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Meet the Experts
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                  Behind every great project is a team of talented individuals who bring passion, 
                  expertise, and creativity to everything they do.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {aboutContent.team.map((member, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="group relative">
                    <div className="relative overflow-hidden rounded-2xl mb-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full aspect-square object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07172a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-[#3B82F6]">{member.role}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Why Work With Us */}
        <section className="py-24 bg-[#050d17]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <ScrollReveal>
                <span className="inline-block text-[#3B82F6] text-sm font-semibold tracking-widest uppercase mb-4">
                  Why Work With Us
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  What Makes Us Different
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  In a sea of digital agencies, we stand out not just for what we do, but for how we do it. 
                  Our approach combines strategic thinking, creative excellence, and technical expertise to 
                  deliver results that exceed expectations.
                </p>

                <div className="space-y-4">
                  {[
                    'Dedicated project managers for seamless communication',
                    'Transparent pricing with no hidden costs',
                    'Agile development methodology for flexibility',
                    'Post-launch support and maintenance included',
                    'Regular progress updates and client involvement',
                    'Results-driven approach with measurable outcomes'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={200}>
                <div className="relative">
                  <div className="aspect-video rounded-2xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800"
                      alt="Team working"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Floating Card */}
                  <div className="absolute -bottom-8 -left-8 bg-[#07172a] border border-white/10 rounded-xl p-6 shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-white block">98%</span>
                        <span className="text-gray-400 text-sm">Client Retention</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[#07172a]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Work Together?
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                Let's discuss your project and explore how NioDelta can help you achieve your digital goals.
              </p>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 bg-[#3B82F6] text-white px-8 py-4 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#3B82F6]/30"
              >
                <span>Get In Touch</span>
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

export default AboutPage;
