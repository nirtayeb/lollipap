import { Controller } from "react-hook-form";
import { TextField } from '@mui/material';


export const FormInput = ({name, control, label}) => {
    return (
        <Controller name={name} control={control}
            render={({ field: { onChange, value } }) => (
            <TextField id="outlined-basic" label={label} variant="outlined" onChange={onChange} value={value} /> 
            )} />
    );
}
