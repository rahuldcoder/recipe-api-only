'use strict';


var path            = require('path');
var async           = require('async');

let server          = require(path.resolve(__dirname, '../server/server'));

var database        = server.datasources.recipeDS;


let getUsers        = require(path.resolve(__dirname, 'sample-users-data'));

let getRecipes      = require(path.resolve(__dirname, 'sample-recipes-data'));

// recipes for search
let getRecipes2     = require(path.resolve(__dirname, 'sample-recipes-search-data'));

let getMenus        = require(path.resolve(__dirname, 'sample-menus-data'));

let getIngredients  = require(path.resolve(__dirname, 'sample-ingredients2'));
// let getIngredients  = require(path.resolve(__dirname, 'sample-ingredients-data'));

let getGroceries    = require(path.resolve(__dirname, 'sample-grocery-data'));

let getDepartments  = require(path.resolve(__dirname, 'sample-departments-data'));

// let getUsers        = require(path.resolve(__dirname, 'sample-users-data'));
let getNutritions  = require(path.resolve(__dirname, 'nutritions'));

let Allergy  = require(path.resolve(__dirname, 'allergy'));
let Courses  = require(path.resolve(__dirname, 'courses'));

let getCuisine  = require(path.resolve(__dirname, 'cuisine'));
let getDiets    = require(path.resolve(__dirname, 'diet'));
let getHolidays = require(path.resolve(__dirname, 'holidays'));


//models
var User        = server.models.UserModel;
var Role        = server.models.Role;
var RoleMapping = server.models.RoleMapping;


var Recipe      = server.models.RecipeModel; 
var Ingredient  = server.models.IngredientModel;

var Menu        = server.models.MenuModel;
var Grocery     = server.models.GroceryModel;

var Department  = server.models.DepartmentModel;

// var Allergy =  server.models.AllergyModel;

// var Course  =  server.models.CourseModel;

var Cuisine =  server.models.CuisineModel;

var Diet    =  server.models.DietModel;

var Holiday =  server.models.HolidayModel;

var Nutritions = server.models.NutritionsModel;



	async.parallel({
		users       : async.apply(createUsers),
		recipes     : async.apply(createRecipes),
		
		ingredients : async.apply(createIngredients),
		menus       : async.apply(createMenus),
		groceries   : async.apply(createGroceries),
		departments : async.apply(createDepartments),

		allergies   : async.apply(createAllergies),
		courses     : async.apply(createCourses),
		cuisines    : async.apply(createCuisines),
		diets       : async.apply(createDiets),
		holidays    : async.apply(createHolidays),

		nutritions  : async.apply(createNutritions)

	}, function(err, results){
		if( err ) throw err;

	

		assignAdmin(results.users[2]);

		// attachVideosToUsers(results.users, results.videos, function(err){
		// 	console.log('>models create sucessfully');
		// });


		attachRecipeToUsers(results.users, results.recipes, function(err){
			console.log('>models create sucessfully');
		});


		attachMenusToUsers(results.users, results.menus, function(err){
			console.log('>models create sucessfully');
		});

		attachRecipesToMenu(results.recipes, results.menus, function(err){
			console.log('>recipes create sucessfully');
		});

		attachIngredientsToRecipes(results.ingredients, results.recipes, function(err){
			console.log('>ingredients create sucessfully');
		});


		attachDepartmentsToIngredients(results.departments, results.ingredients, function(err){
			console.log('>departments attached to ingredients ');
		});


		attachNutritionsToRecipes(results.nutritions, results.recipes, function(err){
			console.log('>nutritions attached to recipes');
		});

		//:todo remove this function, when departments will work 
		attachDepartmentsToGroceries(results.departments, results.groceries, function(err){
			console.log('>departments create sucessfully');
		});

		attachAllergiesToRecipes(results.allergies, results.recipes, function(err){
			console.log('>allergies create sucessfully');
		});


		attachCoursesToRecipes(results.courses, results.recipes, function(err){
			console.log('>courses create sucessfully');
		});


		attachCuisinesToRecipes(results.cuisines, results.recipes, function(err){
			console.log('>cuisines create sucessfully');
		});

		attachDietsToRecipes(results.diets, results.recipes, function(err){
			console.log('>diets create sucessfully');
		});


		attachHolidaysToRecipes(results.holidays, results.recipes, function(err){
			console.log('>models create sucessfully');
		});


		// attach data to recipes


	});








function createRecipes(cb){
	database.automigrate('RecipeModel', function(err){
		if (err) return cb(err);

		Recipe.create(getRecipes(), cb);
	});
};

