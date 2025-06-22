import "../../App.css";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import MyTextField from "../../components/forms/MyTextField";
import MyPasswordField from "../../components/forms/MyPasswordField";
import MyButton from "../../components/forms/MyButton";

import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import AxiosInstance from "../../components/AxiosInstance";

const Register = () => {
  const navigate = useNavigate(); // Used for page navigation
  const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    email: yup
      .string()
      .email("Field expected an email address")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter")
      .matches(/[a-z]/, "Password must contain at least 1 lowercase letter")
      .matches(/[0-9]/, "Password must contain at least 1 number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least 1 special character"
      ),
    password2: yup
      .string()
      .required("Password confirmation is required")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });
  const resolvedSchema = yupResolver(schema);
  const { handleSubmit, control } = useForm({
    resolver: resolvedSchema,
  });

  const submission = (data) => {
    // What to do when clicking submit
    AxiosInstance.post(`register/`, {
      username: data.username,
      email: data.email,
      password: data.password,
    }).then(() => {
      // What to do after the request
      navigate(`/login`);
    });
  };
  return (
    <div className={"myBackground"}>
      <form onSubmit={handleSubmit(submission)}>
        <Box className={"whiteBox"}>
          <Box className={"itemBox"}>
            <Box className={"title"}>Register</Box>
          </Box>
          <Box className={"itemBox"}>
            <MyTextField
              label={"Username"}
              name={"username"}
              control={control}
            />
          </Box>
          <Box className={"itemBox"}>
            <MyTextField label={"Email"} name={"email"} control={control} />
          </Box>
          <Box className={"itemBox"}>
            <MyPasswordField
              label={"Password"}
              name={"password"}
              control={control}
            />
          </Box>
          <Box className={"itemBox"}>
            <MyPasswordField
              label={"Confirm Password"}
              name={"password2"}
              control={control}
            />
          </Box>
          <Box className={"itemBox"}>
            <MyButton label={"Register"} type={"submit"} />
          </Box>
        </Box>
      </form>
    </div>
  );
};

export default Register;
