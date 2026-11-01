const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', authenticateToken, async (req, res) => {
  const { productId, quantity, sellingPrice } = req.body;

  try {
    // Fetch recipe to calculate current unit cost
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { recipe: { include: { material: true } } }
    });

    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Calculate total material cost
    const materialCost = product.recipe.reduce((total, item) => {
      const itemQty = item.quantity * (1 + item.wastePercent / 100);
      return total + (itemQty * item.material.unitPrice);
    }, 0);

    const totalUnitCost = materialCost + product.otherCosts;

    // Save sale with current cost snapshot
    const sale = await prisma.sale.create({
      data: {
        productId,
        quantity: parseInt(quantity),
        sellingPrice: parseFloat(sellingPrice || product.sellingPrice),
        unitCostAtSale: totalUnitCost // Historical cost snapshot
      }
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;