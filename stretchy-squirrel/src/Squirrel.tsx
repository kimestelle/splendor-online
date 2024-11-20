import * as React from 'react';
import useMeasure from 'react-use-measure';
import { useTrail, animated } from '@react-spring/web';

import styles from './styles.module.css';

const fast = { tension: 1200, friction: 40 };
const slow = { mass: 10, tension: 200, friction: 50 };
const trans = (x: number, y: number) =>
  `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`;

export default function App() {
  const [trail, api] = useTrail(5, i => ({
    xy: [0, 0],
    config: i === 0 ? fast : slow, // Fast for the acorn
  }));
  const [ref, { left, top }] = useMeasure();

  const handleMouseMove = e => {
    api.start({ xy: [e.clientX - left, e.clientY - top] });
  };

  return (
    <div className={styles.container}>
      {/* Gooey Effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="30" />
          <feColorMatrix
            in="blur"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 30 -7"
          />
        </filter>
      </svg>

      {/* Main Interactive Area */}
      <div
        ref={ref}
        className={styles.hooksMain}
        onMouseMove={handleMouseMove}
      >
        {trail.map((props, index) => {
          // Customize each blob
          if (index === 0) {
            // Acorn SVG directly on the mouse
            return (
              <animated.svg
                key={index}
                style={{
                  position: 'absolute',
                  transform: props.xy.to(trans),
                  width: '40px',
                  height: '40px',
                }}
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M50 10c20 0 30 10 30 20H20c0-10 10-20 30-20zm0 70c-15 0-30-10-30-20h60c0 10-15 20-30 20z"
                  fill="#8B4513"
                />
                <path d="M30 30h40v40H30z" fill="#D2691E" />
              </animated.svg>
            );
          } else if (index === 1) {
            // Head blob
            return (
              <animated.div
                key={index}
                className={styles.squirrelPart}
                style={{
                  transform: props.xy.to(trans),
                  width: '60px',
                  height: '60px',
                  backgroundColor: 'brown',
                  borderRadius: '50%',
                }}
              />
            );
          } else if (index === 2) {
            // Body blob
            return (
              <animated.div
                key={index}
                className={styles.squirrelPart}
                style={{
                  transform: props.xy.to(trans),
                  width: '100px',
                  height: '100px',
                  backgroundColor: 'saddlebrown',
                  borderRadius: '50%',
                }}
              />
            );
          } else if (index === 3 || index === 4) {
            // Arms (smaller blobs)
            return (
              <animated.div
                key={index}
                className={styles.squirrelPart}
                style={{
                  transform: props.xy.to(trans),
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'tan',
                  borderRadius: '50%',
                }}
              />
            );
          } else {
            // Tail blob
            return (
              <animated.div
                key={index}
                className={styles.squirrelPart}
                style={{
                  transform: props.xy.to(trans),
                  width: '70px',
                  height: '70px',
                  backgroundColor: 'goldenrod',
                  borderRadius: '50%',
                }}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
