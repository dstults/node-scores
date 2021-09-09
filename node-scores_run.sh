
# Docker build and run script

docker build ./node-scores/ -t node-scores

docker stop node-scores
docker container prune -f

docker run \
	--name "node-scores" \
	--user "root" \
	--restart "unless-stopped" \
	--volume "/path/to/data/node-scores:/usr/src/app/data" \
	--volume "/path/to/logs/node-scores:/usr/src/app/logs" \
	--detach \
	node-scores

#	--publish "80:3329" \
