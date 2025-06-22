import AxiosInstance from "../../components/AxiosInstance";
import { React, useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import AddNewIcon from "@mui/icons-material/AddBox";
import InfoIcon from '@mui/icons-material/Info';
import MyTextField from "../../components/forms/MyTextField";
import MyButton from "../../components/forms/MyButton";
import MyMessage from "../../components/Message";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MySelectField from "../../components/forms/MySelectField";
import MyDateTimeField from "../../components/forms/MyDateTimeField";

const EditDocument = () => {
  
  const [showMessage, setShowMessage] = useState(false);
  const [currentDocument, setCurrentDocument] = useState({});
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const params = useParams();
  const document_id = params.id;
  const getData = () => {
    AxiosInstance.get(`documents/${document_id}/`).then((res) => {
      setCurrentDocument(res.data);
    });
  };
  useEffect(() => {
      getData();
    }, []); // get data on initial load page

  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    type: yup.string().required("Doc type is required"),
    file_link: yup.string()
      .required("File link is required")
      .matches(
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
        "File link must be a valid URL"
      ),
    published_at: yup
      .date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      ) // Transform empty string to null
      .max(new Date(), "Published date cannot be in the future"),
    valid_at: yup
      .date("Valid date must be a valid date value")
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      ) // Transform empty string to null
      .min(
        yup.ref("published_at"),
        "Valid date cannot be before the published date"
      ),
    published_by: yup.string(),
    signed_by: yup.string(),
  });

  const resolvedSchema = yupResolver(schema);
  const { handleSubmit, control } = useForm({
    resolver: resolvedSchema,
    values: {
      name: currentDocument.name,
      type: currentDocument.type,
      file_link: currentDocument.file_link,
      published_at: currentDocument.published_at,
      valid_at: currentDocument.valid_at,
      published_by: currentDocument.published_by,
      signed_by: currentDocument.signed_by,
    },
  });

  const submission = (data) => {
    AxiosInstance.put(`documents/${document_id}/`, {
      name: data.name,
      type: data.type,
      file_link: data.file_link,
      published_at: data.published_at == "" ? null : data.published_at,
      valid_at: data.valid_at == "" ? null : data.valid_at,
      published_by: data.published_by,
      signed_by: data.signed_by,
    })
      .then((res) => {
        console.log(res.data);
        setIsError(false);
        setMessage("Document updated successfully.");
        setTimeout(() => {
          // Refresh the page
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        setMessage("An error occurred while updating document.");
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
          Thông tin văn bản
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
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(1, 1fr)",
          }}
        >
          <Box
            className="formArea"
            sx={{ width: "100%", gridColumn: "span 3" }}
          >
            <MyTextField
              className="formField"
              label={"Name"}
              name="name"
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 1", width: "100%" }}
          >
            <MySelectField
              className="formField"
              label={"Type"}
              name="type"
              control={control}
              options={[
                { id: "1", value: "Đề cương", label: "Đề cương" },
                { id: "2", value: "Biểu mẫu", label: "Biểu mẫu" },
                { id: "3", value: "Quy định", label: "Quy định" },
              ]}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 2", width: "100%" }}
          >
            <MyDateTimeField
              className="formField"
              label={"Published At"}
              name="published_at"
              type="date"
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 2", width: "100%" }}
          >
            <MyDateTimeField
              className="formField"
              label={"Valid At"}
              name="valid_at"
              type="date"
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 2", width: "100%" }}
          >
            <MyTextField
              className="formField"
              label={"Published By"}
              name="published_by"
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 2", width: "100%" }}
          >
            <MyTextField
              className="formField"
              label={"Signed By"}
              name="signed_by"
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 4", width: "100%" }}
          >
            <MyTextField
              className="formField"
              label={"File URL"}
              name="file_link"
              control={control}
            />
          </Box>

          <Box
            className="formArea"
            sx={{ gridColumn: "span 4", width: "100%" }}
          >
            <MyButton type="submit" fullWidth label={"Submit"}></MyButton>
          </Box>
        </Box>
      </form>
    </div>
  );
};

export default EditDocument;
