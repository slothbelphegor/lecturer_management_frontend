import AxiosInstance from "../../components/AxiosInstance";
import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import AddNewIcon from "@mui/icons-material/AddBox";
import MyButton from "../../components/forms/MyButton";
import MyMessage from "../../components/Message";

const DeleteEvaluation = () => {
  const params = useParams();
  const navigate = useNavigate();
  const evaluation_id = params.id;
  const [currentEvaluation, setCurrentEvaluation] = useState({});
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const getData = () => {
    AxiosInstance.get(`evaluations/${evaluation_id}/`).then((res) => {
      setCurrentEvaluation(res.data);
      console.log(res.data);
    });
  };
  useEffect(() => {
    getData();
  }, []); // get data on initial load page

  const deleteRecord = (event) => {
    event.preventDefault();
    AxiosInstance.delete(`evaluations/${evaluation_id}/`)
      .then(() => {
        setIsError(false);
        setMessage("Xóa đánh giá thành công. Đang chuyển hướng...");
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      })
      .catch((error) => {
        setMessage("Có lỗi xảy ra trong quá trình xóa đánh giá.");
        setIsError(true);
        console.error(error);
      })
  };

  return (
    <div>
      <Box className="topbar">
        <AddNewIcon />
        <Typography
          sx={{ marginLeft: "15px", fontWeight: "bold" }}
          variant="subtitle2"
        >
          Bạn có chắc chắn muốn xóa đánh giá này không?
        </Typography>
      </Box>
      {message.localeCompare("") ? (
        <MyMessage text={message} color={isError ? "#EC5A76" : "green"} position={"static"}/>
      ) : null}
      <form onSubmit={deleteRecord}>
        <Box className="formBox" sx={{display: "flex", flexDirection: "column"}} onSubmit={deleteRecord}>
          <Box className="formArea">
            <Typography>
              Bạn sẽ xóa đánh giá <strong>{currentEvaluation.title}</strong>{" "}
              viết vào ngày <strong>{currentEvaluation.date}</strong>
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

export default DeleteEvaluation;
