Hotel Management System

A full-stack hotel management system with role-based access control, featuring a React frontend and Node.js backend.

Features

Authentication & Authorization

Multi-role system (Admin, Agency, User)
Basic Authentication for secure access
Role-based access control for different functionalities
Protected routes and API endpoints
Agency Features

Hotel Management

Add new hotels with detailed information
Update existing hotel details
Delete hotels
View all hotels owned by the agency
Upload and manage hotel photos
Profile Management

View agency profile
Update agency information
Upload and manage profile photos
View latest uploaded photo
Admin Features

User Management

View all users in the system
Update user information
Delete users
Change user status (active/inactive)
Filter users by role
Hotel Oversight

View all hotels across agencies
Monitor hotel listings
Access hotel details
User Features

Hotel Browsing
View all available hotels
Search and filter hotels
View detailed hotel information
View hotel photos
Technical Stack

Frontend

React with TypeScript
Material-UI for components
Axios for API calls
React Router for navigation
Context API for state management
Backend

Node.js with Koa
MongoDB for database
GridFS for file storage
Basic Authentication middleware
Role-based access control
API Endpoints

Authentication

POST /api/v1/auth/login - User login
POST /api/v1/auth/register - User registration
Hotels

GET /api/v1/hotel - Get all hotels
GET /api/v1/hotel/:id - Get specific hotel
POST /api/v1/hotel - Add new hotel (Agency only)
PUT /api/v1/hotel/:id - Update hotel (Agency only)
DELETE /api/v1/hotel/:id - Delete hotel (Agency only)
Agency

GET /api/v1/agency/info - Get agency information
PUT /api/v1/agency/info - Update agency information
POST /api/v1/agency/upload - Upload agency photo
GET /api/v1/agency/photos - Get agency photos
Users

GET /api/v1/user - Get all users (Admin only)
PUT /api/v1/user/:username - Update user (Admin only)
DELETE /api/v1/user/:username - Delete user (Admin only)
PUT /api/v1/user/:username/status - Change user status (Admin only)
Database Schema

Users Collection

{
  username: string;
  password: string;
  role: number; // 0: User, 1: Agency, 2: Admin
  status: string; // 'active' or 'inactive'
  createdAt: Date;
  updatedAt: Date;
}
Hotels Collection

{
  name: string;
  description: string;
  location: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  checkInTime: string;
  checkOutTime: string;
  amenities: string[];
  policies: string[];
  priceRange: {
    min: number;
    max: number;
  };
  roomTypes: string[];
  photos: string[];
  status: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  accommodationType: string;
  agencyId: string;
  createdAt: Date;
  updatedAt: Date;
}
Setup Instructions

Clone the repository

Install dependencies:

npm install
Set up environment variables:

Create .env file in the root directory
Add necessary environment variables
Start the development server:

npm start
Security Features

Basic Authentication for API access
Role-based access control
Protected routes and endpoints
Secure file upload handling
Input validation and sanitization
Error Handling

Comprehensive error messages
Input validation
File upload validation
Role verification
Status code handling
File Management

GridFS for storing photos
File type validation
File size limits
Secure file access
Contributing

Fork the repository
Create your feature branch
Commit your changes
Push to the branch
Create a new Pull Request
Frontend Source Code Structure

Core Files

src/index.tsx

Entry point of the React application
Sets up the root React component
Configures routing and global providers
Initializes the application context
src/App.tsx

Main application component
Handles routing and layout structure
Manages global state and authentication
Integrates with backend through:
Authentication state management
Protected route handling
Global error handling
src/App.css & src/index.css

Global styling files
No direct backend interaction
Components Structure

Authentication Components src/components/auth/Login.tsx

Handles user login
Backend Integration:
Calls /api/v1/auth/login endpoint
Manages authentication tokens
Stores user session data
src/components/auth/Register.tsx

Handles user registration
Backend Integration:
Calls /api/v1/auth/register endpoint
Validates user input
Handles registration errors
Agency Components src/components/agency/AgencyDashboard.tsx

Main dashboard for agency users
Backend Integration:
Fetches agency info from /api/v1/agency/info
Retrieves hotels owned by agency
Manages agency photos through /api/v1/agency/photos
src/components/agency/AddHotel.tsx

Form for adding new hotels
Backend Integration:
Posts to /api/v1/hotel endpoint
Handles file uploads for hotel photos
Validates hotel data before submission
src/components/agency/EditHotel.tsx

Form for editing existing hotels
Backend Integration:
Fetches hotel data from /api/v1/hotel/:id
Updates hotel through PUT request
Handles photo updates
Admin Components src/components/admin/AdminDashboard.tsx

Main dashboard for admin users
Backend Integration:
Fetches system-wide statistics
Manages user access to features
src/components/admin/UserManagement.tsx

Manages user accounts
Backend Integration:
Fetches users from /api/v1/user
Updates user status via PUT request
Deletes users through DELETE endpoint
Hotel Components src/components/hotel/HotelList.tsx

Displays list of hotels
Backend Integration:
Fetches hotels from /api/v1/hotel
Implements filtering and search
Handles pagination
src/components/hotel/HotelDetail.tsx

Shows detailed hotel information
Backend Integration:
Fetches specific hotel from /api/v1/hotel/:id
Displays hotel photos
Handles booking requests
Services Layer

src/services/api.tsx

Core API service configuration
Backend Integration:
Sets up Axios instance
Configures authentication headers
Handles API interceptors
Manages error responses
src/services/hotel.service.tsx

Hotel-related API calls
Backend Integration:
Implements CRUD operations for hotels
Handles photo uploads
Manages hotel search and filtering
src/services/agency.service.tsx

Agency-related API calls
Backend Integration:
Manages agency profile updates
Handles agency photo uploads
Fetches agency-specific data
src/services/user.service.tsx

User management API calls
Backend Integration:
Handles user CRUD operations
Manages user status updates
Implements user search and filtering
Context and State Management

src/context/AuthContext.tsx

Manages authentication state
Backend Integration:
Stores authentication tokens
Manages user session
Handles login/logout operations
src/context/HotelContext.tsx

Manages hotel-related state
Backend Integration:
Caches hotel data
Manages hotel filters
Handles hotel updates
Types and Interfaces

src/types/index.ts

TypeScript type definitions
Defines interfaces for:
Hotel data structure
User data structure
API responses
Form data
Utilities

src/utils/helpers.ts

Helper functions
Backend Integration:
Formats API responses
Handles date formatting
Manages file uploads
src/utils/validation.ts

Input validation utilities
Ensures data consistency with backend requirements
Testing Files

src/App.test.tsx

Main application tests
Tests component rendering
Mocks backend API calls
src/setupTests.ts

Test configuration
Sets up testing environment
Configures test utilities
API Integration Flow

Authentication Flow

User enters credentials
Frontend validates input
Backend authenticates
Token stored in AuthContext
Data Fetching Flow

Component mounts
Service layer makes API call
Response handled by component
Data stored in state/context
Data Update Flow

User submits form
Frontend validates data
Service layer sends update
UI updates on success
File Upload Flow

User selects file
Frontend validates file
Service layer uploads file
URL stored in database
Error Handling

API Errors

Network errors
Authentication errors
Validation errors
Server errors
Form Errors

Input validation
File validation
Submission errors
State Errors

Context errors
State management errors
Component errors
Security Measures

Authentication

Token-based auth
Secure token storage
Session management
Authorization

Role-based access
Protected routes
API endpoint protection
Data Protection

Input sanitization
XSS prevention
CSRF protection
