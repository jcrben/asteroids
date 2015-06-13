FROM kyma/docker-nginx
MAINTAINER Ben Creasy <contact@bencreasy.com>
ADD . /var/www
CMD 'nginx'
