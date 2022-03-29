const https = require("https");

function makeRequest(params, requestBody) {
    return new Promise((resolve, reject) => {
        const request = https.request(params, (response) => {
            let body = "";
            response
                .on("data", (chunk) => (body += chunk))
                .on("end", () => {
                    const parseBody = JSON.parse(body);
                    resolve(parseBody);
                })
                .on("error", (err) => reject(err));
        });
        request.end(requestBody);
    });
}

function getTocken() {
    const { Key, Secret } = require("./secrets.json");
    const basic_header = Buffer.from(`${Key}:${Secret}`).toString("base64");

    return makeRequest(
        {
            method: "POST",
            host: "api.twitter.com",
            path: "/oauth2/token",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
                Authorization: `Basic ${basic_header}`,
            },
        },
        "grant_type=client_credentials"
    ).then((response) => {
        return response.access_token;
    });
}

function getTweets(userName) {
    return getTocken().then((token) => {
        return makeRequest(
            {
                method: "GET",
                host: "api.twitter.com",
                path: `/2/tweets/search/recent`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
            null
        ).then((tweets) => {
            //console.log(tweets);
            return tweets;
        });
    });
}

/*const userName = "TheOnion";
getTweets(userName).then((response) => {
    console.log("here4");
    console.log(response);
});*/

function extractData(tweets) {
    return tweets
        .filter((tweet) => tweet.entities.urls.length == 1)
        .map((tweet) => ({
            text: `${tweet.full_text.split("https")[0].trim()} (${
                tweet.user.name
            })`,
            created_at: tweet.created_at,
            url: tweet.entities.urls[0].url,
        }));
}

module.exports = { getTweets, extractData };
