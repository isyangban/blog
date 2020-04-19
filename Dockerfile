FROM node:13.13-alpine
LABEL MAINTAINER Jeong Woon Choi (choijeongwoon@gmail.com)
WORKDIR /build
COPY . .
RUN npm install
RUN npm run build

FROM nginx:latest
WORKDIR /usr/share/nginx/html
COPY --from=0 /build/docs/.vuepress/dist .
