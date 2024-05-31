/**
 * @swagger
 * /api/v1/service:
 *   post:
 *     summary: Create a new service
 *     tags: [Service]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the service
 *               description:
 *                 type: string
 *                 description: Description of the service
 *             required:
 *               - name
 *               - description
 *     responses:
 *       '201':
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 service:
 *                   type: object
 *                   description: The created service object
 *       '400':
 *         description: Invalid input
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/services:
 *   get:
 *     summary: Retrieve all services
 *     tags: [Service]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful retrieval of all services
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 services:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Service ID
 *                       name:
 *                         type: string
 *                         description: Service name
 *                       description:
 *                         type: string
 *                         description: Service description
 *       '500':
 *         description: Internal Server Error
 */
