"use client";

import * as React from 'react';
import { TextField, Stack, Modal, Box, Button, Typography } from '@mui/material';
import { SelfService } from '../services/self-service';
import { useForm } from "react-hook-form";
import { FormInput } from '.';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

const AddSenderModal = ({open, onClose, onSuccess, onFailure}) => {

    const { handleSubmit, control } = useForm();

    const onSubmit = async (data: {name, email}) => {
        const { name, email } = data;
        const created = await SelfService.addSender(name, email);
        console.log("Modal", created);
        if (created){
            onSuccess(name, email);
        }else{
            onFailure();
        }
        onClose();
    }


  return (
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
            <Typography variant="h4" gutterBottom>Add verified sender</Typography>
                <Stack>
                    <FormInput name={"name"} control={control} label="Name" />
                    <Typography variant="body2">An email sent from this address will have this name as the sender</Typography>
                </Stack>
                <FormInput name={"email"} control={control} label="Email" />
                <Button variant="contained" type="submit">Add</Button>
            </Stack>
            </form>
        </Box>
      </Modal>
  );
}

export default AddSenderModal;