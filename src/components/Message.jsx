import { Box } from "@mui/material"


const MyMessage = ({text, color, position}) =>{
    return(
        <Box sx={{
            backgroundColor: color, 
            color:'#FFFFFF', 
            width: '100%', 
            height: '30px',
            top:'20px', 
            position: {position},
            display:'flex', 
            padding:'10px',
            justifyContent:'center', 
            alignItems:'center'
            }}>
            {text}
        </Box>
    )
}

export default MyMessage