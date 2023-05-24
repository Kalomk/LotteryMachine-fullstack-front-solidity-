import LotteryMachine from "./LotteryMachine"
import lotteryMachineBg1 from '../../assets/img/backgrounds/draw_machine.png'
import React,{ useRef } from "react"
import useRightWidthAndHeight from "@/hooks/useRightWidthAndHeight"

interface StartLotteryMachineProps {
    isShakeMachine:boolean;
    numberOfPlayers:string;
}


const StartLotteryMachine:React.ForwardRefRenderFunction<HTMLDivElement,StartLotteryMachineProps>  =({isShakeMachine,numberOfPlayers},ref) => {
    const [rightWidthIC,rightHeightIC] = useRightWidthAndHeight({'1024px':[605,345], '768px':[345,202], '640px':[152,71]})

    return (
        <>
         <div className={`${isShakeMachine ? 'animate-dance ' : ''}sm:w-full bg-no-repeat bg-contain lg:w-[650px] sm:w-[409px] lg:h-[700px] sm:h-[400px] w-[150px] h-[150px] flex justify-center items-center lg:mt-[140px] mt-[-5px] md:ml-[37px] ml-[133px] lg:ml-[0] sm:ml-[22px]`}
        style={{ backgroundImage: "url(" + lotteryMachineBg1.src + ")",padding:30}}>
         <LotteryMachine ref={ref}  width={rightWidthIC} height ={rightHeightIC} ballsCount={numberOfPlayers}/>
        </div>
        </>
    )
}


export default React.forwardRef(StartLotteryMachine)