import * as sql from "mssql";
import * as Promise from "promise";

import {IItem} from "../interfaces/IITem";
import { IIngredient, IRecipe} from "../interfaces/IRecipe";
import {IItemSearchParams, IItemSearchResults} from "../interfaces/isearchparams";
import { Constants } from "../core/constants";

"use strict";

export class DatabaseService {
    public static dbConfig = {
        server: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PSWRD,
        options: {
            encrypt: true
        }
    };

    public static getSingleItem(id: number): Promise<IItem> {
        var itemPromise = new Promise<IItem>((resolve, reject) => {
            var conn = new sql.Connection(DatabaseService.dbConfig);
            var request = new sql.Request(conn);
            conn.connect((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                var qString:string = "select * from Items where id = '" + id + "'";
                request.query(qString, (error, set) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        if (set.length) {
                            resolve(<IItem>set[0]);
                        }
                        else {
                            reject({message: "item not found"});
                        }
                    }
                    conn.close();
                })
            })
        });
        return itemPromise;
    }

    public static getItems(params: IItemSearchParams): Promise<IItemSearchResults> {
        var searchParts:Array<string> = [];
        if (!isNaN(params.type) && params.type >= 0 && params.type < Constants.TYPES.length) {
            searchParts.push("type = '" + Constants.TYPES[params.type] + "'");
        }
        if (!isNaN(params.subType) && params.subType >= 0 && params.subType < Constants.SUBTYPES.length) {
            searchParts.push("details like '%\"type\":\"" + Constants.SUBTYPES[params.subType] + "\"%'");
        }
        if (!isNaN(params.rarity) && params.rarity >= 0 && params.rarity < Constants.RARITIES.length) {
            searchParts.push("rarity = '" + Constants.RARITIES[params.rarity] + "'");
        }
        if (!isNaN(params.min_level) && params.min_level > 0) {
            searchParts.push("level >= " + params.min_level);
        }

        var limit = (isNaN(params.limit) || params.limit <= 0)? 10 : params.limit;
        var offset = (isNaN(params.page) || params.page <= 1)? 0 : (params.page - 1) * limit;
        var qString = "select * from Items";
        var countString = "select count(*) as 'count' from Items";
        if (searchParts.length) {
            var queryParts = searchParts.join(" and ");
            qString += " where " + queryParts;
            countString += " where " + queryParts;
        }
        console.log(qString);
        qString += " order by id offset " + offset + " rows fetch next " + limit + " rows only";
        DatabaseService.getCount(countString);
        var itemsPromise = new Promise<IItemSearchResults>((resolve, reject) => {
            var conn = new sql.Connection(DatabaseService.dbConfig);
            var request = new sql.Request(conn);
            conn.connect((err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                request.query(qString, (error, set) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        var items:Array<IItem> = [];
                        set.forEach((value:IItem) => {
                            items.push(value);
                        });
                        DatabaseService.getCount(countString).then(
                            (count) => {
                                var results:IItemSearchResults = {
                                    total: count,
                                    results: items
                                };
                                resolve(results);
                            },
                            (error) => {
                                reject(error);
                            }
                        );
                    }
                    conn.close();
                })
            })
        });
        return itemsPromise;
    }

    private static getCount(search): Promise<number> {
        var countPromise = new Promise<number>((resolve, reject) => {
            var conn = new sql.Connection(DatabaseService.dbConfig);
            var request = new sql.Request(conn);
            conn.connect((err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                request.query(search, (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    if (result.length && result[0]["count"]) {
                        resolve(<number>result[0]["count"]);
                    }
                    else {
                        reject({message: "Failed to get count"});
                    }
                })
            })
        });
        return countPromise;
    }

    public static getRecipeByItem(id:number) :Promise<IRecipe> {
        var recipePromise = new Promise<IRecipe>((resolve, reject) => {
            var conn = new sql.Connection(DatabaseService.dbConfig);
            var request = new sql.Request(conn);
            conn.connect((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                request.query("uspGetRecipeByItem @id=" + id, (error, set) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        if (set.length) {
                            var disciplines:Array<string>;
                            var flags: Array<string>
                            var ingredients: Array<IIngredient>
                            try {disciplines = JSON.parse(set[0]["disciplines"]);}catch(e) {disciplines = set[0]["disciplines"];}
                            try {flags = JSON.parse(set[0]["flags"]);}catch(e){flags = set[0]["flags"]}
                            try {ingredients = JSON.parse(set[0]["ingredients"]);}catch(e){ingredients = set[0]["ingredients"]}
                            // console.log(ingredients);
                            var recipe:IRecipe = {
                                id: set[0]["id"],
                                type: set[0]["type"],
                                output_item_id: set[0]["output_item_id"],
                                output_item_count: set[0]["output_item_count"],
                                min_rating: set[0]["min_rating"],
                                time_to_craft_ms: set[0]["time_to_craft_ms"],
                                disciplines: disciplines,
                                flags: flags,
                                ingredients: ingredients,
                                chat_link: set[0]["chat_link"]
                            };
                            resolve(recipe);
                        }
                        else {
                            resolve(null);
                        }
                    }
                })
            })
        });
        return recipePromise;
    }
}