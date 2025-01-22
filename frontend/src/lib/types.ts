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

export interface Recipe {
  id: 1,
  name: string;
  description: string;
  preparationTime: number,
  difficultyLevel: number,
  isProfessional: boolean,
  imageUrl: string | null,
  userId: number,
  isActive?: boolean,
  createdAt?: string,
  updatedAt?: string,
  isFavourite?: boolean,
  averageRating?: number
}