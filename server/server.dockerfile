FROM node:20

RUN apt-get update && \
    apt-get install -y tesseract-ocr


WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4001

CMD ["node", "index.js"]