function createIngredients(cb){
	database.automigrate('IngredientModel', function(err){
		if (err) return cb(err);

		Ingredient.create(getIngredients(), cb);
	});
};



function createGroceries(cb){
	database.autoupdate('GroceryModel', function(err){
		if (err) return cb(err);

		Grocery.create(getGroceries(), cb);
	
	});
};

function createDepartments(cb){
	database.autoupdate('DepartmentModel', function(err){
		if (err) return cb(err);

		Department.create(getDepartments(), cb);
	
	});
};

// function createAllergies(cb){
// 	database.autoupdate('AllergyModel', function(err){ 
// 		if (err) return cb(err);

// 		Allergy.create(getAllergy(), cb);
// 	});
// };

// function createCourses(cb){
// 	database.autoupdate('CourseModel', function(err){
// 		if (err) return cb(err);

// 		Course.create(getCourses(), cb);
// 	});
// };

// function createCuisines(cb){
// 	database.autoupdate('CuisineModel', function(err){
// 		if (err) return cb(err);

// 		Cuisine.create(getCuisine(), cb);
// 	});
// };

// function createDiets(cb){
// 	database.autoupdate('DietModel', function(err){
// 		if (err) return cb(err);

// 		Diet.create(getDiets(), cb);
// 	});
// };

// function createHolidays(cb){
// 	database.autoupdate('HolidayModel', function(err){
// 		if (err) return cb(err);

// 		Holiday.create(getHolidays(), cb);
// 	});
// };


// function createNutritions(cb){
// 	database.autoupdate('NutritionsModel', function(err){
// 		if (err) return cb(err);

// 		Nutritions.create(getNutritions(), cb);
// 	});
// };

//attaching recipes to admin user
//:todo not important function
function attachRecipeToUsers(users, recipes, cb){

	recipes.forEach(function(recipe){
		recipe.updateAttribute('userId', users[2].id);
		
	});

};



function attachIngredientsToRecipes(ingredients, recipes, cb){
	var arrayWithIds = idsOnly(ingredients);

	// only first 10 elements attach
	var first10  = arrayWithIds.slice(0, 10);
	var second10 = arrayWithIds.slice(11, 21);

	recipes.forEach(function(recipe, index){

		if (index % 2 === 0){
			recipe.updateAttribute('ingredients', first10);
		} else {
			recipe.updateAttribute('ingredients', second10);
		}

		// recipe.updateAttribute('ingredients', arrayWithIds);
		
	});
};


function attachDepartmentsToIngredients(departments, ingredients, cb){

	var first  = ingredients.splice(0, 15);
	var second = ingredients.splice(16, 31);
	var third  = ingredients.splice(32, 100); 

	var arrayWithIds = idsOnly(departments);

	console.log(arrayWithIds[0]);
	console.log(arrayWithIds[1]);
	console.log(arrayWithIds[2]);
	
	first.forEach(function(ingredient){
		ingredient.updateAttribute('departmentId', arrayWithIds[0]);
	});

	second.forEach(function(ingredient){
		ingredient.updateAttribute('departmentId', arrayWithIds[1]);
	});

	third.forEach(function(ingredient){
		ingredient.updateAttribute('departmentId', arrayWithIds[2]);
	});

};





function attachDepartmentsToGroceries(departments, groceries, cb){
	var arrayWithIds = idsOnly(departments);
	groceries.forEach(function(grocery){
		grocery.updateAttribute('departments', arrayWithIds);
		
	});
};



// function attachCoursesToRecipes(courses, recipes, cb){
// 	var arrayWithIds = idsOnly(courses);
// 	recipes.forEach(function(recipe){
// 		recipe.updateAttribute('courses', arrayWithIds);
		
// 	});
// };

function attachCuisinesToRecipes(cuisines, recipes, cb){
	var arrayWithIds = idsOnly(cuisines);
	recipes.forEach(function(recipe){
		recipe.updateAttribute('cuisines', arrayWithIds);
		
	});
};


function attachDietsToRecipes(diets, recipes, cb){
	var arrayWithIds = idsOnly(diets);
	recipes.forEach(function(recipe){
		recipe.updateAttribute('diets', arrayWithIds);
		
	});
};

function attachHolidaysToRecipes(holidays, recipes, cb){
	var arrayWithIds = idsOnly(holidays);
	recipes.forEach(function(recipe){
		recipe.updateAttribute('holidays', arrayWithIds);
		
	});
};

function idsOnly(array){

	var result = Object.keys(array).map(function(e) {
		return array[e].id;
    });

	return result;    

};
