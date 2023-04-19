'use client';
import 'grapesjs/dist/css/grapes.min.css';
import { GrapesjsReact } from 'grapesjs-react';
import theBLOCKS from 'grapesjs-blocks-basic';
import theNEWS from 'grapesjs-preset-newsletter';
import { Button, Stack, List, ListItem, ListItemButton, Typography } from '@mui/material';
import { CopyButton, FormInput, copyToClipboard } from '../comps';
import { useForm } from 'react-hook-form';
import GrapesJS from 'grapesjs';
import { useState, useEffect } from 'react';
import { SelfService } from '../services/self-service';
import { useRouter } from 'next/router';
import mondaySdk from "monday-sdk-js";

declare global {
  interface Window { editor: GrapesJS.Editor }
}

const Builder = () => {
  const router = useRouter();
  const { handleSubmit, control } = useForm();
  const [columns, setColumns] = useState([]);
  const [template, setTemplate] = useState([]);
  let { templateId } = router.query
  templateId = Array.isArray(templateId) ? templateId[0] : templateId

  const fetchColumns = async () => {
    const monday = mondaySdk();
    const query = `query { boards { columns { title }}}`

    const response = await monday.api(query);
    let columns = [];
    response.data.boards.forEach((board) => {
      columns = columns.concat(board.columns.map(col => col.title));
    });

    columns = Array.from(new Set(columns));
    setColumns(columns);
  }

  const fetchTemplate = async (templateId) => {
    const data = await SelfService.getTemplate(templateId);
    console.log("Got Template", data)
    setTemplate(data.content);
  }

  useEffect(()=>{
    window.editor.setComponents(template, {});
  }, [template])

  useEffect(()=>{
    fetchColumns();
  }, [])

  useEffect(()=>{
    if(templateId){
      fetchTemplate(templateId);
    }
  }, [templateId])

  const onSave = async (data, event: React.BaseSyntheticEvent) => {
    const content = window.editor.getHtml();
    console.log(data);
    const name = data.name;

    const success = await SelfService.saveTemplate(name, content, templateId);
    if(success){
      router.push("/templates");
    }
    event.preventDefault();
  }

  return (
    <Stack direction="row">
      <GrapesjsReact
        id="grapesjs-react"
        plugins={[
          'gjs-preset-newsletter',
          'gjs-blocks-basic',
          (editor) => theBLOCKS(editor, {}),
          (editor) => theNEWS(editor, {}),
        ]}
        onInit={(editor) => {
          window.editor = editor;
        }}
      />
      <Stack sx={{margin:"1em"}} spacing={2}>
          <form onSubmit={handleSubmit(onSave)}>
            <Stack direction="row">
              <FormInput name="name" control={control} label="Template name"></FormInput>
              <Button type="submit">Save</Button>
              </Stack>
          </form>


        <Typography variant="h6">Boards properties</Typography>
        <List style={{maxHeight: '200px', overflow: 'auto', padding:0}}>
          {columns.map((column, index) => {
            const text = `{{${column}}}`;
            return <ListItem disablePadding key={index} secondaryAction={<CopyButton value={text} />}>
              <ListItemButton onClick={()=>{copyToClipboard(text)}}> {text}</ListItemButton>
              </ListItem>
          })}
        </List>
      </Stack>
    </Stack>
  );
};

export default Builder;
