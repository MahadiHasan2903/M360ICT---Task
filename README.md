# Overview

The "M360ICT - Task" project is a task given by M360ICT as part of NodeJS developer assesment

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Node.js:** Version 18 or higher. If you haven't installed it yet, you can download it from the [official Node.js website](https://nodejs.org/).
- **npm:** npm is used as the package manager for this project. Make sure you have npm installed globally. If you need to install it, you can find instructions in the [npm documentation](https://docs.npmjs.com/).
- **Docker:** Docker is optional to run the production version of the application. Install Docker from the [official Docker website](https://www.docker.com/get-started).

## Getting Started

Follow these steps to get your Node.js project up and running (Recommended):

1. **Clone the repository:**
   ```bash
    git clone https://github.com/MahadiHasan2903/M360ICT---Task.git
   ```
2. **Navigate to the project directory:**

   ```bash
    cd M360ICT---Task
   ```

3. **Before running the project, make sure to copy the environment file and provide the necessary information:**

```bash
 cp .env.example .env
```

4. **Install dependencies:**

   ```bash
    npm install
   ```

5. **Start the development server:**

   ```bash
    npm run server
   ```

6. **Open your browser and visit:**
   ```
    http://localhost:8080
   ```

## Running with Docker

If you prefer to run the project in a Docker container, follow these steps (Optional):

1. **Copy the environment file:**
   Before building the Docker image, copy the environment file:

   ```bash
   cp .env.example .env
   ```

2. **Build the Docker image:**

   ```bash
   docker build -t server-app .
   ```

   <sub>Note: To see the build logs add `--progress=plain`</subb>

3. **Run the Docker container:**

   ```bash
   docker run -p 8080:8080 server-app
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:8080
   ```

Note: If you need support for development mode using Docker, please contact the repository maintainer.

## Additional Information

- **Documentation:** For more information on how to use Node.js, check out the [Node.js documentation](https://nodejs.org/docs/latest/api/).

## Support

If you encounter any issues or have any questions, feel free to reach out to the project maintainers or open an issue.

## License

This project is licensed under the [MIT License](LICENSE).

© Md. Mahadi Hasan
