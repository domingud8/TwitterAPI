const express = require("express");
const app = express();
const path = require("path");
const { getTweets, extractData } = require("./twitter-pr");

app.use("/", express.static(path.join(__dirname, "public")));

const names = ["nytimes", "BBCNews", "TheOnion"];

app.get("/links.json", (request, response) => {
    const to_do = names.map(getTweets);
    Promise.all(to_do)
        .then((result) => {
            const output = extractData(result.flat());
            response.json(output);
        })
        .catch((error) => {
            console.log(error);
            response.sendStatus(500);
        });
});
app.listen(3000);
