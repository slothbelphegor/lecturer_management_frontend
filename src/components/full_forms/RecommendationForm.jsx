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
import MyMultiSelectField from "../forms/MyMultiSelectField";

export default function RecommendationForm({ recommendation, submission }) {
  const [subjects, setSubjects] = useState([]);
  const role = localStorage.getItem("Role") || ""; // Get role from local storage
  const isChecking = role === "it_faculty" || role === "education_department";
  const statusOptions = [
    {
      id: "1",
      value: "Chưa được duyệt",
      label: "Chưa được duyệt",
    },
    {
      id: "2",
      value: "Đang liên hệ",
      label: "Đang liên hệ",
    },
    {id: "3", value: "Đã đăng ký", label: "Đã duyệt" },
    
    { id: "4", value: "Đã từ chối", label: "Đã từ chối" },
  ];

  const schema = yup.object().shape({
    name: yup.string().required("Chưa nhập tên giảng viên"),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Chưa nhập email"),
    phone_number: yup
        .string()
        .required("Chưa nhập số điện thoại")
        .matches(/^\+?[0-9]{7,14}$/, "Số điện thoại không hợp lệ"),
    workplace: yup.string().required("Chưa nhập nơi công tác"),
    content: yup.string().required("Chưa nhập mô tả sơ bộ về giảng viên"),
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
    AxiosInstance.get("subjects/").then((res) => {
        setSubjects(res.data);
        console.log(res.data);
    });
    if (recommendation) {
      const formValues = {
        name: recommendation.name,
        content: recommendation.content,
        subjects: recommendation.subjects,
        workplace: recommendation.workplace,
        email: recommendation.email,
        phone_number: recommendation.phone_number,
        status: recommendation.status,
      };
      reset(formValues);
    }
  }, [recommendation, reset]);

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
            label={"Tên giảng viên được giới thiệu"}
            name="name"
            disabled={isChecking}
            control={control}
          />
        </Box>
        <Box className="formArea" sx={{ width: "100%", gridColumn: "span 2" }}>
          <MyTextField
            className="formField"
            label={"Email"}
            name="email"
            control={control}
            disabled={isChecking}
          />
        </Box>
        <Box className="formArea" sx={{ width: "100%", gridColumn: "span 2" }}>
          <MyTextField
            className="formField"
            label={"Số điện thoại"}
            name="phone_number"
            disabled={isChecking}
            control={control}
          />
        </Box>
        <Box className="formArea" sx={{ width: "100%", gridColumn: "span 4" }}>
          <MyTextField
            className="formField"
            label={"Nơi công tác"}
            name="workplace"
            disabled={isChecking}
            control={control}
          />
        </Box>
        <Box className="formArea" sx={{ gridColumn: "span 4", width: "100%" }}>
          <MyMultiSelectField
            className="formField"
            label={"Các môn học giảng dạy"}
            name="subjects"
            options={subjects}
            disabled={isChecking}
            control={control}
          />
        </Box>

        <Box className="formArea" sx={{ width: "100%", gridColumn: "span 4" }}>
          <MyDescriptionField
            className="formField"
            label={"Mô tả sơ bộ về giảng viên (bằng cấp, kinh nghiệm, v.v.)"}
            name="content"
            rows={4}
            disabled={isChecking}
            control={control}
          />
        </Box>
        
          <Box className="formArea" sx={{ width: "100%", gridColumn: "span 4" }}>
            <MySelectField
              className="formField"
              label={"Tình trạng hồ sơ"}
              name="status"
              options={statusOptions}
              control={control}
              disabled={!isChecking}
            />
          </Box>
        

        <Box className="formArea" sx={{ gridColumn: "span 4", width: "100%" }}>
          <MyButton type="submit" fullWidth label={"Submit"}></MyButton>
        </Box>
      </Box>
    </form>
  );
}
