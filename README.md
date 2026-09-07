# Hosteller - Modern Full-Stack Hostel Review Platform

Hosteller is a production-ready full-stack web application designed for university students to search, review, rate, and compare hostels and PGs near their colleges.

---

## 🌟 Key Features

1. **Home Page**: Search banner by name, college, area, or city; top-rated hostel showcase; platform stats.
2. **Hostel Listings & Search**: Multi-criteria filter sidebar (price range, ratings, gender, mess food, Wi-Fi, AC, college distance); interactive OpenStreetMap (Leaflet); grid/map view toggle.
3. **Hostel Details Page**: Image gallery with modal preview, rent & room types breakdown, facilities badges, mess menu info, curfew & hostel rules, contact owner details, and Leaflet location map.
4. **Review & Rating System**: 5-criteria rating (Cleanliness, Food, Safety, Wi-Fi, Location); written experience; image attachments; helpful vote counter; report inappropriate review.
5. **Hostel Comparison Tool**: Side-by-side comparison table of up to 3 hostels comparing rent, ratings, food, Wi-Fi speed, distance, rules, and amenities.
6. **User Authentication & Profile**: JWT authentication; student vs admin roles; saved/bookmarked hostels list; review management (edit & delete own reviews).
7. **Admin Dashboard**: Analytics KPIs (Total Hostels, Total Reviews, Active Users, Pending Reports); full CRUD for hostels; review moderation for reported content; user role management.
8. **Seamless Fallback**: Works out-of-the-box using an in-memory/persisted mock database fallback if local MongoDB is not running.

---

## 📂 Project Folder Structure

