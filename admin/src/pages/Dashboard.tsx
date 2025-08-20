import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";
import {
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";
import { GiConfirmed, GiReturnArrow } from "react-icons/gi";
import { FaBoxOpen, FaExchangeAlt } from "react-icons/fa";
import {
  getFinancialAnalytics,
  getSalesAnalytics,
} from "../services/dashboardService";
import Image from "../components/Images/Image";
import { FaTruck } from "react-icons/fa6";

interface DashboardData {
  totalStats: {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
  };
  topSellingProducts: Array<{
    name: string;
    totalSold: number;
    productId: string;
    images: string[];
  }>;
  salesByStatus: Array<{
    _id:
      | "pending"
      | "confirmed"
      | "shipped"
      | "delivered"
      | "returned"
      | "cancelled";
    count: number;
    total: number;
  }>;
  salesByUser: {
    guests: {
      totalOrders: number;
      totalSales: number;
    };
    users: {
      totalOrders: number;
      totalSales: number;
    };
  };
  financialAnalytics: {
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    monthlyRevenue: Array<{
      _id: string;
      revenue: number;
    }>;
  };
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: salesData }, { data: financialData }] =
          await Promise.all([getSalesAnalytics(), getFinancialAnalytics()]);
        console.log("Dtataas : ", salesData);
        console.log("financialData : ", financialData);
        setData({
          ...salesData,
          financialAnalytics: financialData,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Failed to load dashboard data</div>
      </div>
    );
  }

  const statusColors = {
    pending: "#FFC107",
    confirmed: "#03A9F4",
    shipped: "#9C27B0",
    delivered: "#4CAF50",
    returned: "#F44336",
    cancelled: "#f48836",
  };

  const pieChartData = data.salesByStatus.map((status) => ({
    id: status._id,
    label: status._id.charAt(0).toUpperCase() + status._id.slice(1),
    value: status.count,
    color: statusColors[status._id] || "#9E9E9E",
  }));

  const lineChartData = [
    {
      id: "revenue",
      color: "red",
      data: data.financialAnalytics.monthlyRevenue.map((month) => ({
        x: month._id,
        y: month.revenue,
      })),
    },
  ];

  const statsCards = [
    {
      title: "Total Revenue",
      value: `${data.totalStats.totalSales.toLocaleString()} DA`,
      icon: <FiDollarSign className="text-2xl" />,
      color: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      title: "Total Orders",
      value: data.totalStats.totalOrders.toLocaleString(),
      icon: <FiShoppingCart className="text-2xl" />,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      title: "Avg. Order Value",
      value: `${data.totalStats.averageOrderValue.toFixed(2)} DA`,
      icon: <FiTrendingUp className="text-2xl" />,
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
    },
    {
      title: "Total Profit",
      value: `${data.financialAnalytics.totalProfit.toLocaleString()} DA`,
      icon: <FiUsers className="text-2xl" />,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
  ];

  const statusIcons = {
    confirmed: <GiConfirmed className="text-[#03A9F4]" />,
    shipped: <FaTruck className="text-[#9C27B0]" />,
    returned: <GiReturnArrow className="text-[#F44336]" />,
    delivered: <FaBoxOpen className="text-[#4CAF50]" />,
    pending: <FaExchangeAlt className="text-[#FFC107]" />,
    cancelled: (
      <FaExchangeAlt className="text-[#f48836] transform rotate-180" />
    ),
  };

  return (
    <div className=" bg-off-black p-4 w-full h-full min-h-0 overflow-y-auto">
      <div className="h-full min-h-0 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {statsCards.map((card, index) => (
            <div
              key={index}
              className={`${card.color} rounded-sm px-3 py-5 text-white shadow-lg`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">{card.title}</p>
                  <p className="text-2xl font-bold mt-2">{card.value}</p>
                </div>
                <div className="bg-white text-black bg-opacity-20 p-3 rounded-full">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Trend */}
          <div className="bg-warm-gray text-off-white p-4 rounded-sm shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Monthly Revenue Trend
            </h2>
            <div className="h-80">
              <ResponsiveLine
                data={lineChartData}
                margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: false,
                  reverse: false,
                }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                  legend: "", // optional
                  legendOffset: 36,
                  legendPosition: "middle",
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "", // optional
                  legendOffset: -40,
                  tickValues: 8,
                  legendPosition: "middle",
                  format: (value) => `${value.toLocaleString()} DA`,
                }}
                colors={["#488aec"]}
                // enableGridX={false}
                enableGridY={false}
                lineWidth={3}
                pointSize={7}
                pointColor={"#488aec"}
                pointBorderWidth={1}
                pointBorderColor={{ from: "serieColor" }}
                enableArea={true}
                areaOpacity={0.1}
                useMesh={true}
                legends={[]}
                theme={{
                  background: "#2e2e2e",
                  text: {
                    fill: "#488aec",
                  },
                  tooltip: {
                    container: {
                      background: "#2e2e2e",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 500,
                    },
                  },
                  axis: {
                    domain: {
                      line: {
                        stroke: "#e9e9e9",
                      },
                    },
                    ticks: {
                      line: {
                        stroke: "#e9e9e9",
                      },
                      text: {
                        fill: "#e9e9e9",
                      },
                    },
                  },
                  grid: {
                    line: {
                      stroke: "#555",
                      strokeWidth: 1,
                    },
                  },
                  crosshair: {
                    line: {
                      stroke: "#e9e9e9",
                      strokeWidth: 1,
                      strokeDasharray: "4 4",
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Sales by Status */}
          <div className="bg-warm-gray p-4 rounded-sm shadow-md">
            <h2 className="text-xl font-semibold mb-4">Sales by Status</h2>
            <div className="h-80">
              <ResponsivePie
                data={pieChartData}
                margin={{ top: 20, right: 30, bottom: 80, left: 30 }}
                innerRadius={0.5}
                padAngle={1}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ datum: "data.color" }}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.3]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#e9e9e9"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor="#fff"
                legends={[
                  {
                    anchor: "bottom",
                    direction: "row",
                    justify: false,
                    translateX: 0,
                    translateY: 60,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: "#e9e9e9",
                    itemDirection: "left-to-right",
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: "circle",
                  },
                ]}
                theme={{
                  background: "#2e2e2e",
                  tooltip: {
                    container: {
                      background: "#424242",
                      color: "#e9e9e9",
                      fontSize: 12,
                    },
                  },
                  labels: {
                    text: {
                      fill: "#e9e9e9",
                      fontSize: 13,
                      textTransform: "capitalize",
                      fontWeight: 500,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Selling Products */}
          <div className="bg-warm-gray p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
            <div className="bg-off-black rounded-sm flex p-2 justify-between mb-2 text-xs uppercase text-cold-gray/70">
              <div> Prodcut </div>
              <div> Sales </div>
            </div>
            <div className="overflow-y-auto h-[500px]">
              {data.topSellingProducts.map((product) => (
                <div
                  key={product.productId}
                  className="mb-2 bg-off-black rounded-sm p-2 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-16 rounded-sm">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fromServer
                        styles="w-full h-full object-cover"
                      />
                    </div>
                    <p> {product.name} </p>
                  </div>
                  <p className="bg-primary h-7 font-semibold text-cold-gray w-7 flex justify-center items-center rounded-full">
                    {" "}
                    {product.totalSold}{" "}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* User Types and Status */}
          <div className="space-y-6">
            {/* User Types */}
            <div className="bg-warm-gray p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold  mb-4">
                Sales by User Type
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiUsers className="text-blue-500" />
                    <h3 className="font-medium text-gray-700">
                      Registered Users
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {data.salesByUser.users.totalOrders} orders
                  </p>
                  <p className="text-lg text-gray-600">
                    {data.salesByUser.users.totalSales.toLocaleString()} DA
                  </p>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiUsers className="text-purple-500" />
                    <h3 className="font-medium text-gray-700">
                      Guest Checkouts
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {data.salesByUser.guests.totalOrders} orders
                  </p>
                  <p className="text-lg text-gray-600">
                    {data.salesByUser.guests.totalSales.toLocaleString()} DA
                  </p>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-warm-gray p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">Order Status</h2>
              <div className="space-y-2">
                {data.salesByStatus.map((status, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 py-4 bg-off-black rounded-sm"
                  >
                    <div className="flex items-center space-x-3">
                      {statusIcons[status._id as keyof typeof statusIcons]}
                      <span className="capitalize font-medium">
                        {status._id}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{status.count} orders</p>
                      <p className="text-sm text-cold-gray/80">
                        {status.total.toLocaleString()} DA
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Heatmap */}
        {/* <div className="bg-warm-gray p-4 rounded-xl shadow-sm mb-6">
          <h2 className="text-xl font-semibold  mb-4">Daily Sales Activity</h2>
          <div className="h-64">
            <ResponsiveCalendar
              data={calendarData}
              from="2023-01-01"
              to="2023-12-31"
              emptyColor="#eeeeee"
              colors={[
                "#e0f7fa",
                "#b2ebf2",
                "#80deea",
                "#4dd0e1",
                "#26c6da",
                "#00bcd4",
                "#00acc1",
                "#0097a7",
              ]}
              margin={{ top: 0, right: 40, bottom: 0, left: 40 }}
              yearSpacing={40}
              monthBorderColor="#ffffff"
              dayBorderWidth={2}
              dayBorderColor="#ffffff"
              legends={[
                {
                  anchor: "bottom-right",
                  direction: "row",
                  translateY: 36,
                  itemCount: 4,
                  itemWidth: 42,
                  itemHeight: 36,
                  itemsSpacing: 14,
                  itemDirection: "right-to-left",
                },
              ]}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
