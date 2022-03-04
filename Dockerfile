FROM node:16-alpine3.14

WORKDIR /home/node/

COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build; exit 0

EXPOSE 8000
CMD ["npm", "run", "start"]
