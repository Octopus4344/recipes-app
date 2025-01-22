import { test } from '@japa/runner'


let token: string;

  test.group('Login and register tests', () => {
    test('proper register and login', async ({ client }) => {
      const registerResponse = await client.post('user/register').json({
        firstName: "Tester",
        lastName: "Tester",
        username: "tester123",
        email: "tester@gmail.com",
        password: "kochamtesty",
      });

      registerResponse.assertStatus(201);

      const loginResponse = await client.post('user/login').json({
        email: 'tester@gmail.com',
        password: 'kochamtesty',
      });

      const setCookieHeader = loginResponse.headers()['set-cookie'];
      const tokenCookie = setCookieHeader ? setCookieHeader[0] : '';
      const tokenMatch = tokenCookie.match(/token=([^;]+)/);
      token = tokenMatch ? tokenMatch[1] : '';
      
      if (!token) {
        throw new Error('Token not found in cookies');
      }

      loginResponse.assertStatus(200)

    });

    test('too short password register', async ({ client }) => {
      const badRegisterResponse = await client.post('user/register').json({
        firstName: "Tester2",
        lastName: "Tester2",
        username: "tester1234",
        email: "tester2@gmail.com",
        password: "ha",
      });

      badRegisterResponse.assertStatus(422);
    });

    test('bad request data register', async ({ client }) => {
      const badRegisterResponse = await client.post('user/register').json({
        firstNamse: "Tester3",
        usernsame: "tester1234",
        passwsord: "testytestytesty",
      });

      badRegisterResponse.assertStatus(422);
    });



    test('logout', async ({ client }) => {
      const logoutResponse = await client.delete('user/logout')
        .header('cookie', `token=${token}`);
        
      logoutResponse.assertStatus(200);
    });
  });


