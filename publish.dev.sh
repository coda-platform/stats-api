rm -r -f ./build

docker build -t coda19-stats-api:dev .

docker tag coda19-stats-api:dev coda19/coda19-stats-api:dev
docker push coda19/coda19-stats-api:dev
echo "Finished running script sleeping 30s"
sleep 30