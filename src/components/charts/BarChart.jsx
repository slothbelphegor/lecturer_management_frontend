import { React } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import MyChartBox from './ChartBox';
import AxiosInstance from "../AxiosInstance";
import { rainbowSurgePaletteLight } from "@mui/x-charts";


export default function MyBarChart({myData}) {
  return (
    <>
        <BarChart
            xAxis={[{ 
                data: myData?.map((item) => item.name) || [] ,
            }]}
            series={[{
                data: myData?.map((item) => item.lecturer_count) || [],
            }]}
            height={300}
            colors={rainbowSurgePaletteLight}
        />
    </>
  );
}
