FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./

# For testing -OR-
#RUN npm install
# For production
RUN npm ci --only=production

COPY . .

# Set with -p at run-time...
#EXPOSE 3029/tcp
CMD [ "node", "server.js" ]
