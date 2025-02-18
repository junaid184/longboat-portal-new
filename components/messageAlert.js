import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { styled } from '@mui/system';

// Custom Stylish Button Component with dynamic color support
const CustomButtonRoot = styled('button')`
  cursor: pointer;
  padding: 5px 10px; /* Increased padding for width and height */
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 900;
  font-size: 1.2rem; /* Optional: increase font size for a bigger button */
  color: ${({ color }) => color};
  background: transparent;
  border: 2px solid ${({ color }) => color};
  border-radius: 5px;
  min-width: 100px; 
  height: 35px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ color }) => color};
    color: #fff; /* Set text color to white on hover */
    border-color: ${({ color }) => color};
    transform: translateY(-2px);
  }

  &:active {
    background-color: ${({ color }) => color + '66'}; /* Darken the color on click */
    color: ${({ color }) => color};
    border-color: ${({ color }) => color};
    transform: translateY(0px);
  }

  &:focus {
    outline: 2px ${({ color }) => color + '20'};
  }
`;

export const StylishButton = ({ children, onClick, color }) => {
  return <CustomButtonRoot onClick={onClick} color={color}>{children}</CustomButtonRoot>;
};

// Main MessageAlert Component
export default function MessageAlert({ type, onClickYes, onClickNo }) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClickNo();
  };

  const handleYes = () => {
    setOpen(false);
    onClickYes();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          width: '400px', 
          height: '200px', 
          padding: '10px', 
          borderRadius: '10px', 
        },
      }}
    >
      <DialogTitle style={{ fontWeight: 'bold', fontSize: '1.5rem' , fontFamily: 'cursive', textAlign: 'center' }}>
        {type === 'normal' ? 'Confirmation' : 'Warning'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText  style={{fontSize: '1.2rem' }}>
          Are you sure you want to perform this action?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <StylishButton onClick={handleYes} color="#2F2F2F">Yes</StylishButton>
        <StylishButton onClick={handleClose} color="#F44336">No</StylishButton>
      </DialogActions>
    </Dialog>
  );
}
