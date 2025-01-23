type Coupon = {
  _id: string; // String representation of ObjectId
  code: string;
  discountPercentage: number;
  isActive: boolean;
  expirationDate: string; // Date as an ISO string for easy serialization
  userId: string; // String representation of ObjectId
  createdAt: string; // Date as an ISO string for easy serialization
};

export default Coupon;
