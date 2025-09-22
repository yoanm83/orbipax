# Reset Password Page

## Purpose
Complete password reset flow using secure token from email.

## Expected Inputs
- **Query Parameters:**
  - `token` - Secure reset token from email
  - `email` - User email (optional, for UX)
- **Form Data:**
  - `password` - New password
  - `confirmPassword` - Password confirmation

## Security Considerations
- Token validation and expiry checking
- Strong password requirements
- Password confirmation matching
- Single-use token invalidation
- Secure password hashing

## Next Steps
1. Implement password strength validation
2. Add server action for password update
3. Token verification logic
4. Password confirmation validation
5. Success redirect to login
6. Error handling for expired/invalid tokens
7. Accessibility and UX improvements