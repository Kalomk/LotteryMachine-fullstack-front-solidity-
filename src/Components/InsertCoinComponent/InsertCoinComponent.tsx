import Coin from "../Coin/Coin";


interface InsertCoinProps {
    handleSubmit:() => void
    isFetching:boolean;
    isLoading:boolean;
  }


const InsertCoinComponent:React.FC<InsertCoinProps> = ({handleSubmit,isFetching,isLoading}) =>{

    return(
        <div className="flex-row-reverse flex justify-end items-center mt-[-20px] pt-[15px] lg:gap-[20px] sm:gap-[47px] gap-[15px] max-[420px]:flex-col-reverse">
        <div onClick={handleSubmit} 
             className={`${isFetching || isLoading ? 'translate-y-[500px] opacity-0 transition-all duration-500 ' : ''}`}>
              <Coin/>
        </div>
        <h3 className='lg:text-[32px] text-[15px] font-bold'> Please, insert Coin</h3>
        </div>
    )
}

export default InsertCoinComponent