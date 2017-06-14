FROM node:boron

WORKDIR /supplier-finder

COPY package.json .
RUN npm install

COPY . .

EXPOSE 80 3000

CMD ["npm", "start"]