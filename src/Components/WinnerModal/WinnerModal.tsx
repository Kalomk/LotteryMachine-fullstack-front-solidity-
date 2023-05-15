import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height:300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface WinnerModalProps {
    recentWinner:string;
    modalIsOpen:boolean;
    setModalIsOpen:(arg0:boolean) => void;
}

const WinnerModal:React.FC<WinnerModalProps> = ({recentWinner,modalIsOpen,setModalIsOpen}) => {
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Winner is picked!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Winner is {recentWinner}
          </Typography>
          <Button sx={{ mt: 5 }}  onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default WinnerModal