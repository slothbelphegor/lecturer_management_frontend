import AxiosInstance from "../../components/AxiosInstance";
import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import AddNewIcon from "@mui/icons-material/AddBox";
import MyButton from "../../components/forms/MyButton";
import MyMessage from "../../components/Message";

const DeleteRecommendation = () => {
  const params = useParams();
  const navigate = useNavigate();
  const recommendation_id = params.id;
  const [currentRecommendation, setCurrentRecommendation] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const getData = () => {
    AxiosInstance.get(`recommendations/${recommendation_id}/`).then((res) => {
      setCurrentRecommendation(res.data);
      console.log(res.data);
    });
  };
  useEffect(() => {
    getData();
  }, []); // get data on initial load page

  const deleteRecord = (event) => {
    event.preventDefault();
    AxiosInstance.delete(`recommendations/${recommendation_id}/`)
      .then(() => {
        setIsError(false);
        setMessage("Xóa đề xuất thành công.");
        setTimeout(() => {
          navigate("/lecturers");
        }, 1500);
      })
      .catch((error) => {
        setMessage("Có lỗi xảy ra khi xóa.");
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
          Bạn có chắc chắn muốn xóa đề xuất này không?
        </Typography>
      </Box>
      {message.localeCompare("") ? (
        <MyMessage text={message} color={isError ? "#EC5A76" : "green"} position={"static"}/>
      ) : null}
      <form onSubmit={deleteRecord}>
        <Box className="formBox" sx={{display: "flex", flexDirection: "column"}} onSubmit={deleteRecord}>
          <Box className="formArea">
            <Typography>
              Bạn sẽ xóa đề xuất giảng viên <strong>{currentRecommendation.name}</strong>{" "}
              công tác tại <strong>{currentRecommendation.workplace}</strong>
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

export default DeleteRecommendation;
