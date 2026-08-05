# Secure Authentication & Authorization

1. Objective

Implement a secure authentication and authorization system for the application covering both Frontend (FE) and Backend (BE).

The system must:

- Authenticate users securely.
- Use JWT for stateless authentication.
- Protect authenticated API endpoints.
- Implement Role-Based Access Control (RBAC).
- Protect frontend routes based on authentication and permissions.
- Secure token storage and transmission.
- Handle token expiration and logout correctly.
- Prevent unauthorized access to protected resources.
- Keep authentication secrets and configuration outside source code.

⸻

2. Authentication Flow

Login

1. User enters email/username and password.
2. FE sends credentials to the BE over HTTPS.
3. BE validates the credentials.
4. BE retrieves the user and verifies the password against the stored password hash.
5. BE determines the user’s roles/permissions.
6. BE generates a signed JWT.
7. BE returns the authentication result to the FE.
8. FE stores the authentication state securely.
9. FE redirects the user to the appropriate authenticated route.

Authenticated Request

1. User accesses a protected FE page.
2. FE makes an API request.
3. JWT is attached to the request.
4. BE extracts the JWT.
5. BE verifies:
   - Signature
   - Expiration
   - Issuer
   - Audience
   - Required claims
6. BE identifies the authenticated user.
7. BE checks authorization/RBAC requirements.
8. BE returns the requested resource if authorized.
9. Otherwise, BE returns an appropriate 401 or 403 response.

Logout

1. User clicks Sign Out.
2. FE clears authentication state.
3. BE invalidates the server-side session/refresh-token record if refresh tokens are used.
4. FE redirects the user to the login page.
5. Protected routes become inaccessible.

⸻

3. JWT Requirements

JWT must be signed using a secure algorithm.

The JWT should contain only the minimum required claims.

Recommended claims:

sub User ID
iat Issued-at timestamp
exp Expiration timestamp
iss Token issuer
aud Token audience
jti Unique token identifier
role User role(s), if required

Do not store sensitive information such as:

- Password
- Password hash
- API secrets
- Personal secrets
- Payment information

inside the JWT.

JWT Validation

Every protected API request must validate:

- JWT existence
- JWT format
- Signature
- Expiration
- Issuer
- Audience
- Required claims

A request with an invalid or expired JWT must not reach protected business logic.

⸻

4. Token Storage

Preferred Strategy

For browser applications, prefer:

- Short-lived access token.
- Secure, HttpOnly, SameSite cookie for refresh/session credentials where applicable.
- Avoid exposing long-lived authentication credentials to JavaScript.

If the architecture requires an Authorization: Bearer <token> header, the application must use a carefully considered token-storage strategy.

Local Storage

Using localStorage for JWTs is discouraged for sensitive applications because JavaScript-accessible tokens can be exposed if an XSS vulnerability exists.

If localStorage is explicitly selected:

- Never store passwords.
- Never store refresh tokens in localStorage.
- Implement strong XSS protections.
- Use short token expiration times.
- Clear the token during logout.

⸻

5. Authorization Header

Protected API requests should use:

Authorization: Bearer <JWT>

Example:

GET /api/users/me
Authorization: Bearer eyJ...

Public endpoints must not require the Authorization header unless explicitly required.

⸻

6. Access Token Expiration

Access tokens must have a limited lifetime.

Recommended approach:

Access Token
↓
Short expiration
↓
Expired?
├── No → Continue request
└── Yes
↓
Refresh authentication
↓
Retry request

The application must not create effectively permanent JWTs.

The system should define:

- Access-token lifetime.
- Refresh-token lifetime, if applicable.
- Refresh-token rotation policy.
- Logout behavior.
- Token revocation behavior.

⸻

7. Password Security

Passwords must never be stored as plain text.

BE must hash passwords using a strong password-hashing algorithm such as:

- Argon2id
- bcrypt

Password verification must be performed against the stored password hash.

Additional requirements:

- Never log passwords.
- Never return passwords or password hashes through API responses.
- Do not include passwords in JWTs.
- Apply reasonable password-strength requirements.
- Consider protection against brute-force login attempts.

⸻

8. Environment Variables

Sensitive authentication configuration must be stored in environment variables.

Examples:

JWT_SECRET
JWT_ISSUER
JWT_AUDIENCE
JWT_EXPIRES_IN
DATABASE_URL

