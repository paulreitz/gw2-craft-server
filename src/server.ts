import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import {ItemController} from "./controllers/itemcontroller";
import {RecipeController} from "./controllers/recipecontroller";

var app = express();
app.use(cors());


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 1337;

var router = express.Router();

router.get("/", (req:express.Request, res: express.Response) => {
    // TODO: Should include an API info page here.
    res.json({message: "GW2 Crafting Utility API"});
});

app.use("/api", router);

var itemController = new ItemController(router);
var recipeController = new RecipeController(router);

app.listen(port);
console.log("Server running on port " + port);