import { Ball } from './LotteryMachine';
import Egg from '../../assets/egg/Egg'
import useRightWidthAndHeight from "@/hooks/UseRightWidthAndHeight"

interface RenderBallsProps {
  balls: Ball[]
}

const COLORS = ['#b757a9', '#008000', '#0a8afa', '#fa0aa2', '#fa0a0a','#FFE11C','#F08228']

const RenderBalls:React.FC<RenderBallsProps> = ({balls}) => {
  const [rightWidth,rightHeight] = useRightWidthAndHeight({'1024px':[100,100], '768px':[50,50] , '640px':[25,25]})
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
          width: rightWidth,
          height: rightHeight,
          borderRadius: '50%',
          transform: `rotate(${ball.rotation}deg)`,
        }}>
          <Egg width={rightWidth}
               height={rightHeight}
               color={COLORS[ball.randomColorNum]}
          />
        </div>
      ))}
      </>
    )
  };

export default RenderBalls