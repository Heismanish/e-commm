import { motion } from "framer-motion";
import { GrapeIcon, PlusCircle, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import AnalyticsTab from "../components/AnalyticsTab";
import useProductState from "../store/useProductStore";

enum activeTabEnum {
  create = "create",
  products = "products",
  analytics = "analytics",
}
type tabsType = {
  id: activeTabEnum;
  label: string;
  icon: any;
};
const tabs: tabsType[] = [
  { id: activeTabEnum.create, label: "Create", icon: PlusCircle },
  { id: activeTabEnum.products, label: "Products", icon: ShoppingCart },
  { id: activeTabEnum.analytics, label: "Analytics", icon: GrapeIcon },
];

const Dashboard = () => {
  const { fetchAllProducts } = useProductState();
  const [activeTab, setActiveTab] = useState<activeTabEnum>(
    activeTabEnum.create
  );

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className="min-h-screen w-full text-white relative overflow-hidden mx-auto">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.h1
          className="text-4xl font-bold text-center mb-8 text-emerald-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Admin Dashboard
        </motion.h1>
      </div>
      <div className="flex justify-center mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${
              activeTab === tab.id
                ? "bg-emerald-500 text-white"
                : "bg-gray-200 text-gray-700"
            } px-4 py-2 rounded-lg mr-4 flex items-center hover:bg-emerald-500 hover:text-white transition duration-300 ease-in-out`}
          >
            <tab.icon className="mr-2 h-5 w-5" /> {tab.label}
          </button>
        ))}
      </div>
      {activeTab === activeTabEnum.create && <CreateProductForm />}
      {activeTab === activeTabEnum.products && <ProductsList />}
      {activeTab === activeTabEnum.analytics && <AnalyticsTab />}
    </div>
  );
};

export default Dashboard;
