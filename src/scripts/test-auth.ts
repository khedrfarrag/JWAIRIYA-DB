const BASE_URL = 'http://localhost:5000/api/auth';

async function runAuthTest() {
  console.log('--- Starting Auth Flow Test ---');

  // 1. Register a new user
  const userData = {
    email: `testuser_${Date.now()}@example.com`,
    password: 'password123',
    name: 'Test User',
  };

  const regRes = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const regData = await regRes.json();
  console.log('Register User:', regRes.status === 201 ? 'PASSED' : 'FAILED', regData);

  // 2. Login as the new user
  const loginRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userData.email, password: userData.password }),
  });
  const loginData: any = await loginRes.json();
  const userToken = loginData.data?.accessToken;
  console.log('Login User:', loginRes.status === 200 ? 'PASSED' : 'FAILED');

  // 3. Access /me as user
  const meRes = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  console.log('Access /me as User:', meRes.status === 200 ? 'PASSED' : 'FAILED');

  // 4. Access /admin-only as user (should fail)
  const adminOnlyFailRes = await fetch(`${BASE_URL}/admin-only`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  console.log('Access /admin-only as User (Expected 403):', adminOnlyFailRes.status === 403 ? 'PASSED' : 'FAILED');

  // 5. Login as admin
  const adminLoginRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@jwairia.com', password: 'admin123' }),
  });
  const adminLoginData: any = await adminLoginRes.json();
  const adminToken = adminLoginData.data?.accessToken;
  console.log('Login Admin:', adminLoginRes.status === 200 ? 'PASSED' : 'FAILED');

  // 6. Access /admin-only as admin (should succeed)
  const adminOnlySuccessRes = await fetch(`${BASE_URL}/admin-only`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log('Access /admin-only as Admin:', adminOnlySuccessRes.status === 200 ? 'PASSED' : 'FAILED');

  console.log('--- Auth Flow Test Completed ---');
}

runAuthTest().catch(console.error);
