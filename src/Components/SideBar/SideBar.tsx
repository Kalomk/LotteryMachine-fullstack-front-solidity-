import { Dispatch,SetStateAction } from "react";


interface SideBarProps{
    isOpen:boolean;
    entranceFee:string;
    recentWinner:string;
    numberOfPlayers:string;
    setIsOpen: Dispatch<SetStateAction<boolean>>
    balance:string;
}

const SideBar:React.FC<SideBarProps> = ({isOpen,numberOfPlayers,recentWinner,entranceFee,setIsOpen,balance}) => {
    const sidebarClass = isOpen ? "sidebar open" : "sidebar";
    return (
        <div className={`${sidebarClass} flex flex-row-reverse`}>
        <button className="sidebar_btn" onClick={() => setIsOpen(isOpen => !isOpen)}><span>{isOpen ? 'Close player data' : 'Show player data!'}</span></button>
        <div className="flex justify-center items-center">
             <div className="pl-[20px]">
                 <div className="text-[20px] font-medium">Entrance fee: <span className="text-[25px] font-bold">{(+entranceFee / 10**18).toLocaleString()}</span> eth</div>
                 <div className="text-[20px] font-medium">Number of player: <span className="text-[25px] font-bold">{numberOfPlayers}</span></div>
                 <div className="text-[20px] font-mdeium">Recent winner: <span className="text-[25px] font-bold">{recentWinner.slice(0,6) + '...' + recentWinner.slice(recentWinner.length - 4)}</span></div>
                 <div className="text-[20px] font-medium">Total balance: <span className="text-[25px] font-bold">{(+balance / 10**18).toLocaleString()}</span> eth</div>
             </div>
        </div>
        </div>
    );
  };
  export default SideBar;