Rules:

- Never commit secrets to Git.
- Never hard-code JWT secrets.
- Do not expose BE secrets through FE environment variables.
- Maintain .env.example with placeholder values.
- Production secrets must be managed through the deployment/platform secret manager.

⸻

9. HTTPS

All authentication-related communication must use HTTPS in production.

HTTPS is required for:

- Login
- Logout
- Token refresh
- Password changes
- Authenticated API requests
- Sensitive user information

HTTP must not be used to transmit credentials or authentication tokens in production.

For secure cookies:

Secure=true
HttpOnly=true
SameSite=Lax/Strict

The exact SameSite policy must match the application’s deployment architecture.

⸻

10. Role-Based Access Control (RBAC)

The system must support role-based authorization.

Example roles:

USER
ADMIN
MANAGER

A user may have one or multiple roles depending on the application’s requirements.

Example:

User
├── Role: ADMIN
│ ├── users:read
│ ├── users:create
│ ├── users:update
│ └── users:delete
│
└── Role: USER
└── profile:read

Authorization Rule

Authentication answers:

“Who are you?”

Authorization answers:

“Are you allowed to do this?”

A valid JWT does not automatically mean the user is authorized to access every resource.

⸻

11. Backend Authorization

Authorization must be enforced on the BE.

Example flow:

Request
↓
Authentication Middleware
↓
JWT Validation
↓
User Identification
↓
Authorization Middleware
↓
Role / Permission Check
↓
Controller
↓
Service
↓
Repository
↓
Database

The FE must never be considered the security boundary.

Even if a frontend route is protected, the BE must independently verify authorization.

⸻

12. Frontend Route Authorization

React Router must protect authenticated routes.

Example conceptual structure:

Public Routes
├── /login
└── /register
Protected Routes
├── /dashboard
├── /profile
└── /settings
Admin Routes
├── /admin/users
└── /admin/settings

Route Guard

The FE should:

1. Determine whether the user is authenticated.
2. Redirect unauthenticated users to /login.
3. Determine the user’s role/permissions.
4. Prevent unauthorized users from rendering restricted routes.
5. Redirect unauthorized users to an appropriate page.

Frontend authorization is primarily a UX concern.

Backend authorization remains the actual security boundary.

⸻

13. API Error Contract

Authentication and authorization failures must use consistent HTTP status codes.

401 Unauthorized

Use when:

- JWT is missing.
- JWT is invalid.
- JWT is expired.
- Authentication credentials are invalid.

Example:

{
"error": {
"code": "UNAUTHORIZED",
"message": "Authentication is required."
}
}

403 Forbidden

Use when:

- User is authenticated.
- User does not have the required role/permission.

Example:

{
"error": {
"code": "FORBIDDEN",
"message": "You do not have permission to perform this action."
}
}

Do not expose sensitive authorization details in error responses.

⸻

14. Authentication Middleware

Protected BE endpoints must pass through authentication middleware.

Responsibilities:

- Extract authentication credentials.
- Validate JWT.
- Validate required claims.
- Identify the user.
- Attach authenticated-user information to the request context.
- Reject invalid authentication.

Authentication middleware must not contain business logic.

⸻

15. Authorization Middleware

Authorization should be separated from authentication.

Example conceptual API:

requireAuth()
requireRole("ADMIN")
requirePermission("users:delete")

This separation follows Separation of Concerns (SoC).

Recommended backend flow:

Route
↓
Authentication Middleware
↓
Authorization Middleware
↓
Controller
↓
Service
↓
Repository

⸻

16. User Identity

The authenticated user should be identified using the JWT sub claim.

The BE must not trust user IDs supplied by the client when determining the currently authenticated user.

For example, avoid using:

GET /api/profile?userId=123

as the source of authentication identity.

Prefer deriving the current user from the authenticated request:

JWT → sub → authenticated user

⸻

17. Resource-Level Authorization

RBAC alone may not be sufficient.

The BE should also verify whether the authenticated user owns or is allowed to access a specific resource.

Example:

User A
└── Can read User A's profile
User A
└── Cannot automatically read User B's private data

This prevents IDOR/BOLA-style authorization vulnerabilities.

⸻

18. Login Protection

The login endpoint must include protections against abuse.

Consider:

