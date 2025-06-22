import AxiosInstance from "../../components/AxiosInstance";
import { React, useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import AddNewIcon from "@mui/icons-material/AddBox";
import InfoIcon from '@mui/icons-material/Info';
import MyTextField from "../../components/forms/MyTextField";
import MyButton from "../../components/forms/MyButton";
import MyDescriptionField from "../../components/forms/MyDescriptionField";
import MyMessage from "../../components/Message";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const EditSubject = () => {
  const params = useParams();
  const subject_id = params.id;
  const [showMessage, setShowMessage] = useState(false);
  const [currentSubject, setCurrentSubject] = useState({});
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");

  const getData = () => {
    AxiosInstance.get(`subjects/${subject_id}/`).then((res) => {
      setCurrentSubject(res.data);
    });
  };

  useEffect(() => {
    getData();
  }, []); // get data on initial load page

  const schema = yup.object().shape({
    name: yup.string().required("Chưa nhập tên môn học"),
    credits: yup
          .number()
          .typeError("Số tín chỉ phải là số")
          .positive("Số tín chỉ phải là số dương")
          .integer("Số tín chỉ phải là số nguyên")
          .min(1, "Số tín chỉ tối thiểu là 1"),
  });

  const resolvedSchema = yupResolver(schema);
  const { handleSubmit, control } = useForm({
    resolver: resolvedSchema,
    values: {
      name: currentSubject.name,
      description: currentSubject.description,
      credits: currentSubject.credits,
    },
  });
  

  const submission = (data) => {
    AxiosInstance.put(`subjects/${subject_id}/`, {
      name: data.name,
      description: data.description,
      credits: data.credits,
    })
      .then((res) => {
        console.log(res.data);
        setIsError(false);
        setMessage("Cập nhật môn học thành công!");
        setTimeout(() => {
          // Refresh the page
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        setMessage("Lỗi cập nhật môn học!");
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
        <InfoIcon />
        <Typography
          sx={{ marginLeft: "15px", fontWeight: "bold" }}
          variant="subtitle2"
        >
          Chi tiết môn học
        </Typography>
      </Box>
      {showMessage ? (
        <MyMessage
          text={message}
          color={isError ? "#EC5A76" : "green"}
          position={"static"}
        />
      ) : null}
      <form onSubmit={handleSubmit(submission)}>
        <Box
          className="formBox"
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(1, 1fr)",
          }}
        >
          <Box
            className="formArea"
            sx={{ width: "100%", gridColumn: "span 2" }}
          >
            <MyTextField
              className="formField"
              label={"Tên môn học"}
              name="name"
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 1", width: "100%" }}
          >
            <MyTextField
              className="formField"
              label={"Số tín chỉ"}
              name="credits"
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 3", width: "100%" }}
          >
            <MyDescriptionField
              className="formField"
              label={"Mô tả môn học"}
              name="description"
              control={control}
              rows={4}
            />
          </Box>

          <Box
            className="formArea"
            sx={{ gridColumn: "span 3", justifyContent: "center" }}
          >
            <MyButton type="submit" fullWidth label={"Submit"}></MyButton>
          </Box>
        </Box>
      </form>
    </div>
  );
};

export default EditSubject;
