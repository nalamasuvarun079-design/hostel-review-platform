const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const initialHostels = [
  {
    _id: "h1",
    name: "St. Jude Student Residence & Elite Stays",
    slug: "st-jude-student-residence",
    description: "Premium student accommodation located right next to North Campus. Features fully furnished AC rooms, 24/7 high-speed Wi-Fi, organic chef-curated meals, multi-tier biometric security, and dedicated quiet study lounges.",
    genderType: "Co-ed",
    address: "42 Hudson Lane, GTB Nagar, Kingsway Camp",
    city: "New Delhi",
    area: "North Campus",
    nearestCollege: "Delhi University (North Campus)",
    distanceFromCollege: 0.6,
    coordinates: { lat: 28.6942, lng: 77.2090 },
    monthlyRent: { min: 11500, max: 18500 },
    roomTypes: [
      { _id: "r1", type: "Single Occupancy (AC)", rent: 18500, available: true, description: "Private room with balcony, attached bath, and study desk." },
      { _id: "r2", type: "Double Sharing (AC)", rent: 13500, available: true, description: "Spacious twin sharing with individual wardrobes." },
      { _id: "r3", type: "Triple Sharing (Non-AC)", rent: 11500, available: true, description: "Budget friendly room with air cooler." }
    ],
    facilities: ["Wi-Fi", "AC", "Mess Food", "Laundry", "CCTV", "Power Backup", "Gym", "Study Room", "Security"],
    foodDetails: {
      available: true,
      type: "Veg & Non-Veg",
      description: "4 meals daily (Breakfast, Lunch, Evening Snacks, Dinner). Sunday Special Feast.",
      includedInRent: true
    },
    wifiDetails: { available: true, speedMbps: 200 },
    acDetails: { acAvailable: true },
    rules: ["Curfew at 10:30 PM", "Biometric entry system", "Visitors allowed in common room only", "No smoking or alcohol allowed on premises"],
    contact: {
      ownerName: "Rajesh Kumar",
      phone: "+91 98765 43210",
      email: "stjude.hostel@gmail.com",
      whatsapp: "919876543210"
    },
    photos: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800"
    ],
    ratings: { overall: 4.8, cleanliness: 4.9, food: 4.7, safety: 4.9, wifi: 4.8, location: 4.9 },
    reviewCount: 28,
    isFeatured: true,
    verified: true,
    createdAt: "2026-01-10T10:00:00.000Z"
  },
  {
    _id: "h2",
    name: "Greenwoods Girls PG & Luxury Suites",
    slug: "greenwoods-girls-pg",
    description: "Exclusive women-only hostel offering safe, serene, and modern living standard close to Christ University. Features biometric access control, female security staff, hygienic home-cooked meals, and RO purified water.",
    genderType: "Girls",
    address: "18 Koramangala 4th Block, 80 Feet Road",
    city: "Bangalore",
    area: "Koramangala",
    nearestCollege: "Christ University",
    distanceFromCollege: 0.9,
    coordinates: { lat: 12.9352, lng: 77.6245 },
    monthlyRent: { min: 9500, max: 15000 },
    roomTypes: [
      { _id: "r4", type: "Single Room (AC)", rent: 15000, available: true, description: "Fully furnished with attached bathroom and mini fridge." },
      { _id: "r5", type: "Double Sharing (AC)", rent: 11000, available: true, description: "Twin beds, individual wardrobes, study tables." },
      { _id: "r6", type: "Triple Sharing (Non-AC)", rent: 9500, available: false, description: "Cozy ventilated room." }
    ],
    facilities: ["Wi-Fi", "AC", "Mess Food", "Laundry", "CCTV", "Power Backup", "Security"],
    foodDetails: {
      available: true,
      type: "Pure Veg",
      description: "Healthy vegetarian South & North Indian menu. Milk and fruit tea available daily.",
      includedInRent: true
    },
    wifiDetails: { available: true, speedMbps: 150 },
    acDetails: { acAvailable: true },
    rules: ["Strict gate timing: 9:30 PM", "Parent/Guardian approval required for overnight night-outs", "No male visitors inside rooms"],
    contact: {
      ownerName: "Sunita Sharma",
      phone: "+91 91234 56789",
      email: "greenwoodsgirlshostel@gmail.com",
      whatsapp: "919123456789"
    },
    photos: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800"
    ],
    ratings: { overall: 4.6, cleanliness: 4.8, food: 4.4, safety: 4.9, wifi: 4.5, location: 4.7 },
    reviewCount: 19,
    isFeatured: true,
    verified: true,
    createdAt: "2026-01-15T10:00:00.000Z"
  },
  {
    _id: "h3",
    name: "Phoenix Boys Hub & Scholar Living",
    slug: "phoenix-boys-hub",
    description: "Designed for coaching students and engineering undergraduates. Ultra-quiet study environment with high-speed fiber Wi-Fi, ergonomic chairs, gaming lounge, and gym facilities.",
    genderType: "Boys",
    address: "102 Rajiv Gandhi Nagar, Near Allen Career Institute",
    city: "Kota",
    area: "Rajiv Gandhi Nagar",
    nearestCollege: "Allen Career Institute / RTU",
    distanceFromCollege: 0.3,
    coordinates: { lat: 25.1384, lng: 75.8450 },
    monthlyRent: { min: 8000, max: 14000 },
    roomTypes: [
      { _id: "r7", type: "Single Deluxe AC", rent: 14000, available: true, description: "Private soundproofed room with executive desk." },
      { _id: "r8", type: "Double Sharing AC", rent: 9800, available: true, description: "Two study units with high speed ethernet sockets." },
      { _id: "r9", type: "Double Sharing Non-AC", rent: 8000, available: true, description: "Ventilated room with cooler." }
    ],
    facilities: ["Wi-Fi", "AC", "Mess Food", "Laundry", "CCTV", "Power Backup", "Gym", "Study Room"],
    foodDetails: {
      available: true,
      type: "Veg & Non-Veg",
      description: "High protein diet suitable for students. Snack station open till 11 PM.",
      includedInRent: true
    },
    wifiDetails: { available: true, speedMbps: 300 },
    acDetails: { acAvailable: true },
    rules: ["Study silence hours: 10 PM - 6 AM", "Biometric attendance recorded twice daily", "Visitors restricted to lobby"],
    contact: {
      ownerName: "Vikram Rathore",
      phone: "+91 97850 12345",
      email: "phoenixhostels.kota@gmail.com",
      whatsapp: "919785012345"
    },
    photos: [
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800"
    ],
    ratings: { overall: 4.5, cleanliness: 4.4, food: 4.3, safety: 4.7, wifi: 4.8, location: 4.6 },
    reviewCount: 34,
    isFeatured: true,
    verified: true,
    createdAt: "2026-02-01T10:00:00.000Z"
  },
  {
    _id: "h4",
    name: "Scholar's Haven Co-Living Campus",
    slug: "scholars-haven-co-living",
    description: "Modern co-living space tailored for IT professionals and university students around Powai and IIT Bombay. Features coworking desks, laundry room, rooftop cafeteria, and weekly housekeeping.",
    genderType: "Co-ed",
    address: "77 Hiranandani Gardens, Powai",
    city: "Mumbai",
    area: "Powai",
    nearestCollege: "IIT Bombay",
    distanceFromCollege: 1.2,
    coordinates: { lat: 19.1176, lng: 72.9060 },
    monthlyRent: { min: 14000, max: 24000 },
    roomTypes: [
      { _id: "r10", type: "Private Studio AC", rent: 24000, available: true, description: "Ensuite kitchenette, smart TV, king bed." },
      { _id: "r11", type: "Twin Sharing AC", rent: 16500, available: true, description: "Spacious room with ergonomic study desk." },
      { _id: "r12", type: "Triple Sharing AC", rent: 14000, available: true, description: "Budget AC sharing option." }
    ],
    facilities: ["Wi-Fi", "AC", "Laundry", "CCTV", "Power Backup", "Gym", "Study Room", "Security"],
    foodDetails: {
      available: false,
      type: "Self Kitchen & Cafe",
      description: "Communal kitchen on each floor + paid cafe options.",
      includedInRent: false
    },
    wifiDetails: { available: true, speedMbps: 250 },
    acDetails: { acAvailable: true },
    rules: ["No noise after 11 PM", "Keycard access only", "Pets allowed on approval"],
    contact: {
      ownerName: "Ananya Mehta",
      phone: "+91 98200 99887",
      email: "contact@scholars-haven.com",
      whatsapp: "919820099887"
    },
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800"
    ],
    ratings: { overall: 4.7, cleanliness: 4.8, food: 4.0, safety: 4.9, wifi: 4.9, location: 4.8 },
    reviewCount: 42,
    isFeatured: false,
    verified: true,
    createdAt: "2026-02-10T10:00:00.000Z"
  },
  {
    _id: "h5",
    name: "Serenity Girls PG & Residency",
    slug: "serenity-girls-pg",
    description: "Vibrant and secure girls hostel in Viman Nagar, Pune. Walking distance to Symbiosis Campus. Features daily cleaning, high-speed Wi-Fi, air conditioning, and 24/7 security guard.",
    genderType: "Girls",
    address: "24 Datta Mandir Road, Viman Nagar",
    city: "Pune",
    area: "Viman Nagar",
    nearestCollege: "Symbiosis International University",
    distanceFromCollege: 0.4,
    coordinates: { lat: 18.5679, lng: 73.9143 },
    monthlyRent: { min: 10000, max: 17000 },
    roomTypes: [
      { _id: "r13", type: "Single Deluxe AC", rent: 17000, available: true, description: "Private room with workstation." },
      { _id: "r14", type: "Double Sharing AC", rent: 12000, available: true, description: "Comfortable twin room with wooden wardrobes." },
      { _id: "r15", type: "Triple Sharing Non-AC", rent: 10000, available: true, description: "Airy non-ac sharing room." }
    ],
    facilities: ["Wi-Fi", "AC", "Mess Food", "Laundry", "CCTV", "Power Backup", "Security"],
    foodDetails: {
      available: true,
      type: "Veg & Non-Veg",
      description: "Breakfast and dinner provided daily. Special Sunday lunch.",
      includedInRent: true
    },
    wifiDetails: { available: true, speedMbps: 100 },
    acDetails: { acAvailable: true },
    rules: ["Curfew at 10 PM sharp", "No smoking", "Guests allowed in visitor lounge"],
    contact: {
      ownerName: "Pooja Deshmukh",
      phone: "+91 94220 33445",
      email: "serenitypg.pune@gmail.com",
      whatsapp: "919422033445"
    },
    photos: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800"
    ],
    ratings: { overall: 4.4, cleanliness: 4.6, food: 4.2, safety: 4.8, wifi: 4.4, location: 4.7 },
    reviewCount: 15,
    isFeatured: false,
    verified: true,
    createdAt: "2026-02-14T10:00:00.000Z"
  }
];