```
hostel-review-platform/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & fallback handler
│   ├── controllers/
│   │   ├── adminController.js    # Admin stats, reports moderation & user roles
│   │   ├── authController.js     # User registration, login, profile & bookmarks
│   │   ├── hostelController.js   # Hostel search, filters & CRUD
│   │   └── reviewController.js   # Reviews submission, edit, delete, like, report
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT protection & admin role check
│   │   └── errorHandler.js       # Express error middleware
│   ├── models/
│   │   ├── Hostel.js             # Mongoose Hostel schema
│   │   ├── Report.js             # Mongoose Report schema
│   │   ├── Review.js             # Mongoose Review schema
│   │   └── User.js               # Mongoose User schema
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── hostelRoutes.js
│   │   └── reviewRoutes.js
│   ├── utils/
│   │   ├── mockDb.js             # Rich mock store with pre-populated demo data
│   │   └── seed.js               # MongoDB database seeder script
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Express server entrypoint
└── client/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Admin/            # AdminStats, AdminHostelModal, AdminReports, AdminUsers
    │   │   ├── Common/           # Navbar, Footer, RatingStars, RoomBadge, LoadingSpinner, ProtectedRoute
    │   │   ├── Hostel/           # HostelCard, FilterSidebar, HostelGallery, HostelMap, ReviewModal
    │   │   └── Reviews/          # RatingBreakdown, ReviewCard
    │   ├── context/
    │   │   └── AuthContext.jsx   # Auth & bookmark state manager
    │   ├── pages/
    │   │   ├── AdminDashboardPage.jsx
    │   │   ├── ComparePage.jsx
    │   │   ├── HostelDetailPage.jsx
    │   │   ├── HostelListPage.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── services/
    │   │   └── api.js            # Axios API client with Bearer token interceptor
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🗄️ Database Schemas

### 1. User Schema (`User.js`)
- `name`: String (Required)
- `email`: String (Required, Unique)
- `password`: String (Required, Hashed with bcrypt)
- `role`: String ('student' | 'admin', default: 'student')
- `avatar`: String
- `college`: String
- `phone`: String
- `savedHostels`: Array of Hostel ObjectIds

### 2. Hostel Schema (`Hostel.js`)
- `name`: String (Required)
- `slug`: String
- `description`: String (Required)
- `genderType`: String ('Boys' | 'Girls' | 'Co-ed')
- `address`: String (Required)
- `city`: String (Required)
- `area`: String (Required)
- `nearestCollege`: String (Required)
- `distanceFromCollege`: Number (in KM)
- `coordinates`: `{ lat: Number, lng: Number }`
- `monthlyRent`: `{ min: Number, max: Number }`
- `roomTypes`: `[{ type, rent, available, description }]`
- `facilities`: Array of Strings (Wi-Fi, AC, Mess Food, Laundry, CCTV, etc.)
- `foodDetails`: `{ available: Boolean, type: String, description: String, includedInRent: Boolean }`
- `wifiDetails`: `{ available: Boolean, speedMbps: Number }`
- `acDetails`: `{ acAvailable: Boolean }`
- `rules`: Array of Strings
- `contact`: `{ ownerName, phone, email, whatsapp }`
- `photos`: Array of Image URLs
- `ratings`: `{ overall, cleanliness, food, safety, wifi, location }`
- `reviewCount`: Number

### 3. Review Schema (`Review.js`)
- `hostel`: ObjectId ref Hostel (Required)
- `user`: ObjectId ref User (Required)
- `rating`: Number (1–5)
- `cleanlinessRating`: Number (1–5)
- `foodRating`: Number (1–5)
- `safetyRating`: Number (1–5)
- `wifiRating`: Number (1–5)
- `locationRating`: Number (1–5)
- `title`: String (Required)
- `comment`: String (Required)
- `photos`: Array of Image URLs
- `likes`: Array of User ObjectIds
- `reported`: Boolean
- `verifiedStay`: Boolean

---

## 🔌 API Endpoints Summary

### Authentication & Profile (`/api/auth`)
- `POST /api/auth/register` - Student/Admin registration
- `POST /api/auth/login` - User authentication (returns JWT token)
- `GET /api/auth/profile` - Fetch current user profile & bookmarked hostels
- `POST /api/auth/save-hostel/:hostelId` - Toggle bookmark saved hostel

### Hostels (`/api/hostels`)
- `GET /api/hostels` - List hostels with search, filters (location, gender, rent, rating, amenities, distance) & sorting
- `GET /api/hostels/:id` - Get hostel details by ID or slug
- `POST /api/hostels` - Create new hostel (Admin only)
- `PUT /api/hostels/:id` - Update hostel details (Admin only)
- `DELETE /api/hostels/:id` - Delete hostel (Admin only)

### Reviews (`/api/reviews`)
- `GET /api/reviews/hostel/:hostelId` - Get all reviews for a hostel
- `POST /api/reviews` - Submit a student review & update hostel average ratings
- `PUT /api/reviews/:id` - Update review (Author/Admin)
- `DELETE /api/reviews/:id` - Delete review (Author/Admin)
- `POST /api/reviews/:id/like` - Toggle helpful vote
- `POST /api/reviews/:id/report` - Flag review for moderation

### Admin Management (`/api/admin`)
- `GET /api/admin/stats` - Fetch platform stats
- `GET /api/admin/users` - Fetch user directory
- `PUT /api/admin/users/:id` - Change user role
- `GET /api/admin/reports` - Fetch flagged reviews
- `PUT /api/admin/reports/:id` - Resolve or dismiss report

---

## ⚡ Quick Setup & Local Execution

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (Optional: System runs seamlessly in mock store mode if MongoDB is offline)

### Step 1: Clone & Setup Backend Server
```bash
cd server
npm install
npm run seed  # (Optional: Seeds local MongoDB database)
npm start     # Starts Express API server on http://localhost:5000
```

### Step 2: Setup Frontend Client
```bash
cd client
npm install
npm run dev   # Starts Vite React App on http://localhost:3000
```

---

## 🔑 Demo Login Credentials

- **Demo Student**:
  - Email: `rohan@gmail.com`
  - Password: `student123`

- **Demo Admin**:
  - Email: `admin@hosteller.com`
  - Password: `admin123`

---

## 🚀 Deployment Instructions

### 1. Backend Deployment (Render / Railway / Heroku)
1. Push code repository to GitHub.
2. Create a Web Service on Render or Railway pointing to the `/server` directory.
3. Set Build Command: `npm install`
4. Set Start Command: `node server.js`
5. Configure Environment Variables:
   - `PORT`: `5000`
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET`: `<Secure Random Secret Key>`

### 2. Database Deployment (MongoDB Atlas)
1. Register on MongoDB Atlas and create a free Cluster.
2. Add Database User & IP access (`0.0.0.0/0`).
3. Copy connection URI string and set as `MONGODB_URI` env var.
4. Run `npm run seed` pointing to your Atlas URI.

### 3. Frontend Deployment (Vercel / Netlify)
1. Create a new site on Vercel/Netlify linked to your GitHub repo (`/client` root).
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Set Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend-url.onrender.com`
