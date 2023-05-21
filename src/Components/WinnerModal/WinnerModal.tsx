import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';
import useRightWidthAndHeight from '@/hooks/UseRightWidthAndHeight';
import Confetti from 'react-confetti'

interface WinnerModalProps {
    recentWinner:string;
    modalIsOpen:boolean;
    setModalIsOpen:(arg0:boolean) => void;
}

const WinnerModal:React.FC<WinnerModalProps> = ({recentWinner,modalIsOpen,setModalIsOpen}) => {

  const [rightWidth,rightHeight] = useRightWidthAndHeight({'1024px':[600,300], '768px':[500,200], '640px':[300,250]})
  const [rightWidthCon,rightHeightCon] = useRightWidthAndHeight({'1024px':[1400,1000], '768px':[760,900], '640px':[400,700]})

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: rightWidth,
    height:rightHeight,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleClose = () => {
    window.location.reload();
    setModalIsOpen(false)
  };
  return (
    <div>
      <Modal
        open={modalIsOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography  id="modal-modal-title" variant="h6" component="h2">
            Winner is picked!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            Winner is {recentWinner.slice(0,6) + '...' + recentWinner.slice(recentWinner.length - 4)}
          </Typography>
          <Button sx={{ mt: 5 }}  onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
      <Confetti
     run={modalIsOpen}
     width={rightWidthCon}
     height={rightHeightCon}
     />
    </div>
  );
}

export default WinnerModal