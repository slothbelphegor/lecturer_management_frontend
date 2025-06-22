import AxiosInstance from "../../components/AxiosInstance";
import { React, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import MyPieChart from "../../components/charts/PieChart";
import PeopleIcon from '@mui/icons-material/People';
import MyBarChart from "../../components/charts/BarChart";
import MyChartBox from "../../components/charts/ChartBox";
import MyStatBox from "../../components/statistics/MyStatBox";

const StaffHome = () => {
  const [subjectLecturerCount, setSubjectLecturerCount] = useState([]);
  const [degreeLecturerCount, setDegreeLecturerCount] = useState([]);
  const [titleLecturerCount, setTitleLecturerCount] = useState([]);
  const [allLecturersCount, setAllLecturersCount] = useState(0)
  const [potentialLecturersCount, setPotentialLecturersCount] = useState(0)
  const [pendingRecommendationsCount, setPendingRecommendations] = useState(0)
  const [pendingLecturers, setPendingLecturers] = useState(0)
  const role = localStorage.getItem("Role")
  const getData = () => {
    AxiosInstance.get(`subjects/lecturer_count/`)
      .then((res) => {
        setSubjectLecturerCount(res.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
    AxiosInstance.get(`lecturers/degree_count/`)
      .then((res) => {
        setDegreeLecturerCount(res.data)
      })
      .catch((error) => {
        console.log(error.response.data);
      })
    AxiosInstance.get(`lecturers/title_count/`)
      .then((res) => {
        setTitleLecturerCount(res.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
    AxiosInstance.get('lecturers/count_all_lecturers')
      .then((res) => {
        setAllLecturersCount(res.data)
      })
      .catch((error) => {
        console.log(error.response)
      })
    AxiosInstance.get('lecturers/count_potential_lecturers')
      .then((res) => {
        setPotentialLecturersCount(res.data)
      })
      .catch((error) => {
        console.log(error.response)
      })
    AxiosInstance.get(`recommendations/count_unchecked`)
      .then((res) => {
        setPendingRecommendations(res.data)
      })
      .catch((error) => {
        console.log(error.response)
      })
    AxiosInstance.get('lecturers/count_pending_lecturers')
      .then((res) => {
        setPendingLecturers(res.data)
      })
      .catch((error) => {
        console.log(error.response)
      })
  };

  useEffect(() => {
    getData();
  }, []); // get data on initial load page
  return (
    <div>
      <MyStatBox
        icon1={<PeopleIcon/>}
        title1={"Tổng số giảng viên đang công tác"}
        stat1={allLecturersCount}
        icon3={<PeopleIcon/>}
        title3={role == "it_faculty" ? "Số đề xuất thỉnh giảng đợi duyệt" : 
          role == "education_department" ? "Số hồ sơ thỉnh giảng đã hợp lệ" : null
        }
        stat3={role == "it_faculty" ? pendingRecommendationsCount : 
          role == "education_department" ? pendingLecturers : null
        }
        icon2={<PeopleIcon/>}
        title2="Số hồ sơ đăng ký thỉnh giảng đợi duyệt"
        stat2={['it_faculty', 'education_department'].includes(role) ? potentialLecturersCount : null}
      />
      
      <MyChartBox
        icon1={<PeopleIcon />}
        title1="Số lượng giảng viên theo môn học"
        chart1={<MyBarChart myData={subjectLecturerCount}/>}
      />
      <MyChartBox 
        icon2={<PeopleIcon />}
        title2="Tỉ lệ trình độ giảng viên"
        chart2={<MyPieChart myData={degreeLecturerCount?.map((item) => {
          return {
            value: item.percentage,
            label: item.degree
          }
        })}/>}
        icon3={<PeopleIcon/>}
        title3="Tỉ lệ học hàm giảng viên"
        chart3={<MyPieChart myData={titleLecturerCount?.map((item) => {
          return {
            value: item.percentage,
            label: item.title
          }
        })}/>}
        />
    </div>
  );
};

export default StaffHome;
