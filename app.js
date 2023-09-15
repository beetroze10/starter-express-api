const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us21.api.mailchimp.com/3.0/lists/f826163864";
  const options = {
    method: "POST",
    auth: "brian2:875da69562f0d3f5349184930ad674e0-us21",
  };

  const request = https.request(url, options, function (response) {
    let responseData = "";
  if ( response.statusCode === 200){
    res.sendFile(__dirname + "/success.html");
  } else{
    res.sendFile(__dirname + "/failure.html");
  }

    response.on("data", function (chunk) {
      responseData += chunk;
    });

    response.on("end", function () {
      const responseJSON = JSON.parse(responseData);
      console.log(responseJSON);

      // Check if the response indicates a successful subscription
      if (response.statusCode === 200 && responseJSON.status === "subscribed") {
        // You can redirect to a success page or send a success message here
        res.sendFile(__dirname + "/success.html");
      } else {
        // Handle errors or send to a failure page
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is up and running on port 3000");
});
