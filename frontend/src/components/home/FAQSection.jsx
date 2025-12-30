import React from 'react';
import { faqs } from '../../data/mock';
import ScrollReveal from '../ui/ScrollReveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

const FAQSection = () => {
  return (
    <section className="py-24 bg-[#07172a] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#3B82F6]/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block text-[#3B82F6] text-sm font-semibold tracking-widest uppercase mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Got questions? We've got answers. If you don't find what you're looking for, 
              feel free to reach out.
            </p>
          </div>
        </ScrollReveal>

        {/* FAQ Accordion */}
        <ScrollReveal delay={100}>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white/5 border border-white/10 rounded-xl px-6 data-[state=open]:border-[#3B82F6]/50 transition-all duration-300"
              >
                <AccordionTrigger className="text-white text-left hover:text-[#3B82F6] hover:no-underline py-6 [&[data-state=open]]:text-[#3B82F6]">
                  <span className="flex items-start gap-4">
                    <span className="w-8 h-8 bg-[#3B82F6]/10 rounded-lg flex items-center justify-center flex-shrink-0 text-[#3B82F6] text-sm font-semibold">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-semibold text-lg">{faq.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 pl-12 pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FAQSection;
