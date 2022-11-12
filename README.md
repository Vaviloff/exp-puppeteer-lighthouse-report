## Simple Lighthouse web-site performance test

Start the test site in docker conatiners and wait a couple minutes for the script to seed the database:
```
docker-compose up -d
```
Install dependencies:
```sh
yarn
# or
npm install
```

Run the performace test:
```sh
node index.js
```

The report `user-flow.report.html` will be generated in the folder.

Remove the test site deployment:
```sh
docker-compose down
```