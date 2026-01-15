import { useState } from 'react'
import { AuthPage } from './components/authPage';
import './App.css'

interface User {
  username: string;
  email: string;
  bio?: string;
  status?: string;
  joinedDate: Date;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (username: string, email: string) => {
    setCurrentUser({ username, email, joinedDate: new Date() });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

    if (!currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <>
    </>
  )
}

export default App
