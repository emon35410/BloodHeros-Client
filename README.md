Blood Donation Application

Project Description

A full-stack MERN application that connects blood donors with recipients in urgent need. Users can register, create/manage donation requests, search for donors, and volunteer to donate. Features role-based access (Admin, Volunteer, Donor) with secure authentication and responsive dashboards.


Key Features

User registration/login with avatar upload (ImageBB)
Role-based dashboards (Admin: user/request management; Volunteer: request status updates; Donor: create/view personal requests)
Create, edit, delete, and filter blood donation requests with status (pending → inprogress → done/canceled)
Public search for donors by blood group, district, upazila
Public view of pending requests with private details & volunteer donation
Admin controls: block/unblock users, change roles
Funding page with Stripe payment integration (total funds shown on admin/volunteer dashboard)
Pagination on tables, JWT-protected routes
Fully responsive design

Technologies Used
Frontend

React.js
React Router DOM
Tailwind CSS / DaisyUI
Axios
TanStack Query (React Query)
React Hook Form
Firebase (optional) / Custom JWT
Stripe.js for payments
Framer Motion / AOS (optional animations)

Backend

Node.js
Express.js
MongoDB with Mongoose
JWT for authentication
Bcrypt for password hashing
Stripe for payments
Cors, Dotenv


Live Link : https://bloodherosemon.netlify.app/
Git Repo
Client: https://github.com/emon35410/BloodHeros-Client.git
Server: https://github.com/emon35410/BloodHeros-Server.git



