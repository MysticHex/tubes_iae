FROM node:18

WORKDIR /app


COPY package.json .
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 4001

CMD ["npm", "start"]