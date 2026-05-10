# Diagrama de Clases
- User
- Profile
- ServiceListing
- ServiceRequest
- Review
- Comment
- Report
- EmailVerificationToken
- PasswordResetToken

## Relaciones conceptuales
- `User 1..1 Profile`
- `User 1..n ServiceListing`
- `ServiceListing 1..n ServiceRequest`
- `ServiceRequest 0..1 Review`
- `ServiceListing 0..n Comment`
- `User 0..n Report`
