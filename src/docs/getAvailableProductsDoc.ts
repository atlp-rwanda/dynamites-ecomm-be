/**
 * @swagger
 * /api/v1/getAvailableProducts:
 *   get:
 *     summary: Get available products from vendors
 *     tags: [Product]
 *     description: Retrieve a list of available products with pagination.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items to return per page.
 *         required: false
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number.
 *         required: false
 *     responses:
 *       200:
 *         description: Successful response with available products.
 *       500:
 *         description: Internal server error.
 */