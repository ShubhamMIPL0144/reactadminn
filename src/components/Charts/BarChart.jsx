import React from "react";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChartComponent = ({ chartData,selectedOptions }) => {

  const transformedData = Object.entries(chartData).map(([name, Top10]) => ({
    name,
    Top10
}));

  return (
    <>
    {
      selectedOptions.length>0?
    <div style={{ width: '100%', height: 400 }} id="stackD" >
      <ResponsiveContainer>
        <BarChart
          data={transformedData} // Use transformed data for the chart
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Top10" fill="#35B6E9" />
        </BarChart>
      </ResponsiveContainer>
    </div>
        :null
      }
    </>

  );
};



export function GraphComp({
  userActivityDetails,
  viewInFullScreen,
  barChartRef,
  isFullScreen,
  selectedOptions
}) {


  return (
    <div ref={barChartRef}  >
      {isFullScreen && (
        <button onClick={viewInFullScreen} className="btn btn-secondary">
          Exit Fullscreen
        </button>
      )}
      <BarChartComponent  chartData={userActivityDetails} selectedOptions={selectedOptions} />
    </div>
  );
}
