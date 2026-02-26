live Preview https://authentic-learning-production.up.railway.app
=========================================
                 eStore 
=========================================

eStore is a full-featured, modern e-commerce web application built to provide a seamless online shopping experience. 
It includes product browsing, authentication, cart management, order processing, and an admin dashboard for managing products and orders.

=========================================
                Features
=========================================
User Features

i. User Registration & Login (Authentication)
ii. Browse Products by Categories
iii. Search & Filter Products
iv. Product Details Page
v. Add to Cart / Remove from Cart
vi. Update Cart Quantity
vii. Secure Checkout Process
viii. Order History
ix. Responsive Design (Mobile + Desktop)

=========================================
             Admin Features
=========================================

i. Admin Login
ii.Add / Edit / Delete Products
iii. Manage Product Categories
iv. View All Orders
v. Update Order Status
vi. Manage Users

=========================================
              Tech Stack
=========================================
Frontend

i. React.js
ii. Tailwind CSS

Backend

i. Node.js
ii. Express.js
iii. MongoDB

=========================================
               Tools
=========================================

i. Git & GitHub
ii. Postman (API Testing)
iii. VS Code
iv. Railway (for deployment)


=========================================
        Installation & Setup
=========================================

i. Clone the Repository
ii. git clone https://github.com/Muhammad-Raheel04/eStore.git
iii. cd eStore
iv. cd Backend
v. npm install
vi. Create a .env file inside backend (all env's listed below)

PORT=
MONGO_URI=
MAIL_USER=
MAIL_PASS=
SECRET_KEY=
BREVO_USER=
BREVO_PASS=
FRONTEND_URL=
EMAIL_FROM=
BREVO_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_API_KEY=
CLOUDINARY_CLOUD_NAME=
ADMIN_EMAIL=

vii. Run backend nodemon server.js

npm run dev
=========================================
          Setup Frontend
=========================================

i. cd frontend
ii. npm install
ii. npm run dev

Frontend will run on

http://localhost:5173
=========================================
        Authentication Flow
=========================================

User registers → Password hashed using bcrypt.
JWT token generated on login.
Token stored in localStorage.
Protected routes verified using middleware.
Cart & Order Flow
User adds product to cart.
Cart stored in database.
User proceeds to checkout.
Order created in database.
Admin can update order status.


Future Improvements

Online Payment Integration (payfast)
Wishlist Feature
Product Reviews & Ratings
Dark Mode
