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

- POST /request/send/interest/:userId
- POST /request/send/ignore/:userId
- POST /request/review/accept/:userId
- POST /request/review/reject/:userId

### userRouter

- POST /user/connections
- GET /user/request/received
- GET /user/feed (Gets profile of other users on the platform)
