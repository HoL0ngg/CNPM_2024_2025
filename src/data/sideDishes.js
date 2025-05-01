import cheese from "../assets/images/cheese.png";
import omelette from "../assets/images/omelette.png";
import chickentopping from "../assets/images/chickentopping.png";
export const toppings = [
  { id: "cheese", name: "Phô mai", price: 7000, image: cheese },
  { id: "omelette", name: "Trứng", price: 7000, image: omelette },
  { id: "chickentopping", name: "Gà", price: 10000, image: chickentopping },
];
export const dishToppingMap = {
  1: ["cheese", "omelette", "chickentopping"],
  2: [],
  3: ["cheese", "chicken"],
  4: [],
  5: [],
  6: ["cheese", "chicken"],
};
