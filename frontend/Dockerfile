FROM node:18 as build

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 4173

CMD ["npm", "run", "preview-host"]

# fuck nginx

# RUN npm run build

# FROM nginx:1.21.1-alpine
# 
# COPY --from=build /app/dist /usr/share/nginx/html
# 
# EXPOSE 80
# 
# CMD ["nginx", "-g", "daemon off;"]