import Slider from 'react-slick';
import { useEffect, useRef, useState } from 'react';
import Coin from '../Coin/Coin';
import { StateOfSlider } from '../EnterTheLottery/EnterTheLottery';

interface StateSliderProps {
  stateOfSliderType: StateOfSlider;
  handleSubmit:() => void
  isFetching:boolean;
  isLoading:boolean;
}

const StateSlider: React.FC<StateSliderProps> = ({
  handleSubmit,
  isFetching,
  isLoading,
  stateOfSliderType
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
            <div className="flex-row-reverse flex justify-end items-center mt-[-20px] pt-[15px] gap-[20px]">
            <div onClick={handleSubmit} 
                 className={`${isFetching || isLoading ? 'translate-y-[500px] opacity-0 transition-all duration-500 ' : ''}`}>
                  <Coin/>
            </div>
            <h3 className='text-[32px] font-bold'> Please, insert Coin</h3>
            </div>
        </div>
        <div className='slide02'>
            <div className='flex justify-center items-center pt-[20px] ml-[50px]'>
            <h3 className='animate-blinking text-[32px] text-center font-bold'>Wait more players!</h3> 
            </div>
        </div>
        <div className='slide03'>
        <div className='flex justify-center items-center pt-[20px] ml-[50px]'>
            <h3 className='animate-blinking text-[32px] text-center font-bold'>Wait a transaction response!</h3> 
            </div>
        </div>
        <div className='slide04'>
        <div className='flex justify-center items-center pt-[20px] ml-[50px]'>
            <h3 className='animate-blinking text-[32px] text-center font-bold'>Wait a winner!</h3> 
            </div>
        </div>
        <div className='slide05'>
        <div className='flex justify-center items-center pt-[20px] ml-[50px]'>
            <h3 className='animate-blinking text-[32px] text-center font-bold'>Winner picked!!!</h3> 
            </div>
        </div>
        <div className='slide06'>
        <div className='flex justify-center items-center pt-[20px] ml-[50px]'>
            <h3 className='animate-blinking text-[32px] text-center font-bold'>Wait start a game!</h3> 
            </div>
        </div>
      </Slider>
    </>
  );
};

export default StateSlider;
