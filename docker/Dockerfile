FROM node:20-alpine as build

WORKDIR /app

COPY package*.json package-lock.json ./

RUN npm ci

# Copy the project files into the working directory
COPY ./ ./

ENV VITE_API_BASE_URL='/api'

# Build the React app for production
RUN npm run build

# Use the official NGINX image for production
FROM nginx:stable-alpine as production

# copy nginx configuration in side conf.d folder
COPY --from=build /app/docker/nginx /etc/nginx/conf.d

# Copy the build output from the dist folder into the Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to allow access to the app
EXPOSE 80

# Run Nginx in the foreground
# ENTRYPOINT ["nginx", "-g", "daemon off;"] 