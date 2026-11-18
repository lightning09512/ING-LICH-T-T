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

    // Balanced, subtle floating trollface watermark background (clean, uncluttered & gentle)
    const particleCount = Math.min(18, Math.max(10, Math.floor(window.innerWidth / 75)));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const sizeTier = i % 3;
      let size: number;
      let opacity: number;

      if (sizeTier === 0) {
        // Small watermark trollface
        size = Math.floor(Math.random() * 10) + 28; // 28px - 38px
        opacity = 0.05 + Math.random() * 0.04; // 0.05 - 0.09
      } else if (sizeTier === 1) {
        // Medium midground trollface
        size = Math.floor(Math.random() * 12) + 38; // 38px - 50px
        opacity = 0.07 + Math.random() * 0.05; // 0.07 - 0.12
      } else {
        // Soft drifting accent trollface
        size = Math.floor(Math.random() * 14) + 48; // 48px - 62px
        opacity = 0.08 + Math.random() * 0.05; // 0.08 - 0.13
      }

      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.3,
        size,
        rotation: (Math.random() - 0.5) * 0.5,
        vRot: (Math.random() - 0.5) * 0.004,
        opacity,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.012 + Math.random() * 0.018
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
        const repelRadius = Math.max(100, p.size * 1.5);
        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius;
          p.x += (dx / dist) * force * 1.6;
          p.y += (dy / dist) * force * 1.6;
          p.rotation += (dx >= 0 ? 0.018 : -0.018) * force;
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
