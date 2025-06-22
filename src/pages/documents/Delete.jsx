import AxiosInstance from "../../components/AxiosInstance";
import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import AddNewIcon from "@mui/icons-material/AddBox";
import MyButton from "../../components/forms/MyButton";
import MyMessage from "../../components/Message";

const DeleteDocument = () => {
  const navigate = useNavigate();
  const [currentDocument, setCurrentDocument] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  
  const params = useParams();
  const document_id = params.id;
  const getData = () => {
    AxiosInstance.get(`document/${document_id}/`).then((res) => {
      setCurrentDocument(res.data);
      console.log(res.data);
    });
  };
  useEffect(() => {
    getData();
  }, []); // get data on initial load page

  const deleteRecord = (event) => {
    event.preventDefault();
    AxiosInstance.delete(`documents/${document_id}/`)
      .then(() => {
        setIsError(false);
        setMessage("Document deleted successfully. Redirecting...");
        setTimeout(() => {
          navigate("/documents");
        }, 1500);
      })
      .catch((error) => {
        setMessage("An error occurred while deleting the document.");
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
          Are you sure that you want to delete this document?
        </Typography>
      </Box>
      {message.localeCompare("") ? (
        <MyMessage text={message} color={isError ? "#EC5A76" : "green"} position={"static"}/>
      ) : null}
      <form onSubmit={deleteRecord}>
        <Box className="formBox" sx={{display: "flex", flexDirection: "column"}} onSubmit={deleteRecord}>
          <Box className="formArea">
            <Typography>
              You will delete <strong>{currentDocument.name}.</strong>{" "} of type{" "}
              <strong>{currentDocument.type}</strong>.
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

export default DeleteDocument;
