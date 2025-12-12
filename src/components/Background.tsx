import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Interactive Particle System
    const particles: { x: number; y: number; size: number; speedX: number; speedY: number; color: string; baseX: number; baseY: number }[] = [];
    const particleCount = 120;
    const connectionDistance = 150;

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: Math.random() > 0.6 ? '#00f3ff' : (Math.random() > 0.5 ? '#bc13fe' : '#ffffff')
      });
    }

    const animate = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);
      
      // Draw static background stars
      for(let i=0; i<50; i++) {
         ctx.fillStyle = `rgba(255,255,255, ${Math.random() * 0.3})`;
         ctx.beginPath();
         ctx.arc(Math.random() * width, Math.random() * height, Math.random(), 0, Math.PI*2);
         ctx.fill();
      }

      particles.forEach((p, i) => {
        // Movement
        p.x += p.speedX;
        p.y += p.speedY;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;

        // Mouse Interaction (Constellation Effect)
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < connectionDistance) {
           const opacity = 1 - (dist / connectionDistance);
           ctx.strokeStyle = `rgba(0, 243, 255, ${opacity * 0.5})`;
           ctx.lineWidth = 1;
           ctx.beginPath();
           ctx.moveTo(p.x, p.y);
           ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
           ctx.stroke();
           
           // Slight attraction
           p.x += dx * 0.02;
           p.y += dy * 0.02;
        }

        // Draw Particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Glow
        if (dist < connectionDistance) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};

export default Background;