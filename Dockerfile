FROM registry.secret.su/common/node:14-alpine
RUN npm install -g serve
WORKDIR /app
#ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
COPY package-deploy.json ./
COPY tsconfig.json ./
COPY tslint.json ./
COPY webpack.config.js ./
RUN npm install
RUN npm ci
COPY . ./
RUN npm run build

CMD ["serve", "-p", "80", "-s", "/app/build"]
