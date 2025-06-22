import "../../App.css"
import { Box } from "@mui/material"
import { React,  useState } from "react";
import { useForm } from 'react-hook-form'
import AxiosInstance from "../../components/AxiosInstance";
import MyMessage from "../../components/Message";
import MyTextField from "../../components/forms/MyTextField";
import MyButton from "../../components/forms/MyButton";


const PasswordResetRequest = () => {
    const { handleSubmit, control } = useForm()

    const [showMessage, setShowMessage] = useState(false)
    const submission = (data) => {
        // What to do when clicking submit
        AxiosInstance.post(`api/password_reset/`, {
            email: data.email
        }).then(() => {
            setShowMessage(true)
        }).catch((error) => {
            console.error(error)
        });
    }
    return (
        <div className={"myBackground"}>
            {showMessage ? <MyMessage 
                                text={"If your email exists, you have received the instructions for resetting the password."} 
                                color={'#69C9AB'}
                                position={"absolute"}/> : null}
            <form onSubmit={handleSubmit(submission)}>
                <Box className={"whiteBox"}> 
                    <Box className={"itemBox"}>
                        <Box className={"title"}>
                            Request Password Reset
                        </Box>
                    </Box>
                    <Box className={"itemBox"}>
                        <MyTextField
                            label={"Email"}
                            name={"email"}
                            control={control} />
                    </Box>

                    <Box className={"itemBox"}>
                        <MyButton label={"Request Password Reset"}  type={"submit"} />
                    </Box>
                    <Box className={"itemBox"} sx={{flexDirection: 'column'}}>
                      
                    </Box>
                </Box>
            </form>

        </div>
    )
}

export default PasswordResetRequest;