# Dev Tinder API List

### authRouter

- POST /signup
- POST /login
- POST /logout

### profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

### connectionRequestRouter

- POST /request/send/:status/:toUserId
- POST /request/review/:status/:userId

### userRouter

- GET /user/request/received
- GET /user/connections
- GET /user/feed (Gets profile of other users on the platform)
