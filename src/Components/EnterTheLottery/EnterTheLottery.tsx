import Header from "@/Components/Header/Header"
import { useState,useEffect,useRef} from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import { contractAddresses, abi } from "../../constants"
import LotteryMachine from "../LotteryMachine/LotteryMachine"
import lotteryMachineBg from '../../assets/img/backgrounds/draw_machine.png'
import { ethers } from "ethers"
import WinnerModal from "../WinnerModal/WinnerModal"
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

export enum StateOfSlider {
    INSERT_COIN ='insert',
    WAIT_PLAYERS ='wait-players',
    WAIT_TRANSACTION='wait-transaction',
    WAIT_A_WINNER ='wait-a-winner',
    WAIT_A_START = 'wait-a-start',
    PICK_A_WINNER='winner-picked',
}


const EnterTheLottery = () => {
    const [isShakeMachine,setIsShakeMachine] = useState(false)
    const [modalIsOpen,setModalIsOpen] = useState(false)
    const lotteryMachineRef = useRef<any>(null)
    const { width, height } = useWindowSize()
    const {isWeb3Enabled, chainId: chainIdHex,Moralis } = useMoralis()
    const chainId = parseInt(chainIdHex!)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId as unknown as keyof typeof contractAddresses][0] : null
    const [sliderState,setSliderState] = useState<StateOfSlider>(StateOfSlider.INSERT_COIN)

    //contract variables
    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

//Event Listeners
const listenEventWinner = async  () => {
    const provider = new ethers.BrowserProvider(window?.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(raffleAddress!,abi as any,signer)

    contract.on('WinnerPicked', () =>{
        console.log('Winner Picked!')
        setSliderState(StateOfSlider.PICK_A_WINNER)
        setModalIsOpen(true)
        updateUIValues()
        stopAnimateBalls()
        setIsShakeMachine(false)
            })
              
    }

const listenEventRaffleStart = async  () => {
        const provider = new ethers.BrowserProvider(window?.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(raffleAddress!,abi as any,signer)
    
        contract.on('RequstedRaffleWinner', () =>{
            console.log('Requsted Raffle Winner!')
            updateUIValues()
            animateBalls()
            setIsShakeMachine(true)
            setSliderState(StateOfSlider.WAIT_A_WINNER)
                })
                  
        }

    const dispatch:any = useNotification()
//Main function *Enter the raffle* which emit start of the lottery
    const {
        runContractFunction: enterTheRaffle,
        data: enterTxResponse,
        isFetching,
        isLoading
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!,
        functionName: "enterTheRaffle",
        msgValue: entranceFee,
        params: {},
    })

/* View Functions */

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!, // specify the networkId
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getPlayersNumber } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecenWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!,
        functionName: "getRecenWinner",
        params: {},
    })
/************************************************/

    async function updateUIValues() {
        const entranceFeeFromCall = (await getEntranceFee() as number)?.toString()
        const numPlayersFromCall = (await getPlayersNumber() as number)?.toString()
        const recentWinnerFromCall = await getRecenWinner()
        setEntranceFee(entranceFeeFromCall)
        setNumberOfPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall as string)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
            listenEventRaffleStart()
            listenEventWinner()
            Moralis.onAccountChanged(() => {
                setSliderState(StateOfSlider.INSERT_COIN)
            })
        }
    }, [isWeb3Enabled])

    const handleNewNotification= ()=> {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

//Functions which activate/desactivate animation of shake machine
    const animateBalls =() =>{
        lotteryMachineRef.current.animateBalls()
    }

    const stopAnimateBalls =() =>{
        lotteryMachineRef.current.stopShaking()
    }
/************************************************/
    const handleSuccess = async (tx:any) => {
        setSliderState(StateOfSlider.WAIT_TRANSACTION)
        try {
            await tx.wait(1)
            updateUIValues()
            setSliderState(+numberOfPlayers > 0 ?
                StateOfSlider.WAIT_A_START:
                StateOfSlider.WAIT_PLAYERS
                )
            console.log(+numberOfPlayers)
            handleNewNotification()
        } catch (error) {
            console.log(error)
        }
    }

//HeaderProps
    const headerProps = {
        handleSuccess,
        enterTheRaffle,
        isLoading,
        isFetching,
        sliderState
    }
/************************************************/

  return(
    <>
      <Header {...headerProps}/>
      <main>
        {isWeb3Enabled &&
        <div className="absolute left-[32px]">
        <div className="text-[20px] font-medium">Entrance fee:<span className="text-[25px] font-bold">{entranceFee}</span> wei</div>
        <div className="text-[20px] font-medium">Number of player: <span className="text-[25px] font-bold">{numberOfPlayers}</span></div>
        <div className="text-[20px] font-mdeium">recent winner: <span className="text-[25px] font-bold">{recentWinner.slice(0,6) + '...' + recentWinner.slice(recentWinner.length - 4)}</span></div>
        </div>
        }
        <div className={`${isShakeMachine ? 'animate-dance ' : ''}w-full bg-no-repeat bg-cover w-[670px] h-[700px] flex justify-center items-center mt-[140px]`}
        style={{ backgroundImage: "url(" + lotteryMachineBg.src + ")",padding:30}}>
         <LotteryMachine ref={lotteryMachineRef}  width={605} height ={330} ballsCount={numberOfPlayers}/>
        </div>
      </main>
      <WinnerModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} recentWinner={recentWinner}/>
      <Confetti
      width={width}
      height={height}
      run={modalIsOpen}
    />
    </>
  )

}

export default EnterTheLottery