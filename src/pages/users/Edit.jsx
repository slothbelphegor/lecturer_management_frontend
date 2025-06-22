import AxiosInstance from "../../components/AxiosInstance";
import { React, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import InfoIcon from '@mui/icons-material/Info';
import MyTextField from "../../components/forms/MyTextField";
import MyButton from "../../components/forms/MyButton";
import MyMessage from "../../components/Message";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MySelectField from "../../components/forms/MySelectField";
import MyDateTimeField from "../../components/forms/MyDateTimeField";

const EditUser = () => {
  const params = useParams()
  const user_id = params.id
  const navigate = useNavigate()
  const [showMessage, setShowMessage] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [lecturers, setLecturers] = useState()
  const [groups, setGroups] = useState([])
  const [isLoadingLecturer, setIsLoadingLecturer] = useState(true);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [isLoadingCurrentUser, setIsLoadingCurrentUser] = useState(true);
  
  const getData = () => {
    AxiosInstance.get('lecturers/all/').then((res) => {
      setLecturers(res.data)
      setIsLoadingLecturer(false);
      console.log(res.data)
    })
    AxiosInstance.get(`users/${user_id}/`).then((res) => {
      setCurrentUser(res.data);
      setIsLoadingCurrentUser(false);
      console.log(res.data)
    });
    AxiosInstance.get("groups/").then((res) => {
      setIsLoadingGroups(false);
      setGroups(res.data)
    })
    
  };


const lecturerOptions = useMemo(() =>
  lecturers
    ?.filter(l => !l.user || l.user == currentUser.id || l.id === currentUser.lecturer)
    .map(l => ({ value: l.id, id: l.id, showValue: `${l.name} - ${l.workplace}` })) || [],
  [lecturers, currentUser]
);
  console.log(lecturerOptions)
  const groupOptions = useMemo(() =>
  groups?.map((group) => ({
    id: group.id,
    value: group.id,
    showValue: `${group.name}`,
  })) || [],
  [groups]
);
  
  const {  control, handleSubmit, watch, reset  } = useForm({
    // values: {
    //     username: currentUser.username,
    //     email: currentUser.email,
    //     group: groups.find((group) => group.id == currentUser.groups[0])?.id,
    //     lecturer: currentUser.lecturer_str && lecturerOptions
    //     ? lecturerOptions.find((option) => option.showValue === currentUser.lecturer_str)?.value || ""
    //     : "",
    // }
  });

  useEffect(() => {
      getData();
  }, []); // get data on initial load page
  
  // Reset form when all data is loaded and stable
  useEffect(() => {
    if (
      currentUser &&
      groups.length &&
      lecturerOptions?.length &&
      groupOptions?.length // ensure groupOptions is ready
    ) {
      const formValues = {
        username: currentUser.username,
        email: currentUser.email,
        group: groups.find((group) => group.id == currentUser.groups[0])?.id,
        lecturer: currentUser.lecturer || (
          lecturerOptions.find((option) => option.showValue === currentUser.lecturer_str)?.value || ""
        ),
      };
      reset(formValues);
    }
    // Only depend on reset, currentUser, groups, lecturerOptions, groupOptions
    // This will NOT cause an infinite loop because getData is not called here
  }, [currentUser, groups, reset, lecturerOptions, groupOptions]);


  const selectedGroup = watch("group");

  const submission = (data) => {
    console.log(data)
    AxiosInstance.patch(`users/${user_id}/`, {
      username: data.username,
      email: data.email,
      lecturer: data.lecturer,
      groups: [selectedGroup]
    })
    .then((res) => {
        console.log("Response data: ",res.data);
        setIsError(false);
        setMessage("User updated successfully.");
        setTimeout(() => {
          navigate("/users");
        }, 1500);
      })
      .catch((error) => {
        setMessage("An error occurred while updating the user.");
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
        <InfoIcon />
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
      <form onSubmit={handleSubmit(submission,
      (errors) => console.log("Validation Errors:", errors)
    )}>
      {(isLoadingCurrentUser || isLoadingGroups || isLoadingLecturer ) ? (
        <Box sx={{ textAlign: "center", marginTop: "20px" }}>
          <Typography variant="body1">Loading...</Typography>
        </Box>
      ) : (
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
      )
      }
        
      </form>
    </div>
  );
};

export default EditUser;
