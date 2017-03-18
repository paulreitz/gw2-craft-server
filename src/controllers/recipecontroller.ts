import { Router, Request, Response } from "express";

import { RecipeBuilder } from "../core/recipebuilder";
import { IRecipeTree } from "../interfaces/IRecipeTree";

"use strict";

export class RecipeController {

    constructor(router: Router) {
        router.route("/recipe/:t_id").get(this.getRecipeTree);
    }

    private getRecipeTree(req:Request, res: Response) {
        var id = req.params.t_id;
        var rp = new RecipeBuilder();
        rp.buildRecipeTree(id).then(
            (tree) => {
                res.json(tree);
            },
            (error) => {
                res.json(error);
            }
        )
    }
}