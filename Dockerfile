# Base image
FROM node:19.6.0

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY .env.* ./
COPY ./src ./src
COPY ./nest-cli.json ./
COPY ./tsconfig.build.json ./
COPY ./tsconfig.json ./

# Bundle app source
COPY . .


RUN npm install -g @nestjs/cli

# Install app dependencies
RUN npm install


# Creates a "dist" folder with the production build
RUN npm run build


ENV PORT 3000

EXPOSE 3800


# Start the server using the production build
CMD [ "node", "dist/main.js" ]