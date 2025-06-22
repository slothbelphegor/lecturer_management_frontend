import * as React from 'react';
import "../../App.css";
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';

export default function MyDateTimeField(props) {
    const { label, name, control, disabled, type, sx, onChange: customOnChange } = props;
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
                    id="datetime-local"
                    sx={sx}
                    label={label}
                    type={type} // Use 'datetime-local' for date and time input
                    variant="outlined"
                    className={"myForm"}
                    disabled={disabled}
                    onChange={(e) => {
                        onChange(e); // Update form state
                        if (customOnChange) customOnChange(e); // Call custom handler if provided
                    }}
                    value={value || ""} // Ensure value is a string}
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{
                        shrink: true, // Ensures the label doesn't overlap with the input value
                    }}
                />
            )}
        />
    );
}