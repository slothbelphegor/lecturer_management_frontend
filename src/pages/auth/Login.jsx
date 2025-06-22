import "../../App.css"
import { Box } from "@mui/material"
import { Link } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom"
import { React, useState, useContext } from "react";
import MyMessage from "../../components/Message"
import MyTextField from "../../components/forms/MyTextField"
import MyPasswordField from "../../components/forms/MyPasswordField"
import MyButton from "../../components/forms/MyButton"
import AxiosInstance from "../../components/AxiosInstance"
import { RoleContext } from "../../components/RoleContext"

import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const Login = () => {
    const navigate = useNavigate()  // Used for page navigation
    const [showMessage, setShowMessage] = useState(false)
    //const { setRole } = useContext(RoleContext);
    const schema = yup.object().shape({
        username_or_email: yup.string().required('Username or email is required'),
        password: yup.string().required('Password is required')
    })
    const resolvedSchema = yupResolver(schema)
    const { handleSubmit, control } = useForm({
        resolver: resolvedSchema,
    })

    const submission = (data) => {
        // What to do when clicking submit
        AxiosInstance.post(`login/`, {
            username_or_email: data.username_or_email,
            password: data.password,
        }).then((response) => {
            // What to do after the request
            console.log(response)
            // Store the token and role in localStorage
            localStorage.setItem("Token", response.data.token)
            localStorage.setItem("Role", response.data.user.group)
            // Redirect to the home page
            navigate(`/`)
        }).catch((error) => {
            setShowMessage(true)
            console.error(error)
        });
    }
    return (
        <div className={"myBackground"}>
            {showMessage ? <MyMessage 
                                text={"Login failed. Please try again."} 
                                color={'#EC5A76'}
                                position={"absolute"}/> : null}
            <form onSubmit={handleSubmit(submission)}>
                <Box className={"whiteBox"}>
                    <Box className={"itemBox"}>
                        <Box className={"title"}>
                            Login
                        </Box>
                    </Box>
                    <Box className={"itemBox"}>
                        <MyTextField
                            label="Username or email"
                            name={"username_or_email"}
                            control={control} />
                    </Box>
                    <Box className={"itemBox"}>
                        <MyPasswordField
                            label="Password"
                            name={"password"}
                            control={control} />
                    </Box>
                    <Box className={"itemBox"}>
                        <MyButton label={"Login"}  type={"submit"} />
                    </Box>
                    <Box className={"itemBox"} sx={{flexDirection: 'column'}}>
                        <Link to={"/register"}>
                            Don't have an account? Register
                        </Link>
                        <Link to={"/request/password_reset"}>
                            Forget Password?
                        </Link>
                    </Box>
                </Box>
            </form>

        </div>
    )
}

export default Login;