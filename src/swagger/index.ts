/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the user
 *         name:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           description: User's email
 *         profile_picture:
 *           type: string
 *           description: URL of the user's profile picture
 *         email_verified:
 *           type: boolean
 *           description: Whether the user's email is verified
 *         resume:
 *           type: string
 *           description: URL of the user's resume
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         is_admin:
 *           type: boolean
 *           description: Whether the user has admin rights
 *         domain:
 *           type: string
 *           description: User's domain (if applicable)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Error fetching users
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Error fetching user
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Error creating user
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               profile_picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating user
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error deleting user
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Error fetching user profile
 */

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update the current user's profile
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               profile_picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Error updating user profile
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the category
 *         name:
 *           type: string
 *           description: Name of the category
 *         description:
 *           type: string
 *           description: Description of the category
 *         featured:
 *           type: boolean
 *           description: Whether the category is featured or not
 *         status:
 *           type: string
 *           description: Status of the category
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of categories per page
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured categories
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *         description: Language locale for category names and descriptions
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
 *       500:
 *         description: Error creating category
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
 *       404:
 *         description: Category not found
 *       500:
 *         description: Error updating category
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the client
 *         name:
 *           type: string
 *           description: Client's name
 *         email:
 *           type: string
 *           description: Client's email
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Get all clients
 *     tags: [Client]
 *     responses:
 *       200:
 *         description: Clients fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Get a client by ID
 *     tags: [Client]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The client ID
 *     responses:
 *       200:
 *         description: Client fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Client]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       201:
 *         description: Client created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     summary: Update a client by ID
 *     tags: [Client]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: Client updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: Client not found
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Delete a client by ID
 *     tags: [Client]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The client ID
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /clients/count:
 *   get:
 *     summary: Get the count of clients
 *     tags: [Client]
 *     responses:
 *       200:
 *         description: Number of clients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     ContactMessage:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - service
 *         - message
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the contact message
 *         name:
 *           type: string
 *           description: The name of the person sending the message
 *         email:
 *           type: string
 *           description: The email address of the person sending the message
 *         service:
 *           $ref: '#/components/schemas/Category'
 *           description: The service category the message is related to
 *         message:
 *           type: string
 *           description: The message content
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /contactMessages:
 *   get:
 *     summary: Get all contact messages
 *     tags: [ContactMessage]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of contact messages per page
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *         description: The locale for the service category
 *     responses:
 *       200:
 *         description: List of contact messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 contacts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContactMessage'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /contactMessages:
 *   post:
 *     summary: Create a new contact message
 *     tags: [ContactMessage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactMessage'
 *     responses:
 *       201:
 *         description: Contact message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactMessage'
 *       400:
 *         description: Validation errors or bad request
 */

/**
 * @swagger
 * /contactMessages/{id}:
 *   get:
 *     summary: Get a contact message by ID
 *     tags: [ContactMessage]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact message ID
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *         description: The locale for the service category
 *     responses:
 *       200:
 *         description: Contact message fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactMessage'
 *       404:
 *         description: Contact message not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /contactMessages/{id}:
 *   delete:
 *     summary: Delete a contact message
 *     tags: [ContactMessage]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact message ID
 *     responses:
 *       200:
 *         description: Contact message deleted successfully
 *       404:
 *         description: Contact message not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     ContactMessage:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - service
 *         - message
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the contact message
 *         name:
 *           type: string
 *           description: The name of the person sending the message
 *         email:
 *           type: string
 *           description: The email address of the person sending the message
 *         service:
 *           $ref: '#/components/schemas/Category'
 *           description: The service category the message is related to
 *         message:
 *           type: string
 *           description: The message content
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /contactMessages:
 *   post:
 *     summary: Create a new contact message
 *     tags: [ContactMessage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactMessage'
 *     responses:
 *       201:
 *         description: Contact message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactMessage'
 *       400:
 *         description: Validation errors or bad request
 *       500:
 *         description: Error creating contact message
 */

/**
 * @swagger
 * /contactMessages:
 *   get:
 *     summary: Get all contact messages
 *     tags: [ContactMessage]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of messages per page
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *         description: Locale key for language preference
 *     responses:
 *       200:
 *         description: List of contact messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 contacts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContactMessage'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /contactMessages/{id}:
 *   get:
 *     summary: Get a contact message by ID
 *     tags: [ContactMessage]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact message ID
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *         description: Locale key for language preference
 *     responses:
 *       200:
 *         description: Contact message fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactMessage'
 *       404:
 *         description: Contact message not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /contactMessages/{id}:
 *   delete:
 *     summary: Delete a contact message
 *     tags: [ContactMessage]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact message ID
 *     responses:
 *       200:
 *         description: Contact message deleted successfully
 *       404:
 *         description: Contact message not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Experience:
 *       type: object
 *       required:
 *         - title
 *         - company
 *         - from
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the experience
 *         title:
 *           type: string
 *           description: Title of the experience
 *         company:
 *           type: string
 *           description: Company where the experience took place
 *         location:
 *           type: string
 *           description: Location of the company
 *         from:
 *           type: string
 *           format: date
 *           description: Starting date of the experience
 *         to:
 *           type: string
 *           format: date
 *           description: Ending date of the experience (if applicable)
 *         current:
 *           type: boolean
 *           description: Whether the experience is current
 *         description:
 *           type: string
 *           description: Description of the experience
 */

/**
 * @swagger
 * /experiences:
 *   post:
 *     summary: Create a new experience
 *     tags: [Experience]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Experience'
 *     responses:
 *       201:
 *         description: Experience created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Experience'
 *       400:
 *         description: Validation errors or bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /experiences:
 *   get:
 *     summary: Get all experiences
 *     tags: [Experience]
 *     responses:
 *       200:
 *         description: List of experiences
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Experience'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /experiences/{id}:
 *   get:
 *     summary: Get an experience by ID
 *     tags: [Experience]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The experience ID
 *     responses:
 *       200:
 *         description: Experience fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Experience'
 *       404:
 *         description: Experience not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /experiences/{id}:
 *   put:
 *     summary: Update an experience by ID
 *     tags: [Experience]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The experience ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Experience'
 *     responses:
 *       200:
 *         description: Experience updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Experience'
 *       404:
 *         description: Experience not found
 *       400:
 *         description: Validation errors or bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /experiences/{id}:
 *   delete:
 *     summary: Delete an experience by ID
 *     tags: [Experience]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The experience ID
 *     responses:
 *       200:
 *         description: Experience deleted successfully
 *       404:
 *         description: Experience not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - project
 *         - quantity
 *         - price
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the order
 *         project:
 *           type: string
 *           description: Project name associated with the order
 *         quantity:
 *           type: integer
 *           description: Quantity of the order
 *         price:
 *           type: number
 *           description: Total price of the order
 *         userId:
 *           type: string
 *           description: ID of the user who placed the order
 *         status:
 *           type: string
 *           description: Status of the order (e.g., 'pending', 'completed')
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation errors or bad request
 *       500:
 *         description: Error creating order
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Error fetching orders
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error fetching order
 */

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error deleting order
 */

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update an order by ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       400:
 *         description: Validation errors or bad request
 *       500:
 *         description: Error updating order
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Page:
 *       type: object
 *       required:
 *         - slug
 *         - title
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the page
 *         slug:
 *           type: string
 *           description: Slug (URL path) for the page
 *         title:
 *           type: object
 *           description: Title of the page in different locales
 *           additionalProperties:
 *             type: string
 *         content:
 *           type: object
 *           description: Content of the page in different locales
 *           additionalProperties:
 *             type: string
 *         featured:
 *           type: boolean
 *           description: Whether the page is featured or not
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           description: Status of the page (e.g., 'published', 'draft')
 */

/**
 * @swagger
 * /pages:
 *   get:
 *     summary: Get all pages
 *     tags: [Page]
 *     parameters:
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *         description: Locale for the page content
 *       - in: query
 *         name: multiLocale
 *         schema:
 *           type: boolean
 *         description: Fetch page content in multiple locales
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured pages
 *     responses:
 *       200:
 *         description: List of pages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Page'
 *       500:
 *         description: Error fetching pages
 */

/**
 * @swagger
 * /pages/{id}:
 *   get:
 *     summary: Get a page by ID
 *     tags: [Page]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The page ID
 *     responses:
 *       200:
 *         description: Page fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Page'
 *       404:
 *         description: Page not found
 *       500:
 *         description: Error fetching page
 */

/**
 * @swagger
 * /pages/slug/{slug}:
 *   get:
 *     summary: Get a page by slug
 *     tags: [Page]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The page slug
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *         description: Locale for the page content
 *       - in: query
 *         name: multiLocale
 *         schema:
 *           type: boolean
 *         description: Fetch page content in multiple locales
 *     responses:
 *       200:
 *         description: Page fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Page'
 *       404:
 *         description: Page not found
 *       500:
 *         description: Error fetching page
 */

/**
 * @swagger
 * /pages:
 *   post:
 *     summary: Create a new page
 *     tags: [Page]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Page'
 *     responses:
 *       201:
 *         description: Page created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Page'
 *       500:
 *         description: Error creating page
 */

/**
 * @swagger
 * /pages/{id}:
 *   put:
 *     summary: Update a page by ID
 *     tags: [Page]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The page ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Page'
 *     responses:
 *       200:
 *         description: Page updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Page'
 *       404:
 *         description: Page not found
 *       500:
 *         description: Error updating page
 */

/**
 * @swagger
 * /pages/{id}:
 *   delete:
 *     summary: Delete a page by ID
 *     tags: [Page]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The page ID
 *     responses:
 *       200:
 *         description: Page deleted successfully
 *       404:
 *         description: Page not found
 *       500:
 *         description: Error deleting page
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - category
 *         - user
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the project
 *         title:
 *           type: object
 *           description: Title of the project in different locales
 *           additionalProperties:
 *             type: string
 *         description:
 *           type: object
 *           description: Description of the project in different locales
 *           additionalProperties:
 *             type: string
 *         background:
 *           type: string
 *           description: Background image or color of the project
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: List of project images
 *         featured:
 *           type: boolean
 *           description: Whether the project is featured or not
 *         status:
 *           type: string
 *           description: Status of the project (e.g., 'active', 'archived')
 *         category:
 *           $ref: '#/components/schemas/Category'
 *           description: Category to which the project belongs
 *         user:
 *           $ref: '#/components/schemas/User'
 *           description: The user who created the project
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Project]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of projects per page
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured projects
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *         description: Locale key for language preference
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by project status (e.g., 'active', 'archived')
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *       500:
 *         description: Error fetching projects
 */

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *         description: Locale key for language preference
 *     responses:
 *       200:
 *         description: Project fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 *       500:
 *         description: Error fetching project
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Project]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       500:
 *         description: Error creating project
 */

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update a project by ID
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 *       500:
 *         description: Error updating project
 */

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project by ID
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Error deleting project
 */

