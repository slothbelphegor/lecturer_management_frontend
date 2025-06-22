import { React, useEffect, useState } from "react";
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { cheerfulFiestaPaletteLight, mangoFusionPalette, rainbowSurgePaletteLight } from "@mui/x-charts";
import PeopleIcon from '@mui/icons-material/People';
import MyChartBox from './ChartBox';
import AxiosInstance from "../AxiosInstance";

export default function MyPieChart({myData}) {

  return (
    <>
        <PieChart
            series={[
              {
                arcLabel: (item) => `${item.value}%`,
                data: myData || []
                ,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: 'white',
                fontSize: 14,
              },
            }}
            width={200}
            height={200}
            colors={mangoFusionPalette}
          />
    </>
    
  );
}
