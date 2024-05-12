/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management
 */
/**
 * @swagger
 * /api/v1/category/:
 *   post:
 *     summary: create a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Category successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating successful registration
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The unique identifier of the category
 *                     name:
 *                       type: string
 *                       description: The name of the category
 *                     description:
 *                       type: string
 *                       description: description of the category
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
 *       '409':
 *         description: Conflict - Category name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the name of category already exists
 */
/**
 * @swagger
 * /api/v1/category/:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful
 *       '404':
 *         description: Categories not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/v1/category/{categoryId}:
 *   get:
 *     summary: Get an existing category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         type: string
 *         required: true
 *         description: ID of the category
 *     responses:
 *       '200':
 *         description: Successful
 *       '404':
 *         description: category not found
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/category/{categoryId}:
 *   delete:
 *     summary: Deletes an existing category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         type: string
 *         required: true
 *         description: ID of the category to delete
 *     responses:
 *       '200':
 *         description: Delete Successful
 *       '404':
 *         description: category not found
 *       '500':
 *         description: Internal Server Error
 */
