import LoginForm from '../components/LoginForm';
import { useEffect } from 'react';

function LoginPage() {
    useEffect(() => {
        document.title = "Login";
    }, []);

    return (
        <div>
            <h1>Login</h1>
            <LoginForm />
        </div>
    );
}

export default LoginPage;