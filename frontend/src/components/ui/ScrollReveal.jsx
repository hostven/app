import React, { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up',
  duration = 800,
  threshold = 0.1,
  once = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(40px)';
      case 'down': return 'translateY(-40px)';
      case 'left': return 'translateX(40px)';
      case 'right': return 'translateX(-40px)';
      case 'scale': return 'scale(0.9)';
      default: return 'translateY(40px)';
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0) scale(1)' : getInitialTransform(),
        transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
