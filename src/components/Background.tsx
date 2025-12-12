import React, { useEffect, useRef } from 'react';

interface Orbiter {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  color: string;
  trail: {x: number, y: number}[];
  isHovered: boolean;
}

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // --- Star System ---
    const stars: { x: number; y: number; radius: number; alpha: number; velocity: number; type: 'circle' | 'diamond' }[] = [];
    const starCount = 600;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        alpha: Math.random(),
        velocity: Math.random() * 0.05 + 0.02,
        type: Math.random() > 0.9 ? 'diamond' : 'circle'
      });
    }

    // --- Orbiter System (Shooting Objects) ---
    let orbiters: Orbiter[] = [];
    let orbiterIdCounter = 0;

    const spawnOrbiter = () => {
      const isLeftToRight = Math.random() > 0.5;
      const startX = isLeftToRight ? -50 : width + 50;
      const startY = Math.random() * (height * 0.7); 
      const speed = Math.random() * 4 + 3;
      
      orbiters.push({
        id: orbiterIdCounter++,
        x: startX,
        y: startY,
        dx: isLeftToRight ? speed : -speed,
        dy: (Math.random() - 0.5) * 1.5, // Slight vertical drift
        size: Math.random() * 3 + 2,
        color: Math.random() > 0.5 ? '#00f3ff' : '#bc13fe',
        trail: [],
        isHovered: false
      });
    };

    // Spawn an orbiter every 3-4 seconds
    const spawner = setInterval(spawnOrbiter, 3500);
    spawnOrbiter(); 

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Background Gradient
      const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
      gradient.addColorStop(0, '#0b0d17');
      gradient.addColorStop(1, '#020205');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Stars
      stars.forEach(star => {
        ctx.beginPath();
        if (star.type === 'diamond') {
          // Diamond sparkle
          ctx.moveTo(star.x, star.y - star.radius * 2);
          ctx.lineTo(star.x + star.radius, star.y);
          ctx.lineTo(star.x, star.y + star.radius * 2);
          ctx.lineTo(star.x - star.radius, star.y);
          ctx.closePath();
        } else {
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        }

        const flicker = Math.sin(Date.now() * 0.005 + star.x) * 0.2 + 0.8;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * flicker})`;
        ctx.fill();

        // Parallax movement
        star.y -= star.velocity;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
      });

      // 3. Draw & Update Orbiters
      orbiters.forEach((orb, index) => {
        // Check distance to mouse
        const dist = Math.hypot(orb.x - mouseRef.current.x, orb.y - mouseRef.current.y);
        const captureRadius = 100; // Activation distance
        
        if (dist < captureRadius) {
          orb.isHovered = true;
          // Freeze position but add "whirring" jitter
          orb.x += (Math.random() - 0.5) * 4;
          orb.y += (Math.random() - 0.5) * 4;
          
          // Draw tractor beam line
          ctx.beginPath();
          ctx.moveTo(orb.x, orb.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.strokeStyle = `rgba(0, 243, 255, ${1 - dist/captureRadius})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Draw "CAPTURED" label
          ctx.fillStyle = '#fff';
          ctx.font = '10px Orbitron';
          ctx.fillText('ANOMALY CAPTURED', orb.x + 10, orb.y - 10);
        } else {
          orb.isHovered = false;
          // Move normally
          orb.x += orb.dx;
          orb.y += orb.dy;
        }

        // Update Trail
        orb.trail.push({ x: orb.x, y: orb.y });
        if (orb.trail.length > 25) orb.trail.shift();

        // Draw Trail
        ctx.beginPath();
        orb.trail.forEach((pos, i) => {
           ctx.lineTo(pos.x, pos.y);
        });
        ctx.strokeStyle = orb.isHovered ? '#fff' : orb.color;
        ctx.lineWidth = orb.isHovered ? 2 : orb.size / 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw Head
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        
        // Draw Glow
        const glow = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size * 6);
        glow.addColorStop(0, orb.isHovered ? '#ffffff' : orb.color);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size * 6, 0, Math.PI * 2);
        ctx.fill();

        // Remove if out of bounds (and not currently captured)
        if (!orb.isHovered && (orb.x < -100 || orb.x > width + 100)) {
          orbiters.splice(index, 1);
        }
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

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
      cancelAnimationFrame(animationId);
      clearInterval(spawner);
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