import React, { useEffect, useState } from "react";
import "./ScrollProgress.css";

interface ScrollProgressProps {
  targetWidth?: number; //진행율
  duration: number; //애니메이션 지속 시간(ms)
}

/**
 * ScrollProgress 컴포넌트 - 진행과정 렌더링
 * @param {ScrollProgressProps} props - 컴포넌트에 전달되는 props
 * @param {React.ReactNode} [props.targetWidth] - 컴포넌트 진행도
 * @returns {JSX.Element} ScrollProgress 컴포넌트
 */
const ScrollProgress: React.FC<ScrollProgressProps> = ({
  targetWidth = 0,
  duration,
}) => {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    let animationFrame: number;
    const start = performance.now();
    const animate = (time: number) => {
      const elapsedTime = time - start;
      const progress = Math.min(elapsedTime / duration, 1);
      setWidth(progress * targetWidth);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [targetWidth, duration]);

  return (
    <div className="ScrollProgress">
      <div
        className="Progress"
        style={{ width: width + "%", transition: "width 0.5s ease-in-out" }}
      ></div>
    </div>
  );
};

export default ScrollProgress;
