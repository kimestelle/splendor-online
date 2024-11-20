import React, { useState } from "react";
import useMeasure from "react-use-measure";
import { useTrail, animated } from "@react-spring/web";
import "./App.css";

const fast = { tension: 1500, friction: 30 }; // Faster parts (e.g., acorn)
const head = { tension: 180, friction: 380, mass: 1 }; // Slower head movement
const body = { tension: 400, friction: 80, mass: 2 };
const tail = { tension: 400, friction: 200, mass: 3 }; // Tail-specific

const trans = (x: number, y: number) =>
  `translate3d(${x}svh,${y}svh,0) translate3d(-50%,-50%,0)`;

export default function App() {
  const [trail, api] = useTrail(10, (i) => ({
    xy: [50, 50], // Initial position for all blobs
    config:
      i === 0
        ? fast // Acorn
        : i === 1
        ? head // Head
        : i === 9
        ? tail // Tail
        : body, // Body and intermediary blobs
  }));

  const [ref, { left, top }] = useMeasure();
  const [acornPosition, setAcornPosition] = useState({ x: 50, y: 50 });
  const [dragging, setDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      const newX = ((e.clientX - left) / window.innerHeight) * 100;
      const newY = ((e.clientY - top) / window.innerHeight) * 100;
      setAcornPosition({ x: newX, y: newY });
      api.start({ xy: [newX, newY] });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };
  

  return (
    <div
      className="container"
      style={{ width: "100vw", height: "100vh", position: "relative" }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Gooey Effect */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
          <feColorMatrix
            in="blur"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
          />
        </filter>
      </svg>

      {/* Acorn (Draggable Element) */}
      <div
        style={{
          position: "absolute",
          left: `${acornPosition.x}svh`,
          top: `${acornPosition.y}svh`,
          width: "4svh",
          height: "4svh",
          cursor: dragging ? "grabbing" : "grab",
          transform: "translate(-50%, -50%)",
          zIndex: 20, // Ensure acorn is on top
        }}
        onMouseDown={handleMouseDown}
      >
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: "none", // Prevent interference with dragging
          }}
        >
          <path
            d="M50 10c20 0 30 10 30 20H20c0-10 10-20 30-20zm0 70c-15 0-30-10-30-20h60c0 10-15 20-30 20z"
            fill="#8B4513"
          />
          <path d="M30 30h40v40H30z" fill="#D2691E" />
        </svg>
      </div>

      {/* Main Body */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          filter: "url(#goo)",
          pointerEvents: "none", // Prevent interaction with blobs
        }}
      >
        {trail.map((props, index) => {
          let zIndex;
          if (index === 1) zIndex = 5; // Head on top
          else if (index === 2 || index === 3) zIndex = 4; // Arms
          else if (index === 9) zIndex = 3; // Tail
          else zIndex = 2; // Body

          // Head
          if (index === 1) {
            return (
              <animated.div
                key={index}
                style={{
                  transform: props.xy.to(trans),
                  width: "15svh",
                  height: "15svh",
                  backgroundColor: "brown",
                  borderRadius: "50%",
                  position: "absolute",
                  zIndex,
                }}
              >
                {/* Overlaying Face to Avoid Blur */}
                <div
                  style={{
                    position: "absolute",
                    top: "20%",
                    left: "25%",
                    width: "1svh",
                    height: "1svh",
                    backgroundColor: "black",
                    borderRadius: "50%",
                    zIndex: 10,
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    top: "20%",
                    right: "25%",
                    width: "1svh",
                    height: "1svh",
                    backgroundColor: "black",
                    borderRadius: "50%",
                    zIndex: 10,
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "20%",
                    left: "50%",
                    width: "2svh",
                    height: "1svh",
                    backgroundColor: "black",
                    borderRadius: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                  }}
                ></div>
              </animated.div>
            );
          }


          // Arms
          if (index === 2 || index === 3) {
            const armOffset = index === 2 ? -7 : 7; // Left or right
            return (
              <animated.div
                key={index}
                style={{
                  transform: props.xy.to(
                    (x, y) => `translate3d(${x + armOffset}svh,${y - 2}svh,0)`
                  ),
                  width: "8svh",
                  height: "8svh",
                  backgroundColor: "tan",
                  borderRadius: "50%",
                  position: "absolute",
                  zIndex,
                }}
              />
            );
          }

          // Main Body and Intermediaries
// Intermediary Blobs
if (index === 5) {
  const color = "tan"; // Intermediary blob color
  return (
    <animated.div
      key={index}
      style={{
        transform: props.xy.to(trans),
        width: "12svh", // Slightly smaller than chest/butt
        height: "12svh",
        backgroundColor: color,
        borderRadius: "50%",
        position: "absolute",
        zIndex, // Below chest and butt
      }}
    />
  );
}

// Chest Blob
if (index === 4) {
  const color = "saddlebrown"; // Chest color
  return (
    <animated.div
      key={index}
      style={{
        transform: props.xy.to(trans),
        width: "18svh",
        height: "18svh",
        backgroundColor: color,
        borderRadius: "50%",
        position: "absolute",
        zIndex, // Above intermediary
      }}
    />
  );
}

// Butt Blob
if (index === 6) {
  const color = "saddlebrown"; // Butt color
  return (
    <animated.div
      key={index}
      style={{
        transform: props.xy.to(trans),
        width: "21svh",
        height: "21svh",
        backgroundColor: color,
        borderRadius: "50%",
        position: "absolute",
        zIndex, // Above intermediary
      }}
    />
  );
}


          // Tail
          if (index === 9) {
            return (
              <animated.div
                key={index}
                style={{
                  transform: props.xy.to(trans),
                  width: "14svh",
                  height: "14svh",
                  backgroundColor: "goldenrod",
                  borderRadius: "50%",
                  position: "absolute",
                  zIndex,
                }}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
