import React, { useState } from 'react';
import { useRouter } from 'next/router';

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== repeatPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                setError('');
                router.push('/login'); // Redirect to login page
            } else {
                setError(data.message || 'Registration failed');
                setSuccess('');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            setSuccess('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{success}</span>
            </div>}

            <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <div className="mb-6">
                <label htmlFor="repeatPassword" className="block text-gray-700 text-sm font-bold mb-2">Repeat Password:</label>
                <input type="password" id="repeatPassword" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Register</button>
        </form>
    );
}

export default RegisterForm;