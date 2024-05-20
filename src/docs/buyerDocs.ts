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
