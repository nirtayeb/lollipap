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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';

const TemplateAdmin = ({ templates }) => {

    const router = useRouter();

    const [toastOpen, setToastOpen] = useState(false);
    const [toastText, setToastText] = useState("");
    
    const onCloseCallback = useCallback(() => setToastOpen(false), [setToastOpen]);

    const onDelete = async (template) => {
        setToastOpen(false);
        const deleted = await SelfService.deleteTemplate(template.id);
        if(deleted){
            setToastText(`Template ${template.name} Deleted successfuly`)
            router.refresh()
        }else{
            setToastText(`Couldn't delete ${template.name}, please try again later`)
        }
        setToastOpen(true);
    }

    const handleCopy = async (template) => {
      setToastOpen(false);
      const copied = await SelfService.duplicateTemplate(template.id);
      if(copied){
        if(copied){
          setToastText(`Template ${template.name} duplicated successfuly`)
          router.refresh()
      }else{
          setToastText(`Couldn't duplicate ${template.name}, please try again later`)
      }
      setToastOpen(true);
      }
    }

    const handleEdit = async(template) => {
      router.push(`/builder?templateId=${template.id}`)
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
                    await onDelete(template)
                }

                return (<TableRow
                  key={template.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{template.name}</TableCell>
                  <TableCell align="right">
                      <Button variant="text" size="small" color="primary" onClick={()=> handleEdit(template)}><EditIcon /></Button>
                      <Button varaint="text" size="small" color="secondary" onClick={()=> handleCopy(template)}><ContentCopyIcon /></Button>
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
