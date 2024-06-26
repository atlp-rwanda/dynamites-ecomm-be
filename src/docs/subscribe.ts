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
 *   delete:
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
