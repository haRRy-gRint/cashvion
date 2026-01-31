import App from '../App';
import { useEffect, useState } from 'react';

export default function Home() {
    // Ensure client-side rendering for the main app to avoid hydration mismatch with local storage
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return <App />;
}
