# syntax=docker/dockerfile:1

ARG NODE_VERSION=20

# Use the official Node.js image as the base image with a flexible Node.js version
FROM node:${NODE_VERSION}-alpine

# Set the NODE_ENV and PORT arguments
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=19006
ENV PORT $PORT

# Expose the ports that the app runs on
EXPOSE $PORT 19001 19002

# Install global packages
RUN npm i npm@latest -g expo-cli expo update

# install dependencies first, in a different location for easier app bind mounting for local development
# WORKDIR now sets correct permissions if you set USER first
WORKDIR /opt/meau_app

# Copy the pre-build script and ensure it has the correct permissions
# Copy the package.json and package-lock.json files
COPY --chown=node:node package.json package-lock.json* ./
COPY ./eas-build/pre-build/00_gerar-google-services.sh /opt/meau_app/eas-build/pre-build/
RUN chmod +x /opt/meau_app/eas-build/pre-build/00_gerar-google-services.sh

# Copy the UtilsGerarGoogleServicesFile.ts script
COPY ./src/utils/UtilsGerarGoogleServicesFile.ts /opt/meau_app/src/utils/

# Copy the google-services-base.json file
COPY google-services-base.json /opt/meau_app/

RUN npm ci && npm cache clean --force
ENV PATH /opt/meau_app/node_modules/.bin:$PATH


WORKDIR /opt/meau_app/app
# Copy the rest of the application code
COPY . .

#RUN npm install -g expo-cli
# Install specific Expo dependencies and update Expo
CMD ["npx", "expo", "install", "--check"]

# Start the Expo app
# npx expo start  --tunnel
