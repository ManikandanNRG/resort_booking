# Resort Application API Documentation

## Authentication Endpoints
### 1. User Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

## Resort Management
### 2. Resort Operations
- `GET /api/resorts` - Get all resorts
- `GET /api/resorts/:id` - Get single resort details
- `POST /api/resorts` - Create new resort (Auth required)
- `PUT /api/resorts/:id` - Update resort (Auth + Owner required)
- `DELETE /api/resorts/:id` - Delete resort (Auth + Owner required)

### 3. Room Types
- `GET /api/resorts/:id/room-types` - Get all room types for a resort
- `GET /api/room-types/:id` - Get single room type details
- `POST /api/resorts/:id/room-types` - Add room type to resort (Auth + Owner required)
- `PUT /api/room-types/:id` - Update room type (Auth + Owner required)
- `DELETE /api/room-types/:id` - Delete room type (Auth + Owner required)

### 4. Bookings
- `GET /api/bookings` - Get user's bookings (Auth required)
- `GET /api/resorts/:id/bookings` - Get resort bookings (Auth + Owner required)
- `POST /api/resorts/:id/bookings` - Create new booking (Auth required)
- `PUT /api/bookings/:id` - Update booking (Auth + Owner/Booker required)
- `DELETE /api/bookings/:id` - Cancel booking (Auth + Owner/Booker required)

### 5. Reviews & Ratings
- `GET /api/resorts/:id/reviews` - Get resort reviews
- `POST /api/resorts/:id/reviews` - Add review to resort (Auth required)
- `PUT /api/reviews/:id` - Update review (Auth + Review Owner required)
- `DELETE /api/reviews/:id` - Delete review (Auth + Review Owner required)

### 6. Resort Amenities
- `GET /api/resorts/:id/amenities` - Get resort amenities
- `POST /api/resorts/:id/amenities` - Add amenities to resort (Auth + Owner required)
- `PUT /api/amenities/:id` - Update amenity (Auth + Owner required)
- `DELETE /api/amenities/:id` - Remove amenity (Auth + Owner required)

### 7. User Profile
- `GET /api/users/profile` - Get user profile (Auth required)
- `PUT /api/users/profile` - Update user profile (Auth required)
- `GET /api/users/:id/resorts` - Get resorts owned by user (Auth required)

### 8. Search & Filters
- `GET /api/resorts/search` - Search resorts with filters
- `GET /api/resorts/nearby` - Find nearby resorts

### 9. Resort Images
- `POST /api/resorts/:id/images` - Upload resort images (Auth + Owner required)
- `DELETE /api/resorts/images/:id` - Delete resort image (Auth + Owner required)

## Authorization Levels
- **Public**: No authentication required
- **Auth**: Valid JWT token required
- **Owner**: Must be the owner of the resource
- **Admin**: Must have admin privileges
- **Review Owner**: Must be the creator of the review
- **Booker**: Must be the person who made the booking