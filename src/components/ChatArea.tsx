import { useEffect, useState, useRef } from "react";
import { socket } from "../socket";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { SendHorizontal, Trash2 } from "lucide-react";

export function ChatArea({ currentUserId, selectedFriend, onMessageSent, isConnected }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 1. Join Room on select
  useEffect(() => {
    if (!selectedFriend) return;

    const roomId = [currentUserId, selectedFriend.id].sort().join('_');
    // Join the 'room' for these two users
    socket.emit("join_dm", { currentUserId, targetUserId: selectedFriend.id });

    // Fetch existing history via HTTP API
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/messages/${selectedFriend.id}`, {
           headers: {
             'Authorization': `Bearer ${token}`
           }
        });
        const data = await response.json();
        if (data.success) {
           setMessages(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch history", err);
      }
    };
    
    fetchHistory();
    
    // Cleanup listeners to avoid duplicates
    return () => {
      socket.off("receive_dm");
    };
  }, [selectedFriend?.id, currentUserId]);

  // 2. Listen for incoming messages
  useEffect(() => {
    const handler = (message: any) => {
        // Strict check
        const isRelated = 
            (message.senderId === currentUserId && message.receiverId === selectedFriend?.id) ||
            (message.senderId === selectedFriend?.id && message.receiverId === currentUserId);

        if (isRelated) {
             setMessages((prev) => {
                 // Prevent duplicates
                 if(prev.some(m => m.id === message.id)) return prev;
                 return [...prev, message];
             });
        }
    };
    
    socket.on("receive_dm", handler);
    return () => { 
        socket.off("receive_dm", handler);
    };
  }, [selectedFriend, currentUserId]);

  // 3. Send Message
  const handleSend = () => {
    if (!inputText.trim() || !selectedFriend) return;

    // Emit to server
    socket.emit("send_dm", {
      senderId: currentUserId,
      receiverId: selectedFriend.id,
      content: inputText
    });
    
    if(onMessageSent) onMessageSent();

    setInputText("");
  };

  const handleDeleteConversation = async () => {
    if(!selectedFriend) return;
    if(!confirm(`Are you sure you want to delete the conversation with ${selectedFriend.username}? This cannot be undone.`)) return;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/messages/${selectedFriend.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = await res.json();
        if(data.success) {
            setMessages([]); // Clear local UI
            if(onMessageSent) onMessageSent(); // Triggers refresh of Sidebar list
            alert("Conversation deleted.");
        } else {
            alert("Failed to delete.");
        }
    } catch(e) {
        console.error(e);
        alert("Error occurred.");
    }
  };

  if(!selectedFriend) {
      return (
        <div className="flex-1 flex items-center justify-center text-muted-foreground bg-[#313338]">
             <div className="text-center">
                <p>Select a friend to start chatting</p>
            </div>
        </div>
      );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#313338] text-gray-100">
       <div className="h-14 border-b border-[#26272D] flex items-center px-4 shadow-sm bg-[#313338] justify-between">
        <div className="flex items-center gap-3">
             <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-purple-600 text-white text-xs">
                    {selectedFriend.username?.[0]?.toUpperCase()}
                </AvatarFallback>
             </Avatar>
            <div>
                <div className="font-bold text-sm text-gray-100 flex items-center gap-2">
                    {selectedFriend.username}
                    <span 
                      className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
                      title={isConnected ? "Connected" : "Disconnected"} 
                    />
                </div>
            </div>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500 hover:bg-transparent" onClick={handleDeleteConversation} title="Delete Conversation">
            <Trash2 className="w-5 h-5" />
        </Button>
      </div>

       <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
         {messages.map((msg, idx) => {
            const isMe = msg.senderId === currentUserId;
            return (
           <div key={msg.id || idx} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
             <Avatar className="w-8 h-8 mt-1">
                <AvatarFallback className={`${isMe ? 'bg-blue-600' : 'bg-purple-600'} text-white text-[10px]`}>
                    {(msg.sender?.username || (isMe ? "Me" : selectedFriend.username)).substring(0,2).toUpperCase()}
                </AvatarFallback>
             </Avatar>
             
             <div className={`max-w-[70%] rounded-lg p-3 text-sm ${
                 isMe 
                 ? "bg-blue-600 text-white rounded-br-none" 
                 : "bg-[#2B2D31] text-gray-100 rounded-bl-none"
             }`}>
                {msg.content}
             </div>
           </div>
         )})}
       </div>

       <div className="p-4 bg-[#313338]">
         <div className="bg-[#383A40] rounded-lg flex items-center px-4 py-2 gap-2">
             <input 
               className="bg-transparent flex-1 outline-none text-gray-200 placeholder-gray-400 text-sm"
               placeholder={`Message @${selectedFriend.username}`}
               value={inputText} 
               onChange={(e) => setInputText(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
             />
             <Button variant="ghost" size="icon" onClick={handleSend} className="text-gray-400 hover:text-white hover:bg-transparent">
                 <SendHorizontal className="w-5 h-5" />
             </Button>
         </div>
       </div>
    </div>
  );
}