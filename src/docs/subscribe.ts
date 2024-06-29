/**
 * @swagger
 * tags:
 *   name: Subscribe
 *   description: Subscription management
 */

/**
 * @openapi
 * /api/v1/subscribe:
 *   post:
 *     tags: [Subscribe]
 *     summary: Subscribe user to our app
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *     responses:
 *       201:
 *         description: Subscribed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscribed successfully
 *                 subscription:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: test@gmail.com
 */

/**
 * @openapi
 * /api/v1/subscribe/delete/{id}:
 *   get:
 *     tags: [Subscribe]
 *     summary: Removes a user from subscription
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Subscription removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscription removed successfully
 *       404:
 *         description: Subscription not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscription not found
 *       400:
 *         description: Invalid ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid ID
 */

/**
 * @openapi
 * /api/v1/subscribe/getAll:
 *   get:
 *     tags: [Subscribe]
 *     summary: Retrieve all subscribers
 *     description: Get a list of all subscribers in the system.
 *     responses:
 *       200:
 *         description: A list of subscribers
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
 *                   email:
 *                     type: string
 *                     example: user@example.com
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-06-29T12:34:56Z
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-06-29T12:34:56Z
 */
