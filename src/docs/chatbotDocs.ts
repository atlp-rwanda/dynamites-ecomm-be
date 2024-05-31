/**
 * @swagger
 * tags:
 *   name: Chat bot
 *   description: Operations related to Chat bot
 * /api/v1/chat:
 *   post:
 *     summary: Send a message to the chat bot
 *     tags: [Chat bot]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The message to send to the chat bot
 *     responses:
 *       '200':
 *         description: Successfully received response from the chat bot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The response from the chat bot
 * /api/v1/chat/history:
 *   get:
 *     summary: Get chat history
 *     tags: [Chat bot]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved chat history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Chat'
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The ID of the chat
 *         userId:
 *           type: integer
 *           description: The ID of the user
 *         message:
 *           type: string
 *           description: The message sent by the user
 *         response:
 *           type: string
 *           description: The response from the chat bot
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the chat was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the chat was last updated
 */
