import AxiosInstance from "../../components/AxiosInstance";
import { React, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AddNewIcon from "@mui/icons-material/AddBox";
import MyMessage from "../../components/Message";
import { format } from "date-fns";


import EvaluationForm from "../../components/full_forms/EvaluationForm";

const CreateEvaluation = () => {
  const navigate = useNavigate();
  const params = useParams();
  const lecturer_id = params.id;
  const [showMessage, setShowMessage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [currentLecturer, setCurrentLecturer] = useState({});

  const getData = () => {
    AxiosInstance.get(`lecturers/${lecturer_id}/`).then((res) => {
      setCurrentLecturer(res.data);
    });
  };

  useEffect(() => {
    getData();
  }, []); // get data on initial load page


  const submission = (data) => {
    AxiosInstance.post("evaluations/", {
      title: data.title,
      date: format(new Date(data.date), 'yyyy-MM-dd'),
      type: data.type,
      content: data.content,
      lecturer: currentLecturer.id,
    })
      .then(() => {
        setIsError(false);
        setMessage("Thêm đánh giá thành công.");
        setTimeout(() => {
          navigate(`/lecturers/${lecturer_id}/evaluations`);
        }, 1500);
      })
      .catch((error) => {
        setMessage("Có lỗi xảy ra trong quá trình thêm đánh giá.");
        setIsError(true);
        console.error(error.response.data);
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
          Đánh giá giảng viên {currentLecturer?.name}
        </Typography>
      </Box>
      {showMessage ? (
        <MyMessage
          text={message}
          color={isError ? "#EC5A76" : "green"}
          position={"static"}
        />
      ) : null}
      <EvaluationForm submission={submission}/>
    </div>
  );
};

export default CreateEvaluation;
