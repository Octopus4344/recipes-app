import { test } from '@japa/runner'


const password = "StrongPassword123";

  test.group('Password encryption tests', () => {
    test('register user', async ({ client, assert }) => {
      

      const registerResponse = await client.post('user/register').json({
        firstName: "Stefan",
        lastName: "Praca",
        username: "Haselnik123",
        email: "hasla@gmail.com",
        password: password,
      });


      assert.notEqual(password, registerResponse.body()['user']['password'])


    });

    test('login user', async ({ client, assert }) => {

      const loginResponse = await client.post('user/login').json({
        email: 'hasla@gmail.com',
        password: password,
      });

      assert.notEqual(password, loginResponse.body()['password'])

    });

    test('register food producer', async ({ client, assert }) => {
      

      const registerResponse = await client.post('food_producer/register').json({
        name: 'Best Farms',
        username: 'bestfarms',
        email: 'info@bestfarms.com',
        password: password,
      });


      assert.notEqual(password, registerResponse.body()['user']['password'])


    });

    test('login food producer', async ({ client, assert }) => {

      const loginResponse = await client.post('user/login').json({
        email: 'info@bestfarms.com',
        password: password,
      });


      assert.notEqual(password, loginResponse.body()['password'])

    });

  })
