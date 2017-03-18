import {IIngredient} from "./IRecipe";
import {IItem} from "./IITem";

export interface INode {
    id: number;
    children?: Array<IIngredient>;
}

export interface IRecipeTree {
    root: number;
    nodes: {[key: string]: INode};
    items: {[key: string]: IItem};
}

