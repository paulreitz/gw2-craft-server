export interface IIngredient {
    item_id:number;
    count: number;
}

export interface IRecipe {
    id: number;
    type: string;
    output_item_id: number;
    output_item_count: number;
    min_rating: number;
    time_to_craft_ms: number;
    disciplines: Array<string>;
    flags: Array<string>;
    ingredients:Array<IIngredient>;
    chat_link: string;
}