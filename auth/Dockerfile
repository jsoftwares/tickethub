FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm start
COPY . .

CMD ["npm start"]