const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const API_URL = 'http://localhost:5000/api';

async function createDemoUser() {
    try {
        console.log('Creating Demo User...');
        const email = 'demo@expense-lens.com';
        const password = 'password123';

        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'Demo User',
                email: email,
                password: password
            })
        });

        const text = await res.text();
        if (res.status === 201 || text.includes('already exists')) {
            console.log('SUCCESS: Demo user ready.');
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
        } else {
            console.log('FAILED:', text);
        }

    } catch (err) {
        console.error('Script Failed:', err);
    }
}

createDemoUser();
