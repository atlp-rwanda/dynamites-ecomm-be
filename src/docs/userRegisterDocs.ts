/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               userType:
 *                 type: string
 *                 enum: ['vendor', 'buyer']
 *     responses:
 *       '201':
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating successful registration
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The unique identifier of the user
 *                     firstName:
 *                       type: string
 *                       description: The first name of the user
 *                     lastName:
 *                       type: string
 *                       description: The last name of the user
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: The email address of the user
 *                     userType:
 *                       type: string
 *                       enum: ['vendor', 'buyer']
 *                       description: The type of user
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
 *         description: Conflict - Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the email already exists
 */


/**
 * @swagger
 * /api/v1/user/confirm:
 *   get:
 *     summary: Confirm user email
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: JWT token received in the confirmation email
 *     responses:
 *       '200':
 *         description: Email confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating successful email confirmation
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating invalid or missing token
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
 * /api/v1/user/getAllUsers:
 *   get:
 *     summary: Get all Users
 *     tags: [User]
 *     responses:
 *       '200':
 *         description: Successful
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/user/delete/{id}:
 *   delete:
 *     summary: Deletes an existing User
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       '200':
 *         description: Record deleted successfully.
 *       '404':
 *         description: Record not found.
 *       '500':
 *         description: An error occurred while deleting the record.
 */
/**
 * @swagger
 * /api/v1/user/updateProfile/{id}:
 *   put:
 *     summary: Update user profile
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The updated first name of the user.
 *               lastName:
 *                 type: string
 *                 description: The updated last name of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The updated email address of the user.
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 description: The old password of the user for verification.
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password of the user (optional).
 *     responses:
 *       '200':
 *         description: User profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating successful profile update.
 *       '400':
 *         description: Bad request or validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating the reason for the bad request.
 *       '404':
 *         description: Not Found - User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message indicating the user was not found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message indicating an internal server error occurred.
 */

/**
 * @swagger
 * /api/v1/user/recover:
 *   post:
 *     summary: Recover Password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       '200':
 *         description: Password reset link generated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating successful email confirmation
 *                 recoverToken:
 *                   type: string
 *                   description: JWT token for password recovery
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
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating a server error
 */
/**
 * @swagger
 * /api/v1/user/recover/confirm:
 *   post:
 *     summary: Recover Password
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: recoverToken
 *         schema:
 *           type: string
 *         required: true
 *         description: JWT token received in the Recover email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       '200':
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating successful password reset
 *       '400':
 *         description: Missing Token or User Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating a missing token or user not found
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating a server error
 */
