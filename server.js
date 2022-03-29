const https = require("https");
////function to do the request
function makeRequest(params, requestBody, callback) {
    const request = https.request(params, (response) => {
        let body = "";
        response
            .on("data", (chunk) => (body += chunk))
            .on("end", () => {
                const parseBody = JSON.parse(body);
                callback(null, parseBody);
            })
            .on("error", (err) => callback(err));
    });
    request.end(requestBody);
}

////function to get the tocken
function getTocken(basic_header, callback) {
    /*console.log(saved_tocken);
    if (saved_tocken) {
        console.log("Tocken already exists");
        callback(saved_tocken);
        return;
    }*/
    console.log("There will be a token request.");
    makeRequest(
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
        "grant_type=client_credentials",
        (error, responseBody) => {
            //saved_tocken = responseBody.access_token;
            callback(responseBody.access_token);
        }
    );
}

const { Key, Secret } = require("./secrets.json");
const basic_header = Buffer.from(`${Key}:${Secret}`).toString("base64");

//let saved_tocken;

////function that use the token to get tweets
function getTweets(userName, callback) {
    getTocken(basic_header, (token) => {
        makeRequest(
            {
                method: "GET",
                host: "api.twitter.com",
                path: `/1.1/statuses/user_timeline.json?screen_name=${userName}&tweet_mode=extended&exclude_replies=true`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
            null,
            (error, response) => {
                if (error) {
                    callback(error);
                    return;
                }
                callback(null, response);
            }
        );
    });
}

module.exports = getTweets;

////end-point where tweets will be served
//// Option with call back
/*app.get("/links.json", (request, response) => {
    getTweets(userName, (error, tweets) => {
        const output = extractData(tweets);
        response.json(output);
    });
});*/
