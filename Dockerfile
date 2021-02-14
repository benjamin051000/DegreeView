FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Bundle app source
COPY server/ server/

EXPOSE 5000

CMD npm start