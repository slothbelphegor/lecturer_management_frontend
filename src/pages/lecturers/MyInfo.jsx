import AxiosInstance from "../../components/AxiosInstance";
import { React, useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import {format} from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import AddNewIcon from "@mui/icons-material/AddBox";
import InfoIcon from '@mui/icons-material/Info';
import MyMessage from "../../components/Message";
import LecturerInfoForm from "../../components/full_forms/LecturerInfoForm"


const MyInfo = () => {
  const params = useParams();
  const [currentLecturer, setCurrentLecturer] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [lecturers, setLecturers] = useState([]);

  const currentRole = localStorage.getItem("Role")
  const getData = () => {

    AxiosInstance.get("lecturers/").then((res) => {
      setLecturers(res.data);
    });
    if (currentRole == 'potential_lecturer') {
      AxiosInstance.get(`users/me/`).then((res) => {
        setCurrentUser(res.data);
        console.log(res.data)
      });
    }

      AxiosInstance.get(`lecturers/me/`).then((res) => {
        setCurrentLecturer(res.data);
        console.log(res.data);
    });
    
    
  };

  const navigate = useNavigate();
  const submission = (data) => {
    console.log("Form submitted with data:", data);
    const academics = {
      CN: {
        school_name: data.school_name_CN,
        major: data.major_CN,
        from: format(new Date(data.from_CN), 'yyyy-MM-dd'),
        to: format(new Date(data.to_CN), 'yyyy-MM-dd'),
        degree_granted_at: format(new Date(data.degree_granted_at_CN), 'yyyy-MM-dd'),
      },
      // include this only when degree is ThS or TS
      ThS: data.degree === "Thạc sĩ" || data.degree === "Tiến sĩ" ? {
        school_name: data.school_name_ThS,
        major: data.major_ThS,
        from: format(new Date(data.from_ThS), 'yyyy-MM-dd'),
        to: format(new Date(data.to_ThS), 'yyyy-MM-dd'),
        degree_granted_at: format(new Date(data.degree_granted_at_ThS), 'yyyy-MM-dd'),

      } : null,
      TS: data.degree === "Tiến sĩ" ? {
        school_name: data.school_name_TS,
        major: data.major_TS,
        from: format(new Date(data.from_TS), 'yyyy-MM-dd'),
        to: format(new Date(data.to_TS), 'yyyy-MM-dd'),
        degree_granted_at: format(new Date(data.degree_granted_at_TS), 'yyyy-MM-dd'),
      } : null,
    }
    
    const workExperiences = data.workExperiences?.map((exp) => ({
      organization: exp.organization,
      from: format(new Date(exp.from), 'yyyy-MM-dd'),
      to: format(new Date(exp.to), 'yyyy-MM-dd'),
    })) ;

    const researches = data.researches?.map((research) => ({
      name: research.name,
      year: research.year,
      position: research.position,
      level: research.level,
    }));

    const publishedWorks = data.publishedWorks?.map((work) => ({
      name: work.name,
      year: work.year,
      place: work.place,
    }));


    const sentData = {
      name: data.name,
      email: data.email,
      phone_number: data.phone,
      gender: data.gender,
      dob: format(new Date(data.dob), 'yyyy-MM-dd'),
      ethnic: data.ethnic,
      religion: data.religion,
      hometown: data.hometown,
      degree: data.degree,
      title: data.title,
      title_detail: data.title_detail,
      title_granted_at: format(new Date(data.title_granted_at), 'yyyy-MM-dd'),
      address: data.address,
      work_position: data.work_position,
      workplace: data.workplace,
      quota_code: data.quota_code === "Khác (nhập cụ thể)" ? data.other_quota_code : data.quota_code,
      salary_coefficient: data.salary_coefficient,
      salary_coefficient_granted_at: format(new Date(data.salary_coefficient_granted_at), 'yyyy-MM-dd'),
      recruited_at: format(new Date(data.recruited_at), 'yyyy-MM-dd'),
      years_of_experience: data.years_of_experience,
      exp_language: data.exp_language,
      exp_computer: data.exp_computer,
      exp_work: workExperiences,
      exp_academic: academics,
      researches: researches,
      published_works: publishedWorks,
      subjects: data.subjects,
      recommender: data.recommender,
      status: currentLecturer.status,
      user: currentLecturer.user,
    }
    console.log("Data to be sent:", sentData);
    if (currentRole == 'potential_lecturer' && !currentLecturer.user) {
      console.log('potential')
      sentData['status'] = 'Chưa duyệt hồ sơ'
      AxiosInstance.post(`lecturers/me/`, sentData)
        .then((res) => {
          console.log("Response data: ",res.data);
          setIsError(false);
          setMessage("Lý lịch đã được cập nhật.");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        })
        .catch((error) => {
          setMessage("Có lỗi xảy ra.");
          setIsError(true);
          console.error(error.response.data);
        })
        .finally(() => {
          setShowMessage(true);
        });
    }
    else {
      AxiosInstance.put(`lecturers/me/`, sentData)
        .then((res) => {
          console.log("Response data: ",res.data);
          setIsError(false);
          setMessage("Lecturer updated successfully.");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        })
        .catch((error) => {
          setMessage("An error occurred while creating the lecturer.");
          setIsError(true);
          console.error(error.response.data);
        })
        .finally(() => {
          setShowMessage(true);
        });
    }
    
  };
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
          Lý lịch bản thân
        </Typography>
      </Box>
      
      <LecturerInfoForm lecturer={currentLecturer} submission={submission} isSelfLecturer={true}/>
      {showMessage ? (
        <MyMessage
          text={message}
          color={isError ? "#EC5A76" : "green"}
          position={"static"}
        />
      ) : null}
    </div>
  );
};

export default MyInfo;
