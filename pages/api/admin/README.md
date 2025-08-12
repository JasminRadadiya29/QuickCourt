# QuickCourt Admin API

This directory contains the Admin API endpoints for the QuickCourt platform. These endpoints are designed for administrative tasks such as managing facilities, users, and bookings across the platform.

## Authentication

All endpoints in this API require admin authentication. Requests must include a valid JWT token in the Authorization header with an admin role.

```
Authorization: Bearer <jwt_token>
```

## Common Response Format

List endpoints follow a common response format that includes pagination:

```json
{
  "items": [...],  // Array of items (venues, users, bookings, etc.)
  "pagination": {
    "page": 1,      // Current page number
    "size": 10,     // Items per page
    "total": 100    // Total number of items
  }
}
```

## Audit Logging

All state-changing actions (approve/reject facility, ban/unban user, change booking status) automatically create an audit log entry for accountability and tracking purposes.

## Available Endpoints

### Venues Management

- `GET /api/admin/venues/pending` - List facilities with pending approval status
  - Query params: `page`, `size`, `q` (search)

- `GET /api/admin/venues/:id` - Get full facility details for review

- `PUT /api/admin/venues/:id/approve` - Approve or reject a facility
  - Body: `{ "approve": boolean, "reason": "optional string" }`

### User Management

- `GET /api/admin/users` - List users and facility owners
  - Query params: `role`, `q` (search), `page`, `size`, `status`

- `PATCH /api/admin/users/:id/ban` - Ban or unban a user
  - Body: `{ "ban": boolean, "reason": "optional string" }`

### Booking Management

- `GET /api/admin/bookings` - List & filter bookings across platform
  - Query params: `status`, `venueId`, `courtId`, `userId`, `dateFrom`, `dateTo`, `page`, `size`

- `PATCH /api/admin/bookings/:id/status` - Change booking status
  - Body: `{ "status": "confirmed|cancelled|completed" }`

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK` - Request successful
- `400 Bad Request` - Invalid parameters
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Not authorized (not an admin)
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Testing

A test script is available at `/scripts/test-admin-api.js` to verify the functionality of these endpoints.