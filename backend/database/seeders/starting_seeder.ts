import Amator from '#models/amator'
import Category, { CategoryType } from '#models/category'
import Cook from '#models/cook'
import Favourite from '#models/favourite'
import FoodPackage from '#models/food_package'
import FoodProducer from '#models/food_producer'
import Ingredient from '#models/ingredient'
import Notification from '#models/notification'
import NutritionalProfile from '#models/nutritional_profile'
import Product from '#models/product'
import Recipe from '#models/recipe'
import Restaurant from '#models/restaurant'
import Review from '#models/review'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const users = await User.createMany([
      {
        username: 'Dodi',
        email: 'elo@zelo123.com',
        password: 'Jasnysmokens!',
      },

      {
        username: 'OctopusMarcopus',
        email: 'octo@gmail.com',
        password: 'Aramek123',
      },

      {
        username: 'JasnySmokens',
        email: 'smokens@kozak.com',
        password: 'D00di!',
      },

      {
        username: 'AsiaGotuje',
        email: 'asia@kasia,com',
        password: 'password',
      },

      {
        username: 'Paei3000',
        email: 'adi@email.com',
        password: 'KochamGotowac',
      },

      {
        username: 'Solvro',
        email: 'solvro@kozaki.com',
        password: 'solvroznowugotuje',
      },

      {
        username: 'RopuchaOfficial',
        email: 'ropucha@maduzegobrzucha.pl',
        password: 'jakaparuwawariacie',
      },

      {
        username: 'KucharzMichelle',
        email: 'micheal@morron.pl',
        password: 'michelle123',
      },
    ])

    const amators = await Amator.createMany([
      {
        firstName: 'Marcin',
        lastName: 'Dodi',
        points: 2100,
        userId: users[0].id,
      },

      {
        firstName: 'Apolonia',
        lastName: 'Octopus',
        points: 3700,
        userId: users[1].id,
      },

      {
        firstName: 'Oliwier',
        lastName: 'Jasny',
        points: 0,
        userId: users[2].id,
      },

      {
        firstName: 'Asia',
        lastName: 'Gotuje',
        points: 100,
        userId: users[3].id,
      },

      {
        firstName: 'Piotr',
        lastName: 'Ogiński',
        points: 500,
        userId: users[4].id,
      },
    ])

    const restaurants = await Restaurant.createMany([
      {
        name: 'Restauracja Solvro',
        city: 'Wroclaw',
        street: 'plac Grunwaldzki',
        streetNumber: 42,
        userId: users[5].id,
      },
    ])

    const producers = await FoodProducer.createMany([
      {
        name: 'Ropucha Shop',
        userId: users[6].id,
      },
    ])

    const products = await Product.createMany([
      {
        name: 'Makaron Lubella',
        imageUrl: 'https://albo24.pl/wp-content/uploads/3e83429817f95b8cb996910b193e9b51.jpg',
        producerId: producers[0].id,
        isActive: true,
      },

      {
        name: 'Pesto',
        producerId: producers[0].id,
        isActive: true,
        imageUrl: 'https://gorzkoislodko.pl/uploads/products/pesto%20zielone%201.jpg',
      },

      {
        name: 'Kurczak',
        producerId: producers[0].id,
        isActive: true,
        imageUrl: 'https://sokolow.pl/sites/default/files/images_product/piers_drobiowa_1.png',
      },
    ])

    const categories = await Category.createMany([
      {
        name: 'Makarony',
        type: CategoryType.TYPE_OF_MEAL,
      },

      {
        name: 'Obiady',
        type: CategoryType.TYPE_OF_MEAL,
      },

      {
        name: 'Śniadania',
        type: CategoryType.TYPE_OF_MEAL,
      },

      {
        name: 'Desery',
        type: CategoryType.TYPE_OF_MEAL,
      },

      {
        name: 'Halal',
        type: CategoryType.TYPE_OF_DIET,
      },

      {
        name: 'Wegetariańskie',
        type: CategoryType.TYPE_OF_DIET,
      },

      {
        name: 'Bez laktozy',
        type: CategoryType.TYPE_OF_DIET,
      },

      {
        name: 'Bezglutenowe',
        type: CategoryType.TYPE_OF_DIET,
      },

      {
        name: 'Bez orzechów',
        type: CategoryType.TYPE_OF_DIET,
      },

      {
        name: 'Bez cukru',
        type: CategoryType.TYPE_OF_DIET,
      },
    ])
    //copilot poad połowe  ugotował
    const recipes = await Recipe.createMany([
      {
        name: 'Makaron z pesto',
        description: 'Szybkie studenckie danie',
        preparationTime: 20,
        difficultyLevel: 1,
        isProfessional: false,
        imageUrl: null,
        userId: users[3].id,
        isActive: true,
      },

      {
        name: 'Brownie',
        description: 'Pyszny deser czekoladowy',
        preparationTime: 60,
        difficultyLevel: 1,
        isProfessional: false,
        imageUrl:
          'https://mojewypieki.com/wp-content/uploads/2022/10/Brownie_najlepszy_przepis_1.jpg',
        userId: users[4].id,
        isActive: true,
      },

      {
        name: 'Jajecznica z pomidorami',
        description: 'Szybkie śniadanie',
        preparationTime: 10,
        difficultyLevel: 1,
        isProfessional: false,
        imageUrl: null,
        userId: users[1].id,
        isActive: true,
      },

      {
        name: 'Kotlet schabowy',
        description: 'Tradycyjne polskie danie',
        preparationTime: 60,
        difficultyLevel: 2,
        isProfessional: false,
        imageUrl: null,
        userId: users[3].id,
        isActive: true,
      },

      {
        name: 'Kurczak curry',
        description: 'Klasyczne danie kuchni indyjskiej',
        preparationTime: 60,
        difficultyLevel: 3,
        isProfessional: false,
        imageUrl: null,
        userId: users[0].id,
        isActive: true,
      },

      {
        name: 'Tarta z malinami',
        description: 'Pyszny deser z malinami',
        preparationTime: 60,
        difficultyLevel: 2,
        isProfessional: false,
        imageUrl: null,
        userId: users[4].id,
        isActive: true,
      },

      {
        name: 'Łosoś z sosem bois boudran',
        description: 'Francuskie danie z łososiem',
        preparationTime: 120,
        difficultyLevel: 4,
        isProfessional: true,
        imageUrl: null,
        userId: users[5].id,
        isActive: true,
      },
    ])

    await recipes[0].related('tags').attach([categories[0].id, categories[4].id, categories[5].id]) // Makaron z pesto
    await recipes[1].related('tags').attach([categories[3].id, categories[4].id, categories[5].id]) // Brownie
    await recipes[2]
      .related('tags')
      .attach([categories[2].id, categories[4].id, categories[9].id, categories[5].id]) // Jajecznica
    await recipes[3].related('tags').attach([categories[1].id, categories[9].id]) // Kotlet schabowy
    await recipes[4].related('tags').attach([categories[1].id, categories[4].id]) // Kurczak curry
    await recipes[5].related('tags').attach([categories[3].id, categories[4].id, categories[5].id]) // Tarta z malinami
    await recipes[6].related('tags').attach([categories[1].id, categories[4].id]) // Łosoś z sosem bois boudran

    await Ingredient.createMany([
      {
        name: 'Makaron',
        calorificValue: 300,
        recipeId: recipes[0].id,
        productId: products[0].id,
      },

      {
        name: 'Pesto',
        calorificValue: 400,
        recipeId: recipes[0].id,
        productId: products[1].id,
      },

      {
        name: 'Jajka',
        calorificValue: 150,
        recipeId: recipes[1].id,
      },

      {
        name: 'Czekolada',
        calorificValue: 500,
        recipeId: recipes[1].id,
      },

      {
        name: 'Mąka',
        calorificValue: 50,
        recipeId: recipes[1].id,
      },

      {
        name: 'Masło',
        calorificValue: 500,
        recipeId: recipes[1].id,
      },

      {
        name: 'Jajka',
        calorificValue: 150,
        recipeId: recipes[2].id,
      },

      {
        name: 'Pomidor',
        calorificValue: 50,
        recipeId: recipes[2].id,
      },

      {
        name: 'Schab',
        calorificValue: 300,
        recipeId: recipes[3].id,
      },

      {
        name: 'Kurczak',
        calorificValue: 250,
        recipeId: recipes[4].id,
        productId: products[2].id,
      },

      {
        name: 'Curry',
        calorificValue: 50,
        recipeId: recipes[4].id,
      },

      {
        name: 'Mąka',
        calorificValue: 100,
        recipeId: recipes[5].id,
      },

      {
        name: 'Masło',
        calorificValue: 200,
        recipeId: recipes[5].id,
      },

      {
        name: 'Maliny',
        calorificValue: 50,
        recipeId: recipes[5].id,
      },

      {
        name: 'Łosoś',
        calorificValue: 300,
        recipeId: recipes[6].id,
      },

      {
        name: 'Sos bois boudran',
        calorificValue: 200,
        recipeId: recipes[6].id,
      },
    ])

    await Review.createMany([
      {
        grade: 5,
        review: 'Bardzo dobre',
        amatorId: amators[1].id,
        recipeId: recipes[0].id,
      },

      {
        grade: 4,
        review: 'Dobre',
        amatorId: amators[2].id,
        recipeId: recipes[1].id,
      },

      {
        grade: 3,
        review: 'Nie polecam - robię lepszą z własnego przepisu',
        amatorId: amators[0].id,
        recipeId: recipes[2].id,
      },
    ])

    await Favourite.createMany([
      {
        amatorId: amators[0].id,
        recipeId: recipes[0].id,
      },

      {
        amatorId: amators[3].id,
        recipeId: recipes[2].id,
      },
    ])

    await Cook.createMany([
      {
        firstName: 'Michelle',
        lastName: 'Moran',
        userId: users[7].id,
        restaurantId: restaurants[0].id,
      },
    ])

    const packages = await FoodPackage.createMany([
      {
        name: 'Makaron z pesto paczka',
        producerId: producers[0].id,
      },
    ])

    packages[0].related('products').attach([products[0].id, products[1].id])

    await NutritionalProfile.createMany([
      {
        amatorId: amators[0].id,
        categoryId: categories[4].id,
      },

      {
        amatorId: amators[0].id,
        categoryId: categories[5].id,
      },

      {
        amatorId: amators[1].id,
        categoryId: categories[5].id,
      },

      {
        amatorId: amators[1].id,
        categoryId: categories[7].id,
      },

      {
        amatorId: amators[2].id,
        categoryId: categories[6].id,
      },

      {
        amatorId: amators[2].id,
        categoryId: categories[4].id,
      },

      {
        amatorId: amators[2].id,
        categoryId: categories[9].id,
      },
    ])
    await Notification.createMany([
      {
        content: 'Nowe danie w restauracji Solvro',
        userId: users[5].id,
      },

      {
        content: 'Nowy produkt',
        userId: users[6].id,
      },
    ])
  }
}
