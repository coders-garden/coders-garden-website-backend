# Backend API

This is a backend API for our project. It provides two routes:

## /api

This route returns a simple "Hello, world!" message.

## /members/get

This route returns a JSON array of objects containing details of GitHub community members. The details include:

- Name
- Username
- Profile picture URL
- Number of followers
- Number of repositories

To use this API, send a GET request to the appropriate route. For example, to get the list of community members, send a GET request to `/members/get`.

## Running the API

To run the API, follow these steps:

1. Clone the repository to your local machine.
2. Install the required dependencies by running `npm install`.
3. Start the development server by running `npm run dev`.
4. The API will be available at `http://localhost:3000`.

That's it! You can now use the API to get the list of community members or test other routes as needed.
