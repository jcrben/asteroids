FROM ubuntu:vivid
MAINTAINER Ben Creasy <contact@bencreasy.com>

ENV DEBIAN_FRONTEND noninteractive
# ENV NODE_ENV production

RUN apt-get update -y \
  && apt-get install -y nginx-full \
  && mkdir /app 
ADD . /app
ADD . /var/www/html
WORKDIR /app
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
