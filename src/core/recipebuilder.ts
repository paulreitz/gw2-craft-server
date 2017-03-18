import * as Promise from "promise";

import { IItem } from "../interfaces/IITem";
import { IIngredient, IRecipe } from "../interfaces/IRecipe";
import { INode, IRecipeTree } from "../interfaces/IRecipeTree";

import {DatabaseService} from "../services/databaseservice";

"use strict";

export class RecipeBuilder {

    idList:Array<number>;
    nodes:{[key: string]: INode};
    itemIds:Array<number>;
    items:{[key:string]:IItem};
    tree: IRecipeTree;
    root:number;

    constructor() {

    }

    buildRecipeTree(root:number): Promise.IThenable<IRecipeTree> {
        this.idList = [root];
        this.nodes = {};
        this.items = {};
        this.itemIds = [];
        this.root = root;
        var treePromise = new Promise<IRecipeTree>((resolve, reject) => {
            this.nextItem().then(() => {
                this.nextItemDetails().then(() => {
                    this.tree = {root: this.root, nodes: this.nodes, items: this.items};
                    resolve(this.tree);
                },
                (error) => {
                    reject(error);
                });
            },
            (err) => {
                console.log(err);
                reject(err);
            })
        });
        return treePromise;
    }

    private nextItem():Promise.IThenable<any> {
        var itemPromise = new Promise<any>((resolve, reject) => {
            if (this.idList.length) {
                var current = this.idList.pop();
                if (this.itemIds.indexOf(current) === -1) {
                    this.itemIds.push(current);
                }
                DatabaseService.getRecipeByItem(current).then((value:IRecipe) => {
                    var node:INode = {id:current};
                    
                    if (value) {
                        node.children = [];
                        value.ingredients.forEach((ingredient:IIngredient) => {
                            if (this.idList.indexOf(ingredient.item_id) === -1) {
                                this.idList.push(ingredient.item_id);
                            }
                            node.children.push(ingredient);
                        })
                    }
                    this.nodes["node_" + current.toString(10)] = node;
                    this.nextItem().then((next)=> {
                        resolve(true);
                    },
                    (err) => {
                        reject(err);
                    })
                })
            }
            else {
                resolve(true);
            }
        });
        return itemPromise;
    }

    private nextItemDetails():Promise.IThenable<any> {
        var detailsPromise = new Promise<any>((resolve, reject) => {
            if (this.itemIds.length) {
                var current = this.itemIds.pop();
                DatabaseService.getSingleItem(current).then((item:IItem) => {
                    this.items["item_" + item.id] = item;
                    this.nextItemDetails().then((val) => {
                        resolve(true);
                    },
                    (error) => {
                        reject(error);
                    })
                })
            }
            else {
                resolve(true);
            }
        });
        return detailsPromise;
    }
}