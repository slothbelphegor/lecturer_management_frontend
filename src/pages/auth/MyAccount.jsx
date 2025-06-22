import AxiosInstance from "../../components/AxiosInstance";
import { React, useState, useEffect } from "react";
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

const MyAccount = () => {

  const [showMessage, setShowMessage] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");

  const getData = () => {
    AxiosInstance.get(`users/me/`).then((res) => {
      setCurrentUser(res.data);
      console.log(res.data)
    });
  };

  useEffect(() => {
      getData();
    }, []); // get data on initial load page



  
  const {  control } = useForm({
    values: {
        username: currentUser.username,
        email: currentUser.email
    }
  });

 
  return (
    <form>
      <Box className="topbar">
        <AddNewIcon />
        <Typography
          sx={{ marginLeft: "15px", fontWeight: "bold" }}
          variant="subtitle2"
        >
          Thông tin tài khoản
        </Typography>
      </Box>
      {showMessage ? (
        <MyMessage
          text={message}
          color={isError ? "#EC5A76" : "green"}
          position={"static"}
        />
      ) : null}
      <form>
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
              disabled={true}
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
              disabled={true}
            />
          </Box>

          <Box
            className="formArea"
            sx={{ gridColumn: "span 2", width: "100%" }}
          >
            <Link to={"/request/password_reset"}>
                Đổi mật khẩu
            </Link>
          </Box>
        </Box>
      </form>
    </form>
  );
};

export default MyAccount;
