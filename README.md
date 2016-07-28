# Application Server

### Authentication
Verb | Route | Description
--- | --- | ---
POST | /auth/register | desc
POST | /auth/login | desc
POST | /auth/logout | desc
POST | /auth/password-forgot | desc
GET | /auth/password-reset?token=emailResetToken | desc
POST | /auth/password-reset?token=emailResetToken | desc
GET | /users/search | search all users


### Accounts
Verb | Route | Description
--- | --- | ---
GET | /accounts | fetch *logged in* users account
GET | /accounts/{id} | fetch a single users account
POST | /accounts | create new account
PATCH | /accounts | update *logged in* users account
GET | /accounts/search | search all accounts

### Products
Verb | Route | Description
--- | --- | ---
GET | /{product} | fetch *logged in* users products
GET | /{product}/{id} | fetch a single product `(public)`
POST | /{product} | create a new product
PATCH | /{product}/{id} | update *logged in* users product
DELETE | /{product}/{id} | delete *logged in* users product
GET | /{product}/search | search all products

### Orders
Verb | Route | Description
--- | --- | ---
POST | /basket | create/update a basket
DELETE | /basket | delete a basket

GET | /orders | fetch *logged in* users orders
GET /orders/{id} | fetch a single *logged in* users order
POST | /orders | create a new order

GET | /charges | fetch *logged in* users charges `[stripe]`
GET | /charges/{id} | fetch a single *logged in* users charge `[stripe]`
POST | /charges | create a new charge `[stripe]`

GET | /cards | fetch *logged in* users cards `[stripe]`
GET | /cards/{id} | fetch a single *logged in* users card `[stripe]`
POST | /cards | create a new card `[stripe]`
DELETE | /cards/{id} | delete *logged in* users card `[stripe]`

GET | /customers | fetch *logged in* users customer details `[stripe]`
POST | /customers | create a new customer `[stripe]`


