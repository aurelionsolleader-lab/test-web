import React, { useEffect, useRef } from 'react';

const FerroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, lx: -1000, ly: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false }); // Disable alpha for perf
    if (!ctx) return;

    let animationFrameId: number;
    let width: number;
    let height: number;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      // We don't scale by devicePixelRatio here to ensure maximum performance
      // and a slightly grainy "industrial" look that fits ferrofluid
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
      // Clear with solid black for performance
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Mouse velocity for "fluid" feel
      const mvx = mouseRef.current.x - mouseRef.current.lx;
      const mvy = mouseRef.current.y - mouseRef.current.ly;
      mouseRef.current.lx = mouseRef.current.x;
      mouseRef.current.ly = mouseRef.current.y;

      const maxDistSq = 300 * 300;

      // Group particles into a single path if possible, but spikes need individual rotation
      // Let's use a very optimized loop
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
          
          // Magnet attraction
          const force = intensity * 0.6;
          tx = p.ox + dx * force;
          ty = p.oy + dy * force;
          
          // Spike gets longer when nearer to magnet (mouse)
          spikeScale = 0.4 + intensity * 2.5;

          // Mouse movement "wind" effect
          p.vx += mvx * intensity * 0.1;
          p.vy += mvy * intensity * 0.1;
        }

        // Physics: Spring + Damping
        p.vx += (tx - p.x) * 0.2;
        p.vy += (ty - p.y) * 0.2;
        p.vx *= 0.8;
        p.vy *= 0.8;
        
        p.x += p.vx;
        p.y += p.vy;

        // Draw "Gai Đen" (Black Spikes)
        const angle = Math.atan2(mouseRef.current.y - p.y, mouseRef.current.x - p.x);
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(angle);
        
        const l = spikeScale * 10;
        const w = spikeScale * 2.5;

        // Draw spike body (Deep Black)
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-l, -w);
        ctx.lineTo(-l * 0.85, 0);
        ctx.lineTo(-l, w);
        ctx.closePath();
        
        // Dynamic Fill: Metallic dark gradient feel
        if (intensity > 0) {
          const grad = ctx.createLinearGradient(0, 0, -l, 0);
          grad.addColorStop(0, `rgba(40, 50, 70, ${0.4 + intensity * 0.6})`); // Tip highlight
          grad.addColorStop(1, `rgba(10, 10, 12, ${0.8 + intensity * 0.2})`); // Base deep black
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = 'rgba(15, 15, 18, 0.5)';
        }
        ctx.fill();

        // Sharp highlight on the edge to make it look "sharp"
        if (intensity > 0.1) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-l, -w * 0.2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        // Tip "reflection"
        if (intensity > 0.4) {
          ctx.beginPath();
          ctx.arc(0, 0, 0.6, 0, Math.PI * 2);
          ctx.fillStyle = '#2997ff'; // Apple Blue highlight
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }} // Helps the black spikes look like they have depth on top of background
    />
  );
};

export default FerroCanvas;
