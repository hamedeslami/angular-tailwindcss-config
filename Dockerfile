FROM node:22-alpine AS builder
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
RUN apk --no-cache add bash git
COPY package*.json ./
RUN npm install --cache /tmp/.npm
COPY . .
RUN npm run build -- --configuration production --source-map=false

FROM nginx:stable-alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist/angular-config/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /usr/share/nginx/html/assets && touch /usr/share/nginx/html/assets/env.js
RUN chgrp -R root /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 770 /var/cache/nginx /var/run /var/log/nginx

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
