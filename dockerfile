FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./

# For testing -OR-
#RUN npm install
# For production
RUN npm ci --only=production

# Instead of this, just set with -v at run-time...
#COPY . .

# Instead of this, just set with -p at run-time...
#EXPOSE 3029/tcp

# Run once:
CMD [ "node", "." ]
