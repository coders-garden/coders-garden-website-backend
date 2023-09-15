# Live API

https://coders-garden-backend.vercel.app/


# Backend API README

Welcome to our Backend API documentation for our project. This API provides two main routes for your use. Here's a breakdown of the API structure and how to use it effectively:

## API Response Structure

All responses from the API follow this structure:

```json
{
    "status": true, // Status boolean indicating success or failure
    "data": {},     // Data on success, can be an object, an array, a string, null, or undefined
    "message": ""   // Message providing additional information for errors and success
}
```

## Route 1: /

This route is a simple "Hello, world!" message. It's a great way to check if the API is up and running.

**Example Response:**
```json
{
    "status": true,
    "data": "Hello, world!",
    "message": "Success"
}
```

## Route 2: /members

This route returns a JSON array of objects containing details of GitHub community members. The details provided include:

- `name`: Name
- `username`: GitHub username
- `profile_url`: Profile picture URL
- `followers`: Number of followers
- `following`: Number of people they follow
- `repositories`: Number of repositories
- `bio`: Bio

**Example Response:**
```json
{
    "status": true,
    "data": [
        {
            "name": "John Doe",
            "username": "johndoe123",
            "profile_url": "https://github.com/johndoe123/profile.jpg",
            "followers": 1000,
            "following": 500,
            "repositories": 50,
            "bio": "I'm a software engineer."
            // ... Other details
        },
        // ... More member objects
    ],
    "message": "Success"
}
```

## Using the API

To interact with this API, simply send a GET request to the appropriate route. For example, to retrieve the list of community members, send a GET request to `/members`.

## Running the API Locally

Here are the steps to run the API on your local machine:

1. Clone this repository to your local machine.
2. Install the required dependencies by running `npm install`.
3. Start the server by running `npm start`.
4. The API will be available at `http://localhost:3000`.

## Code Quality and Linting

We maintain code quality by using ESLint with the Airbnb style guide. You can check for and automatically fix common code style issues with these commands:

- To check for issues: `npm run lint`
- To automatically fix fixable issues: `npm run lint:fix`

That's it! You are now ready to use our API to access community member data or explore other available routes. If you have any questions or encounter issues, feel free to reach out to us. Happy coding!
