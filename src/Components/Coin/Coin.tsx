import coinPng from  '../../assets/img/backgrounds/coin.png'
import Image from 'next/image'



const Coin= () =>{
    return(
        <div className={`cursor-pointer animate-bounce w-[100px] h-[100px]`}>
            <Image src ={coinPng} alt='coin'></Image>
        </div>
    )
}

export default Coin