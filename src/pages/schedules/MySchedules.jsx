import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AxiosInstance from "../../components/AxiosInstance";

import { Box, IconButton, Typography, Grid } from "@mui/material";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import MyButton from "../../components/forms/MyButton";
import MyMultiSelectField from "../../components/forms/MyMultiSelectField";
import MyDateTimeField from "../../components/forms/MyDateTimeField";
import MyModal from "../../components/utils/MyModal";
import ScheduleInfoForm from "../../components/full_forms/ScheduleInfoForm";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useForm } from "react-hook-form";
import { format } from "date-fns-tz";
import { isSameDay, addDays, isAfter, isBefore, getDay, isEqual } from "date-fns";
import { WindowScrollController } from "@fullcalendar/core/internal";

const MySchedules = () => {
  const params = useParams();
  const lecturer_id = params.id;

  const [currentLecturer, setCurrentLecturer] = useState({});
  const [schedules, setSchedules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalContent, setModalContent] = useState();

  const handleOpen = (info) => {
    setOpen(true);
    setSelectedDate(info?.dateStr);
    console.log(info?.dateStr);
  };
  const handleClose = () => setOpen(false);

  const fromDateChange = (newDate) => {
    setFromDate(newDate);
  };

  const toDateChange = (newDate) => {
    setToDate(newDate);
  };

  const getData = () => {
    AxiosInstance.get(`lecturers/${lecturer_id}/`).then((res) => {
      setCurrentLecturer(res.data);
    });
    AxiosInstance.get(`schedules/me/`).then((res) => {
      setSchedules(res.data);
      console.log(res.data);
      setSelectedSubjects([
        ...new Set(res.data.map((schedule) => schedule.classNames)),
      ]);
    });
    AxiosInstance.get("subjects/").then((res) => {
      setSubjects(res.data);
    });
  };

  useEffect(() => {
    getData();
  }, []); // get data on initial load page

  const filteredSchedules = schedules.filter(
    (schedule) =>
      selectedSubjects.includes(schedule.classNames) &&
      (!fromDate || isAfter(schedule.start, fromDate) || isEqual(schedule.start, fromDate)) &&
      (!toDate || isBefore(schedule.end, toDate) || isEqual(schedule.end, fromDate))
  );

  const { control } = useForm({});

  // Hàm tạo màu từ tên
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 30%)`; // sáng, dễ nhìn
    return color;
  };

  const subjectOptions = subjects.map((subject) => ({
    id: subject.name,
    value: subject.name,
    name: subject.name,
  }));

  

  console.log(filteredSchedules);

  

  // Gửi dữ liệu về backend
  const timeZone = "Asia/Bangkok";
  const createSubmission = (data) => {
    console.log("Form submitted with data:", data);
    // Parse dates
    const fromDate = data.from_date;
    const toDate = data.to_date;
    const weekday = fromDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    // Parse times
    const [startHour, startMinute] = data.start.split(":").map(Number);
    const [endHour, endMinute] = data.end.split(":").map(Number);
    // Generate all matching dates
    let current = fromDate;
    const schedulesToCreate = [];
    while (!isAfter(current, toDate) || current == toDate) {
      console.log(current);
      if (current.getDay() === weekday) {
        // Combine date and time for start and end
        const startDateTime = new Date(current);
        startDateTime.setHours(startHour, startMinute, 0, 0);
        const endDateTime = new Date(current);
        endDateTime.setHours(endHour, endMinute, 0, 0);
        const selectedSubjectId = subjects.find(
          (subject) => subject.name == data.subject
        ).id;
        schedulesToCreate.push({
          start: format(startDateTime, "yyyy-MM-dd'T'HH:mm:ssXXX", {
            timeZone,
          }),
          end: format(endDateTime, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
          lecturer: currentLecturer.id,
          subject: selectedSubjectId,
          place: data.place,
          notes: data.notes,
          title: `${data.subject} - ${data.place}`,
        });
      }
      current = addDays(current, 7);
    }
    // Send all schedules to backend (batch or one by one)
    Promise.all(
      schedulesToCreate.map((schedule) =>
        AxiosInstance.post("schedules/", schedule)
      )
    )
      .then(() => {
        alert("Schedules created");
        setTimeout(window.location.reload(), 1500);
      })
      .catch((error) => {
        console.error("Error details:", error.response?.data || error);
      });
  };

  const editSubmission = async (data) => {
    // Parse dates and weekday
    const fromDate = data.from_date;
    const toDate = data.to_date;
    const weekday = fromDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Parse times
    const [startHour, startMinute] = data.start.split(":").map(Number);
    const [endHour, endMinute] = data.end.split(":").map(Number);

    // Find all schedules to update
    const schedulesToEdit = schedules.filter((schedule) => {
      const scheduleDate = schedule.start;
      return (
        (isAfter(scheduleDate, fromDate) || isSameDay(scheduleDate, fromDate)) &&
        (isBefore(scheduleDate, toDate) || isSameDay(scheduleDate, toDate)) &&
        getDay(scheduleDate) === weekday
      );
    });

    // Prepare PATCH requests for each schedule
    const updatePromises = schedulesToEdit.map((schedule) => {
      // Combine date and time for new start/end
      const scheduleDate = schedule.start;
      const newStart = new Date(scheduleDate);
      newStart.setHours(startHour, startMinute, 0, 0);
      const newEnd = new Date(scheduleDate);
      newEnd.setHours(endHour, endMinute, 0, 0);

      const selectedSubjectId = subjects.find(
          (subject) => subject.name == data.subject
        ).id;

      return AxiosInstance.patch(`schedules/${schedule.id}/`, {
        start_time: format(newStart, "yyyy-MM-dd'T'HH:mm:ssXXX", {
            timeZone,
        }),
        end_time: format(newEnd, "yyyy-MM-dd'T'HH:mm:ssXXX", {
            timeZone,
        }),
        subject: selectedSubjectId,
        place: data.place,
        notes: data.notes,
      });
    });

    try {
      await Promise.all(updatePromises);
      alert("Cập nhật lịch thành công!");
      window.location.reload();
    } catch (error) {
      console.error("Update error:", error);
      alert("Có lỗi xảy ra khi cập nhật lịch.");
    }
  };

  const deleteSubmission = async (data) => {
    alert("Bạn có chắc muốn xóa lịch học không?")
    // Parse dates and weekday
    const fromDate = data.from_date;
    const toDate = data.to_date;
    const weekday = fromDate.getDay(); // 0 = Sunday, 1 = Monday, etc.


    // Find all schedules to update
    const schedulesToDelete = schedules.filter((schedule) => {
      const scheduleDate = schedule.start;
      return (
        (isAfter(scheduleDate, fromDate) || isSameDay(scheduleDate, fromDate)) &&
        (isBefore(scheduleDate, toDate) || isSameDay(scheduleDate, toDate)) &&
        getDay(scheduleDate) === weekday
      );
    });

    
  const deletePromises = schedulesToDelete.map((schedule) =>
    AxiosInstance.delete(`schedules/${schedule.id}/`)
  );

    try {
      await Promise.all(deletePromises);
      alert("Xóa lịch dạy thành công!");
      window.location.reload();
    } catch (error) {
      console.error("Update error:", error);
      alert("Có lỗi xảy ra khi xóa lịch.");
    }
  };

  

  const scheduleClickAction = (info) => {
    handleOpen(info);
    setModalTitle("Thông tin lịch giảng");
    setModalContent(
      <ScheduleInfoForm
        subjects={subjects}
        startTime={format(info.event.start, "HH:mm")}
        endTime={format(info.event.end, "HH:mm")}
        fromDate={format(info.event.start, "yyyy-MM-dd")}
        subjectId={info.event.extendedProps.subject}
        place={info.event.extendedProps.place}
        notes={info.event.extendedProps.notes}
        readOnly={true}
      />
    );
    console.log(info);
  };



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
            Lịch giảng dạy của giảng viên {currentLecturer.name}
          </Typography>
        </Box>
        <Box>

        </Box>
      </Box>
      <MyModal
        open={open}
        handleClose={handleClose}
        title={modalTitle}
        content={modalContent}
      />
      <Box
        sx={{
          padding: "20px",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <Box sx={{ width: "33%", margin: "12px", marginTop: 0 }}>
          <MyMultiSelectField
            label={"Môn học"}
            control={control}
            name={"Subject"}
            options={subjectOptions}
            selectedValues={selectedSubjects}
            onChange={(e) => {
              setSelectedSubjects(e.target.value);
              console.log("Selected: ", selectedSubjects);
            }}
          />
        </Box>
        <Box sx={{ width: "33%", margin: "12px" }}>
          <MyDateTimeField
            label={"Từ"}
            type="date"
            control={control}
            name="from"
            onChange={(e) => {
              fromDateChange(e.target.value);
            }}
          />
        </Box>
        <Box sx={{ width: "33%", margin: "12px" }}>
          <MyDateTimeField
            label={"Đến"}
            type="date"
            control={control}
            name="to"
            sx={{ height: "85px" }}
            onChange={(e) => {
              toDateChange(e.target.value);
            }}
          />
        </Box>
      </Box>
      <Box sx={{ padding: "20px" }}>
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,today,next",
            center: "title",
            right: "listDay,timeGridWeek,dayGridMonth",
          }}
          events={filteredSchedules}
          // màu theo tên môn học
          eventDidMount={(info) => {
            const className = info.event.classNames[0];
            if (className) {
              const color = stringToColor(className);
              info.el.style.backgroundColor = color;
            }
          }}
          eventClick={scheduleClickAction}
          slotDuration="00:15:00"
          snapDuration="00:15:00"
          slotLabelInterval="01:00"
          slotMinTime="07:00:00"
          validRange={{
            start: fromDate,
            end: toDate,
          }}
        />
      </Box>
    </div>
  );
};

export default MySchedules;
