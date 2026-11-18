import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  opacity: number;
  floatOffset: number;
  floatSpeed: number;
}

export const FloatingTrollfaces: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const img = new Image();
    img.src = '/trollface.png';

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchEnd = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    window.addEventListener('touchstart', onTouchMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    // Abundant, lively trollface background with varied sizes and gentle floating buoyancy
    const particleCount = Math.min(48, Math.max(22, Math.floor(window.innerWidth / 38)));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const sizeTier = i % 4;
      let size: number;
      let opacity: number;

      if (sizeTier === 0) {
        // Small watermark trollface
        size = Math.floor(Math.random() * 12) + 28; // 28px - 40px
        opacity = 0.08 + Math.random() * 0.06; // 0.08 - 0.14
      } else if (sizeTier === 1 || sizeTier === 2) {
        // Medium midground trollface
        size = Math.floor(Math.random() * 18) + 42; // 42px - 60px
        opacity = 0.12 + Math.random() * 0.08; // 0.12 - 0.20
      } else {
        // Large bold trollface drifting along margins
        size = Math.floor(Math.random() * 24) + 64; // 64px - 88px
        opacity = 0.14 + Math.random() * 0.08; // 0.14 - 0.22
      }

      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.4,
        size,
        rotation: (Math.random() - 0.5) * 0.6,
        vRot: (Math.random() - 0.5) * 0.006,
        opacity,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.015 + Math.random() * 0.02
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Buoyant organic drift
        p.floatOffset += p.floatSpeed;
        const floatWave = Math.sin(p.floatOffset) * 0.25;

        p.x += p.vx;
        p.y += p.vy + floatWave;
        p.rotation += p.vRot;

        // Wrap around viewport edges smoothly
        if (p.x < -p.size) p.x = canvas.width + p.size;
        else if (p.x > canvas.width + p.size) p.x = -p.size;

        if (p.y < -p.size) p.y = canvas.height + p.size;
        else if (p.y > canvas.height + p.size) p.y = -p.size;

        // Interactive mouse & touch evasion
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = Math.max(120, p.size * 1.6);
        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius;
          p.x += (dx / dist) * force * 2.2;
          p.y += (dy / dist) * force * 2.2;
          p.rotation += (dx >= 0 ? 0.025 : -0.025) * force;
        }

        // Draw trollface meme
        if (img.complete && img.naturalWidth > 0) {
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    img.onload = () => {
      render();
    };
    if (img.complete) {
      render();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchstart', onTouchMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
