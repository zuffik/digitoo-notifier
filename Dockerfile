FROM node:15-alpine

WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build
CMD ["yarn", "start:prod"]