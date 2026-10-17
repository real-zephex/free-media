"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface MarqueeProps {
  items: string[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
}

export const InfiniteMarquee = ({
  items,
  direction = "left",
  speed = "normal",
}: MarqueeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  const addAnimation = () => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  };

  useEffect(() => {
    addAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className={`scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]`}
    >
      <ul
        ref={scrollerRef}
        className={`flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap ${
          start ? "animate-scroll" : ""
        }`}
      >
        {items.map((url, idx) => (
          <li
            className="w-[150px] md:w-[200px] h-[225px] md:h-[300px] max-w-full relative rounded-2xl border border-border/50 shrink-0 overflow-hidden shadow-xl"
            key={`${url}-${idx}`}
          >
            <Image
              src={url}
              alt="Trending Poster"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 150px, 200px"
              loading="lazy"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
