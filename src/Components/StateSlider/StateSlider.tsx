import Slider from 'react-slick';
import { useEffect, useRef, useState } from 'react';
import Coin from '../Coin/Coin';
import { StateOfSlider } from '../EnterTheLottery/EnterTheLottery';
import Timer from '../Timer/Timer';
import InsertCoinComponent from '../InsertCoinComponent/InsertCoinComponent';

interface StateSliderProps {
  stateOfSliderType: StateOfSlider;
  handleSubmit:() => void
  isFetching:boolean;
  isLoading:boolean;
  startTimer:boolean;
  blockRaffle:boolean;
}

const StateSlider: React.FC<StateSliderProps> = ({
  handleSubmit,
  isFetching,
  isLoading,
  stateOfSliderType,
  startTimer,
  blockRaffle
}) => {
  const settings = {
    dots:false,
    infinite: true,
    speed: 200,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay:false,
    fade:false,
    slideWidth: 400,
    draggable:false,
  };
  const slider = useRef<any>(null);

  const choseTheStateOfSlider = (state:StateOfSlider) =>{
    switch(state){
        case StateOfSlider.INSERT_COIN:
            slider.current.slickGoTo(0);
            break
        case StateOfSlider.WAIT_PLAYERS:
            slider.current.slickGoTo(1);
            break
        case StateOfSlider.WAIT_TRANSACTION:
            slider.current.slickGoTo(2);
            break
        case StateOfSlider.WAIT_A_WINNER:
            slider.current.slickGoTo(3);
            break
        case StateOfSlider.PICK_A_WINNER:
            slider.current.slickGoTo(4);
            break
        case StateOfSlider.WAIT_A_START:
            slider.current.slickGoTo(5);
            break
             
    }
  }

  useEffect(() => {
    if (slider.current) {
     choseTheStateOfSlider(stateOfSliderType)
    }
  }, [stateOfSliderType]);
  return (
    <>
      <Slider ref={slider} {...settings}>
        <div className='slide01'>
         {blockRaffle ? 
         <h3 className='animate-blinking lg:text-[32px] text-[15px]  text-center font-bold'>Sorry,wait until raffle is over</h3>:
         <InsertCoinComponent isFetching={isFetching} isLoading ={isLoading} handleSubmit={handleSubmit}/>
         }
        </div>
        <div className='slide02'>
            <div className='flex justify-center items-center pt-[20px] ml-[50px] max-[420px]:ml-[6px]'>
            <h3 className='animate-blinking lg:text-[32px] text-[15px]  text-center font-bold'>Wait more players!</h3> 
            </div>
        </div>
        <div className='slide03'>
        <div className='flex justify-center items-center pt-[20px] ml-[50px] max-[420px]:ml-[6px]'>
            <h3 className='animate-blinking lg:text-[32px] text-[15px]  text-center font-bold'>Wait a transaction response!</h3> 
            </div>
        </div>
        <div className='slide04'>
        <div className='flex justify-center items-center pt-[20px] ml-[50px] max-[420px]:ml-[6px]'>
            <h3 className='animate-blinking lg:text-[32px] text-[15px]  text-center font-bold'>Wait a winner!</h3> 
            </div>
        </div>
        <div className='slide05'>
        <div className='flex justify-center items-center pt-[20px] ml-[50px] max-[420px]:ml-[6px]'>
            <h3 className='animate-blinking lg:text-[32px] text-[15px]  text-center font-bold'>Winner picked!!!</h3> 
            </div>
        </div>
        <div className='slide06'>
        <div className='flex justify-center items-center pt-[20px] ml-[50px] max-[420px]:ml-[6px]'>
            <h3 className='animate-blinking lg:text-[32px] text-[15px]  text-center font-bold'>Wait start a game:</h3> 
            <Timer startTimer={startTimer} interval='20'/>
            </div>
        </div>
      </Slider>
    </>
  );
};

export default StateSlider;
