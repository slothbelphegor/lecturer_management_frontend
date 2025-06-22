import { React, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import AxiosInstance from "../../components/AxiosInstance";

import { Box, Chip, IconButton, Typography } from "@mui/material";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InfoIcon from '@mui/icons-material/Info';
import MyButton from "../../components/forms/MyButton";
import { MaterialReactTable } from "material-react-table";

const ListLecturer = () => {
  const [lecturers, setLecturers] = useState([]);
  const currentRole = localStorage.getItem("Role")
  
  // Su dung Axios lay du lieu tu backend
  const getData = () => {
    AxiosInstance.get("lecturers/").then((res) => {
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
        filterFn: (row, columnId, filterValue) => {
          const subjectNames = row.getValue(columnId) || [];
          if (!filterValue) return true;
          // filterValue can be a string or array, depending on your filter UI
          if (Array.isArray(filterValue)) {
            // Multi-select: check if any selected subject is in the row's subjects
            return filterValue.some(val =>
              subjectNames.some(subject => subject.toLowerCase().includes(val.toLowerCase()))
            );
          }
          // Single string: check if any subject includes the filter string
          return subjectNames.some(subject =>
            subject.toLowerCase().includes(filterValue.toLowerCase())
          );
        },
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
            Danh sách giảng viên
          </Typography>
        </Box>
        {currentRole === "education_department" && (
        <Box>
          <MyButton
            type="button"
            label="Thêm giảng viên"
            onClick={() => {
              window.location.href = `/lecturers/create`;
            }}
          />
        </Box>
        )}
        
      </Box>
      <MaterialReactTable
        columns={columns}
        data={lecturers} // Nap du lieu vao bang
        initialState={{
          columnVisibility: {
            degree: false,
            title: false,
            "recommender_details.full_name": false,
          },
        }}
        enableRowActions
        positionActionsColumn={"last"}
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
            {["it_faculty", "education_department"].includes(currentRole) && 
            <>
            <IconButton
              color="primary"
              component={Link}
              to={`/lecturers/edit/${row.original.id}`}
            >
              <InfoIcon />
            </IconButton>
            
            </>}
            {["it_faculty", "supervision_department"].includes(currentRole) && (
            <IconButton
              color="primary"
              component={Link}
              to={`/lecturers/${row.original.id}/evaluations`}
            >
              <ThumbUpIcon />
            </IconButton>
            )}
            
            <IconButton
              color="primary"
              component={Link}
              to={`/lecturers/${row.original.id}/schedules`}
            >
              <CalendarMonthIcon />
            </IconButton>

            {currentRole === "education_department" && (
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
            <Typography variant="h6">Thông tin liên lạc</Typography>
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
          </Box>
        )}
      />
    </div>
  );
};

export default ListLecturer;