/**
 * @swagger
 * /projects:
 *   delete:
 *     summary: Delete all projects
 *     tags: [Project]
 *     responses:
 *       200:
 *         description: All projects deleted successfully
 *       404:
 *         description: No projects found to delete
 *       500:
 *         description: Error deleting all projects
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Skill:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the skill
 *         title:
 *           type: string
 *           description: Title of the skill
 *         image:
 *           type: string
 *           description: Image URL of the skill
 */

/**
 * @swagger
 * /skills:
 *   get:
 *     summary: Get all skills
 *     tags: [Skill]
 *     responses:
 *       200:
 *         description: List of skills
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Skill'
 *                 message:
 *                   type: string
 *       500:
 *         description: Error fetching skills
 */

/**
 * @swagger
 * /skills/{id}:
 *   get:
 *     summary: Get a skill by ID
 *     tags: [Skill]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The skill ID
 *     responses:
 *       200:
 *         description: Skill fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skill'
 *       404:
 *         description: Skill not found
 *       500:
 *         description: Error fetching skill
 */

/**
 * @swagger
 * /skills:
 *   post:
 *     summary: Create a new skill
 *     tags: [Skill]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Skill created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skill'
 *       500:
 *         description: Error creating skill
 */

/**
 * @swagger
 * /skills/{id}:
 *   put:
 *     summary: Update a skill by ID
 *     tags: [Skill]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The skill ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skill'
 *       404:
 *         description: Skill not found
 *       500:
 *         description: Error updating skill
 */

/**
 * @swagger
 * /skills/{id}:
 *   delete:
 *     summary: Delete a skill by ID
 *     tags: [Skill]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The skill ID
 *     responses:
 *       200:
 *         description: Skill deleted successfully
 *       404:
 *         description: Skill not found
 *       500:
 *         description: Error deleting skill
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       properties:
 *         file:
 *           type: string
 *           format: binary
 *           description: Uploaded file
 */

/**
 * @swagger
 * /upload-images:
 *   post:
 *     summary: Upload multiple images
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/File'
 *     responses:
 *       200:
 *         description: File upload successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 files:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Failed to store the file
 */

/**
 * @swagger
 * /remove-image/{filename}:
 *   delete:
 *     summary: Remove an image by filename
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: filename
 *         schema:
 *           type: string
 *         required: true
 *         description: The filename of the image to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: File not found
 *       500:
 *         description: Unable to delete file
 */

/**
 * @swagger
 * /gallery:
 *   get:
 *     summary: List all uploaded images
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: List of images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Unable to scan directory
 */