- Rate limiting.
- Brute-force protection.
- Account lockout or progressive delays.
- Request validation.
- Generic authentication error messages.
- Monitoring of repeated failed login attempts.

Avoid responses such as:

"Email exists but password is incorrect."

when this would allow account enumeration.

Prefer a generic response:

"Invalid credentials."

⸻

19. Input Validation

All authentication-related inputs must be validated on the BE.

Validate:

- Email/username.
- Password.
- Role values.
- User IDs.
- Token-related inputs.
- Password-reset tokens.
- Refresh tokens.

Frontend validation improves UX but must never replace backend validation.

⸻

20. CSRF Protection

If authentication credentials are stored in cookies, implement appropriate CSRF protection.

Depending on the architecture, this may include:

- SameSite cookies.
- CSRF tokens.
- Origin/Referer validation.
- Appropriate CORS configuration.

Do not assume CORS alone provides CSRF protection.

⸻

21. CORS

Configure CORS using an explicit allowlist.

Do not use unrestricted production configuration such as:

Access-Control-Allow-Origin: \*

for authenticated applications where credentials are involved.

Allowed origins should be environment-specific.

Example:

Development:
http://localhost:3000
Production:
https://app.example.com

⸻

22. Security Headers

The BE should configure appropriate security headers.

Consider:

- Content-Security-Policy
- X-Content-Type-Options
- Referrer-Policy
- Strict-Transport-Security
- Frame protection

Security headers should be reviewed according to the application’s deployment architecture.

⸻

23. Sensitive Data Handling

Authentication endpoints must never log:

- Passwords.
- JWTs.
- Refresh tokens.
- Authorization headers.
- Password-reset tokens.

Logs may contain safe identifiers such as:

userId
requestId
timestamp
authentication event

Sensitive values must be redacted.

⸻

24. Password Reset

If password reset is part of the authentication feature:

1. User requests password reset.
2. BE generates a short-lived, single-use reset token.
3. Reset link is sent to the user.
4. User submits a new password.
5. BE validates the reset token.
6. BE updates the password hash.
7. Existing authentication sessions/tokens should be invalidated where appropriate.

The system must not reveal whether a specific email address exists during the password-reset request.

⸻

25. Session Revocation

Although JWT authentication is stateless, the system should define how compromised or revoked authentication credentials are handled.

Possible approaches:

- Short-lived access tokens.
- Refresh-token rotation.
- Server-side refresh-token storage.
- Token revocation using jti.
- User-level token/session version.

The selected approach must be documented.

⸻

26. Refresh Token Security

If refresh tokens are implemented:

- Use longer-lived but securely protected refresh tokens.
- Store them securely.
- Rotate refresh tokens.
- Detect refresh-token reuse.
- Revoke compromised token families.
- Never expose refresh tokens unnecessarily to frontend JavaScript.
- Invalidate refresh tokens on logout.

⸻

27. Frontend Authentication State

The FE should have a single source of truth for authentication state.

Example conceptual state:

AuthState
├── status
│ ├── loading
│ ├── authenticated
│ └── unauthenticated
│
├── user
└── permissions

Avoid duplicating authentication state across unrelated components.

Authentication logic should be separated from UI components.

Recommended structure:

auth/
├── api/
├── components/
├── hooks/
├── routes/
├── services/
├── types/
└── utils/

⸻

28. API Client

The FE should use a centralized API client for authenticated requests.

Responsibilities:

- Attach authentication credentials.
- Handle 401 responses.
- Handle token refresh where applicable.
- Retry requests only when safe.
- Redirect to login when authentication cannot be restored.

Authentication behavior should not be duplicated across individual API calls.

⸻

29. Authorization UI

The FE may hide or disable UI actions based on permissions.

Example:

ADMIN:
[Create User] [Edit] [Delete]
USER:
[View Profile]

However:

Hiding a button is not authorization.

The BE must always enforce the permission.

⸻

30. Security Against XSS

Because XSS can compromise browser-accessible authentication data:

- Avoid unsafe HTML rendering.
- Sanitize untrusted HTML.
- Use React’s default escaping behavior.
- Avoid unnecessary dangerouslySetInnerHTML.
- Implement a strong Content Security Policy where practical.
- Keep dependencies updated.

⸻

31. Dependency Security

Authentication-related dependencies must be reviewed regularly.

Requirements:

