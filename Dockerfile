FROM 590184140933.dkr.ecr.us-east-1.amazonaws.com/mfg-ui:base AS build
ARG env=dev
ENV env=${env}
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build:${env}

FROM nginx:alpine3.18-perl
COPY --from=build /app/dist/ /usr/share/nginx/html
COPY /deploy/nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80
