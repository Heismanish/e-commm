import { Request, Response } from "express";
import Coupon from "../model/Coupon.model";
import { stripe } from "../lib/stripe";
import { Types } from "mongoose";
import Order from "../model/Order.model";
import { productOrderType } from "../types/order.type";

/**
 * Creates a new checkout session for a user.
 *
 * This function takes a request containing a `products` array and a `couponCode` string.
 * It creates a Stripe checkout session and returns the session ID in the response.
 *
 * If the total amount of the products is greater than 200, a new coupon is generated for the user.
 *
 * @param {Request} req - The request object, containing the products and coupon code in the body.
 * @param {Response} res - The response object, used to send the response.
 */
const createCheckoutSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length < 1) {
      res.status(400).json({ message: "Invalid or no products found" });
      return;
    }

    let totalAmount = 0;

    const checkoutProducts = products.map((product) => {
      const amount = Math.round(product.price * 100); // stripe require amount in cents
      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity,
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        isActive: true,
        userId: req.user?._id,
      });
      if (coupon) {
        totalAmount = Math.round(
          totalAmount * (1 - coupon.discountPercentage / 100)
        );
      }
    }

    const stripeCoupon =
      coupon && (await createStripeCoupon(coupon.discountPercentage));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: checkoutProducts,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon ? [{ coupon: stripeCoupon as string }] : [],
      metadata: {
        userId: req.user && req.user._id ? req.user._id.toString() : null,
        coupon: JSON.stringify(coupon) || null,
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });

    // more than 200 rupees
    if (totalAmount > 20000) {
      generateNewCoupon(req.user?._id as Types.ObjectId);
    }
    res
      .status(200)
      .json({ sessionId: session.id, totalAmount: totalAmount / 100 });
  } catch (error: any) {
    console.error("Error processing checkout:", error);
    res
      .status(500)
      .json({ message: "Error processing checkout", error: error.message });
  }
};

async function createStripeCoupon(discountPercentage: number) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return coupon.id;
}

async function generateNewCoupon(_id: Types.ObjectId) {
  await Coupon.findOneAndDelete({ userId: _id });

  const coupon = new Coupon({
    userId: _id,
    code: "GIFT" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    discountPercentage: 10,
    isActive: true,
    expirationDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });
  await coupon.save();
  return coupon;
}

/**
 * Handles a successful checkout, deactivates the coupon if used, and creates a new order.
 * 1. It retrieves a Stripe checkout session by its ID from the request body.
 * 2. If the session is paid, it:
 *    - Deactivates the coupon used (if any) by updating its status in the database.
 *    - Creates a new order in the database with the user ID, products, total amount, and Stripe session ID.
 * 3. Returns a successful response (200) with a message and the new order ID.
 * 4. Catches any errors and returns a failed response (500) with an error message.
 *
 * @param {Request} req - The request object containing the sessionId in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<void>}
 */
const checkoutSuccess = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session && session.payment_status === "unpaid") {
      const coupon = JSON.parse(session?.metadata?.coupon as string);
      await Coupon.findOneAndUpdate(
        { userId: session?.metadata?.userId, code: coupon?.code },
        { isActive: false }
      );

      // create a new order:
      const product = JSON.parse(session?.metadata?.products as string);

      const newOrder = await Order.create({
        user: session?.metadata?.userId,
        products: product.map((p: productOrderType) => ({
          product: p.id,
          quantity: p.quantity,
          price: p.price,
        })),
        totalAmount: (session?.amount_total as number) / 100,
        stripeSessionId: sessionId,
      });

      res.status(200).json({
        message:
          "Payment successful, order created, and coupon deactivated if used.",
        orderId: newOrder._id,
      });
    } else {
      res.status(200).json({ message: "Payment failed" });
    }
  } catch (error: any) {
    console.error("Error processing successful checkout:", error);
    res.status(500).json({
      message: "Error processing successful checkout",
      error: error.message,
    });
  }
};

export { createCheckoutSession, checkoutSuccess };
