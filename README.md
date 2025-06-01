# Urban Mural 

## Live Project
<!-- [Marissa Lamothe's Portfolio](https://www.marissalamothe.dev) -->

## About Urban Mural 

This website is a platform for users to share and appreciate urban murals from cities around the world. It allows users to upload their own mural posts, edit and delete their posts, and like the murals they enjoy.

> Thank you so much for visiting. This app is a product of my love for the city of Orlando, and the art that I've encountered here at home, and on my travels. I wanted to create a space where people could share their love for the street art that they come across. I hope you enjoy using this app as much as I enjoyed creating it.
>
> In the future, I plan to add more features to this app, such as a map view of the murals, a search function, and a way to filter murals by location. I want to make this app a comprehensive resource for street art lovers everywhere.
>
> If you have any suggestions for features that you would like to see added, please let me know through my contact form on my portfolio. I am always looking for ways to improve this app and make it more useful for everyone.
>
> **Technical specs, in case you were interested:**
> This app is built with Next.js, React, and Tailwind CSS. It uses the NextAuth library for authentication. The app is hosted on Vercel.
>
> Feel free to check out my other work: **[www.marissalamothe.dev](https://www.marissalamothe.dev)**
>
> I would also like to thank the city of Orlando for inspiring me.

## Features

-   **User Authentication:** Users can create accounts and log in.
-   **Post Upload:** Logged-in users can upload images of urban murals.
-   **Post Management:** Users can edit and delete their own uploaded posts.
-   **Like Functionality:** Users can like other users' mural posts.

## Tech Stack

-   **React:** For building the user interface.
-   **Next.js:** For server-side rendering and routing.
-   **Tailwind CSS:** For styling.
-   **NextAuth:** For user authentication.
-   **Vercel:** For hosting and deployment.
-   **Supabase:** For the PostgreSQL database backend.
-   **`@emotion/react` & `@emotion/styled`:** For styling components.
-   **`@heroicons/react`:** For using Heroicons.
-   **`@mui/icons-material` & `@mui/material`:** For Material UI icons and components.
-   **`dotenv`:** For managing environment variables.
-   **`framer-motion`:** For animations.
-   **`lucide-react`:** For using Lucide icons.
-   **`pg`:** For PostgreSQL database interaction (via NextAuth).
-   **`react-dom`:** For the React DOM.
-   **`react-hook-form`:** For form handling.
-   **`react-icons`:** For various icons.
-   **`react-images-uploading`:** For handling image uploads.
-   **`react-share`:** For social sharing functionality.
-   **`shadcn-ui`:** For UI components.
## Getting Started

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/msrissaxox/urbancanvas
    ```

2.  **Navigate into the project directory**
    ```bash
    cd urbancanvas
    ```

3.  **Install dependencies**
    ```bash
    npm install
    ```

4.  **Set up environment variables:**
    You will likely need to configure environment variables for NextAuth, your database connection (if direct), and potentially Vercel. Create a `.env.local` file and add the necessary variables. Refer to the documentation of NextAuth and any database you are using for the required variables.

5.  **Run database migrations (if applicable):**
    If you are using a database with migrations, run them to set up your database schema.

6.  **Start the development server**
    ```bash
    npm run dev
    ```

7.  **Open in browser:** [http://localhost:3000](http://localhost:3000)

## How It Works

-   **User Interaction:** Users can browse the showcased murals. Logged-in users can upload new murals, edit or delete their own, and like other murals.
-   **Authentication:** Users can create accounts and log in using NextAuth.
-   **Mural Posting:** Logged-in users can upload images and create posts showcasing urban murals.
-   **Content Management:** Users have control over their own mural posts, allowing them to make edits or remove them.
-   **Engagement:** Users can show their appreciation for murals by liking them.