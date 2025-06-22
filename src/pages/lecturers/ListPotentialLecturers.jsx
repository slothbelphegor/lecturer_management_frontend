import { React, useMemo, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import AxiosInstance from "../../components/AxiosInstance";

import { Box, Chip, IconButton, Typography } from "@mui/material";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MyButton from "../../components/forms/MyButton";
import { MaterialReactTable } from "material-react-table";
import { RoleContext } from "../../components/RoleContext";

const ListPotentialLecturer = () => {
  const [lecturers, setLecturers] = useState([]);
  //const { role } = useContext(RoleContext)
  const role = localStorage.getItem("Role") || ""; // Default to 'education_department' if Role is not set
  // Su dung Axios lay du lieu tu backend
  const getData = () => {
    AxiosInstance.get("lecturers/potential_lecturers/").then((res) => {
      setLecturers(res.data);
    });
  };
  // Lay du lieu ngay khi tai trang
  useEffect(() => {
    getData();
  }, []); 
  // Khai bao cac cot của bang
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Tên",
      },
      {
        'accessorKey': "date",
        'header': "Ngày đăng ký"
      },
      {
        accessorKey: "degree",
        header: "Học vị",
      },
      {
        accessorKey: "title",
        header: "Học hàm",
      },
      {
        accessorKey: "workplace",
        header: "Nơi công tác",
        // max length of 10 characters
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return value?.length > 10 ? value.slice(0, 50) + "..." : value;
        },
      },
      {
        accessorKey: "subject_names",
        header: "Môn học",
        Cell: ({ cell }) => (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {cell.getValue()?.map((char, index) => (
              <Chip key={index} label={char} />
            ))}
          </div>
        ),
      },
      {
        'accessorKey': "status",
        'header': "Tình trạng hồ sơ"
      },
      
      {
        accessorKey: "recommender_details.full_name",
        header: "Người giới thiệu",
        // max length of 10 characters
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return value?.length > 10 ? value.slice(0, 50) + "..." : value;
        },
      },
    ],
    []
  );
  return (
    <div>
      <Box
        className="topbar"
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CalendarViewMonthIcon />
          <Typography
            sx={{ marginLeft: "15px", fontWeight: "bold" }}
            variant="subtitle2"
          >
            Danh sách giảng viên đăng ký thỉnh giảng
          </Typography>
        </Box>
      </Box>
      <MaterialReactTable
        columns={columns}
        data={lecturers} // Nap du lieu vao bang
        initialState={{
          columnVisibility: {
            id: false,
            degree: false,
            title: false,
            email: false,
            date: true,
            "recommender_details.full_name": false,
          },
        }}
        enableRowActions
        positionActionsColumn={"last"}
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
            {["it_faculty", "education_department"].includes(role) && (
            <IconButton
              color="primary"
              component={Link}
              to={`/lecturers/check/${row.original.id}`}
            >
              <CheckCircleIcon />
            </IconButton>
            )}
            
            {role === "education_department" && (
            <IconButton
              color="error"
              component={Link}
              to={`/lecturers/delete/${row.original.id}`}
            >
              <DeleteIcon />
            </IconButton>
            )}
          </Box>
        )}
        enableExpanding
        renderDetailPanel={({ row }) => (
          <Box sx={{ padding: 2, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6">Thông tin chi tiết</Typography>
            <Typography variant="body1">
              <strong>Tên:</strong> {row.original.name}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {row.original.email}
            </Typography>
            <Typography variant="body1">
              <strong>Số điện thoại:</strong> {row.original.phone_number}
            </Typography>
            <Typography variant="body1">
              <strong>Nơi công tác:</strong> {row.original.workplace}
            </Typography>
            <Typography variant="body1">
              <strong>Môn học:</strong> {row.original.subject_names.join(", ")}
            </Typography>
          </Box>
        )}
      />
    </div>
  );
};

export default ListPotentialLecturer;
