import { React, useState } from "react";
import { Box, Typography } from "@mui/material";
import MyTextField from "../../components/forms/MyTextField";
import MyButton from "../../components/forms/MyButton";
import MyDescriptionField from "../../components/forms/MyDescriptionField";
import MySelectField from "../../components/forms/MySelectField";
import MyDateTimeField from "../../components/forms/MyDateTimeField";

import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { format } from "date-fns";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import AxiosInstance from "../AxiosInstance";

export default function EvaluationForm({ evaluation, submission }) {
  const typeOptions = [
    {
      id: "1",
      value: "Đánh giá từ cán bộ đào tạo",
      label: "Cán bộ đánh giá",
    },
    {
      id: "2",
      value: "Phản ánh từ sinh viên",
      label: "Cán bộ đánh giá",
    },
    { id: "3", value: "Khác", label: "Khác" },
  ];

  const schema = yup.object().shape({
    title: yup.string().required("Chưa nhập tiêu đề"),
    date: yup
      .date()
      .typeError("Chưa nhập ngày đánh giá")
      .max(new Date(), "Ngày không được lớn hơn ngày hiện tại"),
    type: yup.string().required("Chưa chọn loại đánh giá"),
    content: yup.string().required("Chưa nhập nội dung đánh giá"),
  });

  const resolvedSchema = yupResolver(schema);
  const { handleSubmit, control, reset } = useForm({
    resolver: resolvedSchema,
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  function convertDateFormat(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
    return `${year}-${month}`;
  }

  useEffect(() => {
    if (evaluation) {
      const formValues = {
        title: evaluation.title,
        content: evaluation.content,
        date: evaluation.date,
        type: evaluation.type,
      };
      reset(formValues);
    }
  }, [evaluation, reset]);

  return (
    <form onSubmit={handleSubmit(submission, (error) => console.log(error))}>
      <Box
        className="formBox"
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(1, 1fr)",
        }}
      >
        <Box className="formArea" sx={{ width: "100%", gridColumn: "span 4" }}>
          <MyTextField
            className="formField"
            label={"Tiêu đề"}
            name="title"
            control={control}
          />
        </Box>
        <Box className="formArea" sx={{ gridColumn: "span 2", width: "100%" }}>
          <MyDateTimeField
            className="formField"
            label={"Ngày đánh giá"}
            name="date"
            control={control}
            type="date"
          />
        </Box>
        <Box className="formArea" sx={{ gridColumn: "span 2", width: "100%" }}>
          <MySelectField
            className="formField"
            label={"Loại đánh giá"}
            name="type"
            options={typeOptions}
            control={control}
          />
        </Box>

        <Box className="formArea" sx={{ width: "100%", gridColumn: "span 4" }}>
          <MyDescriptionField
            className="formField"
            label={"Chi tiết đánh giá"}
            name="content"
            rows={4}
            control={control}
          />
        </Box>

        <Box className="formArea" sx={{ gridColumn: "span 4", width: "100%" }}>
          <MyButton type="submit" fullWidth label={"Submit"}></MyButton>
        </Box>
      </Box>
    </form>
  );
}
