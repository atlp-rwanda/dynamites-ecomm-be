/**
 * @swagger
 * tags:
 *   name: buyer
 *   description: Category management
 */

/**
 * @openapi
 * /buyer/addItemToWishList:
 *   post:
 *     tags: [buyer]
 *     @security bearerAuth
 *     summary: Adds an item to the wishlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               productId:
 *                 type: integer
 *               time:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Wishlist item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BuyerWishList'
 */

/**
 * @openapi
 * /buyer/removeToWishList:
 *   delete:
 *     tags: [buyer]
 *     @security bearerAuth
 *     summary: Removes a product from the wishlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               productId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product successfully removed from wishlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BuyerWishList'
 */

/**
 * @openapi
 * /buyer/getWishList:
 *   get:
 *      tags: [buyer]
 *     @security bearerAuth
 *     summary: Retrieves all wishlists
 *     responses:
 *       200:
 *         description: Data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BuyerWishList'
 */

/**
 * @swagger
 * /buyer/addItemToWishList:
 *   post:
 *     summary: Get a specific product
 *     tags: [Buyer]
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
 *                 type: integer
 *               time:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Wishlist item added successfully
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Wishlist not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/buyer/removeToWishList:
 *   delete:
 *     summary: Remove a product to WishList
 *     tags: [Buyer]
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
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Successful Removed a Product
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/buyer/getWishList:
 *   get:
 *     summary: Get a All Wish List
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
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
 * /api/v1/buyer/getOneWishList:
 *   get:
 *     summary: Get One Wish List
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
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
