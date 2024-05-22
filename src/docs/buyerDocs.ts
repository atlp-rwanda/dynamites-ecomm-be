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
