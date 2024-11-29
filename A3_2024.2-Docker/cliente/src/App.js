import React, { useState } from 'react';
import Login from './components/Login';
import Home from './components/Home';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <div>
            {isAuthenticated ? (
                <Home />
            ) : (
                <Login onLogin = {() => setIsAuthenticated(true)} />
            )}
        </div>
    );
}

export default App;
