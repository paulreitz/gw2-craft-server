import {RecipeBuilder} from "./core/recipebuilder";

var rp = new RecipeBuilder();

rp.buildRecipeTree(77193).then((tree) => {
    console.log(tree);
},
(error) => {
    console.log(error);
})