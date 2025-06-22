import AxiosInstance from "../../components/AxiosInstance";
import { React, useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import {format} from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import InfoIcon from '@mui/icons-material/Info';
import MyMessage from "../../components/Message";
import EvaluationForm from "../../components/full_forms/EvaluationForm";
import RecommendationForm from "../../components/full_forms/RecommendationForm";

export default function EditRecommendation() {
    const params = useParams();
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
    }

    const navigate = useNavigate();

    const submission = (data) => {
        const sentData = {
            name: data.name,
            date: data.date,
            email: data.email,
            phone_number: data.phone_number,
            content: data.content,
            workplace: data.workplace,
            recommender: currentRecommendation.recommender,
            status: data.status,
            subjects: data.subjects,
        }
        console.log("Payload:", sentData);
        AxiosInstance.put(`recommendations/${recommendation_id}/`, sentData)
            .then(() => {
                setIsError(false);
                setMessage("Cập nhật đề xuất thành công");
                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            })
            .catch((error) => {
                setMessage("Có lỗi xảy ra khi cập nhật đề xuất.");
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
                <InfoIcon />
                <Typography
                sx={{ marginLeft: "15px", fontWeight: "bold" }}
                variant="subtitle2"
                >
                    Chi tiết đề xuất
                </Typography>
            </Box>
            <RecommendationForm recommendation={currentRecommendation} submission={submission}/>
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