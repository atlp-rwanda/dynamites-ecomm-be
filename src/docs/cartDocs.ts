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

/**
 * @swagger
 * /api/v1/checkout:
 *   post:
 *     summary: Checkout and create an order from the cart items
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deliveryInfo:
 *                 type: object
 *                 description: Delivery information for the order
 *                 example: { "address": "123 Main St", "city": "Anytown", "zip": "12345" }
 *               couponCode:
 *                 type: string
 *                 description: Optional coupon code for discount
 *               email:
 *                 type: string
 *                 description: Email address for guest users
 *               firstName:
 *                 type: string
 *                 description: First name for guest users
 *               lastName:
 *                 type: string
 *                 description: Last name for guest users
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Bad request, e.g., empty cart, invalid quantity
 *       401:
 *         description: Unauthorized, e.g., not logged in
 *       404:
 *         description: User or product not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/checkout/cancel-order/{orderId}:
 *   delete:
 *     summary: Cancel a pending order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the order to cancel
 *     responses:
 *       200:
 *         description: Order canceled successfully
 *       400:
 *         description: Cannot cancel an order that is not pending
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/checkout/getall-order:
 *   get:
 *     summary: Get all orders
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful retrieval of all orders
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/checkout/removeall-order:
 *   delete:
 *     summary: Delete all orders
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders deleted successfully
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/order/{orderId}:
 *   put:
 *     summary: Update the status of an order
 *     tags: [Order]
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: ID of the order to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Failed, Canceled, Paid, Shipping, Delivered, Returned, Completed]
 *                 example: Failed
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Order status updated to Failed
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Invalid status
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Order Not Found
 *       500:
 *         description: Internal Server Error
 */
