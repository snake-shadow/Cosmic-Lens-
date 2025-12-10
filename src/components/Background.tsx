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
    canvas.width = width;
    canvas.height = height;

    // Increased star count and added type for diamonds
    const stars: { x: number; y: number; radius: number; alpha: number; velocity: number; type: 'circle' | 'diamond' }[] = [];
    const starCount = 800; // Increased to hundreds of stars

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        alpha: Math.random(),
        velocity: Math.random() * 0.05 + 0.01,
        type: Math.random() > 0.85 ? 'diamond' : 'circle' // 15% chance to be a diamond sparkle
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      // Create deep space gradient
      const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
      gradient.addColorStop(0, '#0b0d17');
      gradient.addColorStop(1, '#020205');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      stars.forEach(star => {
        ctx.beginPath();
        if (star.type === 'diamond') {
          // Draw diamond/star sparkle shape
          const r = star.radius * 2; // Slightly larger for sparkle effect
          ctx.moveTo(star.x, star.y - r);
          ctx.lineTo(star.x + r * 0.7, star.y);
          ctx.lineTo(star.x, star.y + r);
          ctx.lineTo(star.x - r * 0.7, star.y);
          ctx.closePath();
        } else {
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        }

        // Diamond shapes twinkle more intensely
        const alphaMultiplier = star.type === 'diamond' ? 1.5 : 1;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(star.alpha * alphaMultiplier, 1)})`;
        ctx.fill();

        // Twinkle logic
        star.alpha += (Math.random() - 0.5) * 0.02;
        if (star.alpha < 0) star.alpha = 0;
        if (star.alpha > 1) star.alpha = 1;

        star.y -= star.velocity;
        if (star.y < 0) star.y = height;
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};

export default Background;