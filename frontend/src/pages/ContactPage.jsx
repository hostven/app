import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollReveal from '../components/ui/ScrollReveal';
import { companyInfo } from '../data/mock';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Linkedin, Twitter, Instagram } from 'lucide-react';
import { toast } from 'sonner';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (mock)
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success('Message sent successfully! We\'ll get back to you soon.');

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        budget: '',
        message: '',
      });
      setIsSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      value: companyInfo.email,
      link: `mailto:${companyInfo.email}`,
      description: 'We respond within 24 hours'
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: companyInfo.phone,
      link: `tel:${companyInfo.phone}`,
      description: 'Mon-Fri from 9am to 6pm'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: companyInfo.address,
      link: '#',
      description: 'Come say hello at our office'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      value: 'Mon - Fri: 9:00 AM - 6:00 PM',
      link: null,
      description: 'Weekend support available'
    },
  ];

  const services = [
    'Web Design & Development',
    'E-Commerce Solutions',
    'Branding & Identity',
    'SEO & Performance',
    'UI/UX Design',
    'Maintenance & Support',
    'Other'
  ];

  const budgetRanges = [
    'Less than $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000+',
    'Not sure yet'
  ];

  return (
    <div className="min-h-screen bg-[#07172a]">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#3B82F6]/10 rounded-full blur-[150px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <ScrollReveal>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="inline-block text-[#3B82F6] text-sm font-semibold tracking-widest uppercase mb-4">
                  Contact Us
                </span>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Let's Start a
                  <span className="text-[#3B82F6]"> Conversation</span>
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Have a project in mind? We'd love to hear about it. Fill out the form below 
                  or reach out directly, and we'll get back to you within 24 hours.
                </p>
              </div>
            </ScrollReveal>

            {/* Contact Info Cards */}
            <ScrollReveal delay={200}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#3B82F6]/50 transition-all duration-500"
                  >
                    <div className="w-12 h-12 bg-[#3B82F6]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#3B82F6] transition-all duration-500">
                      <info.icon className="w-6 h-6 text-[#3B82F6] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">{info.title}</h3>
                    {info.link ? (
                      <a href={info.link} className="text-[#3B82F6] hover:underline block mb-1">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-gray-300 mb-1">{info.value}</p>
                    )}
                    <p className="text-gray-500 text-sm">{info.description}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-24 bg-[#050d17]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-16">
              {/* Form */}
              <div className="lg:col-span-3">
                <ScrollReveal>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
                    
                    {isSubmitted ? (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                        <p className="text-gray-400">Thank you for reaching out. We'll get back to you shortly.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name & Email */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Full Name *</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Email Address *</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>

                        {/* Phone & Company */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Company Name</label>
                            <input
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleChange}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                              placeholder="Your Company"
                            />
                          </div>
                        </div>

                        {/* Service & Budget */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Service Needed *</label>
                            <select
                              name="service"
                              value={formData.service}
                              onChange={handleChange}
                              required
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer"
                            >
                              <option value="" className="bg-[#07172a]">Select a service</option>
                              {services.map((service, index) => (
                                <option key={index} value={service} className="bg-[#07172a]">
                                  {service}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Budget Range</label>
                            <select
                              name="budget"
                              value={formData.budget}
                              onChange={handleChange}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer"
                            >
                              <option value="" className="bg-[#07172a]">Select budget range</option>
                              {budgetRanges.map((range, index) => (
                                <option key={index} value={range} className="bg-[#07172a]">
                                  {range}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Message */}
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">Project Details *</label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={6}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#3B82F6] transition-colors resize-none"
                            placeholder="Tell us about your project, goals, and timeline..."
                          />
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full inline-flex items-center justify-center gap-3 bg-[#3B82F6] hover:bg-[#2563eb] text-white px-8 py-4 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <span>Send Message</span>
                              <Send className="w-5 h-5" />
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </ScrollReveal>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-2">
                <ScrollReveal delay={200}>
                  <div className="sticky top-32 space-y-8">
                    {/* Quick Contact */}
                    <div className="bg-gradient-to-br from-[#3B82F6]/20 to-transparent border border-[#3B82F6]/30 rounded-2xl p-8">
                      <h3 className="text-xl font-bold text-white mb-4">Prefer to talk?</h3>
                      <p className="text-gray-400 mb-6">
                        Schedule a free 30-minute consultation call with our team to discuss your project.
                      </p>
                      <a
                        href={`tel:${companyInfo.phone}`}
                        className="inline-flex items-center gap-2 text-[#3B82F6] font-medium hover:underline"
                      >
                        <Phone className="w-4 h-4" />
                        {companyInfo.phone}
                      </a>
                    </div>

                    {/* Social Links */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                      <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
                      <p className="text-gray-400 mb-6">
                        Stay updated with our latest projects and insights.
                      </p>
                      <div className="flex gap-3">
                        {[
                          { icon: Linkedin, label: 'LinkedIn' },
                          { icon: Twitter, label: 'Twitter' },
                          { icon: Instagram, label: 'Instagram' },
                        ].map((social, index) => (
                          <a
                            key={index}
                            href="#"
                            className="w-12 h-12 bg-white/5 hover:bg-[#3B82F6] border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                            aria-label={social.label}
                          >
                            <social.icon className="w-5 h-5" />
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Response Time */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <h3 className="text-xl font-bold text-white">Quick Response</h3>
                      </div>
                      <p className="text-gray-400">
                        We typically respond within 24 hours during business days. For urgent matters, 
                        please call us directly.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-24 bg-[#07172a]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <ScrollReveal>
              <div className="relative rounded-2xl overflow-hidden h-[400px] bg-white/5 border border-white/10">
                {/* Placeholder for Map */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-[#3B82F6] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Our Location</h3>
                    <p className="text-gray-400">{companyInfo.address}</p>
                  </div>
                </div>
                {/* Grid Pattern Overlay */}
                <div 
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), 
                                      linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                  }}
                />
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
