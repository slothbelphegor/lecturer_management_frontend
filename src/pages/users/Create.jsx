import AxiosInstance from "../../components/AxiosInstance";
import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import AddNewIcon from "@mui/icons-material/AddBox";
import MyTextField from "../../components/forms/MyTextField";
import MyButton from "../../components/forms/MyButton";
import MyMessage from "../../components/Message";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MySelectField from "../../components/forms/MySelectField";
import MyDateTimeField from "../../components/forms/MyDateTimeField";
import MyPasswordField from "../../components/forms/MyPasswordField";

const CreateUser = () => {
  const params = useParams()
  const user_id = params.id
  const navigate = useNavigate()
  const [showMessage, setShowMessage] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [lecturers, setLecturers] = useState()
  const [groups, setGroups] = useState()
  const getData = () => {
    AxiosInstance.get('lecturers/').then((res) => {
      setLecturers(res.data)
    })
    AxiosInstance.get("groups/").then((res) => {
        setGroups(res.data)
        console.log("Groups:", res.data)
    })

    
  };
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


  useEffect(() => {
      getData();
    }, []); // get data on initial load page

  const lecturerOptions = lecturers?.filter(l => !l.user) // Only lecturers not linked to a user
                                    .map(l => ({ value: l.id, id: l.id, showValue: `${l.name} - ${l.workplace}` }));

  const groupOptions = groups?.map((group) => ({
      id: group.id,
      value: group.id,
      showValue: `${group.name}`,
  }));
  
  const {  control, handleSubmit, watch  } = useForm({
    resolver: resolvedSchema,
  });

  const selectedGroup = watch("group");

  const submission = (data) => {
    console.log(data)
    AxiosInstance.post(`users/`, {
      username: data.username,
      email: data.email,
      password: data.password,
      groups: [data.group],
      lecturer: data.lecturer,
    })
    .then((res) => {
        console.log("Response data: ",res.data);
        setIsError(false);
        setMessage("User created successfully.");
        setTimeout(() => {
          navigate("/users");
        }, 1500);
      })
      .catch((error) => {
        setMessage("An error occurred while creating the user.");
        setIsError(true);
        console.error(error.response.data);
      })
      .finally(() => {
        setShowMessage(true);
      });
  }
 
  return (
    <div>
      <Box className="topbar">
        <AddNewIcon />
        <Typography
          sx={{ marginLeft: "15px", fontWeight: "bold" }}
          variant="subtitle2"
        >
          Thêm tài khoản mới
        </Typography>
      </Box>
      {showMessage ? (
        <MyMessage
          text={message}
          color={isError ? "#EC5A76" : "green"}
          position={"static"}
        />
      ) : null}
      <form onSubmit={handleSubmit(submission,
      (errors) => console.log("Validation Errors:", errors)
    )}>
        <Box
          className="formBox"
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(1, 1fr)",
          }}
        >
          <Box
            className="formArea"
            sx={{ width: "100%", gridColumn: "span 4" }}
          >
            <MyTextField
              className="formField"
              label={"Username"}
              name="username"
              control={control}
            />
          </Box>

        
          <Box
            className="formArea"
            sx={{ gridColumn: "span 4", width: "100%" }}
          >
            <MyTextField
              className="formField"
              label={"Email"}
              name="email"
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 4", width: "100%" }}
          >
            <MyPasswordField
              className="formField"
              label={"Mật khẩu"}
              name="password"
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 4", width: "100%" }}
          >
            <MyPasswordField
              className="formField"
              label={"Nhập lại mật khẩu"}
              name="password2"
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 4", width: "100%" }}
          >
            {(groups) ? 
            ( <MySelectField
              className="formField"
              label={"Loại tài khoản"}
              name="group"
              control={control}
              options={groupOptions}
            />) : null}
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 4", width: "100%" }}
          >
            {["lecturer", "potential_lecturer"].includes(
              groupOptions?.find(g => g.id === selectedGroup)?.showValue
            ) && (
              <MySelectField
                className="formField"
                label={"Giảng viên liên kết"}
                name="lecturer"
                control={control}
                options={lecturerOptions}
              />
            )}
          </Box>
          

          <Box
            className="formArea"
            sx={{ gridColumn: "span 4", width: "100%" }}
          >
            <MyButton type="submit" fullWidth label={"Submit"}></MyButton>
          </Box>
        </Box>
      </form>
    </div>
  );
};

export default CreateUser;
