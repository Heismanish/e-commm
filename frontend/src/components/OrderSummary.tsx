import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { MouseEvent } from "react";

import { Link } from "react-router-dom";
import useCartStore from "../store/useCartStore";
import { loadStripe } from "@stripe/stripe-js";
import { stripe } from "../../../backend/src/lib/stripe";
import axios from "../lib/axios";
import { AxiosError } from "axios";

const stripePromise = loadStripe(
  "pk_test_51QdVYRP7AIqe2JpNqbZLjDiXSFg2vGFbYr3mgK9Saz6Bdh4JIcHP8mIVFDLxOyXE9E2MyEcp2PCHkjlF6FYW5JQk00j9hVwZJQ"
);

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();
  const savings: number = subtotal - total;
  const formattedSubtotal: number = parseInt(subtotal.toFixed(2));
  const formattedTotal: number = parseInt(total.toFixed(2));
  const formattedSavings: number = parseInt(savings.toFixed(2));

  async function handlePayment(
    event: MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    try {
      const stripe = await stripePromise;
      const res = await axios.post("/payments/create-checkout-session", {
        products: cart,
        couponCode: coupon?.code,
      });
      const session = res.data;
      // console.log("Session is here: ", session);
      const result = await stripe?.redirectToCheckout({
        sessionId: session.sessionId,
      });
      if (result?.error) {
        console.log(result.error);
      }
    } catch (error: AxiosError | any) {
      console.log(
        "Error occured while creating checkout session",
        error.response.data.message
      );
    }
  }

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-emerald-400">Order summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">
              Original price
            </dt>
            <dd className="text-base font-medium text-white">
              ${formattedSubtotal}
            </dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-emerald-400">
                -${formattedSavings}
              </dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">
                Coupon ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-emerald-400">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}
          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">
              ${formattedTotal}
            </dd>
          </dl>
        </div>

        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
        >
          Proceed to Checkout
        </motion.button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
