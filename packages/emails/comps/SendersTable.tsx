'use client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Snackbar, Box, Button, Stack, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import AddSenderModal from './AddSenderModal';
import { useRouter } from 'next/navigation'
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';
import ButtonUnstyled from '@mui/base/ButtonUnstyled';
import { SelfService } from '../services/self-service';

const SendersAdmin = ({ senders }) => {

    const router = useRouter();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [toastOpen, setToastOpen] = useState(false);
    const [toastText, setToastText] = useState("");
    const onAddSenderSuccess = useCallback((name, email) => {
        setToastText(`Verification link sent to ${email}, please check your inbox`);
        setToastOpen(true);
        router.refresh();
    }, 
    [setToastOpen, setToastText, router])

    const onFailureToast = useCallback(() => {
        setToastText("Email already exists, please use a different email address");
        setToastOpen(true)}, 
    [setToastOpen, setToastText])
    
    const onCloseCallback = useCallback(() => setToastOpen(false), [setToastOpen]);

    const onDelete = async (email) => {
        setToastOpen(false);
        const deleted = await SelfService.deleteSender(email);
        if(deleted){
            setToastText(`${email} Deleted successfuly`)
            router.refresh()
        }else{
            setToastText(`Couldn't delete ${email}, please try again later`)
        }
        setToastOpen(true);
    }

  return (
    <>
        <AddSenderModal open={open} onClose={handleClose} onSuccess={onAddSenderSuccess} onFailure={onFailureToast} />
        <Snackbar
            open={toastOpen}
            autoHideDuration={6000}
            onClose={onCloseCallback}
            message={toastText}
            />
    <Box
      sx={{
        width: '75%',
        marginTop: '1rem',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" justifyContent={'space-between'}>
            <Typography variant="h4">Verified Senders</Typography>
            <Box>
                <Button variant="contained" onClick={handleOpen} color="primary" size="small">Add</Button>
            </Box>
        </Stack>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {senders.map((sender) => {

                const handleDelete = async() => {
                    await onDelete(sender.email)
                }

                return (<TableRow
                  key={sender.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left">{sender.email}</TableCell>
                  <TableCell align="left">{sender.status}</TableCell>
                  <TableCell align="right">
                        <Button variant="text" size="small" color="secondary"><ReplayIcon /></Button>
                        <Button variant="text" size="small" color="error" onClick={handleDelete}><DeleteIcon /></Button>
                </TableCell>
                  
                </TableRow>)
              }
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
    </>
  );
};

export default SendersAdmin;
