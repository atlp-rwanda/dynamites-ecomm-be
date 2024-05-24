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
