import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import midtrans from "../config/midtransConfig.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Utility Function
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100000 ? 0 : 2000;
  const taxRate = 0.11;
  const taxPrice = Math.round(itemsPrice * taxRate);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  );

  return {
    itemsPrice: itemsPrice,
    shippingPrice: shippingPrice,
    taxPrice,
    totalPrice,
  };
}

function isValidQty(qty, countInStock) {
  return Number.isInteger(qty) && qty >= 1 && qty <= countInStock;
}

function isMidtransPaid({ transaction_status, fraud_status }) {
  return (
    transaction_status === "settlement" ||
    (transaction_status === "capture" && fraud_status === "accept")
  );
}

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    res.status(400);
    throw new Error("Tidak ada pesanan");
  }

  const itemsFromDB = await Product.find({
    _id: { $in: orderItems.map((x) => x._id) },
  });

  const dbOrderItems = orderItems.map((itemFromClient) => {
    const matchingItemFromDB = itemsFromDB.find(
      (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
    );

    if (!matchingItemFromDB) {
      res.status(404);
      throw new Error(`Produk tidak ditemukan: ${itemFromClient._id}`);
    }

    const qty = Number(itemFromClient.qty);

    if (!isValidQty(qty, matchingItemFromDB.countInStock)) {
      res.status(400);
      throw new Error(`Jumlah tidak valid: ${matchingItemFromDB.name}`);
    }

    return {
      name: matchingItemFromDB.name,
      qty,
      image: matchingItemFromDB.image,
      price: matchingItemFromDB.price,
      product: matchingItemFromDB._id,
    };
  });

  const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

  const order = new Order({
    orderItems: dbOrderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  // Midtrans transaction parameters
  const parameter = {
    transaction_details: {
      order_id: createdOrder._id.toString(),
      gross_amount: totalPrice,
    },
    customer_details: {
      first_name: req.user.username,
      email: req.user.email,
    },
  };

  const midtransTransaction = await midtrans.createTransaction(parameter);
  createdOrder.paymentResult = {
    token: midtransTransaction.token,
    redirect_url: midtransTransaction.redirect_url,
  };

  await createdOrder.save();

  res.status(201).json(createdOrder);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id username");
  res.json(orders);
});

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

const countTotalOrders = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  res.json({ totalOrders });
});

const calculateTotalSales = asyncHandler(async (req, res) => {
  const [result] = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
  ]);

  res.json({ totalSales: result?.totalSales ?? 0 });
});

const calcualteTotalSalesByDate = asyncHandler(async (req, res) => {
  const salesByDate = await Order.aggregate([
    {
      $match: {
        isPaid: true,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$paidAt",
            timezone: "Asia/Jakarta",
          },
        },
        totalSales: { $sum: "$totalPrice" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(salesByDate);
});

const findOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "username email"
  );

  if (order) {
    if (!req.user.isAdmin && !order.user?._id.equals(req.user._id)) {
      res.status(403);
      throw new Error("Akses ditolak");
    }
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Pesanan tidak ditemukan");
  }
});

const markOrderAsPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (!req.user.isAdmin && !order.user._id.equals(req.user._id)) {
      res.status(403);
      throw new Error("Akses ditolak");
    }

    if (order.isPaid) return res.json(order);

    const status = await midtrans.transaction.status(order._id.toString());

    if (!isMidtransPaid(status)) {
      res.status(400);
      throw new Error("Pembayaran belum diterima");
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult.id = status.transaction_id;
    order.paymentResult.status = status.transaction_status;
    order.paymentResult.update_time = status.transaction_time;

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Pesanan tidak ditemukan");
  }
});

const markOrderAsDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Pesanan tidak ditemukan");
  }
});

export {
  isValidQty,
  isMidtransPaid,
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
};
