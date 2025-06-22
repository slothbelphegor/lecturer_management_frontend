import "../../App.css"

import { Box } from "@mui/material"
import { React, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form'

import MyMessage from "../../components/Message";
import MyButton from "../../components/forms/MyButton";
import MyPasswordField from "../../components/forms/MyPasswordField";

import AxiosInstance from "../../components/AxiosInstance";
const PasswordReset = () => {
    const { handleSubmit, control } = useForm()
    const navigate = useNavigate()
    const [showMessage, setShowMessage] = useState(false)
    const {token} = useParams()
    const submission = (data) => {
        // What to do when clicking submit
        AxiosInstance.post(`api/password_reset/confirm/`, {
            password: data.password,
            token: token,
        }).then(() => {
            setShowMessage(true)
            setTimeout(() => {
                navigate(`/login`)
            }, 2000)
        }).catch((error) => {
            console.error(error)
        });
    }
    return (
        <div className={"myBackground"}>
            {showMessage ? <MyMessage 
                            text={"Password reset successful. Redirecting to login page..."} 
                            color={'#69C9AB'} 
                            position={"absolute"}/> : null}
            <form onSubmit={handleSubmit(submission)}>
                <Box className={"whiteBox"}>
                    <Box className={"itemBox"}>
                        <Box className={"title"}>
                            Reset Password
                        </Box>
                    </Box>
                    <Box className={"itemBox"}>
                        <MyPasswordField
                            label="Password"
                            name={"password"}
                            control={control} />
                    </Box>
                    <Box className={"itemBox"}>
                        <MyPasswordField
                            label="Confirm Password"
                            name={"password2"}
                            control={control} />
                    </Box>

                    <Box className={"itemBox"}>
                        <MyButton label={"Reset Password"} type={"submit"} />
                    </Box>
                    <Box className={"itemBox"} sx={{ flexDirection: 'column' }}>

                    </Box>
                </Box>
            </form>

        </div>
    )
}

export default PasswordReset;