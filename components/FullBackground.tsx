"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  label?: string;
  originalVx: number;
  originalVy: number;
}

export default function FullBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const SIZES = [2, 4, 6, 8];
    const LABELS = ["한신네", "소상공인", "전통시장", "KCCN", "온누리상품권", "제로페이","간편결제", "배달앱"];
    const COLORS = ["rgba(0, 71, 171, 0.45)", "rgba(59, 130, 246, 0.45)", "rgba(34, 197, 94, 0.45)"];

    const resize = () => {
      const parent = canvas.parentElement;
      const newWidth = parent?.clientWidth || window.innerWidth;
      const newHeight = parent?.clientHeight || window.innerHeight;
      
      // 캔버스 크기만 업데이트(파티클 재생성 createParticles 호출 제거)
      canvas.width = newWidth;
      canvas.height = newHeight;
    };

    const createParticles = () => {
      const tempParticles: Particle[] = [];
      let labelIdx = 0;
      // 초기 생성 개수
      for (let i = 0; i < 60; i++) {
        const size = SIZES[Math.floor(Math.random() * SIZES.length)];
        const vx = (Math.random() - 0.5) * 0.3;
        const vy = (Math.random() - 0.5) * 0.3;
        let label: string | undefined;

        if (size === 2) {
          label = LABELS[labelIdx % LABELS.length];
          labelIdx++;
        }

        tempParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx, vy, originalVx: vx, originalVy: vy,
          size, color: COLORS[Math.floor(Math.random() * COLORS.length)],
          label
        });
      }
      particles = tempParticles;
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const MAX_DIST = 180;
      const MOUSE_RADIUS = 100; // 모바일 배려를 위해 살짝 줄임

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distToMouse < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - distToMouse) / MOUSE_RADIUS;
          p.x += (dx / distToMouse) * force * 3;
          p.y += (dy / distToMouse) * force * 3;
        } else {
          p.vx += (p.originalVx - p.vx) * 0.05;
          p.vy += (p.originalVy - p.vy) * 0.05;
        }

        p.x += p.vx;
        p.y += p.vy;

        // 화면 밖으로 완전히 나가는 것 방지 (리사이즈 대응)
        if (p.x < 0) p.vx = Math.abs(p.vx);
        if (p.x > canvas.width) p.vx = -Math.abs(p.vx);
        if (p.y < 0) p.vy = Math.abs(p.vy);
        if (p.y > canvas.height) p.vy = -Math.abs(p.vy);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        if (p.label) {
          ctx.font = "12px sans-serif";
          ctx.fillStyle = "rgba(51, 65, 85, 0.8)";
          ctx.textAlign = "center";
          ctx.fillText(p.label, p.x, p.y + 15);
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < MAX_DIST) {
            const alpha = 0.18 * (1 - dist / MAX_DIST);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${Math.max(alpha, 0)})`;
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    const updateMouse = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top };
    };

    const resetMouse = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    // Passive 옵션을 false로 주어 이벤트 충돌 방지 (선택사항)
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", updateMouse);
    window.addEventListener("touchmove", updateMouse, { passive: true });
    window.addEventListener("mouseleave", resetMouse);
    window.addEventListener("touchend", resetMouse);

    resize();
    createParticles(); // 최초 1회만 생성
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", updateMouse);
      window.removeEventListener("touchmove", updateMouse);
      window.removeEventListener("mouseleave", resetMouse);
      window.removeEventListener("touchend", resetMouse);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-90 z-0"
      style={{ touchAction: 'none' }} // 브라우저 기본 터치 액션 방해 방지
    />
  );
}
