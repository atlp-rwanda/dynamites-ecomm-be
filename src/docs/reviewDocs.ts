/**
 * @swagger
 * /api/v1/review:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               rating:
 *                 type: number
 *               productId:
 *                 type: number
 *     responses:
 *       '201':
 *         description: Review created successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: A success message
 *             review:
 *       '400':
 *         description: Bad request, failed validation
 *       '404':
 *         description: Product not found
 *       '409':
 *         description: User has already reviewed the product
 */

/**
 * @swagger
 * /api/v1/review:
 *   get:
 *     summary: Get reviews by user
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Reviews retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             reviews:
 *               type: array
 */
