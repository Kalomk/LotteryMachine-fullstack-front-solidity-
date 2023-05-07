import Header from "@/Components/Header/Header"
import { useState,useEffect,useRef} from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import { contractAddresses, abi } from "../../constants"
import LotteryMachine from "../LotteryMachine/LotteryMachine"
import lotteryMachineBg from '../../assets/img/backgrounds/draw_machine.png'
import { ethers } from "ethers"

const EnterTheLottery = () => {
    const [isShakeMachine,setIsShakeMachine] = useState(false)
    const [transactionWait,setTransactionWait] = useState(false)
    const [winnerEmited,setWinnerEmited] = useState(false)
    const lotteryMachineRef = useRef<any>(null)
    const [insertCoin,setInsertCoin] = useState(false)
    const [waitWinner,setWaitWinner] = useState(false)
    const {isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex!)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId as unknown as keyof typeof contractAddresses][0] : null

    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")


    const listenEventWinner = async  () => {
            const provider = new ethers.BrowserProvider(window?.ethereum)
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(raffleAddress!,abi as any,signer)

            contract.on('WinnerPicked', () =>{
                console.log('done!')
                updateUIValues()
                lotteryMachineRef.current.stopShaking()
                setIsShakeMachine(false)
                setWinnerEmited(true)
            })
              
    }

    const dispatch:any = useNotification()

    const {
        runContractFunction: enterTheRaffle,
        data: enterTxResponse,
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
            listenEventWinner()
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
    const animateBalls =() =>{
        lotteryMachineRef.current.animateBalls()
    }

    const handleSuccess = async (tx:any) => {
        setTransactionWait(true)
        try {
            await tx.wait(1)
            updateUIValues()
            handleNewNotification()
            setIsShakeMachine(true)
            setWaitWinner(true)
            animateBalls()
            setTransactionWait(false)
        } catch (error) {
            console.log(error)
        }
    }

    const headerProps = {
        handleSuccess,
        enterTheRaffle,
        transactionWait,
        setInsertCoin,
        insertCoin,
        setWaitWinner,
        waitWinner,
        winnerEmited
        
    }
  return(
    <>
      <Header {...headerProps}/>
      <main>
        <div className="absolute left-[32px]">
            <div>Entrance fee: {entranceFee} gwei</div>
            <div>Number of player: {numberOfPlayers}</div>
            <div>recent winner: {recentWinner.slice(0,6) + '...' + recentWinner.slice(recentWinner.length - 4)}</div>
        </div>
        <div className={`${isShakeMachine ? 'animate-dance ' : ''}w-full bg-no-repeat bg-cover w-[670px] h-[700px] flex justify-center items-center mt-[150px]`}
        style={{ backgroundImage: "url(" + lotteryMachineBg.src + ")",padding:30}}>
         <LotteryMachine ref={lotteryMachineRef}  width={605} height ={330} ballsCount={numberOfPlayers}/>
        </div>
      </main>
    </>
  )

}

export default EnterTheLottery