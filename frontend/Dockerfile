FROM node:18 as build

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 4173

ARG VITE_BACKEND_BASE_URL
ENV VITE_BACKEND_BASE_URL=$VITE_BACKEND_BASE_URL

ARG VITE_BACKEND_WS_URL
ENV VITE_BACKEND_WS_URL=$VITE_BACKEND_WS_URL

ARG VITE_FRONTEND_BASE_URL
ENV VITE_FRONTEND_BASE_URL=$VITE_FRONTEND_BASE_URL

RUN npm run build

# CMD ["npm", "run", "preview-host"]

# fuck nginx
FROM nginx:1.21.1-alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]