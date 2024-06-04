# ShareFrame

ShareFrame App is a simple Full Stack web application built using React, NodeJs, ExpreesJs, and MongoDB. Users can easily upload images along with content and manage their posts with efficiency and reliability.  

## Some Features of This Application  
### 1. User Log In and Sign Up  

ShareFrame provides a seamless user authentication experience, allowing users to create new accounts or log in with existing credentials. This feature ensures that each user has a personalized experience and can securely access their account.

### 2. Password Hashing and Authentication  

To enhance security, ShareFrame employs password hashing techniques, ensuring that user passwords are encrypted and stored securely in the database. Additionally, robust authentication mechanisms are in place to verify user identities and protect against unauthorized access.

### 3. Posts, Likes, Comments, and Deletion  

Users can create posts to share their images or content with the community. They can also interact with posts by liking them, leaving comments, and deleting their own posts if needed. These features foster engagement and collaboration within the ShareFrame platform.  

## How to Run

To run the ShareFrame application locally, follow these steps:

### Prerequisites

- Node.js installed on your machine
- MongoDB installed and running locally, or access to a MongoDB account. You can create one on your own.

### Backend Setup

1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the `backend` directory and add the following environment variables:
    ```
    MONGOOSE_SECRET=your_mongodb_connection_string
    ```

    Replace `your_mongodb_connection_string` with the connection string to your MongoDB database. You can also use your `connect_string` in `app.js` of the `backend` section.

4. Start the backend server:
    ```bash
    npm start
    ```

5. The backend server will be running on `http://localhost:4000` by default.

### Frontend Setup

1. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm start
    ```

4. The frontend will be running on `http://localhost:3000` by default.

### Accessing the Application

Once both the frontend and backend servers are running, you can access the ShareFrame application by navigating to `http://localhost:3000` in your web browser.

