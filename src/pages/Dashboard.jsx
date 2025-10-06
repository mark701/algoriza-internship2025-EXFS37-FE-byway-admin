import { CategoryServices } from '../services/CategoryServices'
import { useEffect, useState } from "react";
import { CourseServices } from '../services/CourseServices'
import { instructorServices } from '../services/instructorServices'
import { LineChart, PieChart } from '../services/Shared/ApexChartsService';
import { UserCoursesServices } from '../services/UserCoursesServices';
import { groupDataByTimeline } from '../utils/groupDataByTimeline';
import FailedRequest from "../components/FailedRequest";

const Dashboard = () => {

  const [stats, setStats] = useState([
    { label: "Instructors", value: 0, service: instructorServices.getCount, icon: `${process.env.PUBLIC_URL}/Assets/Icons/user.png` },
    { label: "Categories", value: 0, service: CategoryServices.getCount, icon: `${process.env.PUBLIC_URL}/Assets/Icons/Icon.png` },
    { label: "Courses", value: 0, service: CourseServices.getCount, icon: `${process.env.PUBLIC_URL}/Assets/Icons/folder.png` },
  ]);

  const [error, setError] = useState('');


  const [totals, setTotals] = useState([]);
  const [dates, setDates] = useState([]);
  const [timeline, setTimeline] = useState("thisMonth"); // "thisMonth" or "thisYear"

  const pieSeries = stats.map((s) => s.value ?? 0);
  const pieLabels = stats.map((s) => s.label);


  // --- Fetch pie stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const results = await Promise.all(stats.map((s) => s.service()));
        setStats((prev) =>
          prev.map((s, i) => ({ ...s, value: results[i] }))
        );
      } catch (error) {
        setError(`Error fetching dashboard stats: ${error.response.data}`);

      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchLineChartData = async () => {
      try {
        const yearType = timeline === "thisMonth" ? "month" : "year";

        const data = await UserCoursesServices.GetPricesWithDate(yearType);

        if (Array.isArray(data)) {
          // Group and sum by label (day or month)
          const { grouped, labels } = groupDataByTimeline(data, timeline);

          setDates(labels);
          setTotals(labels.map((label) => grouped[label]));
        }
      } catch (error) {
        setError(`Error fetching line chart data: ${error.response.data}`);
      }
    };

    fetchLineChartData();
  }, [timeline]);


  return (
    <div className=" bg-gray-50">

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button className="relative p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="w-6 h-6 flex items-center justify-center">
              <img src={`${process.env.PUBLIC_URL}/Assets/Icons/notification.png`} alt="notification" />
            </div>

            <span className="absolute top-2 right-2  block w-3 h-3 rounded-full bg-red-500 border-2 border-white"></span>
          </button>

        </div>
        <div className="border-t border-gray-200 mx-7 my-3"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-gray-800">
                  {stat.value !== null ? stat.value : "…"}
                </div>
                <div className="p-3 rounded-lg bg-opacity-10">
                  <img src={stat.icon} alt={stat.label} className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {stat.label}
              </div>
            </div>
          ))}



        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wallet Section */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Wallet</h2>
              <select
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
              >
                <option value="thisMonth">This Month</option>
                <option value="thisYear">This Year</option>
              </select>
            </div>

            <div className="mb-6">
              <div className="text-4xl font-bold text-gray-800 mb-2">${totals.reduce((acc, curr) => acc + curr, 0)}</div>

            </div>

            {/* Line Chart */}
            <div >
              <LineChart
                title="Wallet Activity"
                series={[{ name: "Totals", data: totals },
                ]}
                categories={dates}
                xLabel={timeline}
                yLabel="Amount of Money"

              />
            </div>


          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Statistics</h2>

            <div className=' w-full overflow-hidden' >
              <PieChart
                series={pieSeries}
                labels={pieLabels}
                title=""

              />
            </div>



          </div>


        </div>
      </div>
      <FailedRequest
        message={error}
        onClose={() => setError("")}
      />
    </div>
  );
};

export default Dashboard;
