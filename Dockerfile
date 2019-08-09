FROM node:lts

ENV TZ="/usr/share/zoneinfo/Asia/Seoul"

ARG PROJECT_DIR=/home/watchdocs/backend

COPY . ${PROJECT_DIR}

WORKDIR ${PROJECT_DIR}

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
