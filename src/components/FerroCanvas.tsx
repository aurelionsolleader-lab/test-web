import React, { useEffect, useRef } from 'react';

const FerroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width: number;
    let height: number;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', resize);
    resize();

    const particles: { x: number; y: number; ox: number; oy: number }[] = [];
    const spacing = 35;
    const cols = Math.ceil(width / spacing) + 1;
    const rows = Math.ceil(height / spacing) + 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * spacing;
        const y = j * spacing;
        particles.push({ x, y, ox: x, oy: y });
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: true };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchMove);
    window.addEventListener('touchmove', handleTouchMove);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background glow
      if (mouseRef.current.active) {
        const gradient = ctx.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, 300
        );
        gradient.addColorStop(0, 'rgba(0, 113, 227, 0.08)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      particles.forEach((p) => {
        const dx = mouseRef.current.x - p.ox;
        const dy = mouseRef.current.y - p.oy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 350;

        let tx = p.ox;
        let ty = p.oy;
        let scale = 1;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          tx = p.ox + dx * (force * 0.4);
          ty = p.oy + dy * (force * 0.4);
          scale = 1 + force * 2.5;
        }

        // Smoothly move towards target
        p.x += (tx - p.x) * 0.15;
        p.y += (ty - p.y) * 0.15;

        // Draw Spike
        const angle = Math.atan2(mouseRef.current.y - p.y, mouseRef.current.x - p.x);
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(angle);
        
        const spikeLen = scale * 4;
        const spikeWidth = scale * 1.5;

        // Shadow/Glow
        ctx.shadowBlur = scale * 3;
        ctx.shadowColor = 'rgba(0, 113, 227, 0.3)';

        // Spike body
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-spikeLen, -spikeWidth);
        ctx.lineTo(-spikeLen, spikeWidth);
        ctx.closePath();
        ctx.fillStyle = dist < maxDist ? `rgba(255, 255, 255, ${0.1 + (maxDist - dist) / maxDist * 0.4})` : 'rgba(255, 255, 255, 0.05)';
        ctx.fill();

        // Tip
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.arc(0, 0, 1, 0, Math.PI * 2);
          ctx.fillStyle = '#0071e3';
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
      id="ferro-canvas"
    />
  );
};

export default FerroCanvas;
