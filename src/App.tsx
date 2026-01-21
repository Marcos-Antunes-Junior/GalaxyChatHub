import { useState, useEffect } from 'react'
import { AuthPage } from './components/authPage';
import { Sidebar } from "./components/sideBar"
import './App.css'
import { ProfileView } from './components/ProfileView';
import { FriendsView } from './components/FriendsView';
import { ChatArea } from './components/ChatArea';
import { socket } from './socket';

interface User {
  username: string;
  email: string;
  bio?: string;
  status?: string;
  joinedDate: Date;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<'friends' | 'rooms' | 'profile'>('friends');
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log("Socket connected!");
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("Socket disconnected!");
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Connect only if we have a user (optional strategy)
    if (currentUser) {
       socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, [currentUser]);

  const handleLogin = (username: string, email: string) => {
    setCurrentUser({ username, email, joinedDate: new Date() });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    socket.disconnect();
  };

  const handleUpdateProfile = (updates: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="fixed top-2 right-2 z-50">
        <span className={`inline-block w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} title={isConnected ? "Connected" : "Disconnected"} />
      </div>
      
      <Sidebar
        currentUser={currentUser}
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={handleLogout}
        rooms={[]}
        onRoomSelect={(roomId) => console.log("Room selected:", roomId)}
        selectedRoom={null}
      />

      {activeView === "friends" && <FriendsView />}
      {activeView === "rooms" && <ChatArea />}
      {activeView === "profile" && (
        <ProfileView 
          user={currentUser} 
          onUpdateProfile={handleUpdateProfile}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}

export default App
