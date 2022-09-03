FROM node:18.6-alpine
WORKDIR /usr/mysecrets/server
COPY ./server/package.json .
RUN npm install pm2 -g
COPY ./server .
CMD [ "pm2-runtime", "npm", "--", "start" ]