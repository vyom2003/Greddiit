FROM node:18.13.0

WORKDIR /frontend
COPY package.json .
RUN npm install
COPY . .


RUN npm run build
RUN npm install -g serve

CMD ["npm","start"]