# nginx state for serving content
FROM nginx:alpine

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets over
COPY ./dist/* ./

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]




# FROM nginx:alpine

# WORKDIR /app

# COPY ./dist/ /app/static/
# COPY ./nginx.conf /etc/nginx/nginx.conf

# Run the entrypoint at runtime (executed when the container starts)
#CMD ["node", "index.js"]