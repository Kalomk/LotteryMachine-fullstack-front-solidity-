import { ConnectButton } from "web3uikit"
import { useMoralis } from "react-moralis"
import { useState, useEffect } from "react"
import StateSlider from "../StateSlider/StateSlider"
import { StateOfSlider } from "../EnterTheLottery/EnterTheLottery"

interface HeaderProps {
    handleSuccess: (arg0:any) => void
    enterTheRaffle: (onSuccess:any) => Promise<unknown>
    isFetching:boolean;
    isLoading:boolean;
    sliderState:StateOfSlider;
}



const Header:React.FC<HeaderProps> = ({
    handleSuccess,
    enterTheRaffle,
    isFetching,
    isLoading,
    sliderState
}) =>{
   const {isWeb3Enabled} = useMoralis()

   const [walletAvaible,setWalletAvaible] = useState<number>(0)

   const handleSubmit = async () => {
    await enterTheRaffle({
        onSuccess: handleSuccess,
        onError: (error:any) => console.log(error),
    })
   }
//Check if web3Wallet is enabled and set the result in to localStorage
   useEffect(() =>{
     if(isWeb3Enabled){
        localStorage.setItem('slideIndex','1')
        setWalletAvaible(1)
        const validateIndex = localStorage.getItem('slideIndex')
        if(validateIndex !== null){
            setWalletAvaible(Number(validateIndex))
        }
     }
     else{
        localStorage.removeItem('slideIndex')
        setWalletAvaible(0)
     }

   },[isWeb3Enabled])
   

    return(
        <div className="lg:absolute lg:max-w-[800px] w-[400px] lg:mt-[0] mt-[70px] max-[420px]:mt-[277px]">
            <div className="lg:grid lg:grid-cols-[600px,200px] items-center justify-between lg:m-[50px,0,50px,0]">
              <div className="order-2 lg:ml-[0] ml-[50px] max-[420px]:ml-[114px]"><ConnectButton moralisAuth={false}/></div>
               <div className="order-1 lg:mt-[0] mt-[30px] max-[420px]:ml-[11px]">
                 {walletAvaible ?
                 <StateSlider stateOfSliderType={sliderState} isFetching={isFetching} isLoading={isLoading} handleSubmit={handleSubmit}/>:
                <div className="h-[150px] flex justify-center items-center">
                     <h3 className="lg:text-[32px] text-[15px] text-center font-bold">Please, connect the wallet</h3>
                </div>
                 }
                </div>
            </div>
        </div>
    )
}

export default Header