/**
 * @swagger
 * /api/v1/review:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: review
 *         description: The review object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             content:
 *               type: string
 *               description: The content of the review
 *             rating:
 *               type: integer
 *               description: The rating of the review (1 to 5)
 *             productId:
 *               type: integer
 *               description: The ID of the product being reviewed
 *           example:
 *             content: "This product is amazing!"
 *             rating: 5
 *             productId: 50
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
 *         description: Bad request, check the request body
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
