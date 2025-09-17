import { useEffect } from 'react';
import { useRouter } from 'next/router';

function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        document.title = "Dashboard";
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
        }
    }, []);

    return (
        <div>
            <h1></h1>
            <p></p>
        </div>
    );
}

export default DashboardPage;