import AxiosInstance from "../../components/AxiosInstance";
import { React, useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import {format} from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import MyMessage from "../../components/Message";
import EvaluationForm from "../../components/full_forms/EvaluationForm";

export default function EditEvaluation() {
    const params = useParams();
    const evaluation_id = params.id;
    const [currentEvaluation, setCurrentEvaluation] = useState({});
    const [showMessage, setShowMessage] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");

    const getData = () => {
        AxiosInstance.get(`evaluations/${evaluation_id}/`).then((res) => {
            setCurrentEvaluation(res.data);
            console.log(res.data);
        });
    }

    const navigate = useNavigate();

    const submission = (data) => {
        const sentData = {
            title: data.title,
            date: format(new Date(data.date), 'yyyy-MM-dd'),
            type: data.type,
            content: data.content,
            lecturer: currentEvaluation.lecturer
        }
        console.log("Payload:", sentData);
        AxiosInstance.put(`evaluations/${evaluation_id}/`, sentData)
            .then(() => {
                setIsError(false);
                setMessage("Cập nhật đánh giá thành công");
                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            })
            .catch((error) => {
                setMessage("Có lỗi xảy ra khi cập nhật đánh giá.");
                setIsError(true);
                console.error(error.response.data);
            })
      .finally(() => {
        setShowMessage(true);
      });
    }

    useEffect(() => {
        getData();
    }, []); // get data on initial load page

    return (
        <div>
            <Box className="topbar">
                <EditIcon />
                <Typography
                sx={{ marginLeft: "15px", fontWeight: "bold" }}
                variant="subtitle2"
                >
                    Chỉnh sửa đánh giá
                </Typography>
            </Box>
            <EvaluationForm evaluation={currentEvaluation} submission={submission}/>
            {showMessage ? (
                <MyMessage
                text={message}
                color={isError ? "#EC5A76" : "green"}
                position={"static"}
                />
            ) : null}
        </div>
    )
}