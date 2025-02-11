FROM node:18-alpine
RUN apk add --no-cache g++
WORKDIR /sandbox
COPY execute.js .
CMD ["node", "execute.js"]
