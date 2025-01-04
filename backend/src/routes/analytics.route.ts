import { Request, Response, Router } from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware";
import {
  getDailySalesData,
  getDataAnalytics,
} from "../controllers/analytics.controller";

const analyticsRoute = Router();
analyticsRoute.get(
  "/",
  protectRoute,
  adminRoute,
  async (req: Request, res: Response) => {
    try {
      const analytics: AnalyticsData = await getDataAnalytics();

      const endDate: Date = new Date();
      const startDate: Date = new Date(
        endDate.getTime() - 7 * 24 * 60 * 60 * 1000
      );

      const dailySalesData = await getDailySalesData(startDate, endDate);

      res.status(200).json({ analytics, dailySalesData });
    } catch (error: any) {
      console.error("Error in analytics route:", error);
      res
        .status(500)
        .json({ message: `Error in analytics route: ${error.message}` });
    }
  }
);
export default analyticsRoute;
