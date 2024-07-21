/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact management
 */
/**
 * @swagger
 * /api/v1/contact:
 *   post:
 *     summary: Handle contact form submissions
 *     description: This endpoint handles contact form submissions and sends the data via email to administrators.
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               phone:
 *                 type: string
 *                 example: 123-456-7890
 *               message:
 *                 type: string
 *                 example: This is a test message.
 *             required:
 *               - name
 *               - email
 *               - message
 *     responses:
 *       200:
 *         description: Feedback sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Feedback sent successfully
 *       400:
 *         description: Name, email, and message are required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Name, email, and message are required
 *       500:
 *         description: Failed to send feedback
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to send feedback
 */
