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