- Keep authentication libraries updated.
- Run dependency vulnerability scans.
- Avoid abandoned authentication packages.
- Review security advisories.
- Lock dependency versions appropriately.

⸻

32. Database Security

User authentication data must be protected at the database level.

User records should include appropriate fields such as:

id
email
passwordHash
status
createdAt
updatedAt

Potential additional fields:

lastLoginAt
failedLoginAttempts
lockedUntil

Database access must use parameterized queries or a trusted ORM/query builder.

⸻

33. Authentication Status

Users should have an explicit account status where required.

Example:

ACTIVE
DISABLED
LOCKED

Only eligible users may authenticate.

A disabled or locked account must not receive a valid authentication session.

⸻

34. Security Requirements

The implementation must satisfy the following:

- Passwords are hashed.
- JWTs are signed securely.
- JWT secrets are stored in environment variables/secrets management.
- Sensitive secrets are never committed to source control.
- HTTPS is used in production.
- Protected APIs require authentication.
- Authorization is enforced on the backend.
- RBAC is implemented.
- Resource ownership is checked where applicable.
- Authentication and authorization are separated.
- JWT expiration is enforced.
- Login rate limiting is implemented.
- CORS uses an explicit allowlist.
- CSRF protection is implemented when cookie authentication requires it.
- Sensitive authentication data is excluded from logs.
- Frontend route guards are implemented.
- API authentication is centralized.
- 401 and 403 responses are consistent.
- Logout clears/revokes authentication appropriately.
- Password reset tokens are short-lived and single-use.
- Security headers are configured.
- Authentication dependencies are regularly reviewed.

⸻

35. Testing Requirements

Backend Unit Tests

Test:

- Password hashing.
- Password verification.
- JWT generation.
- JWT validation.
- Expired JWT.
- Invalid JWT signature.
- Invalid issuer.
- Invalid audience.
- Missing JWT.
- Role validation.
- Permission validation.
- Resource ownership validation.

Backend Integration Tests

Test:

Login
↓
JWT generation
↓
Authenticated API request
↓
Authorization
↓
Protected resource

Also test:

- Invalid credentials → 401
- Missing token → 401
- Expired token → 401
- Valid token + insufficient role → 403
- Valid token + correct role → success
- Disabled user → authentication rejected
- Rate limit exceeded → request rejected

Frontend Tests

Test:

- Unauthenticated user accessing protected route.
- Authenticated user accessing protected route.
- Unauthorized user accessing admin route.
- Authorized admin accessing admin route.
- Logout.
- Expired authentication.
- 401 API response handling.
- Authentication loading state.
- Protected navigation.

Security Tests

Test for:

- XSS.
- CSRF where applicable.
- Brute-force login attempts.
- Token tampering.
- Token replay.
- IDOR/BOLA.
- CORS misconfiguration.
- Sensitive information leakage.
- Authorization bypass.

⸻

36. Acceptance Criteria

The feature is complete when:

1. A valid user can successfully log in.
2. BE generates a valid signed JWT.
3. Protected APIs reject unauthenticated requests.
4. JWT expiration is enforced.
5. Invalid or tampered JWTs are rejected.
6. FE protects authenticated routes.
7. FE protects role-specific routes.
8. BE independently enforces RBAC.
9. Users cannot access resources they are not authorized to access.
10. Passwords are never stored or logged in plain text.
11. Authentication secrets are not present in source code.
12. Production authentication traffic uses HTTPS.
13. Logout properly clears/revokes authentication.
14. Authentication failures return consistent 401 responses.
15. Authorization failures return consistent 403 responses.
16. Automated tests cover authentication, authorization, expiration, logout, and security-critical edge cases.
17. No critical authentication or authorization vulnerability remains unresolved.

⸻

37. Non-Goals

The initial implementation does not need to include:

- Social login/OAuth.
- SSO.
- Multi-factor authentication.
- Biometric authentication.
- Enterprise identity providers.

These can be introduced as separate features later.

⸻

38. Architectural Principle

The implementation must follow:

Frontend
↓
React Router
↓
Auth State
↓
API Client
↓
HTTPS
↓
Backend
↓
Authentication Middleware
↓
Authorization Middleware
↓
Controller
↓
Service
↓
Repository
↓
Database

Authentication, authorization, business logic, persistence, and UI concerns must remain separated.

Core security principle:

The frontend controls what the user sees. The backend controls what the user is allowed to do.
