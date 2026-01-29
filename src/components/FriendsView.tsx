import { useEffect, useMemo, useState } from 'react';

interface Friend {
  id: number;
  username: string;
  avatarUrl?: string;
  status: 'Online' | 'Offline';
}

interface FriendRequest {
  id: number;
  sender: {
    id: number;
    username: string;
  };
}

interface FriendsViewProps {
  onChatSelect?: (friend: Friend) => void;
}

export function FriendsView({ onChatSelect }: FriendsViewProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'add'>('all');
  const [newFriendName, setNewFriendName] = useState('');

  const token = localStorage.getItem('token');

  /* ---------------------- DATA LOADING ---------------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [friendsRes, requestsRes] = await Promise.all([
          fetch('http://localhost:3000/api/friends', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:3000/api/friends/requests', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const friendsData = await friendsRes.json();
        const requestsData = await requestsRes.json();

        if (friendsData.success) {
          setFriends(friendsData.data);
        }

        if (requestsData.success) {
          setRequests(requestsData.data.incoming ?? requestsData.data);
        }
      } catch (err) {
        console.error('Failed to load friends data', err);
      }
    };

    loadData();
  }, [token]);

  /* ---------------------- ACTIONS ---------------------- */
  const addFriend = async () => {
    if (!newFriendName.trim()) return;

    await fetch('http://localhost:3000/api/friends/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username: newFriendName }),
    });

    setNewFriendName('');
    alert('Friend request sent!');
  };

  const acceptRequest = async (requestId: number) => {
    await fetch('http://localhost:3000/api/friends/accept', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ requestId }),
    });

    setRequests(prev => prev.filter(r => r.id !== requestId));
  };

  /* ---------------------- FILTERING ---------------------- */
  const displayedFriends = useMemo(() => {
    return friends.filter(friend => {
      const matchesSearch = friend.username
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'online' && friend.status === 'Online');

      return matchesSearch && matchesTab;
    });
  }, [friends, search, activeTab]);

  const onlineFriends = displayedFriends.filter(f => f.status === 'Online');
  const offlineFriends = displayedFriends.filter(f => f.status === 'Offline');

  /* ---------------------- UI ---------------------- */
  return (
    <div className="flex-1 p-6 text-white overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Friends</h2>

      {/* Search */}
      <input
        className="w-full mb-4 p-2 rounded bg-gray-800 border border-gray-700"
        placeholder="Search friends..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'online', 'add'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 rounded text-sm ${
              activeTab === tab
                ? 'bg-purple-600'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {tab === 'all' && 'All'}
            {tab === 'online' && 'Online'}
            {tab === 'add' && 'Add Friend'}
          </button>
        ))}
      </div>

      {/* Add Friend */}
      {activeTab === 'add' && (
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              className="flex-1 p-2 rounded bg-gray-800 border border-gray-700"
              placeholder="Enter username"
              value={newFriendName}
              onChange={e => setNewFriendName(e.target.value)}
            />
            <button
              onClick={addFriend}
              className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
            >
              Add
            </button>
          </div>

          {/* Friend Requests */}
          {requests.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm text-gray-400 mb-2">
                Friend Requests
              </h3>
              {requests.map(req => (
                <div
                  key={req.id}
                  className="flex justify-between items-center bg-gray-900 p-3 rounded mb-2"
                >
                  <span>{req.sender.username}</span>
                  <button
                    onClick={() => acceptRequest(req.id)}
                    className="bg-green-600 px-3 py-1 rounded text-sm"
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Friends List */}
      {activeTab !== 'add' && (
        <>
          {onlineFriends.length > 0 && (
            <>
              <p className="text-xs text-gray-500 mb-2">
                ONLINE — {onlineFriends.length}
              </p>
              {onlineFriends.map(friend => (
                <FriendRow
                  key={friend.id}
                  friend={friend}
                  onClick={() => onChatSelect?.(friend)}
                />
              ))}
            </>
          )}

          {offlineFriends.length > 0 && (
            <>
              <p className="text-xs text-gray-500 mt-6 mb-2">
                OFFLINE — {offlineFriends.length}
              </p>
              {offlineFriends.map(friend => (
                <FriendRow
                  key={friend.id}
                  friend={friend}
                  onClick={() => onChatSelect?.(friend)}
                />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

/* ---------------------- FRIEND ROW ---------------------- */
function FriendRow({
  friend,
  onClick,
}: {
  friend: Friend;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3 bg-gray-900 rounded hover:bg-gray-800 cursor-pointer mb-2"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center font-bold">
          {friend.username[0].toUpperCase()}
        </div>
        <div>
          <div className="font-medium">{friend.username}</div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                friend.status === 'Online'
                  ? 'bg-green-500'
                  : 'bg-gray-500'
              }`}
            />
            {friend.status}
          </div>
        </div>
      </div>
      <span className="text-sm text-gray-400">Message</span>
    </div>
  );
}
