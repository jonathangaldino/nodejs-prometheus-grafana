# Select the nodejs image and version
FROM node:12.16.1

# Create the app directory
WORKDIR /laboratory/app

# Install YARN cuz I like it
RUN curl -o -L https://yarnpkg.com/install.sh | bash

# Copy package.json first
COPY package.json ./

# Copy yarn.lock 
COPY yarn.lock ./

# Install dependencies
RUN yarn --production

# Bundle app source
COPY . .

# Expose the app port
EXPOSE 5000


# Start the app
CMD ["yarn", "start"]


