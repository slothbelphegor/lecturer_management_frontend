import * as React from 'react';
import Button from '@mui/material/Button';

export default function MyButton(props) {
  const {label, type, onClick, sx, disabled} = props;
  return (
      <Button type={type} variant="contained" className='myButton' onClick={onClick} sx={sx} disabled={disabled}>
        {label}
      </Button>
  );
}
