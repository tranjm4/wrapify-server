const express = require("express");
const session = require("express-session");
const querystring = require("querystring");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const localURL = "https://wrapify-server.jmhtran.dev";
const clientURL = "https://wrapify.jmhtran.dev";
const clientSecret = process.env.CLIENT_SECRET;
const clientID = process.env.CLIENT_ID;

app.use(session({
    secret: clientSecret,
    resave: false,
    saveUninitialized: true
}));
app.use(cors());
app.use("/", express.static("public"));
const PORT = process.env.PORT || 3000;

// Get Code
app.get("/auth/spotify", (req, res) => {
    const { response_type, redirect_uri, scope, code_challenge, code_challenge_method, verifier } = req.query;

    req.session.codeVerifier = verifier;

    const queryParams = querystring.stringify({
        client_id: clientID,
        response_type: response_type,
        redirect_uri: redirect_uri,
        scope: scope,
        code_challenge: code_challenge,
        code_challenge_method: code_challenge_method,
    });

    res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
})

app.get("/callback", async (req, res) => {
    const { code, verifier } = req.query;
    const redirectURI = `${clientURL}/callback`;
    const params = querystring.stringify({
        "client_id": clientID,
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirectURI,
        "code_verifier": verifier
    });

    delete req.session.codeVerifier;

    const access_token = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    }).then(response => {
        return response.json();
    })

    res.json(access_token);
});

app.get("/getData", async (req, res) => {
    const { access_token } = req.query;
    let jsonData = {
        artistData: {
            short_term: {},
            medium_term: {},
            long_term: {},
        },
        trackData: {
            short_term: {},
            medium_term: {},
            long_term: {},
        }
    };

    for (const key in jsonData) {
        for (const term in jsonData[key]) {
            jsonData[key][term] = await fetch(localURL + `/${key}?term=${term}&access_token=${access_token}`)
                .then(response => {
                    return response.json();
                });
        }
    }

    res.json(jsonData);

    // fetch(`https://api.spotify.com/v1/me/top/tracks?limit=10&offset=0`, {
    //     method: "GET",
    //     headers: {
    //         Authorization: `Bearer ${access_token}`,
    //     },
    // })
    //     .then(response => {
    //         return response.json();
    //     }).then(data => {
    //         res.json(data);
    //     })

});

app.get("/trackData", async (req, res) => {
    try {
        const { term, access_token } = req.query;
        console.log(`Track (${term})`)

        const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${term}&limit=10&offset=0`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        });

        if (response.status !== 200) {
            console.log(`Failed call! Response status ${response.status}`);
            res.status(response.status).send({});
        } else {
            const data = await response.json();
            res.json(data);
        }
    }
    catch (error) {
        console.error("Error in /trackData", error);
        res.status(500).send({ error: "An error occurred" });
    }
});

app.get("/artistData", async (req, res) => {
    try {
        const { term, access_token } = req.query;
        console.log(`Artist (${term})`)

        const response = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${term}&limit=10&offset=0`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })

        if (response.status !== 200) {
            console.log(`Failed call! Response status ${response.status}`)
            res.status(response.status).send({});
        } else {
            const data = await response.json();
            res.json(data);
        }
    }
    catch (error) {
        console.error("Error in /artistData", error);
        res.status(500).send({ error: "An error occurred" });
    }
})

// app.get("/refresh_token", (req, res) => {
//     const refresh_token = req.query.refres_token;
//     const authOptions = {
//         method: "POST",
//         headers: {
//             "Authorization": "Basic " + (Buffer.from(clientID + ":" + clientSecret).toString("base64")),
//             "Content-Type": "application/x-www-form-urlencoded"
//         },
//         body: `grant_type=refresh_token&refresh_token=${refresh_token}`
//     };
//     fetch("https://accounts.spotify.com/api/token", authOptions)
//         .then( response => {
//             if (response.status === 200) {
//                 response.json()
//                 .then( data => {
//                     const access_token = data.access_token;
//                     res.send({access_token});
//                 });
//             }
//         })
//         .catch(error => {
//             console.error(error);
//             res.send(error);
//         })
// })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
