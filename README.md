# Exercise-Tracker Rest API Microservice [Full-Stack] [Demo](https://exercise-trackerf.herokuapp.com/)
Database: MongoDB

Back End: NodeJS

Front End: BootStrap, JS, CSS, HTML

## User Stories

1. You can POST to `/api/users` with form data username to create a new user.
2. The returned response from POST `/api/users` with form data username will be an object with `username` and `_id` properties.
3. You can make a GET request to `/api/users` to get a list of all users.
4. The GET request to `/api/users` returns an array.
5. Each element in the array returned from GET `/api/users` is an object literal containing a user's username and _id.
6. You can POST to `/api/users/:_id/exercises` with form data description, duration, and optionally date. If no date is supplied, the current date will be used.
7. The response returned from POST `/api/users/:_id/exercises` will be the user object with the exercise fields added.
8. You can make a GET request to `api/users/:_id/logs` to retrieve a full exercise log of any user.
9. A request to a user's log GET `/api/users/:_id/logs` returns a user object with a count property representing the number of exercises that belong to that user.
10. A GET request to `/api/users/:id/logs` will return the user object with a log array of all the exercises added.
11. Each item in the log array that is returned from GET `/api/users/:id/logs` is an object that should have a description, duration, and date properties.
12. The description property of any object in the log array that is returned from GET `/api/users/:id/logs` should be a string.
13. The duration property of any object in the log array that is returned from GET `/api/users/:id/logs` should be a number.
14. The date property of any object in the log array that is returned from GET `/api/users/:id/logs` should be a string. Use the dateString format of the Date API.
15. You can add from, to and limit parameters to a GET `/api/users/:_id/logs` request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.

