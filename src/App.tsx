import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom hook for intersection observer
const useInView = (threshold = 0.1) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return [setRef, inView] as const;
};

// Animated text reveal component
const TextReveal = ({ children, delay = 0 }: { children: string; delay?: number }) => {
  const [ref, inView] = useInView();

  return (
    <span ref={ref} className="inline-block overflow-hidden">
      <motion.span
        className="inline-block"
        initial={{ y: '100%' }}
        animate={inView ? { y: 0 } : { y: '100%' }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
};

// Service card component
const ServiceCard = ({ title, description, index }: { title: string; description: string; index: number }) => {
  const [ref, inView] = useInView();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative border border-[#252525] p-6 md:p-8 cursor-pointer overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#c9a962]/10 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
      <div className="relative z-10">
        <span className="text-[#c9a962] font-outfit text-sm tracking-[0.3em] mb-4 block">
          0{index + 1}
        </span>
        <h3 className="font-cormorant text-2xl md:text-3xl text-[#f5f0e8] mb-4 leading-tight">
          {title}
        </h3>
        <p className="font-outfit text-[#6b6b6b] text-sm md:text-base leading-relaxed">
          {description}
        </p>
        <motion.div
          className="mt-6 flex items-center gap-2 text-[#c9a962]"
          animate={{ x: isHovered ? 8 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="font-outfit text-sm tracking-wider">Explore</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="stroke-current">
            <path d="M4 10h12M12 6l4 4-4 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Stat component
const Stat = ({ value, label, delay }: { value: string; label: string; delay: number }) => {
  const [ref, inView] = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="text-center md:text-left"
    >
      <div className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-[#c9a962] mb-2">{value}</div>
      <div className="font-outfit text-xs md:text-sm text-[#6b6b6b] tracking-[0.2em] uppercase">{label}</div>
    </motion.div>
  );
};

// Navigation
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
          <a href="#" className="font-cormorant text-2xl md:text-3xl text-[#f5f0e8] tracking-tight">
            Nexus<span className="text-[#c9a962]">AI</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-12">
            {['Services', 'Work', 'About', 'Contact'].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="font-outfit text-sm text-[#6b6b6b] hover:text-[#f5f0e8] tracking-wider transition-colors duration-300"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-12 h-12 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-5">
              <span className={`absolute left-0 w-full h-[1.5px] bg-[#f5f0e8] transition-all duration-300 ${isOpen ? 'top-2 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-2 w-full h-[1.5px] bg-[#f5f0e8] transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 w-full h-[1.5px] bg-[#f5f0e8] transition-all duration-300 ${isOpen ? 'top-2 -rotate-45' : 'top-4'}`} />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#0a0a0a] md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {['Services', 'Work', 'About', 'Contact'].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="font-cormorant text-4xl text-[#f5f0e8]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Hero section
const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]" />

      {/* Animated orb */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-gradient-to-br from-[#c9a962]/20 via-[#c9a962]/5 to-transparent blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(#f5f0e8 1px, transparent 1px), linear-gradient(90deg, #f5f0e8 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8"
        >
          <span className="font-outfit text-xs md:text-sm tracking-[0.4em] text-[#c9a962] uppercase">
            Intelligence Redefined
          </span>
        </motion.div>

        <h1 className="font-cormorant text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-[#f5f0e8] leading-[0.9] mb-8">
          <TextReveal delay={0.6}>Crafting</TextReveal>
          <br />
          <span className="italic text-[#c9a962]">
            <TextReveal delay={0.8}>Tomorrow's</TextReveal>
          </span>
          <br />
          <TextReveal delay={1.0}>Intelligence</TextReveal>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="font-outfit text-[#6b6b6b] text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed"
        >
          We architect bespoke AI solutions that transform visionary enterprises
          into the defining forces of their industries.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-3 bg-[#c9a962] text-[#0a0a0a] font-outfit text-sm tracking-wider px-8 py-4 hover:bg-[#f5f0e8] transition-colors duration-300"
          >
            Begin Your Journey
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="stroke-current">
              <path d="M3 8h10M9 4l4 4-4 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a
            href="#work"
            className="inline-flex items-center justify-center gap-3 border border-[#252525] text-[#f5f0e8] font-outfit text-sm tracking-wider px-8 py-4 hover:border-[#c9a962] hover:text-[#c9a962] transition-colors duration-300"
          >
            View Our Work
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-[1px] h-16 bg-gradient-to-b from-[#c9a962] to-transparent"
        />
      </motion.div>
    </section>
  );
};

// Services section
const Services = () => {
  const services = [
    {
      title: 'Strategic AI Consulting',
      description: 'Navigate the complex AI landscape with clarity. We craft comprehensive roadmaps that align cutting-edge technology with your business objectives.'
    },
    {
      title: 'Custom Model Development',
      description: 'Bespoke machine learning solutions engineered for your unique challenges. From neural architectures to deployment, we build intelligence that scales.'
    },
    {
      title: 'Intelligent Automation',
      description: 'Transform operations with cognitive workflows. Our automation systems learn, adapt, and evolve—delivering efficiency that compounds over time.'
    },
    {
      title: 'Data Architecture',
      description: 'The foundation of intelligence is data. We design robust pipelines and architectures that turn raw information into strategic advantage.'
    },
    {
      title: 'AI Integration',
      description: 'Seamlessly embed intelligence into your existing systems. Our integration expertise ensures AI enhances rather than disrupts your operations.'
    },
    {
      title: 'Ongoing Partnership',
      description: 'AI excellence demands continuous refinement. Our dedicated teams provide monitoring, optimization, and evolution of your AI investments.'
    }
  ];

  return (
    <section id="services" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="font-outfit text-xs tracking-[0.4em] text-[#c9a962] uppercase block mb-4"
          >
            What We Do
          </motion.span>
          <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-[#f5f0e8] leading-tight">
            <TextReveal>Capabilities that</TextReveal>
            <br />
            <span className="italic text-[#c9a962]"><TextReveal delay={0.2}>define excellence</TextReveal></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[#252525]">
          {services.map((service, i) => (
            <div key={service.title} className="bg-[#0a0a0a]">
              <ServiceCard {...service} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Stats section
const Stats = () => {
  return (
    <section className="py-24 md:py-32 border-y border-[#252525]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          <Stat value="150+" label="Projects Delivered" delay={0} />
          <Stat value="$2B+" label="Client Value Generated" delay={0.1} />
          <Stat value="40+" label="Enterprise Partners" delay={0.2} />
          <Stat value="99%" label="Client Retention" delay={0.3} />
        </div>
      </div>
    </section>
  );
};

// Work/Portfolio section
const Work = () => {
  const [ref, inView] = useInView();

  const projects = [
    { name: 'Meridian Finance', category: 'Predictive Analytics', year: '2024' },
    { name: 'Vantage Health', category: 'Diagnostic AI', year: '2024' },
    { name: 'Atlas Logistics', category: 'Supply Chain Intelligence', year: '2023' },
  ];

  return (
    <section id="work" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-24 gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="font-outfit text-xs tracking-[0.4em] text-[#c9a962] uppercase block mb-4"
            >
              Selected Work
            </motion.span>
            <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-[#f5f0e8] leading-tight">
              <TextReveal>Intelligence in</TextReveal>
              <br />
              <span className="italic text-[#c9a962]"><TextReveal delay={0.2}>action</TextReveal></span>
            </h2>
          </div>
          <a
            href="#"
            className="font-outfit text-sm text-[#6b6b6b] hover:text-[#c9a962] tracking-wider transition-colors duration-300 flex items-center gap-2"
          >
            View All Projects
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="stroke-current">
              <path d="M3 8h10M9 4l4 4-4 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        <div ref={ref} className="space-y-[1px] bg-[#252525]">
          {projects.map((project, i) => (
            <motion.a
              key={project.name}
              href="#"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group block bg-[#0a0a0a] p-6 md:p-8 hover:bg-[#0f0f0f] transition-colors duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <span className="font-cormorant text-3xl md:text-4xl text-[#f5f0e8] group-hover:text-[#c9a962] transition-colors duration-300">
                    {project.name}
                  </span>
                  <span className="font-outfit text-sm text-[#6b6b6b] tracking-wider">
                    {project.category}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-outfit text-sm text-[#6b6b6b]">{project.year}</span>
                  <motion.div
                    className="text-[#c9a962] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ x: 4 }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-current">
                      <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

// About section
const About = () => {
  const [ref, inView] = useInView();

  return (
    <section id="about" className="py-24 md:py-32 bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="font-outfit text-xs tracking-[0.4em] text-[#c9a962] uppercase block mb-4"
            >
              Our Philosophy
            </motion.span>
            <h2 className="font-cormorant text-4xl md:text-5xl text-[#f5f0e8] leading-tight mb-8">
              <TextReveal>Where artistry</TextReveal>
              <br />
              <TextReveal delay={0.2}>meets</TextReveal>{' '}
              <span className="italic text-[#c9a962]"><TextReveal delay={0.3}>algorithm</TextReveal></span>
            </h2>
          </div>

          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            <p className="font-outfit text-[#a0a0a0] text-base md:text-lg leading-relaxed">
              We believe artificial intelligence is more than code—it's an art form.
              Every solution we craft is a symphony of data, design, and deep expertise,
              composed to elevate your enterprise to unprecedented heights.
            </p>
            <p className="font-outfit text-[#6b6b6b] leading-relaxed">
              Our team of researchers, engineers, and strategists share an obsession
              with excellence. We don't just implement AI; we architect intelligence
              that becomes your competitive moat—elegant, powerful, and distinctly yours.
            </p>
            <div className="pt-6">
              <a
                href="#contact"
                className="inline-flex items-center gap-3 font-outfit text-sm text-[#c9a962] tracking-wider hover:text-[#f5f0e8] transition-colors duration-300"
              >
                Meet Our Team
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="stroke-current">
                  <path d="M3 8h10M9 4l4 4-4 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Contact section
const Contact = () => {
  const [ref, inView] = useInView();

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-[#c9a962]/10 to-transparent blur-3xl" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="font-outfit text-xs tracking-[0.4em] text-[#c9a962] uppercase block mb-4"
        >
          Let's Connect
        </motion.span>

        <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-[#f5f0e8] leading-tight mb-8">
          <TextReveal>Ready to redefine</TextReveal>
          <br />
          <span className="italic text-[#c9a962]"><TextReveal delay={0.2}>what's possible?</TextReveal></span>
        </h2>

        <motion.p
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-outfit text-[#6b6b6b] text-base md:text-lg max-w-xl mx-auto mb-12"
        >
          Every transformative partnership begins with a conversation.
          Share your vision, and let's explore how AI can amplify your ambitions.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-md mx-auto space-y-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full bg-transparent border border-[#252525] px-6 py-4 font-outfit text-[#f5f0e8] placeholder-[#6b6b6b] focus:border-[#c9a962] focus:outline-none transition-colors duration-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#c9a962] text-[#0a0a0a] font-outfit text-sm tracking-wider px-8 py-4 hover:bg-[#f5f0e8] transition-colors duration-300 flex items-center justify-center gap-3"
          >
            Request Consultation
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="stroke-current">
              <path d="M3 8h10M9 4l4 4-4 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-[#6b6b6b]"
        >
          <a href="mailto:hello@nexusai.com" className="font-outfit text-sm hover:text-[#c9a962] transition-colors duration-300">
            hello@nexusai.com
          </a>
          <span className="hidden md:block w-[1px] h-4 bg-[#252525]" />
          <span className="font-outfit text-sm">New York · London · Singapore</span>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="py-12 border-t border-[#252525]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="#" className="font-cormorant text-xl text-[#f5f0e8]">
            Nexus<span className="text-[#c9a962]">AI</span>
          </a>

          <div className="flex items-center gap-8">
            {['LinkedIn', 'Twitter', 'Instagram'].map((social) => (
              <a
                key={social}
                href="#"
                className="font-outfit text-xs text-[#6b6b6b] hover:text-[#c9a962] tracking-wider transition-colors duration-300"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#1a1a1a] flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-outfit text-xs text-[#4a4a4a]">
            © 2024 NexusAI. All rights reserved.
          </span>
          <span className="font-outfit text-xs text-[#3a3a3a]">
            Requested by @vladyy__01 · Built by @clonkbot
          </span>
        </div>
      </div>
    </footer>
  );
};

// Main App
function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f0e8] font-outfit antialiased">
      <Navigation />
      <Hero />
      <Services />
      <Stats />
      <Work />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
