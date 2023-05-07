import yellowEgg from '../../assets/img/eggs/yellowEgg.png';
import Image from 'next/image';
import { Ball } from './LotteryMachine';

interface RenderBallsProps {
  balls: Ball[]
}

const RenderBalls:React.FC<RenderBallsProps> = ({balls}) => {
    return (
      <>
      {balls.map(ball => (
        <div
        className='transition-all duration-150'
        key={ball.id}
        style={{
          position: 'absolute',
          left: ball.position.x,
          top: ball.position.y,
          width: 100,
          height: 100,
          borderRadius: '50%',
          transform: `rotate(${ball.rotation}deg)`,
        }}>
          <Image alt='egg' src={yellowEgg}></Image>
        </div>
      ))}
      </>
    )
  };

export default RenderBalls