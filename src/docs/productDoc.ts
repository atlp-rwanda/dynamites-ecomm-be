/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Operations related to products
 */

/**
 * @swagger
 * /api/v1/product:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '500':
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete all products
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Products deleted successfully
 *       '500':
 *         description: Failed to delete products
 */

/**
 * @swagger
 * /api/v1/product/{productId}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: productId
 *         type: integer
 *         required: true
 *         description: ID of the product to retrieve
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         type: integer
 *         required: true
 *         description: ID of the product to delete
 *     responses:
 *       '200':
 *         description: Product deleted successfully
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/product:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               gallery:
 *                 type: array
 *                 items:
 *                   type: string
 *               shortDesc:
 *                 type: string
 *               longDesc:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               regularPrice:
 *                 type: number
 *               salesPrice:
 *                 type: number
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               type:
 *                 type: string
 *                 enum: ['Simple', 'Grouped', 'Variable']
 *               isAvailable:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       '201':
 *         description: Product successfully created
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Category not found
 *       '409':
 *         description: Product name already exists
 */

/**
 * @swagger
 * /api/v1/product/{productId}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         type: integer
 *         required: true
 *         description: ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               gallery:
 *                 type: array
 *                 items:
 *                   type: string
 *               shortDesc:
 *                 type: string
 *               longDesc:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               regularPrice:
 *                 type: number
 *               salesPrice:
 *                 type: number
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               type:
 *                 type: string
 *                 enum: ['Simple', 'Grouped', 'Variable']
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: Product successfully updated
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/product/{productId}/availability:
 *   put:
 *     summary: Update Product Availability
 *     tags: [Product]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               availability:
 *                 type: boolean
 *     responses:
 *       '201':
 *         description: Availability modified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating successful availability modification
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         description: The error message
 *       '403':
 *         description: Forbidden - Product not owned by vendor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the product is not owned by the vendor
 *       '404':
 *         description: Not Found - Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the product was not found
 *
 *   get:
 *     summary: Check Product Availability
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product
 *     responses:
 *       '200':
 *         description: Product availability retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 availability:
 *                   type: boolean
 *                   description: A boolean indicating the availability of the product
 *       '403':
 *         description: Forbidden - Product not owned by vendor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the product is not owned by the vendor
 *       '404':
 *         description: Not Found - Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the product was not found
 */

/**
 * @swagger
 * /api/v1/product/recommended:
 *   get:
 *     summary: Get recommended products according to season
 *     tags: [Product]
 *     responses:
 *       '200':
 *         description: Recommended products retrieved successfully
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/product/getAvailableProducts:
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

/**
 * @swagger
 * /api/v1/product/bestselling:
 *   get:
 *     summary: Get Best Selling Products
 *     description: Fetches the top 4 best-selling products based on the quantity sold in descending order.
 *     tags: [Product]
 *     responses:
 *       '200':
 *         description: Successfully retrieved the list of best-selling products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: 'Product 1'
 *                   image:
 *                     type: string
 *                     example: 'product1.jpg'
 *                   gallery:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: []
 *                   shortDesc:
 *                     type: string
 *                     example: 'Short description for Product 1'
 *                   longDesc:
 *                     type: string
 *                     example: 'Long description for Product 1'
 *                   category:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 5
 *                       name:
 *                         type: string
 *                         example: 'Electronics'
 *                       description:
 *                         type: string
 *                         example: 'Electronics'
 *                       icon:
 *                         type: string
 *                         example: 'icon unavailable'
 *                   quantity:
 *                     type: integer
 *                     example: 100
 *                   regularPrice:
 *                     type: number
 *                     format: float
 *                     example: 10.0
 *                   salesPrice:
 *                     type: number
 *                     format: float
 *                     example: 8.0
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - 'tag1'
 *                   type:
 *                     type: string
 *                     example: 'Simple'
 *                   isAvailable:
 *                     type: boolean
 *                     example: true
 *                   isFeatured:
 *                     type: boolean
 *                     example: false
 *                   averageRating:
 *                     type: number
 *                     format: float
 *                     example: 4.5
 *                   reviews:
 *                     type: array
 *                     items:
 *                       type: object
 *                     example: []
 *                   vendor:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 18
 *                       firstName:
 *                         type: string
 *                         example: 'Xavier'
 *                       lastName:
 *                         type: string
 *                         example: 'string'
 *                       email:
 *                         type: string
 *                         example: 'irakozetresor797@gmail.com'
 *                       picture:
 *                         type: string
 *                         example: 'https://res.cloudinary.com/ditrc0kph/image/upload/v1711450197/rgrjpswkhjey1xgunqhr.png'
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: '2024-07-09T12:34:56Z'
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: '2024-07-09T12:34:56Z'
 *                   sales:
 *                     type: integer
 *                     example: 10
 *       '404':
 *         description: No best-selling products found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: 'No best-selling products found'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Failed to fetch best-selling products'
 */
