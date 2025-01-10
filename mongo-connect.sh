retries=5
count=0
until docker exec mongo_db_community sh -c 'mongosh --eval "db.runCommand({ ping: 1 })"' || [ $count -ge $retries ]; do
    echo "Waiting for test_db to be ready...Attempt $((count + 1))/$retries"
    sleep 5
    count=$((count + 1))
done
if [ $count -ge $retries ]; then
    echo "The test db did not start in time, exiting..."
    exit 1
fi
echo "Connection test successful"