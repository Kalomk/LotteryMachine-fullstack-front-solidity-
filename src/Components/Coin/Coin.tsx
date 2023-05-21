import coinPng from  '../../assets/img/backgrounds/coin.png'
import Image from 'next/image'



const Coin= () =>{
    return(
        <div className={`cursor-pointer animate-bounce lg:w-[100px] lg:h-[100px] sm:w-[75px] sm:h-[75px] w-[35px] h-[35px]`}>
            <Image src ={coinPng} alt='coin'></Image>
        </div>
    )
}

export default Coin