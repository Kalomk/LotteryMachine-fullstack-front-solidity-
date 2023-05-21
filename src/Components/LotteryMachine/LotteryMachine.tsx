'use client'

import React, { useState, useEffect, useRef,useImperativeHandle } from 'react';
import RenderBalls from './RenderBalls';
import middleContainer from '../../assets/img/backgrounds/middle-inside.png'

export interface Ball {
  id: number;
  position: { x: number, y: number };
  rotation: number;
  randomColorNum:number;
}

interface Props {
  width: any;
  height: any;
  ballsCount: string;
}



const LotteryMachine: React.ForwardRefRenderFunction<HTMLDivElement,Props> = ({ width, height, ballsCount},ref:React.Ref<HTMLDivElement>) => {
  const [balls, setBalls] = useState<Ball[]>([]);
  const animationFrameId = useRef<any>();
  const CONTENT_WIDTH = 0.70



useImperativeHandle<HTMLDivElement,any>(ref,() =>({
  animateBalls: animateBalls,
  stopShaking
}))

  // Generate initial ball positions and rotations
  useEffect(() => {
    const newBalls: Ball[] = [];
    for (let i = 0; i < +ballsCount; i++) {
      const ball: Ball = {
        id: i,
        position: {
          x: Math.floor(Math.random() * width * CONTENT_WIDTH),
          y: Math.floor(Math.random() * height * CONTENT_WIDTH),
        },
        rotation: Math.floor(Math.random() * 360),
        randomColorNum: Math.floor(Math.random() * (6 - 1 + 1) + 1)
      };
      newBalls.push(ball);
    }

    setBalls(newBalls);
  }, [width, height, ballsCount]);


  // Stops the animation and aligns the balls to their final positions
  const stopShaking = () => {
    cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = null
    const newBalls = balls.map(ball => {
      const finalPosition: { x: number, y: number } = {
        x: Math.floor(Math.random() * width * CONTENT_WIDTH),
        y: Math.floor(Math.random() * height * CONTENT_WIDTH),
      };
      return {
        ...ball,
        position: finalPosition,
        rotation: Math.floor(Math.random() * 360),
      };
    });
    setBalls(newBalls);
    console.log('animation stopped')
  };

  // Animates the balls with a delay of 0.3 seconds
  const animateBalls = () => {
    let startTime = performance.now();
    const updateBalls = () => {
      const deltaTime = performance.now() - startTime;
      if (deltaTime >= 1000 / 15) {
        const newBalls = balls.map(ball => {
          const finalPosition: { x: number, y: number } = {
            x: Math.floor(Math.random() * width * CONTENT_WIDTH),
            y: Math.floor(Math.random() * height * CONTENT_WIDTH),
          };
          return {
            ...ball,
            position: finalPosition,
            rotation: ball.rotation + Math.random() * 10 - 5,
          };
        });
        setBalls(newBalls);
        startTime = performance.now();
      }
      animationFrameId.current = requestAnimationFrame(updateBalls);
    };
    animationFrameId.current = requestAnimationFrame(updateBalls);
  };
  // Renders the balls
  return (
      <div className='lg:mt-[-175px] max-[420px]:right-[-15px] sm:mt-[-90px] mt-[-38px] lg:ml-[0] sm:ml-[-31px] ml-[-38px] w-full bg-no-repeat bg-contain' style={{ position: 'relative', width, height, backgroundImage: "url(" + middleContainer.src + ")" }}>
        <RenderBalls balls={balls}/>
      </div>
  );
};



export default React.forwardRef(LotteryMachine)