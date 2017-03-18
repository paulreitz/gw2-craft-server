import { Router, Request, Response } from "express";

import { DatabaseService } from "../services/databaseservice";
import { IItem } from "../interfaces/IITem";

"use strict";

export class ItemController {

    constructor(router: Router) {
        router.route("/items").get(this.getItems);
        router.route("/items/:t_id").get(this.getItem);
    }

    private getItem(req:Request, res: Response) {
        console.log(req);
        var id = req.params.t_id;
        DatabaseService.getSingleItem(id).then (
            (data:IItem) => {
                res.json(data);
            },
            (err) => {
                res.json(err);
            }
        );
    }

    private getItems(req:Request, res: Response) {
        DatabaseService.getItems(req.query).then(
            (data) => {
                res.json(data);
            },
            (err) => {
                res.json(err);
            }
        )
    }
}