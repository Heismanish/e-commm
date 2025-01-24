import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import {
  DollarSign,
  LucideProps,
  Package,
  ShoppingCart,
  UserCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  YAxis,
  CartesianGrid,
  XAxis,
  Tooltip,
} from "recharts";

type analyticsDataType = {
  totalUsers: number;
  totalProducts: number;
  totalSales: number;
  totalSalesAmount: number;
};

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState<analyticsDataType>({
    totalUsers: 0,
    totalProducts: 0,
    totalSales: 0,
    totalSalesAmount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [dailySalesData, setDailySalesData] = useState<string[]>([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const res = await axios.get("/analytics");

        setAnalyticsData(res.data.analytics);
        setDailySalesData(res.data.dailySalesData);
      } catch (error: AxiosError | any) {
        console.log(error);
        toast.error(
          error.response.data.message ||
            "An error occurred while fetching analytics data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 xm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard
          title="Users"
          value={analyticsData.totalUsers.toLocaleString()}
          icon={UserCircle}
          color="from-emerald-600 to-teal-700"
        ></AnalyticsCard>
        <AnalyticsCard
          title="Tota Products"
          value={analyticsData.totalProducts.toLocaleString()}
          icon={Package}
          color="from-emerald-600 to-green-800"
        ></AnalyticsCard>
        <AnalyticsCard
          title="Total Sales"
          value={analyticsData.totalSales.toLocaleString()}
          icon={ShoppingCart}
          color="from-emerald-500 to-cyan-800"
        ></AnalyticsCard>
        <AnalyticsCard
          title="Total Revenue"
          value={"$" + analyticsData.totalSalesAmount}
          icon={DollarSign}
          color="from-emerald-500 to-lime-700"
        ></AnalyticsCard>
      </div>
      <motion.div
        className="bg-gray-800/60 rounded-lg p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={dailySalesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#D1D5DB" />
            <YAxis yAxisId="left" stroke="#D1D5DB" />
            <YAxis yAxisId="right" orientation="right" stroke="#D1D5DB" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              activeDot={{ r: 8 }}
              stroke="#10B981"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              activeDot={{ r: 8 }}
              stroke="#3B82F6"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};
export default AnalyticsTab;

type AnalyticsCardProps = {
  title: string;
  value: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  color: string;
};
const AnalyticsCard = ({
  title,
  value,
  icon: Icon,
  color,
}: AnalyticsCardProps) => (
  <motion.div
    className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex justify-between items-center">
      <div className="z-10">
        <p className="text-emerald-300 text-sm mb-1 font-semibold">{title}</p>
        <h3 className="text-white text-3xl font-bold">{value}</h3>
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30" />
    <div className="absolute -bottom-4 -right-4 text-emerald-800 opacity-50">
      <Icon className="h-32 w-32" />
    </div>
  </motion.div>
);
