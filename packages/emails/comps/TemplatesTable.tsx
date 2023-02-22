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
import { useRouter } from 'next/navigation'
import DeleteIcon from '@mui/icons-material/Delete';
import { SelfService } from '../services/self-service';
import Link from 'next/link';

const TemplateAdmin = ({ templates }) => {

    const router = useRouter();

    const [toastOpen, setToastOpen] = useState(false);
    const [toastText, setToastText] = useState("");
    
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
            <Typography variant="h4">Templates</Typography>
            <Box>
                <Link href="/builder" passHref>
                    <Button variant="contained" color="primary" size="small">Add</Button>
                </Link>
            </Box>
        </Stack>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((template) => {

                const handleDelete = async() => {
                    await onDelete(template.id)
                }

                return (<TableRow
                  key={template.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{template.name}</TableCell>
                  <TableCell align="right">
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

export default TemplateAdmin;
