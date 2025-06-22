import AxiosInstance from "../../components/AxiosInstance";
import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import AddNewIcon from "@mui/icons-material/AddBox";
import MyButton from "../../components/forms/MyButton";
import MyMessage from "../../components/Message";

const DeleteLecturer = () => {
  const params = useParams();
  const navigate = useNavigate();
  const lecturer_id = params.id;
  const [currentLecturer, setCurrentLecturer] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const getData = () => {
    AxiosInstance.get(`lecturers/${lecturer_id}/`).then((res) => {
      setCurrentLecturer(res.data);
      console.log(res.data);
    });
  };
  useEffect(() => {
    getData();
  }, []); // get data on initial load page

  const deleteRecord = (event) => {
    event.preventDefault();
    AxiosInstance.delete(`lecturers/${lecturer_id}/`)
      .then(() => {
        setIsError(false);
        setMessage("Lecturer deleted successfully. Redirecting...");
        setTimeout(() => {
          navigate("/lecturers");
        }, 1500);
      })
      .catch((error) => {
        setMessage("An error occurred while deleting the lecturer.");
        setIsError(true);
        console.error(error);
      })
      .finally(() => {
        setShowMessage(true);
      });
  };

  return (
    <div>
      <Box className="topbar">
        <AddNewIcon />
        <Typography
          sx={{ marginLeft: "15px", fontWeight: "bold" }}
          variant="subtitle2"
        >
          Bạn có chắc chắn muốn xóa giảng viên này không?
        </Typography>
      </Box>
      {message.localeCompare("") ? (
        <MyMessage text={message} color={isError ? "#EC5A76" : "green"} position={"static"}/>
      ) : null}
      <form onSubmit={deleteRecord}>
        <Box className="formBox" sx={{display: "flex", flexDirection: "column"}} onSubmit={deleteRecord}>
          <Box className="formArea">
            <Typography>
              Bạn sẽ xóa giảng viên <strong>{currentLecturer.name}</strong>{" "}
              công tác tại <strong>{currentLecturer.workplace}</strong>
            </Typography>
          </Box>
          <Box sx={{ marginTop: "30px" }}>
            <MyButton type="submit" fullWidth label={"Delete"}></MyButton>
          </Box>
        </Box>
      </form>
    </div>
  );
};

export default DeleteLecturer;
