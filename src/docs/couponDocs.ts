/**
 * @swagger
 * tags:
 *   name: Coupon
 *   description: Coupon management
 */

/**
 * @swagger
 * /api/v1/coupons/:
 *   post:
 *     summary: Create a new coupon
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               expirationDate:
 *                 type: string
 *                 format: date
 *               percentage: 
 *                type: number
 *               applicableProducts:
 *                type: array
 *                items:
 *                 type: number
 *     responses:
 *       '201':
 *         description: Coupon successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating successful coupon creation
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The unique identifier of the coupon
 *                     code:
 *                       type: string
 *                       description: The code of the coupon
 *                     discount:
 *                       type: number
 *                       description: The discount value of the coupon
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
 *         description: Conflict - Coupon code already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the code of coupon already exists
 */

/**
 * @swagger
 * /api/v1/coupons/:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupon]
 *     responses:
 *       '200':
 *         description: Successful
 *       '404':
 *         description: Coupons not found
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/coupons/mine:
 *   get:
 *     summary: Get own coupons
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful
 *       '404':
 *         description: Coupons not found
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/coupons/{couponId}:
 *   get:
 *     summary: Get an existing coupon
 *     tags: [Coupon]
 *     parameters:
 *       - in: path
 *         name: couponId
 *         type: string
 *         required: true
 *         description: ID of the coupon
 *     responses:
 *       '200':
 *         description: Successful
 *       '404':
 *         description: Coupon not found
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/coupons/{couponId}:
 *   put:
 *     summary: Update an existing coupon
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: couponId
 *         type: string
 *         required: true
 *         description: ID of the coupon
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               expirationDate:
 *                 type: string
 *                 format: date
 *               percentage: 
 *                type: number
 *               applicableProducts:
 *                type: array
 *                items:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Coupon successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating successful coupon updation
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The unique identifier of the coupon
 *                     code:
 *                       type: string
 *                       description: The code of the coupon
 *                     discount:
 *                       type: number
 *                       description: The discount value of the coupon
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
 *         description: Conflict - Coupon code already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the code of coupon already exists
 */

/**
 * @swagger
 * /api/v1/coupons/{couponId}:
 *   delete:
 *     summary: Delete an existing coupon
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: couponId
 *         type: string
 *         required: true
 *         description: ID of the coupon to delete
 *     responses:
 *       '200':
 *         description: Delete Successful
 *       '404':
 *         description: Coupon not found
 *       '500':
 *         description: Internal Server Error
 */
