/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: Operations related to user management
 * securityDefinitions:
 *   BearerAuth:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 */

/**
 * @swagger
 * /api/v1/deactivate/{userId}:
 *   put:
 *     summary: Deactivate user account
 *     tags: [User Management]
 *     description: Deactivates the user account associated with the provided userId.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose account needs to be deactivated
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: User account deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating successful deactivation
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating the user is already inactive or other errors
 *       '404':
 *         description: Not Found - User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating user not found
 */

/**
 * @swagger
 * /api/v1/activate/{userId}:
 *   put:
 *     summary: Activate user account
 *     tags: [User Management]
 *     description: Activates the user account associated with the provided userId.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose account needs to be activated
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: User account activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating successful activation
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating the user is already active or other errors
 *       '404':
 *         description: Not Found - User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating user not found
 */