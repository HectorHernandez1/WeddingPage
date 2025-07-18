FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Remove any existing config
RUN rm -f /etc/nginx/conf.d/default.conf.default

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 