FROM alpine:3.13.5

LABEL maintainer="dev@gamigo.com"

RUN apk update && \
    apk add nginx && \
    mkdir -p /srv/site

WORKDIR /srv/site

COPY ./docker/dev.nginx.conf /etc/nginx/conf.d/default.conf
COPY ./docker/dev.start.sh /tmp/start.sh

ENV ENV="/root/.ashrc"

CMD ["ash", "/tmp/start.sh"]
