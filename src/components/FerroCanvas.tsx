import React, { useEffect, useRef } from 'react';

interface FerroCanvasProps {
  theme?: 'dark' | 'light';
}

const FerroCanvas: React.FC<FerroCanvasProps> = ({ theme = 'dark' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, lx: -1000, ly: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use alpha: true to support transparent clearing in light mode
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width: number;
    let height: number;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    const spacing = 40;
    const particles: { x: number; y: number; ox: number; oy: number; vx: number; vy: number }[] = [];
    
    const initParticles = () => {
      particles.length = 0;
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          particles.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
        }
      }
    };
    initParticles();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.lx = mouseRef.current.x;
      mouseRef.current.ly = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current.lx = mouseRef.current.x;
        mouseRef.current.ly = mouseRef.current.y;
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
        mouseRef.current.active = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchMove);
    window.addEventListener('touchmove', handleTouchMove);

    const draw = () => {
      // Clear with transparency
      ctx.clearRect(0, 0, width, height);

      const mvx = mouseRef.current.x - mouseRef.current.lx;
      const mvy = mouseRef.current.y - mouseRef.current.ly;
      mouseRef.current.lx = mouseRef.current.x;
      mouseRef.current.ly = mouseRef.current.y;

      const maxDistSq = 300 * 300;

      particles.forEach((p) => {
        const dx = mouseRef.current.x - p.ox;
        const dy = mouseRef.current.y - p.oy;
        const distSq = dx * dx + dy * dy;

        let tx = p.ox;
        let ty = p.oy;
        let spikeScale = 0.4;
        let intensity = 0;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          intensity = 1 - dist / 300;
          const force = intensity * 0.6;
          tx = p.ox + dx * force;
          ty = p.oy + dy * force;
          spikeScale = 0.4 + intensity * 2.5;

          p.vx += mvx * intensity * 0.1;
          p.vy += mvy * intensity * 0.1;
        }

        p.vx += (tx - p.x) * 0.2;
        p.vy += (ty - p.y) * 0.2;
        p.vx *= 0.8;
        p.vy *= 0.8;
        
        p.x += p.vx;
        p.y += p.vy;

        const angle = Math.atan2(mouseRef.current.y - p.y, mouseRef.current.x - p.x);
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(angle);
        
        const l = spikeScale * 10;
        const w = spikeScale * 2.5;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-l, -w);
        ctx.lineTo(-l * 0.85, 0);
        ctx.lineTo(-l, w);
        ctx.closePath();
        
        if (theme === 'dark') {
          if (intensity > 0) {
            const grad = ctx.createLinearGradient(0, 0, -l, 0);
            grad.addColorStop(0, `rgba(60, 80, 120, ${0.4 + intensity * 0.6})`);
            grad.addColorStop(1, `rgba(10, 10, 15, ${0.8 + intensity * 0.2})`);
            ctx.fillStyle = grad;
          } else {
            ctx.fillStyle = 'rgba(20, 20, 25, 0.4)';
          }
        } else {
          // Light mode: Darker, sharper spikes
          if (intensity > 0) {
            const grad = ctx.createLinearGradient(0, 0, -l, 0);
            grad.addColorStop(0, `rgba(30, 30, 40, ${0.7 + intensity * 0.3})`);
            grad.addColorStop(1, `rgba(60, 60, 80, ${0.5 + intensity * 0.2})`);
            ctx.fillStyle = grad;
          } else {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
          }
        }
        ctx.fill();

        if (intensity > 0.1) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-l, -w * 0.2);
          ctx.strokeStyle = theme === 'dark' ? `rgba(255, 255, 255, ${intensity * 0.3})` : `rgba(0, 0, 0, ${intensity * 0.2})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        if (intensity > 0.4 && theme === 'dark') {
          ctx.beginPath();
          ctx.arc(0, 0, 0.6, 0, Math.PI * 2);
          ctx.fillStyle = '#2997ff';
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: theme === 'dark' ? 'screen' : 'multiply' }}
    />
  );
};

export default FerroCanvas;
