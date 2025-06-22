import { React, useState } from "react";
import { format } from "date-fns";
import { Box, Typography } from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import InputAdornment from "@mui/material/InputAdornment";
import MyTextField from "../forms/MyTextField";
import MyButton from "../forms/MyButton";
import MyDescriptionField from "../forms/MyDescriptionField";
import MySelectField from "../forms/MySelectField";
import MyDateTimeField from "../forms/MyDateTimeField";
import MyMultiSelectField from "../forms/MyMultiSelectField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import AxiosInstance from "../AxiosInstance";

export default function ScheduleInfoForm({
  subjects,
  startTime,
  endTime,
  fromDate,
  submission,
  subjectId,
  place,
  notes,
  hasDeleteButton,
  deleteSubmission,
  readOnly,
}) {
  console.log(subjects);
  const subjectOptions = subjects.map((subject) => ({
    id: subject.name,
    value: subject.name,
    name: subject.name,
  }));

  useEffect(() => {
    const formValues = {};
    startTime ? (formValues["start"] = startTime) : "";
    endTime ? (formValues["end"] = endTime) : "";
    fromDate ? (formValues["from_date"] = fromDate) : "";
    formValues["to_date"] = fromDate;
    subjectId
      ? (formValues["subject"] = subjects.find(
          (item) => item.id == subjectId
        ).name)
      : "";
    place ? (formValues["place"] = place) : "";
    notes ? (formValues["notes"] = notes) : "";
    reset(formValues);
  }, []);

  const schema = yup.object().shape({
    subject: yup.string().required("Chưa chọn môn học"),
    start: yup.string().required("Chưa chọn giờ bắt đầu"),
    end: yup.string().required("Chưa chọn giờ kết thúc"),
    from_date: yup.date().typeError("Chưa chọn ngày bắt đầu"),
    to_date: yup.date().typeError("Chưa chọn ngày kết thúc"),
    place: yup.string().required("Chưa chọn phòng học")
  });

  const resolvedSchema = yupResolver(schema);
  const { handleSubmit, control, register, getValues, watch, reset } = useForm({
    resolver: resolvedSchema,
  });
  if (readOnly) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Box>
            <MyTextField
              className="formField"
              label={"Môn học"}
              name="subject"
              control={control}
              disabled={true}

            />
          </Box>
          <Box>
            <MyTextField
              type="time"
              className="formField"
              label={"Giờ bắt đầu"}
              name="start"
              control={control}
              disabled={true}
            />
          </Box>
          <Box>
            <MyTextField
              type="time"
              className="formField"
              label={"Giờ kết thúc"}
              name="end"
              control={control}
              disabled={true}
            />
          </Box>
          
          <Box>
            <MyTextField
              className="formField"
              label={"Phòng dạy"}
              name="place"
              control={control}
              disabled={true}
            />
          </Box>
          <Box>
            <MyDescriptionField
              className="formField"
              label={"Ghi chú"}
              name="notes"
              control={control}
              rows={2}
              disabled={true}
            />
          </Box>

        </Box>
    );
  } else {
    return (
      <form
        onSubmit={handleSubmit(submission, (errors) =>
          console.log("Validation Errors:", errors)
        )}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Box>
            <MySelectField
              className="formField"
              label={"Môn học"}
              name="subject"
              control={control}
              options={subjectOptions}
            />
          </Box>
          <Box>
            <MyDateTimeField
              type="time"
              className="formField"
              label={"Giờ bắt đầu"}
              name="start"
              control={control}
            />
          </Box>
          <Box>
            <MyDateTimeField
              type="time"
              className="formField"
              label={"Giờ kết thúc"}
              name="end"
              control={control}
            />
          </Box>
          <Box>
            <MyDateTimeField
              type="date"
              className="formField"
              label={"Từ ngày"}
              name="from_date"
              control={control}
            />
          </Box>
          <Box>
            <MyDateTimeField
              type="date"
              className="formField"
              label={"Đến ngày"}
              name="to_date"
              control={control}
            />
          </Box>
          <Box>
            <MyTextField
              className="formField"
              label={"Phòng dạy"}
              name="place"
              control={control}
            />
          </Box>
          <Box>
            <MyDescriptionField
              className="formField"
              label={"Ghi chú"}
              name="notes"
              control={control}
              rows={2}
            />
          </Box>

          <Box>
            <MyButton type="submit" fullWidth label={"Submit"}></MyButton>
          </Box>
          {hasDeleteButton ? (
            <MyButton
              type={"button"}
              label={"Delete"}
              sx={{ backgroundColor: "red" }}
              onClick={handleSubmit(deleteSubmission)}
            />
          ) : null}
        </Box>
      </form>
    );
  }
}
