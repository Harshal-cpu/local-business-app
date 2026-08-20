const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const router = express.Router();

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      customer: req.userId
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (for testing)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find().populate('customer', 'fullName email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customer's own orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get revenue stats
router.get('/stats', auth, async (req, res) => {
  try {
    const orders = await Order.find({ status: 'completed' }).populate('items.product');

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthlyOrders = orders.filter(o => o.createdAt >= thisMonth);
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.total, 0);

    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Revenue trend (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayOrders = orders.filter(o => o.createdAt >= date && o.createdAt < nextDate);
      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
      
      last7Days.push({
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        revenue: dayRevenue
      });
    }

    // Top products
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product?._id || item.product;
        if (!productSales[productId]) {
          productSales[productId] = {
            name: item.name,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[productId].quantity += item.quantity;
        productSales[productId].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    res.json({
      totalRevenue,
      monthlyRevenue,
      avgOrderValue,
      totalOrders,
      revenueTrend: last7Days,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customers
router.get('/customers', auth, async (req, res) => {
  try {
    const orders = await Order.find().populate('customer', 'fullName email');

    const customerMap = new Map();
    orders.forEach(order => {
      if (order.customer) {
        const customerId = order.customer._id.toString();
        if (!customerMap.has(customerId)) {
          customerMap.set(customerId, {
            _id: order.customer._id,
            name: order.customer.fullName,
            email: order.customer.email,
            orders: 0,
            totalSpent: 0
          });
        }
        const customer = customerMap.get(customerId);
        customer.orders += 1;
        customer.totalSpent += order.total;
      }
    });

    res.json(Array.from(customerMap.values()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
