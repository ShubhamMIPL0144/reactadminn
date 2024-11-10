# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /src

# Copy package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies (use --legacy-peer-deps to avoid peer dependency conflicts)
RUN npm install --legacy-peer-deps

# Copy the rest of your application files to the container
COPY . .

# Build the application (if needed, for example, with React or Vue)
# RUN npm run build

# Expose the port the app runs on (replace with your app's port if different)
EXPOSE 80

# Start the application
CMD ["npm", "start"]
