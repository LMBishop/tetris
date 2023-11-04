FROM node:18 as build

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

ARG BACKEND_HTTP_URL
ENV VITE_BACKEND_BASE_URL ${BACKEND_HTTP_URL}

ARG BACKEND_WS_URL
ENV VITE_BACKEND_WS_URL ${BACKEND_WS_URL}

ARG FRONTEND_URL
ENV VITE_FRONTEND_BASE_URL ${FRONTEND_URL}


RUN npm run build


FROM nginx:1.21.1-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]