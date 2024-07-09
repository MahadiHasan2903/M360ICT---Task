# Use the specified Node.js version
ARG NODE_VERSION=18
FROM node:${NODE_VERSION}

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE ${PORT}

# Run the application
CMD [ "node", "dist/server.js" ]
