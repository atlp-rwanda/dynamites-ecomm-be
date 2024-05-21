/**
 * @swagger
 * /api/v1/cart/:
 *   get:
 *     summary: Get all items in a user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/cart/:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *               quantity:
 *                 type: number
 *     responses:
 *       '201':
 *         description: Item successfully added to cart
 *       '404':
 *         description: User or Product not found
 *       '409':
 *         description: Invalid or exceeding quantity
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/cart/{itemId}:
 *   patch:
 *     summary: Update quantity of cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         type: string
 *         required: true
 *         description: ID of the cart item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Quantity successfully updated
 *       '404':
 *         description: User or Product not found
 *       '409':
 *         description: Invalid or exceeding quantity
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/cart/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         type: string
 *         required: true
 *         description: ID of the cart item to remove
 *     responses:
 *       '200':
 *         description: Cart item successfully removed
 *       '404':
 *         description: User or Product not found
 *       '409':
 *         description: Invalid or missing itemId
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/cart/:
 *   delete:
 *     summary: Remove all items of a specific user from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Cart items successfully removed
 *       '404':
 *         description: User or Cart item not found
 *       '500':
 *         description: Internal Server Error
 */
