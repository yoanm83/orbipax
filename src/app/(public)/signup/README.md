# Signup Page

## Purpose
User registration for new OrbiPax accounts.

## Expected Inputs
- **Form Data:**
  - `email` - User email address
  - `password` - User password
  - `confirmPassword` - Password confirmation
  - `firstName` - User first name
  - `lastName` - User last name
  - `termsAccepted` - Terms of service acceptance

## Security Considerations
- Email validation and uniqueness check
- Strong password requirements
- CSRF protection
- Rate limiting for registration attempts
- Email verification requirement

## Next Steps
1. Implement form validation with Zod schemas
2. Add server action for user registration
3. Integrate with Supabase Auth
4. Add email verification flow
5. Password strength indicator
6. Terms of service integration
7. Accessibility features with UI primitives