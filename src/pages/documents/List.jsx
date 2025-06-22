import { React, useMemo, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import AxiosInstance from "../../components/AxiosInstance";

import { Box, IconButton, Typography, Grid } from "@mui/material";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import MyButton from "../../components/forms/MyButton";
import InfoIcon from '@mui/icons-material/Info';
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import { MaterialReactTable } from "material-react-table";

const ListDocument = () => {
  const [documents, setDocuments] = useState([]);
  //const { role } = useContext(RoleContext);
  const role = localStorage.getItem("Role") || ""; // Default to 'education_department' if Role is not set
  const getData = () => {
    AxiosInstance.get("documents/").then((res) => {
      setDocuments(res.data);
    });
  };

  useEffect(() => {
    getData();
  }, []); // get data on initial load page

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Tên tài liệu",
        size: 250,
      },
      {
        accessorKey: "type",
        header: "Loại tài liệu",
        size: 40,
      },
      {
        accessorKey: "published_at",
        header: "Ngày công bố",

      },
      {
        accessorKey: "valid_at",
        header: "Có hiệu lực từ",
        
      },
      {
        accessorKey: "published_by",
        header: "Công bố bởi",
      },
      {
        accessorKey: "signed_by",
        header: "Người ký",
        
      },
      
    ],
    []
  );
  return (
    <div>
      <Box className="topbar"sx={{
        display: "flex",
        justifyContent: "space-between",
      }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CalendarViewMonthIcon />
            <Typography
              sx={{ marginLeft: "15px", fontWeight: "bold" }}
              variant="subtitle2"
            >
              Danh sách văn bản
            </Typography>
        </Box>
        {['education_department', 'it_faculty'].includes(role) && (
          <Box>
            <MyButton
              type="button"
              label="Thêm văn bản"
              onClick={() => {
                window.location.href = `/documents/create`;
              }}
            />
          </Box>
        )}
        
      </Box>

      <MaterialReactTable
        columns={columns}
        data={documents}
        // columns shrink to fit the screen

        initialState={{
          density: "compact", // Kích thước compact 
          columnVisibility: {
            published_at: false, 
            valid_at: false, 
            published_by: false,
            signed_by: false, 
          },
        }}
        enableColumnActions={true}
        enableColumnFilters={true}
        enablePagination={true}
        enableSorting={true}
        enableRowActions
        positionActionsColumn={'last'}
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
            <IconButton
              color="primary"
              component={Link}
              to={`${row.original.file_link}`}
            >
              <FileDownloadIcon />
            </IconButton>
            {["education_department",'it_faculty'].includes(role) && 
            <>
            <IconButton
              color="primary"
              component={Link}
              to={`/documents/edit/${row.original.id}`}
            >
              <InfoIcon />
            </IconButton>
            <IconButton
              color="error"
              component={Link}
              to={`/documents/delete/${row.original.id}`}
            >
              <DeleteIcon />
            </IconButton>
            </>}
            
          </Box>
        )}
        enableExpanding
        renderDetailPanel={({ row }) => (
          <Box sx={{ padding: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>

                <Typography variant="body2">
                  <strong>Ngày xuất bản:</strong>{" "}
                  {row.original.published_at
                    ? new Date(row.original.published_at).toDateString()
                    : "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Ngày có hiệu lực:</strong>{" "}
                  {row.original.valid_at
                    ? new Date(row.original.valid_at).toDateString()
                    : "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Công bố bởi:</strong>{" "}
                  {row.original.published_by || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Người ký:</strong> {row.original.signed_by || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
        getRowId={(row) => row.id} // Giả định document có trường 'id' duy nhất
        displayColumnDefOptions={{
          "mrt-row-expand": {
            Header: "", // Ẩn header
            size: 10, // Kích thước cột
            enableResizing: false,
            enableColumnActions: false,
            position: "last", // Đặt nút collapse ở đầu hàng
          },
          "mrt-row-actions": {
            // Cột actions
            Header: "", // Tùy chọn - thêm tiêu đề nếu muốn
            position: "last", // Luôn đặt ở cuối bảng
            size: 30, // Kích thước cột
          },
        }}
        muiTableBodyRowProps={{
          sx: {
            "&:hover td": {
              backgroundColor: "#f5f5f5",
            },
          },
        }}
        muiTablePaperProps={{
          sx: {
            boxShadow: "none",
            border: "1px solid #e0e0e0",
          },
        }}
        
        
      />
    </div>
  );
};

export default ListDocument;
