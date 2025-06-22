import AxiosInstance from "../components/AxiosInstance";
import { React, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import MyPieChart from "../components/charts/PieChart";
import PeopleIcon from '@mui/icons-material/People';
import MyBarChart from "../components/charts/BarChart";
import MyChartBox from "../components/charts/ChartBox";
import StaffHome from "./home/StaffHome";
import PotentialHome from "./home/PotentialHome";

const Home = () => {
  const role = localStorage.getItem("Role") || "";
  return (
    <div>
      <Box
        className="topbar"
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            sx={{ marginLeft: "15px", fontWeight: "bold" }}
            variant="heading"
          >
            Chào mừng bạn đến với hệ thống quản lý giảng viên!
          </Typography>
        </Box>
        <Box></Box>
      </Box>
      {['it_faculty', 'education_department', 'supervision_department','lecturer'].includes(role) && (
        <StaffHome/>
      )}
      {role === 'potential_lecturer' && (
        <PotentialHome/>
      )}
      {role === 'lecturer' && (
        <Typography variant="h6" sx={{ textAlign: "center", margin: "20px 0" }}>
          
        </Typography>
      )}
        

    </div>
  );
};

export default Home;
