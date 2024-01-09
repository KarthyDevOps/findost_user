FROM node:14.19.3

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the entire application code to the working directory
COPY . .

# Expose the port that the application will run on
EXPOSE 2277

# Set the default command to start the application
CMD ["npm", "start"]
