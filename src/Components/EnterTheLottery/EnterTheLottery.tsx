import Header from '@/Components/Header/Header';
import { useState, useEffect, useRef } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import { useNotification } from 'web3uikit';
import { contractAddresses, abi } from '../../constants';
import SideBar from '../SideBar/SideBar';
import WinnerModal from '@/Components/WinnerModal/WinnerModal';
import StartLotteryMachine from '../LotteryMachine/StartLotteryMachine';
import { ethers, AddressLike } from 'ethers';

export enum StateOfSlider {
  INSERT_COIN = 'insert',
  WAIT_PLAYERS = 'wait-players',
  WAIT_TRANSACTION = 'wait-transaction',
  WAIT_A_WINNER = 'wait-a-winner',
  WAIT_A_START = 'wait-a-start',
  PICK_A_WINNER = 'winner-picked',
}

const EnterTheLottery = () => {
  const [isShakeMachine, setIsShakeMachine] = useState(false);
  const { isWeb3Enabled, chainId: chainIdHex, Moralis } = useMoralis();
  const chainId = parseInt(chainIdHex!);
  const raffleAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId as unknown as keyof typeof contractAddresses][0]
      : null;
  const [sliderState, setSliderState] = useState<StateOfSlider>(StateOfSlider.INSERT_COIN);
  const [isOpenSideBar, setIsOpenSideBar] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [blockRaffle, setBlockRaffle] = useState(false);
  const [accountChanged, setAccountChanged] = useState(true);
  const startlotteryMachineRef = useRef<any>(null);

  //contract variables
  const [entranceFee, setEntranceFee] = useState('0');
  const [numberOfPlayers, setNumberOfPlayers] = useState('0');
  const [recentWinner, setRecentWinner] = useState('0');
  const [balance, setBalance] = useState('0');

  const contractVariables = async () => {
    const provider = new ethers.BrowserProvider(window?.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(raffleAddress!, abi as any, signer);
    const balance = await provider.getBalance(raffleAddress as AddressLike);

    return { contract, balance };
  };

  const checkNumberofPlayers = async () => {
    const numPlayersFromCall = ((await getPlayersNumber()) as number)?.toString();
    setSliderState(
      +numPlayersFromCall > 1 ? StateOfSlider.WAIT_A_START : StateOfSlider.WAIT_PLAYERS
    );
    updateUIValues();
    console.log(numPlayersFromCall);
  };
  /************************************************/
  const dispatch: any = useNotification();
  //Main function *Enter the raffle* which emit start of the lottery
  const {
    runContractFunction: enterTheRaffle,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: 'enterTheRaffle',
    msgValue: entranceFee,
    params: {},
  });

  //Event Listeners
  const listenEventWinner = async () => {
    const { contract } = await contractVariables();

    contract.on('WinnerPicked', () => {
      setSliderState(StateOfSlider.PICK_A_WINNER);
      setModalIsOpen(true);
      updateUIValues();
      stopAnimateBalls();
      setIsShakeMachine(false);
      setBlockRaffle(false);
    });
  };

  const listenRaffleEnter = async () => {
    const { contract } = await contractVariables();

    contract.on('RaffleEnter', () => {
      updateUIValues();
      if (!accountChanged) {
        checkNumberofPlayers();
      }
    });
  };

  const listenEventRaffleStart = async () => {
    const { contract } = await contractVariables();
    contract.on('RequstedRaffleWinner', () => {
      updateUIValues();
      animateBalls();
      setBlockRaffle(true);
      setIsShakeMachine(true);
      setSliderState(StateOfSlider.WAIT_A_WINNER);
    });
  };

  /* View Functions */

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!, // specify the networkId
    functionName: 'getEntranceFee',
    params: {},
  });

  const { runContractFunction: getPlayersNumber } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: 'getNumberOfPlayers',
    params: {},
  });

  const { runContractFunction: getRecenWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: 'getRecenWinner',
    params: {},
  });

  const { runContractFunction: getRaffleState } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: 'getRaffleState',
    params: {},
  });
  /************************************************/

  async function updateUIValues() {
    const entranceFeeFromCall = ((await getEntranceFee()) as number)?.toString();
    const numPlayersFromCall = ((await getPlayersNumber()) as number)?.toString();
    const recentWinnerFromCall = await getRecenWinner();
    const { balance } = await contractVariables();

    setEntranceFee(entranceFeeFromCall);
    setNumberOfPlayers(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall as string);
    setBalance(balance.toString());
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();
      Moralis.onAccountChanged(() => {
        setSliderState(StateOfSlider.INSERT_COIN);
        setAccountChanged(true);
        updateUIValues();
      });

      listenEventWinner();
      listenRaffleEnter().then(() => listenEventRaffleStart());

      //Check if raffle state is calculating
      const checkBlockRaffle = async () => {
        const raffleStateFromCall = ((await getRaffleState()) as unknown as string)?.toString();
        if (raffleStateFromCall === '1') {
          animateBalls();
          updateUIValues();
          setBlockRaffle(true);
          setIsShakeMachine(true);
        } else {
          setBlockRaffle(false);
          stopAnimateBalls();
          setIsShakeMachine(false);
        }
      };
      checkBlockRaffle();
    }
  }, [isWeb3Enabled, accountChanged]);

  //Functions which activate/desactivate animation of shake machine
  const animateBalls = () => {
    startlotteryMachineRef.current.animateBalls();
  };

  const stopAnimateBalls = () => {
    startlotteryMachineRef.current.stopShaking();
  };

  const handleNewNotification = () => {
    dispatch({
      type: 'info',
      message: 'Transaction Complete!',
      title: 'Transaction Notification',
      position: 'topR',
      icon: 'bell',
    });
  };

  /************************************************/
  const handleSuccess = async (tx: any) => {
    setSliderState(StateOfSlider.WAIT_TRANSACTION);
    updateUIValues();
    setAccountChanged(false);
    try {
      await tx.wait(1);
      handleNewNotification();
    } catch (error) {
      console.log(error);
    }
  };

  //HeaderProps
  const headerProps = {
    handleSuccess,
    enterTheRaffle,
    isLoading,
    isFetching,
    sliderState,
    blockRaffle,
    setAccountChanged,
    getRaffleState,
  };
  /************************************************/

  return (
    <>
      <Header {...headerProps} />
      <main>
        {isWeb3Enabled && (
          <div>
            <SideBar
              balance={balance}
              setIsOpen={setIsOpenSideBar}
              recentWinner={recentWinner}
              numberOfPlayers={numberOfPlayers}
              entranceFee={entranceFee}
              isOpen={isOpenSideBar}
            />
          </div>
        )}
        <StartLotteryMachine
          ref={startlotteryMachineRef}
          isShakeMachine={isShakeMachine}
          numberOfPlayers={numberOfPlayers}
        />
      </main>
      <WinnerModal
        balance={balance}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        recentWinner={recentWinner}
      />
    </>
  );
};

export default EnterTheLottery;
