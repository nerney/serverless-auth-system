# serverless-auth-system

## Resources

userTable - holds emails and passwords

sessionTable - holds sessions

## Lambdas

### Signup

Accepts email and password.

Existing email - 409

No username or password - 400

Success - 200

### Login

Accepts email and password.

Bad credentials - 400

Success - 200

SESSION_COOKIE dropped

### Logout

The SESSION_COOKIE is cleared, and the session is removed from the session db.

### Authorizer

Checks for session in the db, if there, it grants access.
