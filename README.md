![image](https://user-images.githubusercontent.com/32570896/160172916-c550f92d-c3d1-460d-8f53-bd49670a43e4.png)

# Address Book Server
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/nirupama1210/address-book-server)
![GitHub last commit](https://img.shields.io/github/last-commit/nirupama1210/address-book-server)

1. This is the backend of an Address Book web application.
2. Address Book can be used to store your contacts with details like
   phone number, email ids of different types like personal, work. 
   As well as storing Birthdays, Personal Notes, Social Media profiles.


## API Reference


```https://address-book2022-server.herokuapp.com/
https://address-book2022-server.herokuapp.com/
```

| Method    | URL      | Description                       |
| :-------- | :------- | :-------------------------------- |
|       GET | /users/ |   Get all user Details            |
|      POST | /users/register |    Creates a user using the information sent inside the request body                               |
|POST|/users/login|Checks if user is email authenticated using infomation in request body,and allows login for authenticated users|
|POST|/users/verify|Authenticated user using token passed inside request body|
|POST|/users/contacts|Creates a new contact for the specified user sent inside the request body|
|PUT|/users/contacts|Updates contact for the specified user sent inside the request body|
|PUT|/users/contacts-edit|Updates specific single contact of given user sent in the request body|
|GET|/users/contacts|Displayes all contacts for given email passed as parameter|
|DELETE|/users/register|Deletes user whose email passed as parameter|
|POST|/google-login|To sign-in with google|

## Tech Stack

**Server:** Node, Express
**Database:** MongoDB Atlas


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`DBURL` MongoDb Atlas URL

`REACT_APP_GOOGLE_CLIENT_ID` Google Client ID

`MAILGUN_USER` Mailjet Username

`MAILGUN_PASS` Mailjet Password

