# Beyt Next.js Project

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file with the required environment variables (see code for details).
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

This project exposes several RESTful API endpoints under `/api/`:

### User APIs

- **GET /api/users/[id]**: Get user details and their properties by user ID. Also supports updating user info via PUT.
- **GET /api/users/user-exist?email=**: Check if a user exists by email.
  - **Query Parameters:**
    - `email` (string, required): Email address to check.
- **GET /api/users/saved-listings?userId=**: Get a user's saved (favorite) property listings.
  - **Query Parameters:**
    - `userId` (string, required): User's MongoDB ObjectId.
- **POST /api/users/save-listing**: Add or remove a property from a user's favorites.
  - **Body:**
    ```json
    {
      "userId": "string", // User's MongoDB ObjectId
      "propertyId": "string" // Property's MongoDB ObjectId
    }
    ```

### Property APIs

- **GET /api/properties**: List properties with filters.
  - **Query Parameters:**
    - `featured` (boolean, optional): Filter by featured properties.
    - `name` (string, optional): Search by property title (case-insensitive).
    - `type` (string or array, optional): Filter by property type(s).
    - `status` (string, optional): Filter by property status.
    - `location` (string array, optional): Filter by city.
    - `bedrooms` (number, optional): Filter by number of bedrooms.
    - `bathrooms` (number, optional): Filter by number of bathrooms.
    - `minPrice` (number, optional): Minimum price.
    - `maxPrice` (number, optional): Maximum price.
    - `sortBy` (string, optional): Sort field (e.g., 'price', 'createdAt').
    - `userId` (string, optional): Filter by user/agent.
    - `page` (number, optional): Page number for pagination (default: 1).
    - `limit` (number, optional): Results per page (default: 9).
- **GET /api/properties/[id]**: Get details of a property by ID, including similar properties.
- **POST /api/properties/create**: Create a new property. Requires user authentication and property data in the body.
  - **Body:**
    ```json
    {
      "userId": "string", // Required, User's MongoDB ObjectId
      "title": "string",
      "titleArabic": "string",
      "status": "string", // See PROPERTY_STATUS
      "price": number,
      "priceArabic": "string",
      "location": {
        "lat": "string",
        "lng": "string",
        "address": "string",
        "city": "string",
        "pincode": "string",
        "country": "string"
      },
      "size": number,
      "sizeArabic": "string",
      "type": "string", // See PROPERTY_TYPES
      "bedrooms": number,
      "bathrooms": number,
      "bedroomsArabic": "string",
      "bathroomsArabic": "string",
      "description": "string",
      "descriptionArabic": "string",
      "images": ["string"],
      "amenities": ["string"],
      "featured": boolean
    }
    ```
- **DELETE /api/properties/delete/[id]**: Delete a property by ID (admin only).

### Property Types & Locations

- **GET /api/propertyTypes**: List all property types with their property counts.
- **GET /api/locations**: List all locations with property counts.

### Auth APIs

- **POST /api/auth/signup**: Register a new user.
  - **Body:**
    ```json
    {
      "name": "string",
      "email": "string",
      "phoneNumber": "string",
      "password": "string"
    }
    ```
- **POST /api/auth/send-otp**: Send an OTP to a user's email for verification.
  - **Body:**
    ```json
    {
      "email": "string"
    }
    ```
- **POST /api/auth/verify-otp**: Verify an OTP for a user's email.
  - **Body:**
    ```json
    {
      "email": "string",
      "otp": "string"
    }
    ```
- **POST /api/auth/reset-password**: Reset a user's password using OTP.
  - **Body:**
    ```json
    {
      "email": "string",
      "password": "string",
      "otp": "string"
    }
    ```
- **GET, POST /api/auth/[...nextauth]**: NextAuth.js authentication endpoints.

### Admin APIs

- **GET /api/admin/users**: List all users (admin only, paginated).
  - **Query Parameters:**
    - `page` (number, optional): Page number for pagination (default: 1).
    - `limit` (number, optional): Results per page (default: 10).
- **GET /api/admin/properties**: List all properties with admin-level filters (admin only).
  - **Query Parameters:**
    - `name`, `type`, `status`, `location`, `bedrooms`, `bathrooms`, `minPrice`, `maxPrice`, `sortBy`, `userId`, `page`, `limit`, `propertyId`, `agentInfo` (see `/api/properties` for details).

### Reports

- **GET /api/reports**: List unresolved reports (admin only, paginated).
  - **Query Parameters:**
    - `page` (number, optional): Page number for pagination (default: 1).
    - `limit` (number, optional): Results per page (default: 10).
- **POST /api/reports**: Create a new report.
  - **Body:**
    ```json
    {
      "name": "string",
      "email": "string",
      "phone": "string",
      "message": "string"
    }
    ```

### Upload APIs

- **POST /api/upload**: Upload a file to Cloudinary. Accepts form-data with a `file` field.
  - **Body:**
    - `multipart/form-data` with a `file` field.
- **POST /api/upload/generate-signature**: Generate a Cloudinary upload signature for client-side uploads.
  - **Body:**
    ```json
    {
      "folder": "string (optional)",
      "public_id": "string (optional)"
    }
    ```

---

For more details on request/response formats, see the code in `src/app/api/`.
