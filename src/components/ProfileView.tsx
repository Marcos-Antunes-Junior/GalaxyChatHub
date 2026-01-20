import { useState } from 'react';

interface UserProfile {
  username: string;
  email: string;
  bio?: string;
  status?: string;
  joinedDate: Date;
}

interface ProfileViewProps {
  user: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export function ProfileView({ user, onUpdateProfile }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile>(user);

  return (
    <div className="flex-1 p-8 max-w-2xl mx-auto">
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Profile</h2>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-primary hover:underline"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{user.username}</h3>
              <p className="text-muted-foreground">{user.status || 'Online'}</p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input 
                  type="text"
                  value={editedUser.username}
                  onChange={(e) => setEditedUser({...editedUser, username: e.target.value})}
                  className="w-full p-2 rounded border bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                  className="w-full p-2 rounded border bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea 
                  value={editedUser.bio || ''}
                  onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                  className="w-full p-2 rounded border bg-background min-h-[100px]"
                />
              </div>
              <button 
                onClick={() => {
                  onUpdateProfile(editedUser);
                  setIsEditing(false);
                }}
                className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 transition-opacity"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p>{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Bio</label>
                <p>{user.bio || 'No bio provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                <p>{new Date(user.joinedDate).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
