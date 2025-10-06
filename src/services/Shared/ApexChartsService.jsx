// src/services/ApexChartsService.jsx
import Chart from "react-apexcharts";

// Line Chart (supports multiple lines)
export const LineChart = ({ series, categories, title, xLabel, yLabel }) => {


  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: { curve: "smooth" },
    xaxis: {
      categories,
      title: {
        text: xLabel || "",
        style: { fontSize: "12px", fontWeight: 500 }
      }
    },
    yaxis: {
      title: {
        text: yLabel || "",
        style: { fontSize: "12px", fontWeight: 500 }
      }
    },
    title: { text: title, align: "left" },
    dataLabels: { enabled: false },
    tooltip: { enabled: true },
    legend: { position: "top" },
  };

  return <Chart options={options} series={series} type="line" height={300} />;
};



// Pie Chart
export const PieChart = ({ series, labels, title }) => {
  const options = {
    chart: { type: "pie" },
    labels,
    legend: {
      position: "left",

      formatter: function (val, opts) {
        const value = opts.w.globals.series[opts.seriesIndex];
        return `${val}: ${value}`; // show label + number
      },
    },
    title: { text: title, align: "left" },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: "bottom" },
        },
      },
    ],
  };



  return <Chart options={options} series={series} type="pie" />;
};
