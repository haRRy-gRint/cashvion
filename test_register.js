const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const API_URL = 'http://localhost:5000/api';

async function testRegister() {
    try {
        console.log('Testing Registration...');
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'cloud_tester',
                email: `test_${Date.now()}@cloud.com`,
                password: 'password123'
            })
        });

        const text = await res.text();
        console.log(`Status: ${res.status}`);
        console.log('Body:', text);

    } catch (err) {
        console.error('Test Failed:', err);
    }
}

testRegister();
