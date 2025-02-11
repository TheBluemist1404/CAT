FROM node:18-alpine 
RUN apk add --no-cache python3
WORKDIR /sandbox
COPY execute.js .
CMD ["node", "execute.js"]
