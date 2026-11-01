const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', authenticateToken, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Database transaction to guarantee consistency
    await prisma.$transaction(async (tx) => {
      // 1. Get product recipe
      const recipeItems = await tx.recipeMaterial.findMany({
        where: { productId },
        include: { material: true }
      });

      // 2. Check stock levels
      for (const item of recipeItems) {
        const requiredQty = item.quantity * (1 + item.wastePercent / 100) * quantity;
        if (item.material.currentStock < requiredQty) {
          throw new Error(`Insufficient stock for material: ${item.material.name}`);
        }
      }

      // 3. Deduct stock
      for (const item of recipeItems) {
        const requiredQty = item.quantity * (1 + item.wastePercent / 100) * quantity;
        await tx.rawMaterial.update({
          where: { id: item.materialId },
          data: { currentStock: { decrement: requiredQty } }
        });
      }

      // 4. Log production run
      await tx.productionRun.create({
        data: { productId, quantity }
      });
    });

    res.status(200).json({ message: 'Production recorded and stock updated successfully.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;