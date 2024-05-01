/**
 * @swagger
 * /api/v1/roles/create_role:
 *   post:
 *     summary: Creates a new role
 *     tags: [Role]
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
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Successful
 *       '409':
 *         description: Role already exists
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/roles/get_roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful
 *       '404':
 *         description: Roles not found
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/roles/update_role:
 *   post:
 *     summary: Updates an existing role
 *     tags: [Role]
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
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Update Successful
 *       '404':
 *         description: Role not found
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/roles/change_user_role:
 *   patch:
 *     summary: Changes a user's role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *               newRole:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Update Successful
 *       '404':
 *         description: Role not found
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/roles/delete_role/{id}:
 *   post:
 *     summary: Deletes an existing role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the role to delete
 *     responses:
 *       '204':
 *         description: Delete Successful
 *       '404':
 *         description: Role not found
 *       '500':
 *         description: Internal Server Error
 */
