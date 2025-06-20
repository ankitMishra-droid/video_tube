FROM node:20

WORKDIR /app

# Only copy package.json files first to leverage Docker cache
COPY package*.json ./

# Clean lock file and modules to fix Rollup bug
RUN rm -rf node_modules package-lock.json && npm install

# Now copy the rest
COPY . .

EXPOSE 5173
ENV HOST=0.0.0.0

CMD ["npm", "run", "dev"]
