import Head from "next/head";
import { useSession } from "next-auth/react";
import Layout from "../../components/Layout";
// import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { QuestionMark } from "../../components/Icons";
import { Grid, Popover, Card, Text } from "@nextui-org/react";
import FoodCategoryInfo from "../../components/FoodCategoryInfo";
import { useState, useEffect } from "react";
import FoodDisplayCard from "../../components/FoodDisplayCard";

const AddMealData = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [chosenItems, setChosenItems] = useState([]);
  const [itemsQuantity, setItemsQuantity] = useState({});
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleDataInput = async (e) => {
    e.preventDefault();

    const data = {
      email: session.user.email,
      date: e.target.date.value,
      mealType: e.target.mealType.value,
    };

    console.log("data from submit form ~~ ", data);

    //   await axios.post("/api/wellnessData", data);
    //   router.push("/profile");
  };

  const handleSearchIngredients = async (e) => {
    e.preventDefault();

    const categoryLabel = [];
    const catData = e.target.category.selectedOptions;
    for (let i = 0; i < catData.length; i++) {
      categoryLabel.push(catData[i].value);
    }
    const healthLabel = [];
    const healthData = e.target.healthLabel.selectedOptions;
    for (let i = 0; i < healthData.length; i++) {
      healthLabel.push(healthData[i].value);
    }

    const data = {
      amount: e.target.amount.value,
      measurement: e.target.measurement.value,
      ingredients: e.target.ingredients.value,
      healthLabel: healthLabel,
      category: categoryLabel,
      brand: e.target.brand.value,
    };

    await axios
      .get(
        `https://api.edamam.com/api/food-database/v2/parser?app_id=c68c9a1d&app_key=4ce474a24202f7f68e0308435ed057c4
        &ingr=${data.amount} serving ${data.ingredients}
        ${data.brand ? "&brand=" + data.brand : ""}
        ${data.category.length ? "&category=" + data.category : ""}`
        // ${data.healthLabel.length ? "&health=" + data.healthLabel : ""}
      )
      .then((result) => {
        setFoodItems([...result.data.parsed, ...result.data.hints]);
      });
  };

  useEffect(() => {
    console.log("food items ~~ ", itemsQuantity);
  }, [itemsQuantity]);

  const removeItem = (item) => {
    const pickedFoodItems = chosenItems.filter(
      (singleItem) => singleItem.food.foodId !== item.food.foodId
    );
    setChosenItems(pickedFoodItems);

    const quantity = { ...itemsQuantity };
    for (let key in quantity) {
      if (item.food.foodId === key) delete quantity[item.food.foodId];
    }
    setItemsQuantity(quantity);
  };

  if (status === "loading") {
    return <Layout>...Loading</Layout>;
  }

  if (status === "unauthenticated") router.push("/");

  return (
    <>
      <Head>
        <title>Health Tracker - Meals</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout className="flex flex-col items-center">
        <div>
          <h4>You must complete the following in order to record your meal:</h4>
          <li>Select Date</li>
          <li>Choose a meal type</li>
          <li>Search and add foods that you&apos;ve eaten</li>
          Click &quot;ADD MEAL&quot; to input your data.
        </div>
        <form onSubmit={(e) => handleDataInput(e)} className="flex flex-col">
          <div className="py-8">
            <labe htmlFor="selectDate">Select Date: </labe>
            <input
              type="date"
              name="date"
              max={new Date().toISOString().slice(0, 10)}
              required
            />
          </div>
          {/* Meal Type */}
          <div className="py-8">
            <label htmlFor="mealType">Meal Type:</label>
            <select name="mealType" required>
              <option hidden></option>
              <option value="Breakfast">Breakfast</option>
              <option value="Brunch">Brunch</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
              <option value="TeaTime">TeaTime</option>
              <option value="Other">Other</option>
            </select>
            <label htmlFor="warning" className="italic ml-2">
              <b>*Warning:</b> choosing the same Meal Type for the same date
              will override your previous data.
            </label>
          </div>
          {/* My chosen food items */}
          {chosenItems.length ? (
            <>
              <h3 className="self-center underline">
                Click on the card to remove from your list.
              </h3>
              <Grid.Container
                gap={2}
                justify="flex-start"
                name="chosenFoodItems"
              >
                {chosenItems.map((item) => (
                  <Grid key={item.foodId}>
                    <FoodDisplayCard
                      item={item}
                      clicked={() => removeItem(item)}
                    />
                    <Card
                      css={{
                        flexDirection: "row",
                        marginTop: 8,
                        paddingLeft: 6,
                        justifyContent: "center",
                      }}
                    >
                      Estimated Servings:
                      <input
                        type="number"
                        name={`${item.food.foodId}`}
                        className="ml-4 text-center border border-black rounded"
                        min="1"
                        max="20"
                        value={itemsQuantity[item.food.foodId]}
                        onChange={(e) =>
                          setItemsQuantity((prev) => {
                            const result = { ...prev };
                            result[item.food.foodId] = Number(e.target.value);
                            return result;
                          })
                        }
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid.Container>
            </>
          ) : null}
          <input
            className="text-2xl border-2 p-2 my-4 rounded hover:bg-green-400 hover:border-black"
            type="submit"
            value="ADD MEAL"
          />
        </form>

        {/* Search Food */}
        <form onSubmit={(e) => handleSearchIngredients(e)}>
          <div className="flex flex-col max-w-7xl border-2 rounded p-4 mt-12">
            <div className="flex justify-start">
              <div className="mr-4">
                <label htmlFor="amount">Amount:</label>
                <input
                  className="text-end ml-2"
                  type="number"
                  name="amount"
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>

              <div className="px-12">
                <label htmlFor="measurement">Measurement:</label>
                <select name="measurement" className="mx-2 text-center">
                  <option value=""></option>
                  <option value="Serving">Serving</option>
                  <option value="Ounce">Ounce</option>
                  <option value="Gram">Gram</option>
                  <option value="Pound">Pound</option>
                  <option value="Kilogram">Kilogram</option>
                  <option value="Pinch">Pinch</option>
                  <option value="Liter">Liter</option>
                  <option value="Fluid ounce">Fluid ounce</option>
                  <option value="Gallon">Gallon</option>
                  <option value="Pint">Pint</option>
                  <option value="Quart">Quart</option>
                  <option value="Milliliter">Milliliter</option>
                  <option value="Drop">Drop</option>
                  <option value="Cup">Cup</option>
                  <option value="Tablespoon">Tablespoon</option>
                  <option value="Teaspoon">Teaspoon</option>
                </select>
              </div>

              <div>
                <label htmlFor="ingredients">Food/Ingredients:</label>
                <input
                  className="text-center mx-2"
                  type="text"
                  name="ingredients"
                  placeholder="spaghetti"
                  required
                />
              </div>
            </div>

            <div className="pt-4 font-bold">
              *ALL Sections below are OPTIONAL
            </div>
            <div className="flex items-start pb-12">
              {/* currently not working */}
              <div className="flex mr-2">
                <label htmlFor="healthLabel">Health Labels:</label>
                <select name="healthLabel" multiple>
                  <option value="alcohol-free">alcohol-free</option>
                  <option value="celery-free">celery-free</option>
                  <option value="crustacean-free">crustacean-free</option>
                  <option value="dairy-free">dairy-free</option>
                  <option value="egg-free">egg-free</option>
                  <option value="fish-free">fish-free</option>
                  <option value="gluten-free">gluten-free</option>
                  <option value="immuno-supporive">immuno-supporive</option>
                  <option value="keto-friendly">keto-friendly</option>
                  <option value="kosher">kosher</option>
                  <option value="low-fat-abs">low-fat-abs</option>
                  <option value="low-potassium">low-potassium</option>
                  <option value="low-sugar">low-sugar</option>
                  <option value="no-oil-added">no-oil-added</option>
                  <option value="paleo">paleo</option>
                  <option value="peanut-free">peanut-free</option>
                  <option value="pork-free">pork-free</option>
                  <option value="red-meat-free">red-meat-free</option>
                  <option value="sesame-free">sesame-free</option>
                  <option value="shellfish-free">shellfish-free</option>
                  <option value="soy-free">soy-free</option>
                  <option value="tree-nut-free">tree-nut-free</option>
                  <option value="vegan">vegan</option>
                  <option value="vegetarian">vegetarian</option>
                  <option value="wheat-free">wheat-free</option>
                </select>
              </div>

              {/* Category */}
              <div className="flex mx-2">
                <label htmlFor="category" className="flex">
                  Category
                  <Popover>
                    <Popover.Trigger>
                      <Text>
                        <QuestionMark className="mx-2 text-red-600" />
                      </Text>
                    </Popover.Trigger>
                    <Popover.Content>
                      <FoodCategoryInfo />
                    </Popover.Content>
                  </Popover>
                  :
                </label>
                <select name="category" className="mx-2 text-center" multiple>
                  <option value="" hidden></option>
                  <option value="generic-foods">generic-foods</option>
                  <option value="generic-meals">generic-meals</option>
                  <option value="packaged-foods">packaged-foods</option>
                  <option value="fast-foods">fast-foods</option>
                </select>
              </div>

              {/* Brand */}
              <div className="flex">
                <label htmlFor="brand">Brand:</label>
                <input
                  className="text-center ml-2"
                  type="text"
                  name="brand"
                  placeholder="Cheerios"
                  size="13"
                />
              </div>
            </div>

            <input
              className="text-2xl border-2 rounded-xl mx-12 hover:bg-green-400 hover:border-black"
              type="submit"
              value="SEARCH"
            />
          </div>
        </form>

        {/* Display card for each food item */}
        {foodItems.length ? (
          <Grid.Container gap={2} justify="flex-start">
            <h4 className="py-4">
              <span className="text-red-600">DISCLAIMER:</span> Due to usage of
              the FREE API, there is a limited amount of nutrient data
              retrieved. Only nutrients that are currently available are
              calories, carbohydrate, fat, protein, and fiber.&nbsp;
              <b className="text-red-700 text-2xl underline">
                ITEMS DISPLAYED ARE FOR 1 SERVING.
              </b>
            </h4>
            {foodItems.map((foodItem) => (
              <Grid key={foodItem.foodId}>
                <FoodDisplayCard
                  item={foodItem}
                  clicked={() => {
                    setChosenItems([...chosenItems, foodItem]);
                    setItemsQuantity((prev) => {
                      const result = { ...prev };
                      result[foodItem.food.foodId] = foodItem.quantity || 1;
                      return result;
                    });
                  }}
                />
              </Grid>
            ))}
          </Grid.Container>
        ) : null}
      </Layout>
    </>
  );
};

export default AddMealData;
