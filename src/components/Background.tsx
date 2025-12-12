import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    // 1. STARS
    const stars: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random(),
        speed: Math.random() * 0.2 + 0.05
      });
    }

    // 2. NEBULA CLOUDS (Large moving gradients)
    const nebulas = [
      { x: width * 0.2, y: height * 0.3, r: 400, color: 'rgba(0, 243, 255, 0.08)', vx: 0.1, vy: 0.05 }, // Blue
      { x: width * 0.8, y: height * 0.7, r: 500, color: 'rgba(188, 19, 254, 0.06)', vx: -0.1, vy: -0.05 }, // Purple
      { x: width * 0.5, y: height * 0.5, r: 600, color: 'rgba(0, 255, 157, 0.04)', vx: 0.05, vy: -0.02 }, // Green
    ];

    const animate = () => {
      ctx.fillStyle = '#050508'; // Deep dark background
      ctx.fillRect(0, 0, width, height);

      // Draw Nebulas
      nebulas.forEach(neb => {
        neb.x += neb.vx;
        neb.y += neb.vy;
        
        // Bounce off edges (softly)
        if (neb.x < -200 || neb.x > width + 200) neb.vx *= -1;
        if (neb.y < -200 || neb.y > height + 200) neb.vy *= -1;

        const g = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.r);
        g.addColorStop(0, neb.color);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(neb.x, neb.y, neb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Stars
      stars.forEach(star => {
        star.y -= star.speed;
        if (star.y < 0) star.y = height;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
        
        // Twinkle
        if (Math.random() > 0.95) {
          star.alpha = Math.random() * 0.8 + 0.2;
        }
      });

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
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