import { Controller } from "react-hook-form";
import { InputLabel, Select, FormControl } from '@mui/material';


const FormSelect = ({name, control, label, children}) => {
    return (
        <Controller name={name} control={control}
            render={({ field: { onChange, value } }) => (
                <FormControl fullWidth>
                    <InputLabel>{label}</InputLabel>
                <Select
                    onChange={onChange}
                    id="demo-simple-select"
                    value={value}
                    label={label}
                    >
                    { children }
                </Select>
                </FormControl>
            )} />
    );
}

export default FormSelect;