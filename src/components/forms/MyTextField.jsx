import * as React from 'react';
import "../../App.css"
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form'

export default function MyTextField(props) {
    const { label, name, control, slotProps, sx, disabled } = props
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={""}
            
            render={({
                field: { onChange, value },
                fieldState: { error }
            }) => (
                <TextField
                    id="outlined-basic"
                    sx={sx}
                    label={label}
                    variant="outlined"
                    className={"myForm"}
                    onChange={onChange}
                    slotProps={slotProps}
                    value={value}
                    error={!!error}
                    disabled={disabled}
                    helperText={error?.message}
                />
            )
            }
        />


    );
}