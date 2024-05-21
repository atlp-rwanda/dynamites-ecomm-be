/**
 * @swagger
 * /api/v1/search:
 *   get:
 *     summary: Search products
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         type: string
 *         description: Keyword to search for in product name, short description, or long description.
 *       - in: query
 *         name: category
 *         type: string
 *         description: Name of the category to filter the products.
 *       - in: query
 *         name: productName
 *         type: string
 *         description: Name of the product to filter the products.
 *       - in: query
 *         name: sort
 *         type: string
 *         enum: [asc, desc]
 *         description: Sort order for the products based on sales price.
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the list of products matching the search criteria.
 *       '400':
 *         description: Invalid search parameters provided.
 *       '500':
 *         description: Internal Server Error.
 */