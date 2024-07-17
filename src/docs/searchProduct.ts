/**
 * @swagger
 * /api/v1/search:
 *   get:
 *     summary: Search products
 *     tags: [Buyer]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         type: string
 *         description: Keyword to search for in product name, short description, or long description.
 *       - in: query
 *         name: category
 *         type: array
 *         description: An array of category IDs
 *       - in: query
 *         name: rating
 *         type: array
 *         description: An array of ratings
 *       - in: query
 *         name: productName
 *         type: string
 *         description: Name of the product to filter the products.
 *       - in: query
 *         name: page
 *         type: number
 *         description: page to return
 *       - in: query
 *         name: limit
 *         type: number
 *         description: number of items to return per page
 *       - in: query
 *         name: minPrice
 *         type: number
 *         description: minPrice of products to return
 *       - in: query
 *         name: maxPrice
 *         type: number
 *         enum: [asc, desc]
 *         description: maxPrice of products to return
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
