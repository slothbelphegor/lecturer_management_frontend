import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Box, Typography } from "@mui/material";
import AddNewIcon from "@mui/icons-material/AddBox";


import AxiosInstance from "../../components/AxiosInstance";


const ScheduleDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const schedule_id = params.id;
    const [currentSchedule, setCurrentSchedule] = useState()

    const getData = () => {
        AxiosInstance.get(`schedules/${schedule_id}/`).then((res) => {
            setCurrentSchedule(res.data);
            console.log(res.data);
        });
    };
    useEffect(() => {
        getData();
      }, []); // get data on initial load page
    return <div>
        <Box className="topbar">
        <AddNewIcon />
        <Typography
          sx={{ marginLeft: "15px", fontWeight: "bold" }}
          variant="subtitle2"
        >
          Chi tiết giờ giảng
        </Typography>
      </Box>
        Schedule details
    </div>
}

export default ScheduleDetails