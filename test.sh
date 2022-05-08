mkdir test
cd test
mkdir server
mkdir client1
mkdir client2
mkdir client3
cd ..

cp -R server/* test/server
echo "Server copied!"
cp -R client/* test/client1
echo "Client1 copied!"
# cp -R client/* test/client2
# echo "Client2 copied!"
cp -R client/* test/client3
echo "Client3 copied!"

cd test
echo "{}" > server/data.json

cd client1
echo "[]" > data.json
echo "{\"port\": 1111," > config.json
echo "\"server\": \"localhost:8000\"," >> config.json
echo "\"username\": \"user1\"}" >>config.json
cd ..

# cd client2
# echo "[]" > data.json
# echo "{\"port\": 2222," > config.json
# echo "\"server\": \"localhost:8000\"," >> config.json
# echo "\"username\": \"user2\"}" >>config.json
# cd ..

cd client3
echo "[]" > data.json
echo "{\"port\": 3333," > config.json
echo "\"server\": \"localhost:8000\"," >> config.json
echo "\"username\": \"user3\"}" >>config.json
cd ..