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
