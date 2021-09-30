
# Docker build and run script

cp ../path/to/src/*.json ./node-scores
docker build ./node-scores/ -t node-scores

docker stop node-scores
docker container prune -f

docker run \
	--name "node-scores" \
	--restart "unless-stopped" \
	--volume "/path/to/src/node-scores:/usr/src/app" \
	--volume "/path/to/data/node-scores:/usr/src/data" \
	--volume "/path/to/logs/node-scores:/usr/src/logs" \
	--detach \
	node-scores

#	--publish "80:3329" \
