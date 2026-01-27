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
  const [selectedFriend, setSelectedFriend] = useState<any | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);

  // Restore session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
         // Ensure we have the minimal required fields
         if(parsedUser.username && parsedUser.email) {
            setCurrentUser({ ...parsedUser, joinedDate: new Date() });
         }
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('user');
      }
    }
  }, []);

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

  // Fetch Rooms (Conversations)
  const fetchRooms = async () => {
     if(!currentUser) return;
     try {
       const token = localStorage.getItem('token');
       const res = await fetch('http://localhost:3000/api/messages/conversations', {
           headers: { Authorization: `Bearer ${token}` }
       });
       const data = await res.json();
       if(data.success) {
           setRooms(data.data);
       }
     } catch(e) { console.error(e); }
  };

  useEffect(() => {
     if(currentUser) fetchRooms();
  }, [currentUser, activeView]); 

  const handleLogin = (username: string, email: string) => {
    setCurrentUser({ username, email, joinedDate: new Date() });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
      
      <Sidebar
        currentUser={currentUser}
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={handleLogout}
        rooms={rooms}
        onRoomSelect={(roomId) => {
            const room = rooms.find(r => r.id === roomId);
            if(room) {
                // Ensure ID is passed as number if needed, but ChatArea uses it as is (or casts it)
                setSelectedFriend({ ...room, id: parseInt(room.id) }); 
                setActiveView('rooms'); 
            }
        }}
        selectedRoom={selectedFriend?.id?.toString()}
      />

      {activeView === "friends" && (
        <FriendsView 
             onChatSelect={(friend) => {
                 setSelectedFriend(friend);
                 setActiveView('rooms'); 
             }}
        />
      )}
      
      {activeView === "rooms" && (
        <ChatArea 
           currentUserId={JSON.parse(localStorage.getItem('user') || '{}').id} 
           selectedFriend={selectedFriend} 
           onMessageSent={fetchRooms}
           isConnected={isConnected}
        />
      )}
      
      {activeView === "profile" && (
        <ProfileView 
          user={currentUser} 
          onUpdateProfile={handleUpdateProfile} 
        />
      )}
    </div>
  )
}

export default App
