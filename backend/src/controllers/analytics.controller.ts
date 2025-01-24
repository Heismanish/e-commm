// analytics data includes:
// 1. user count
// 2. product count
// 3. sales data -> total number of sales, total amount of all orders

import Order from "../model/Order.model";
import Product from "../model/Product.model";
import User from "../model/User.model";

/**
 * Retrieves analytics data including total users, total products,
 * total sales, and total sales amount.
 *
 * This function performs the following operations:
 * 1. Counts the total number of users.
 * 2. Counts the total number of products.
 * 3. Aggregates order data to calculate the total number of sales
 *    and the total sales amount.
 *
 * @returns {Promise<AnalyticsData>} An object containing totalUsers,
 * totalProducts, totalSales, and totalSalesAmount.
 */

export const getDataAnalytics = async (): Promise<AnalyticsData> => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  // returns an array with a single document
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, // merges all the docs
        totalSales: { $sum: 1 },
        totalSalesAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  const { totalSales, totalSalesAmount } = salesData[0] || {
    totalSales: 0,
    totalSalesAmount: 0,
  };

  return { totalUsers, totalProducts, totalSales, totalSalesAmount };
};

/**
 * Retrieves daily sales data between two dates.
 *
 * This function performs the following operations:
 * 1. Validates the start and end dates.
 * 2. Aggregates order data to calculate the number of sales and revenue
 *    for each day between the provided start and end dates.
 * 3. Returns an array of objects where each object contains the date,
 *    the number of sales, and the revenue for that date.
 *
 * @param {Date} start - The start date of the range.
 * @param {Date} end - The end date of the range.
 * @returns {Promise<(Date & { sales: number; revenue: number })[]>} An array of objects with daily sales data.
 */

type salesDataType = { date: Date; sales: number; revenue: number }[];
export const getDailySalesData = async (
  start: Date,
  end: Date
): Promise<salesDataType> => {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: { createdAt: { $gte: start, $lte: end } },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const dateArray: Date[] = getDatesRange(start, end);

    const salesData: salesDataType = dateArray.map((date) => {
      const formattedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
      const foundData = dailySalesData.find(
        (data) => data._id === formattedDate
      );

      return {
        date,
        sales: foundData ? foundData.sales : 0,
        revenue: foundData ? foundData.revenue : 0,
      };
    });

    return salesData;
  } catch (error: any) {
    console.log("Error in getDailySalesData", error);
    throw error;
  }
};

const getDatesRange = (startDate: Date, endDate: Date): Date[] => {
  let dates = [];
  const currDate = new Date(startDate);
  while (currDate <= endDate) {
    dates.push(new Date(currDate.toISOString().split("T")[0]));
    currDate.setDate(currDate.getDate() + 1);
  }
  return dates;
};
