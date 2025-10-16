# Build the React UI
FROM node:20-bullseye AS build
WORKDIR /app
COPY ui/package*.json ./
RUN npm ci
COPY ui/ ./
ARG VITE_API_URL
ARG VITE_DMZ_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_DMZ_URL=$VITE_DMZ_URL
RUN npm run build

# Serve with nginx
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN printf 'server {\n  listen 80;\n  add_header Cache-Control "no-store";\n  root /usr/share/nginx/html;\n  index index.html;\n  location / { try_files $uri /index.html; }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
