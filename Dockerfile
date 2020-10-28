FROM node:12.18 AS base

FROM base AS build

WORKDIR /build/
COPY ./frontend ./
RUN yarn
RUN yarn run webpack --mode=production

FROM nginx
COPY --from=build /build/dist /dist
COPY ./nginx.conf /etc/nginx/nginx.conf
