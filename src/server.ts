require("dotenv").config({path: "./config.env"});
import * as express from "express";
import * as bodyParser from "body-parser";

import {ItemController} from "./controllers/itemcontroller";
import {RecipeController} from "./controllers/recipecontroller";

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 1337;

var router = express.Router();

router.get("/", (req:express.Request, res: express.Response) => {
    res.json({message: "yay! it works and stuff!"});
});

app.use("/api", router);

var itemController = new ItemController(router);
var recipeController = new RecipeController(router);

app.listen(port);
console.log("Magic happens on port " + port);