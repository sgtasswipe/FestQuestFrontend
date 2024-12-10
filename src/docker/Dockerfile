# Use official Nginx image
FROM nginx:latest

# Copy the build folder to the Nginx server's public folder
COPY ./ /usr/share/nginx/html

# Expose port 80 (default for HTTP)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
