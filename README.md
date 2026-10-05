# Restaurant Management & Ordering System

A full-stack restaurant management and ordering system built with **Node.js, Express, Prisma, and SQLite**.

The project provides separate experiences for customers and administrators, including product management, authentication, shopping cart functionality, and order management.

## Features

### Customer

* Customer registration and login
* JWT-based authentication
* Browse available menu items
* Add products to cart
* Increase/decrease item quantities
* Remove items from cart
* Checkout and create orders
* View previous orders
* View order status
* Customer logout

### Admin

* Admin authentication
* Protected admin routes
* Add new products
* Edit existing products
* Delete products
* Upload product images
* Enable/disable product availability
* View all customer orders
* View order details and customer information
* Update order status

## Technologies

* **Node.js**
* **Express.js**
* **JavaScript**
* **HTML5**
* **CSS3**
* **Prisma ORM**
* **SQLite**
* **JWT**
* **bcrypt**
* **Multer**

## Project Structure

```text
Restaurant_Project/
│
├── controllers/
│   ├── authController.js
│   ├── orderController.js
│   └── productController.js
│
├── lib/
│   └── prisma.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── upload.js
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── routes/
│   ├── authRoutes.js
│   ├── orderRoutes.js
│   └── productRoutes.js
│
├── validators/
│   └── productValidator.js
│
├── views/
│   ├── admin.html
│   ├── cart.html
│   ├── customer-login.html
│   ├── home.html
│   ├── login.html
│   ├── orders.html
│   └── register.html
│
├── server.js
├── package.json
└── prisma7.config.ts
```

## Authentication & Authorization

The application uses **JWT authentication** to protect API routes.

There are two user roles:

* `customer`
* `admin`

Customers can access their own orders and create new orders.

Administrators can manage products and manage customer orders.

Passwords are securely hashed using **bcrypt** before being stored in the database.

## Order System

The order system uses three main models:

```text
User
  │
  └── Order
        │
        └── OrderItem
              │
              └── Product
```

When a customer checks out, the server retrieves the product information from the database and calculates the order total on the server.

Order statuses include:

* Pending
* Preparing
* Completed
* Cancelled

## API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Products

```text
GET    /api/products
GET    /api/products/:id
GET    /api/products/admin/all
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Orders

```text
POST  /api/orders
GET   /api/orders/my-orders
GET   /api/orders/admin
PATCH /api/orders/admin/:id/status
```

Protected endpoints require authentication, and admin endpoints additionally require an administrator role.

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/Omar-Ahmed2004/Restaurant_Project.git
cd Restaurant_Project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret_key"
```

### 4. Run Prisma migrations

```bash
npx prisma@7 migrate dev
```

### 5. Generate Prisma Client

```bash
npx prisma@7 generate
```

### 6. Start the server

```bash
node server.js
```

The application will be available at:

```text
http://localhost:3000
```

## Project Purpose

This project was built as a practical backend development project to gain hands-on experience with:

* Node.js and Express
* REST APIs
* Database design
* Prisma ORM
* Authentication and authorization
* File uploads
* Shopping cart and order workflows
* Role-based access control
* Connecting frontend interfaces with backend APIs

## Author

**Omar Ahmed Hadhood**

GitHub:
https://github.com/Omar-Ahmed2004
