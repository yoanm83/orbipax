# Forgot Password Page

## Purpose
Initiate password reset flow for users who have forgotten their credentials.

## Expected Inputs
- **Form Data:**
  - `email` - User email address to send reset link

## Security Considerations
- Rate limiting for reset requests (per email and per IP)
- Email validation and sanitization
- Secure token generation
- Time-limited reset links

## Next Steps
1. Implement email validation with Zod
2. Add server action for password reset request
3. Integrate with email service provider
4. Add confirmation message (without revealing if email exists)
5. Link to login page
6. Implement rate limiting middleware
7. Add accessibility features