"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Star() {
  const backMain = useRef(null);
  const [screenW, setScreenW] = useState<number>(0);
  const [screenH, setScreenH] = useState<number>(0);

  useEffect(() => {
    if (backMain && backMain.current) {
      setScreenW(backMain.current["clientWidth"]);
      setScreenH(backMain.current["clientHeight"]);
    }
  }, [backMain]);

  return (
    <div ref={backMain} className="bg-star">
      {screenW &&
        screenH &&
        [...new Array(100).keys()].map((key) => {
          const scale = Math.random() * 1.5;
          return (
            <Image
              key={key}
              src="/star.png"
              width={50}
              height={50}
              alt="star"
              style={{
                position: "absolute",
                left: parseInt((Math.random() * screenW).toString()) + "px",
                top: parseInt((Math.random() * screenH).toString()) + "px",
                zIndex: 1,
                scale: Math.random() * 1.5,
                animationName: "flash",
                animationDelay: Math.random() * 1.5 + "s",
                animationDuration: Math.random() * 2 + 1 + "s",
                animationIterationCount: "infinite",
                transform: "scale(" + scale + ", " + scale + ")",
              }}
            />
          );
        })}
    </div>
  );
}
