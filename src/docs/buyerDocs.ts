/**
 * @swagger
 * /api/v1/buyer/get_product/{id}:
 *   get:
 *     summary: Get a specific product
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the product to get
 *     responses:
 *       '200':
 *         description: Successful
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/buyer/payment:
 *   post:
 *     summary: Create a charge
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Stripe token
 *               orderId:
 *                 type: number
 *                 description: Order ID
 *             required:
 *               - token
 *               - orderId
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the charge was successful
 *                 charge:
 *                   type: object
 *                   description: The charge object returned by Stripe
 *               required:
 *                 - success
 *                 - charge
 *       '400':
 *         description: Invalid input or order has already been paid
 *       '404':
 *         description: Order not found
 *       '500':
 *         description: Internal Server Error
 */