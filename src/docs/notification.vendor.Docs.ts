
/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API endpoints for managing notifications
 */

/**
 * @swagger
 * /api/v1/notification/vendor:
 *   get:
 *     summary: Get all vendors notifications
 *     tags: [Notifications]
 *     responses:
 *       '200':
 *         description: A list of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notification:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 */


/**
 * @swagger
 * /api/v1/notification/vendor:
 *   delete:
 *     summary: Delete all vendors notifications
 *     tags: [Notifications]
 *     responses:
 *       '200':
 *         description: All notifications deleted successfully
 */


/**
 * @swagger
 * /api/v1/notification/vendor/{id}:
 *   get:
 *     summary: Get notifications by vendor ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vendor ID
 *     responses:
 *       '200':
 *         description: Notifications for the vendor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notification:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 */


/**
 * @swagger
 * /api/v1/notification/vendor/{id}:
 *   delete:
 *     summary: Delete a vendor notification by ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       '200':
 *         description: Notification deleted successfully
 */