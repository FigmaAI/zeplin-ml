const https = require("https");

const TOKEN = "";

function getToken(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api-hyperclova.navercorp.com",
      path: "/v1/auth/token?existingToken=true",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${token}`,
      },
    };
    const req = https.request(options, (res) => {
      if (res.statusCode != 200) {
        return reject();
      }
      let responseBody = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      res.on("end", () => {
        console.log("no more data in body");
        console.log(responseBody);
        const result = JSON.parse(responseBody);
        resolve(result.result);
      });
    });
    req.on("error", (e) => {
      console.log(e);
      reject(e);
    });
    req.end();
  });
}

function executeApp(tokenInfo, reqBody) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api-hyperclova.navercorp.com",
      path: "/v1/apps/execute",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${tokenInfo.tokenType} ${tokenInfo.accessToken}`,
        "X-Session-Id": "test-my-session-name",
      },
    };
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        console.error(`unexpected status code ${res.statusCode}`);
        return reject();
      }
      let resBody = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        resBody += chunk;
      });
      res.on("end", () => {
        console.log("no more data in body");
        console.log(resBody);
        const result = JSON.parse(resBody);
        resolve(result.result);
      });
    });
    req.on("error", (e) => {
      console.error(e);
      reject(e);
    });
    req.write(JSON.stringify(reqBody));
    req.end();
  });
}

getToken(TOKEN)
  .then((token) => {
    console.log("get token");
    console.log(token);
    return executeApp(token, { sendMessage: "안녕" });
  })
  .then((result) => {
    console.log("got the response");
    console.log(result);
  })
  .catch((err) => console.log(err));
