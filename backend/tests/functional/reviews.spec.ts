import { test } from '@japa/runner'


let token: string;

  test.group('Authentication', () => {
    test('register and login', async ({ client }) => {
      // Register
      await client.post('user/register').json({
        firstName: "Bartosz",
        lastName: "Jagiełło",
        username: "babjaga12",
        email: "babjaga12@gmail.com",
        password: "Dziady123",
      });

      const loginResponse = await client.post('user/login').json({
        email: 'babjaga12@gmail.com',
        password: 'Dziady123',
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

  test.group('Recipes', () => {
    test('fetch recipes with cookies', async ({ client }) => {
      const recipesResponse = await client.get('/recipes')
        .header('cookie', `token=${token}`);
        
      recipesResponse.assertStatus(200);
      //console.log(recipesResponse.body());
    });
  });
