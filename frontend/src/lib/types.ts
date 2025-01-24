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
  imageUrl: string,
  userId: number,
  isActive?: boolean,
  createdAt?: string,
  updatedAt?: string,
  isFavourite?: boolean,
  averageRating?: number,
  tags?: Category[],
  ingredients?: Ingredient[]
  reviews?: Review[]
}

export interface Category {
  id: string;
  type: string;
  name: string;
  isAdded?: boolean;
}

export interface Ingredient {
  name: string
  id: number,
  calorificValue: number,
}

export interface Review {
  id?: string;
  grade: number;
  amatorId?: string;
  review?: string;
  recipeId?: string;
}

export interface Product {
  id?: string;
  name: string;
  imageUrl: string;
  producerId: number;
  producer?: FoodProducer;
  isActive: boolean;
  ingredients?: Ingredient[];
}
