import AxiosInstance from "../../components/AxiosInstance";
import { React, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import MyPieChart from "../../components/charts/PieChart";
import PeopleIcon from '@mui/icons-material/People';
import MyBarChart from "../../components/charts/BarChart";
import MyChartBox from "../../components/charts/ChartBox";

const PotentialHome = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [currentLecturer, setCurrentLecturer] = useState({});
  const [hasInfo, setHasInfo] = useState(false);
  const getData = () => {
    AxiosInstance.get(`lecturers/me`)
      .then((res) => {
        setCurrentLecturer(res.data);
        setHasInfo(res.data && res.data.id);
      })
      .catch((error) => {
        console.log(error.response.data);
        setHasInfo(false)
      });
  };

  useEffect(() => {
    getData();
  }, []); // get data on initial load page
  return (
    <div>
      <Typography variant="h6" sx={{ textAlign: "left", margin: "20px 0" }}>
        Xin chào!
      </Typography>
      {!hasInfo ? (
        <Typography variant="h7" sx={{ textAlign: "center", marginBottom: "20px" }}>
            Bạn là giảng viên tiềm năng, hãy cập nhật thông tin cá nhân của bạn để có thể được xét duyệt trở thành giảng viên chính thức.
        </Typography>
      ) : (
        <>
        <Typography variant="h7" sx={{ textAlign: "center", marginBottom: "20px" }}>
            Bạn đã cập nhật thông tin cá nhân, hãy chờ đợi để được xét duyệt trở thành giảng viên chính thức.
        </Typography>
        <br/>
        <Typography variant="h7" sx={{ textAlign: "center", marginBottom: "20px" }}>
            Tình trạng hồ sơ của bạn: {currentLecturer.status}
        </Typography>
        </>
        
        
      )}
      
      

    </div>
  );
};

export default PotentialHome;
