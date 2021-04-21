#!/usr/bin/env bash

echo "Building server..."
echo ""
docker build -t site-image --file ./docker/dev.dockerfile .
echo "Starting server..."
echo ""
docker-compose -p skydome --file ./docker/dev-composition.json up -d
docker exec -it site-server ash
echo "Stopping server..."
docker-compose --file ./docker/dev-composition.json stop
echo "Done."
