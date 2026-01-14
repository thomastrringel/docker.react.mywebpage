FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
# CMD ["vite", "--https", "--host"] # Use this for HTTPS
CMD ["npm", "run", "dev", "--", "--host"]   