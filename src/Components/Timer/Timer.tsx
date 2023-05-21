import { useState, useEffect } from 'react';

type TimerProps = {
    interval:string
    startTimer:boolean
}

const Timer:React.FC<TimerProps> = ({interval,startTimer}) => {
    const [seconds, setSeconds ] =  useState(+interval);
    useEffect(()=>{
    if(startTimer){
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
               
            } 
        }, 1000)
        return ()=> {
            clearInterval(myInterval);
          };
    }
    });

    return (
        <div>
        { seconds === 0
            ? <h3 className='animate-blinking lg:text-[32px] text-[15px]  text-center font-bold'>∞</h3>
            : <h3 className='animate-blinking lg:text-[32px] text-[15px]  text-center font-bold'>{seconds}</h3> 
        }
        </div>
    )
}

export default Timer;