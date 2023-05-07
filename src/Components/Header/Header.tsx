import { ConnectButton } from "web3uikit"
import { useMoralis } from "react-moralis"
import { useState, useEffect } from "react"
import Coin from "../Coin/Coin"

interface HeaderProps {
    handleSuccess: (arg0:any) => void
    enterTheRaffle: (onSuccess:any) => Promise<unknown>
    transactionWait:boolean;
    insertCoin:boolean;
    setInsertCoin: (arg0:boolean) => void;
    waitWinner:boolean;
    winnerEmited:boolean
}

const Header:React.FC<HeaderProps> = ({
    handleSuccess,
    enterTheRaffle,
    transactionWait,
    insertCoin,
    setInsertCoin,
    waitWinner,
    winnerEmited
}) =>{
   const {isWeb3Enabled} = useMoralis()

   const [walletAvaible,setWalletAvaible] = useState<number>(0)

   const handleSubmit = async () => {
    setInsertCoin(true)
    await enterTheRaffle({
        onSuccess: handleSuccess,
        onError: (error:any) => console.log(error),
    })
   }

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
        <div className="absolute w-[800px]">
            <div className="grid grid-cols-[600px,200px] items-center justify-between mt-[50px]">
              <div className="order-2"><ConnectButton moralisAuth={false}/></div>
               <div className="order-1 flex justify-center items-center ml-[50px]">
                {walletAvaible ? <>
                    {transactionWait ? <div className='animate-blinking text-[32px] font-bold'>Please,wait transaction response</div> : <div className="flex-row-reverse flex justify-center items-center absolute ml-[-152px] mt-[-20px] pt-[15px] gap-[20px]">
                    <div onClick={handleSubmit} 
                            className={`${insertCoin && 'translate-y-[500px] opacity-0 transition-all duration-500 '}`}>
                    <Coin/>
                    </div>
                  {waitWinner ? <h3 className='animate-blinking text-[32px] ml-[280px] font-bold'>{winnerEmited ? 'Winner is picked': 'Wait a winner!'}</h3> : <h3 className='text-[32px] font-bold'>
                   Insert the coin!
                  </h3>}
                </div> }
                </>
                 :  <h3 className='text-[32px] font-bold'>Please,connect the wallet</h3>}
                </div>
            </div>
        </div>
    )
}

export default Header