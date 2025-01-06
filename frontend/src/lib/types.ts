export interface User {
  id: string;
  username: string;
  email: string;
  role: "amator" | "restaurant" | "cook" | "foodProducer";
  amatorData?: Amateur;
  foodProducerData?: FoodProducer;
  restaurantData?: Restaurant;
}

interface Amateur {
  id: string;
  firstName: string;
  lastName: string;
  points: number;
}

interface FoodProducer {
  id: string;
  name: string;
}

interface Restaurant {
  id: string;
  name: string;
}

