import AxiosInstance from "../../components/AxiosInstance";
import { React, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AddNewIcon from "@mui/icons-material/AddBox";
import MyMessage from "../../components/Message";
import { format } from "date-fns";
import RecommendationForm from "../../components/full_forms/RecommendationForm";

const CreateRecommendation = () => {
  const navigate = useNavigate();
  const params = useParams();
  const lecturer_id = params.id;
  const [showMessage, setShowMessage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [currentLecturer, setCurrentLecturer] = useState({});
  const [subjects, setSubjects] = useState([]);

  const getData = () => {
    AxiosInstance.get(`lecturers/me/`).then((res) => {
      setCurrentLecturer(res.data);
      console.log(res.data);
    });
    AxiosInstance.get(`subjects/`).then((res) => {
        setSubjects(res.data);
    });

  };

  useEffect(() => {
    getData();
  }, []); // get data on initial load page


  const submission = (data) => {
    console.log(data)
    const sentData = {
      name: data.name,
      date: format(new Date(data.date), 'yyyy-MM-dd'),
      email: data.email,
      phone_number: data.phone_number,
      content: data.content,
      workplace: data.workplace,
      recommender: currentLecturer.id,
      status: "Chưa được duyệt",
      subjects: data.subjects,
    }
    
    AxiosInstance.post("recommendations/me/", sentData)
      .then(() => {
        setIsError(false);
        setMessage("Thêm đề xuất thành công.");
        setTimeout(() => {
          navigate(`/my_recommendations`);
        }, 1500);
      })
      .catch((error) => {
        setMessage("Có lỗi xảy ra trong quá trình thêm đề xuất.");
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
          Thêm đề xuất mới
        </Typography>
      </Box>
      <RecommendationForm submission={submission}/>
      {showMessage ? (
        <MyMessage
          text={message}
          color={isError ? "#EC5A76" : "green"}
          position={"static"}
        />
      ) : null}
      
    </div>
  );
};

export default CreateRecommendation;
