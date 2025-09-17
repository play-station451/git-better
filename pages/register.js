import RegisterForm from '../components/RegisterForm';
import { useEffect } from 'react';

function RegisterPage() {
    useEffect(() => {
        document.title = "Register";
    }, []);
    
    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-1/2 flex items-center justify-center">
                <div>
                    <h1 className="text-3xl font-bold mb-4">Register</h1>
                    <RegisterForm />
                </div>
            </div>
            <div className="w-1/2 bg-cover" style={{ backgroundImage: 'url(https://source.unsplash.com/random)' }}></div>
        </div>
    );
}

export default RegisterPage;