const initialUsers = [
  {
    _id: "u1",
    name: "Admin User",
    email: "admin@hosteller.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    college: "IIT Bombay",
    phone: "+91 99999 88888",
    savedHostels: ["h1", "h4"],
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    _id: "u2",
    name: "Rohan Verma",
    email: "rohan@gmail.com",
    password: bcrypt.hashSync("student123", 10),
    role: "student",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300",
    college: "Delhi University",
    phone: "+91 98765 11111",
    savedHostels: ["h1"],
    createdAt: "2026-01-05T00:00:00.000Z"
  },
  {
    _id: "u3",
    name: "Priya Sharma",
    email: "priya@gmail.com",
    password: bcrypt.hashSync("student123", 10),
    role: "student",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
    college: "Christ University",
    phone: "+91 98765 22222",
    savedHostels: ["h2"],
    createdAt: "2026-01-12T00:00:00.000Z"
  }
];

const initialReviews = [
  {
    _id: "r_1",
    hostel: "h1",
    user: { _id: "u2", name: "Rohan Verma", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300" },
    rating: 5,
    cleanlinessRating: 5,
    foodRating: 5,
    safetyRating: 5,
    wifiRating: 5,
    locationRating: 5,
    title: "Best place for DU students!",
    comment: "I stayed here for my 2nd and 3rd year. Super clean rooms, amazing food menu, and just 5 minutes walk to North Campus metro & library. Highly recommended!",
    photos: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600"],
    likes: ["u1", "u3"],
    reported: false,
    verifiedStay: true,
    createdAt: "2026-02-01T12:00:00.000Z"
  },
  {
    _id: "r_2",
    hostel: "h1",
    user: { _id: "u3", name: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300" },
    rating: 4,
    cleanlinessRating: 5,
    foodRating: 4,
    safetyRating: 5,
    wifiRating: 4,
    locationRating: 5,
    title: "Great security and peaceful vibe",
    comment: "The security guards are very alert and helpful. The study room is silent 24/7 which helped me prepare for my exams. Food is decent.",
    photos: [],
    likes: ["u2"],
    reported: false,
    verifiedStay: true,
    createdAt: "2026-02-15T14:30:00.000Z"
  },
  {
    _id: "r_3",
    hostel: "h2",
    user: { _id: "u3", name: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300" },
    rating: 5,
    cleanlinessRating: 5,
    foodRating: 4,
    safetyRating: 5,
    wifiRating: 5,
    locationRating: 4,
    title: "Super safe PG for female students in Koramangala",
    comment: "Felt very safe here! The Warden is super warm and caring. Cleanliness is top notch with daily room mopping.",
    photos: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600"],
    likes: ["u1"],
    reported: false,
    verifiedStay: true,
    createdAt: "2026-02-20T09:15:00.000Z"
  }
];

const initialReports = [
  {
    _id: "rep_1",
    review: "r_2",
    reportedBy: { _id: "u2", name: "Rohan Verma", email: "rohan@gmail.com" },
    reason: "Contains mild spam / irrelevant comments",
    status: "pending",
    createdAt: "2026-03-01T10:00:00.000Z"
  }
];

let state = {
  hostels: [...initialHostels],
  users: [...initialUsers],
  reviews: [...initialReviews],
  reports: [...initialReports]
};

const getStore = () => state;

const updateHostelRatings = (hostelId) => {
  const hostelReviews = state.reviews.filter(r => (r.hostel._id || r.hostel) === hostelId);
  const hostel = state.hostels.find(h => h._id === hostelId);
  if (!hostel) return;

  if (hostelReviews.length === 0) {
    hostel.ratings = { overall: 0, cleanliness: 0, food: 0, safety: 0, wifi: 0, location: 0 };
    hostel.reviewCount = 0;
    return;
  }

  const sum = hostelReviews.reduce(
    (acc, curr) => {
      acc.overall += curr.rating;
      acc.cleanliness += curr.cleanlinessRating;
      acc.food += curr.foodRating;
      acc.safety += curr.safetyRating;
      acc.wifi += curr.wifiRating;
      acc.location += curr.locationRating;
      return acc;
    },
    { overall: 0, cleanliness: 0, food: 0, safety: 0, wifi: 0, location: 0 }
  );

  const count = hostelReviews.length;
  hostel.ratings = {
    overall: parseFloat((sum.overall / count).toFixed(1)),
    cleanliness: parseFloat((sum.cleanliness / count).toFixed(1)),
    food: parseFloat((sum.food / count).toFixed(1)),
    safety: parseFloat((sum.safety / count).toFixed(1)),
    wifi: parseFloat((sum.wifi / count).toFixed(1)),
    location: parseFloat((sum.location / count).toFixed(1))
  };
  hostel.reviewCount = count;
};

module.exports = {
  getStore,
  updateHostelRatings,
  initialHostels,
  initialUsers,
  initialReviews,
  initialReports
};
