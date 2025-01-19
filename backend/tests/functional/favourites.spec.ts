import { test } from '@japa/runner'
import { assert } from 'console';


let token: string;

  test.group('Authentication', () => {
    test('register and login', async ({ client }) => {
      // Register
      await client.post('user/register').json({
        firstName: "Marian",
        lastName: "Favourite",
        username: "favouritetest",
        email: "favouritetest@gmail.com",
        password: "Ulubione123",
      });

      const loginResponse = await client.post('user/login').json({
        email: 'favouritetest@gmail.com',
        password: 'Ulubione123',
      });

      const setCookieHeader = loginResponse.headers()['set-cookie'];
      const tokenCookie = setCookieHeader ? setCookieHeader[0] : '';
      const tokenMatch = tokenCookie.match(/token=([^;]+)/);
      token = tokenMatch ? tokenMatch[1] : '';
      
      if (!token) {
        throw new Error('Token not found in cookies');
      }
    });
  });

  test.group('Favourites', () => {
    test('add to favourites', async ({ client }) => {
      const addFavouriteResponse = await client.post('user/favourite?recipeId=1')
        .header('cookie', `token=${token}`);
        
        addFavouriteResponse.assertStatus(200);
    });


    test('add to favourites doubled', async ({ client, assert }) => {
      const myFavouritesResponseBefore = await client.get('user/favourite')
      .header('cookie', `token=${token}`);

      await client.post('user/favourite?recipeId=2')
        .header('cookie', `token=${token}`);

        await client.post('user/favourite?recipeId=2')
        .header('cookie', `token=${token}`);
      
      const myFavouritesResponseAfter = await client.get('user/favourite')
      .header('cookie', `token=${token}`);

      assert.equal(myFavouritesResponseAfter.body().length - myFavouritesResponseBefore.body().length, 1);
      
    });

    test('remove recipe', async ({ client, assert }) => {
      await client.post('user/favourite?recipeId=3')
        .header('cookie', `token=${token}`);
      
      const myFavouritesResponse = await client.get('user/favourite')
      .header('cookie', `token=${token}`);

      await client.delete('user/favourite?recipeId=3')
      .header('cookie', `token=${token}`);

      const myFavouritesResponseAfterDelete = await client.get('user/favourite')
      .header('cookie', `token=${token}`);

      assert.equal((myFavouritesResponse.body().length - myFavouritesResponseAfterDelete.body().length), 1);
    });


    test('remove nonexistent', async ({ client, assert }) => {
     const deleteResponse = await client.delete('user/favourite?recipeId=5')
      .header('cookie', `token=${token}`);
      
      console.log(deleteResponse.headers())
      deleteResponse.assertStatus(200)
      
    });
  });
