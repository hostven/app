import React, { useState } from 'react';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { portfolioProjects } from '../../data/mock';
import ScrollReveal from '../ui/ScrollReveal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';

const PortfolioSection = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Website', 'App', 'Branding'];

  const filteredProjects = activeFilter === 'All' 
    ? portfolioProjects 
    : portfolioProjects.filter(p => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-24 bg-[#050d17] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-block text-[#3B82F6] text-sm font-semibold tracking-widest uppercase mb-4">
              Portfolio
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Our Work
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Real projects. Real results. Real impact.
            </p>
          </div>
        </ScrollReveal>

        {/* Filter Tabs */}
        <ScrollReveal delay={100}>
          <div className="flex justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                  activeFilter === category
                    ? 'bg-[#3B82F6] text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ScrollReveal key={project.id} delay={index * 100}>
              <div
                onClick={() => setSelectedProject(project)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-[#3B82F6]/50 transition-all duration-500"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07172a] via-[#07172a]/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block bg-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium px-3 py-1 rounded-full mb-3">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#3B82F6] transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <span>View Case Study</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                  <ExternalLink className="w-5 h-5 text-white" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a1f35] border-white/10 text-white p-0">
          {selectedProject && (
            <>
              {/* Hero Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f35] to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="inline-block bg-[#3B82F6] text-white text-xs font-medium px-3 py-1 rounded-full mb-2">
                    {selectedProject.category}
                  </span>
                  <h2 className="text-3xl font-bold text-white">{selectedProject.title}</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Problem */}
                <div>
                  <h3 className="text-lg font-semibold text-[#3B82F6] mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-[#3B82F6]/20 rounded-lg flex items-center justify-center text-sm">01</span>
                    The Problem
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{selectedProject.problem}</p>
                </div>

                {/* Solution */}
                <div>
                  <h3 className="text-lg font-semibold text-[#3B82F6] mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-[#3B82F6]/20 rounded-lg flex items-center justify-center text-sm">02</span>
                    Our Solution
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{selectedProject.solution}</p>
                </div>

                {/* Results */}
                <div>
                  <h3 className="text-lg font-semibold text-[#3B82F6] mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-[#3B82F6]/20 rounded-lg flex items-center justify-center text-sm">03</span>
                    The Results
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{selectedProject.results}</p>
                </div>

                {/* Technologies */}
                <div>
                  <h3 className="text-lg font-semibold text-[#3B82F6] mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-300 rounded-lg"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PortfolioSection;
