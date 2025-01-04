import e, { Request, Response } from "express";
import Product from "../model/Product.model";

/**
 * Returns all products in the user's cart.
 *
 * Finds all products in the database whose id is in the user's cart items.
 * Then, for each product, finds the corresponding cart item and adds the quantity to the product.
 * Finally, returns the array of products with their quantities.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>}
 */
const getCartProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({
      _id: { $in: req.user?.cartItems.map((item) => item.products) },
    });

    const cartItems = products.map((product) => {
      const item = req.user?.cartItems.find((i) => i.products == product.id);
      return { ...product.toJSON(), quantity: item?.quantity };
    });

    res.status(200).json(cartItems);
    return;
  } catch (error) {
    console.log("Error in getting cart products", error);
    res
      .status(500)
      .json({ message: `Error in getting cart products \n ${error}` });
  }
};

/**
 * Adds a product to the user's cart.
 *
 * If the product is already in the cart, it increments the quantity by 1.
 * If the product is not in the cart, it adds the product to the cart with a quantity of 1.
 * Responds with a status of 200 and a message indicating whether the product quantity was updated or added.
 * If an error occurs during the process, it logs the error and responds with a status of 500.
 *
 * @param {Request} req - The request object containing the productId in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<void>}
 */
const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingProduct = user?.cartItems.find(
      (item) => item.products == productId
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
      await user?.save();
      res.status(200).json({ message: "Product quantity updated in cart" });
    } else {
      user?.cartItems.push({ products: productId, quantity: 1 });
      await user?.save();
      res.status(200).json({ message: "Product added to cart" });
    }
  } catch (error) {
    console.log("Error in adding product to cart", error);
    res
      .status(500)
      .json({ message: `Error in adding product to cart \n ${error}` });
  }
};

/**
 * Removes products from the user's cart.
 *
 * If a productId is provided in the request body, it removes the specific product
 * from the cart. If no productId is provided, it clears all items in the cart.
 * Responds with a status of 200 and a message indicating the product(s) were removed.
 * If an error occurs during the process, it logs the error and responds with a status of 500.
 *
 * @param req - Express request object, containing the productId in the body.
 * @param res - Express response object, used to send the response.
 */

const removeAllFromCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      if (user && user.cartItems) {
        user.cartItems = [];
      }
    } else if (user) {
      user.cartItems = user?.cartItems.filter(
        (items) => items.products.toString() !== (productId as string)
      );
    }

    await user?.save();
    res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    console.log("Error in removing product from cart", error);
    res
      .status(500)
      .json({ message: `Error in removing product from cart \n ${error}` });
  }
};

/**
 * Updates the quantity of a product in the user's cart.
 *
 * If the product is already in the cart, it updates the quantity of the product.
 * If the product is not in the cart, it responds with a status of 404 and a message indicating the product was not found.
 * If an error occurs during the process, it logs the error and responds with a status of 500.
 *
 * @param {Request} req - The request object containing the productId in the params and the quantity in the body.
 * @param {Response} res - The response object used to send the response.
 * @returns {Promise<void>}
 */
const updateQuantity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: productID } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    const existingProduct = user?.cartItems.find(
      (item) => item.products.toString() === productID
    );

    if (!existingProduct)
      res.status(404).json({ message: "Product not found in cart" });

    if (existingProduct && existingProduct.quantity === 0) {
      if (user && user.cartItems) {
        user.cartItems.map((item) => {
          if (item.products.toString() == productID) {
            item.quantity = req.body.quantity;
          }
        });
      }
    } else if (existingProduct) {
      existingProduct.quantity = quantity;
      await user?.save();
      res.status(200).json({ message: "Product quantity updated in cart" });
    }
  } catch (error) {
    console.log("Error in updating product quantity in cart", error);
    res.status(500).json({
      message: `Error in updating product quantity in cart \n ${error}`,
    });
  }
};

export { getCartProducts, addToCart, removeAllFromCart, updateQuantity };
