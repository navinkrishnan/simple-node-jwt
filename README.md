# simple-node-jwt

Simple Nodejs JWT based application Without Passport or Helmet

`jsonwebtoken` - For generating and verify JWT

`argon2` - Save password as hash

No Database user. For Production, user details need to be stored in database.

## Steps
  
    npm install
    
    npm start
    
## Usage

1. Register as new user

`/register` [POST] - To register as new user

**POST Body:**

    {"email":"admin@admin.com, "password":"admin1234", "username":"admin"}

2. Login as registered user

`/login` [POST] - Login as registered user. Response is `JWT token`

**POST Body:**
    
     {"email":"admin@admin.com", "password":"admin1234"}
     
3. View secured message

`/api/secure/msg` [GET] - Get the protected message by passing `bearer` token

**Headers:**

     Authorization: Bearer <JWT>
  
  
