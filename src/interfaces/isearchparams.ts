import {IItem} from "./IITem";

export interface IItemSearchParams {
    name?: string;
    type?: number;
    subType?: number;
    rarity?: number;
    min_level?:number;
    page?: number;
    limit?: number;
}

export interface IItemSearchResults {
    total: number;
    results: Array<IItem>;
}