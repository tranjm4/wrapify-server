var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var express = require("express");
var session = require("express-session");
var axios = require("axios");
var querystring = require("querystring");
var cors = require("cors");
var dotenv = require("dotenv");
dotenv.config();
var app = express();
var localURL = "https://wrapify-server-bff9ee0094f2.herokuapp.com";
app.use(cors());
app.use("/", express.static("public"));
var clientID = process.env.CLIENTID;
var PORT = 8000;
// Get Code
app.get("/auth/spotify", function (req, res) {
    var _a = req.query, response_type = _a.response_type, redirect_uri = _a.redirect_uri, scope = _a.scope, code_challenge = _a.code_challenge, code_challenge_method = _a.code_challenge_method, verifier = _a.verifier;
    req.session.codeVerifier = verifier;
    var queryParams = querystring.stringify({
        client_id: clientID,
        response_type: response_type,
        redirect_uri: redirect_uri,
        scope: scope,
        code_challenge: code_challenge,
        code_challenge_method: code_challenge_method,
    });
    res.redirect("https://accounts.spotify.com/authorize?".concat(queryParams));
});
app.get("/callback", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var _a, code, verifier, redirectURI, params, access_token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, code = _a.code, verifier = _a.verifier;
                redirectURI = "https://wrapify.jmhtran.dev/callback";
                params = querystring.stringify({
                    "client_id": clientID,
                    "grant_type": "authorization_code",
                    "code": code,
                    "redirect_uri": redirectURI,
                    "code_verifier": verifier
                });
                delete req.session.codeVerifier;
                return [4 /*yield*/, fetch("https://accounts.spotify.com/api/token", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: params
                    }).then(function (response) {
                        return response.json();
                    })];
            case 1:
                access_token = _b.sent();
                res.json(access_token);
                return [2 /*return*/];
        }
    });
}); });
app.get("/getData", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var access_token, jsonData, _a, _b, _c, _i, key, _d, _e, _f, _g, term, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                access_token = req.query.access_token;
                jsonData = {
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
                _a = jsonData;
                _b = [];
                for (_c in _a)
                    _b.push(_c);
                _i = 0;
                _k.label = 1;
            case 1:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                _c = _b[_i];
                if (!(_c in _a)) return [3 /*break*/, 5];
                key = _c;
                _d = jsonData[key];
                _e = [];
                for (_f in _d)
                    _e.push(_f);
                _g = 0;
                _k.label = 2;
            case 2:
                if (!(_g < _e.length)) return [3 /*break*/, 5];
                _f = _e[_g];
                if (!(_f in _d)) return [3 /*break*/, 4];
                term = _f;
                _h = jsonData[key];
                _j = term;
                return [4 /*yield*/, fetch(localURL + "/".concat(key, "?term=").concat(term, "&access_token=").concat(access_token))
                        .then(function (response) {
                        return response.json();
                    })];
            case 3:
                _h[_j] = _k.sent();
                _k.label = 4;
            case 4:
                _g++;
                return [3 /*break*/, 2];
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6:
                res.json(jsonData);
                return [2 /*return*/];
        }
    });
}); });
app.get("/trackData", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var _a, term, access_token, response, data, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.query, term = _a.term, access_token = _a.access_token;
                console.log("Track (".concat(term, ")"));
                return [4 /*yield*/, fetch("https://api.spotify.com/v1/me/top/tracks?time_range=".concat(term, "&limit=10&offset=0"), {
                        method: "GET",
                        headers: {
                            Authorization: "Bearer ".concat(access_token),
                        }
                    })];
            case 1:
                response = _b.sent();
                if (!(response.status !== 200)) return [3 /*break*/, 2];
                console.log("Failed call! Response status ".concat(response.status));
                res.status(response.status).send({});
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, response.json()];
            case 3:
                data = _b.sent();
                res.json(data);
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                console.error("Error in /trackData", error_1);
                res.status(500).send({ error: "An error occurred" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
app.get("/artistData", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var _a, term, access_token, response, data, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.query, term = _a.term, access_token = _a.access_token;
                console.log("Artist (".concat(term, ")"));
                return [4 /*yield*/, fetch("https://api.spotify.com/v1/me/top/artists?time_range=".concat(term, "&limit=10&offset=0"), {
                        method: "GET",
                        headers: {
                            Authorization: "Bearer ".concat(access_token),
                        },
                    })];
            case 1:
                response = _b.sent();
                if (!(response.status !== 200)) return [3 /*break*/, 2];
                console.log("Failed call! Response status ".concat(response.status));
                res.status(response.status).send({});
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, response.json()];
            case 3:
                data = _b.sent();
                res.json(data);
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                console.error("Error in /artistData", error_2);
                res.status(500).send({ error: "An error occurred" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
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
app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
