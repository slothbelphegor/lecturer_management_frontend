import AxiosInstance from "../../components/AxiosInstance";
import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import AddNewIcon from "@mui/icons-material/AddBox";
import MyButton from "../../components/forms/MyButton";
import MyMessage from "../../components/Message";

const DeleteSubject = () => {
  const params = useParams();
  const navigate = useNavigate();
  const subject_id = params.id;
  const [currentSubject, setCurrentSubject] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const getData = () => {
    AxiosInstance.get(`subjects/${subject_id}/`).then((res) => {
      setCurrentSubject(res.data);
      console.log(res.data);
    });
  };
  useEffect(() => {
    getData();
  }, []); // get data on initial load page

  const deleteRecord = (event) => {
    event.preventDefault();
    AxiosInstance.delete(`subjects/${subject_id}/`)
      .then(() => {
        setIsError(false);
        setMessage("Xóa môn học thành công, đang chuyển hướng về danh sách môn học...");
        setTimeout(() => {
          navigate("/subjects");
        }, 1500);
      })
      .catch((error) => {
        setMessage("Xóa môn học thất bại!");
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
          Bạn có chắc chắn muốn xóa môn học này?
        </Typography>
      </Box>
      {message.localeCompare("") ? (
        <MyMessage text={message} color={isError ? "#EC5A76" : "green"} position={"static"}/>
      ) : null}
      <form onSubmit={deleteRecord}>
        <Box className="formBox" sx={{display: "flex", flexDirection: "column"}} onSubmit={deleteRecord}>
          <Box className="formArea">
            <Typography>
              Bạn sẽ xóa môn học <strong>{currentSubject.name}.</strong>{" "}
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

export default DeleteSubject;
