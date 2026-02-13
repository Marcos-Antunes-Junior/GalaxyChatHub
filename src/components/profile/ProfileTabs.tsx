import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Moon, Palette, Shield, Sun } from "lucide-react";
import { useState } from "react";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { ACCENT_OPTIONS, MODE_OPTIONS, WALLPAPER_OPTIONS } from "../../theme";
import type {
  AccentColor,
  GalaxyWallpaper,
  ThemeMode,
  ThemePreferences,
} from "../../theme";

type ProfileTabsProps = {
  isEditing: boolean;
  user: {
    id: number;
    bio?: string;
    email: string;
    joinedDate: Date;
  };
  editedUser: {
    bio?: string;
  };
  setEditedUser: (user: any) => void;
  themePreferences: ThemePreferences;
  onThemePreferencesChange: (next: ThemePreferences) => void;
};

export function ProfileTabs({
  isEditing,
  user,
  editedUser,
  setEditedUser,
  themePreferences,
  onThemePreferencesChange,
}: ProfileTabsProps) {
  const [showModal, setShowModal] = useState(false);

  const setMode = (mode: ThemeMode) => {
    onThemePreferencesChange({ ...themePreferences, mode });
  };

  const setAccent = (accent: AccentColor) => {
    onThemePreferencesChange({ ...themePreferences, accent });
  };

  const setWallpaper = (wallpaper: GalaxyWallpaper) => {
    onThemePreferencesChange({ ...themePreferences, wallpaper });
  };

  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="bg-secondary">
        <TabsTrigger value="about" className="cursor-pointer">
          About
        </TabsTrigger>
        <TabsTrigger value="account" className="cursor-pointer">
          Account
        </TabsTrigger>
        <TabsTrigger value="privacy" className="cursor-pointer">
          Privacy
        </TabsTrigger>
        <TabsTrigger value="appearance" className="cursor-pointer">
          Appearance
        </TabsTrigger>
      </TabsList>

      <TabsContent value="about" className="mt-4">
        <Card className="border-border bg-card/50 p-6 backdrop-blur">
          <h3 className="mb-4 text-foreground">About Me</h3>

          {isEditing ? (
            <textarea
              value={editedUser.bio || ""}
              onChange={(e) =>
                setEditedUser({ ...editedUser, bio: e.target.value })
              }
              placeholder="Tell others about yourself..."
              className="min-h-[120px] w-full rounded-md border border-input bg-input-background p-3 text-foreground placeholder:text-muted-foreground"
            />
          ) : (
            <div className="whitespace-pre-wrap text-foreground">
              {user.bio || (
                <span className="text-muted-foreground">
                  No bio added yet. Click "Edit Profile" to add one.
                </span>
              )}
            </div>
          )}
        </Card>
      </TabsContent>

      <TabsContent value="account" className="mt-4">
        <Card className="border-border bg-card/50 p-6 backdrop-blur">
          <h3 className="mb-4 text-foreground">Account Information</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border py-3">
              <div>
                <div className="text-foreground">Member Since</div>
                <div className="text-sm text-muted-foreground">
                  {user.joinedDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-border py-3">
              <div>
                <div className="text-foreground">Password</div>
                <div className="text-sm text-muted-foreground">************</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowModal(true)}
                className="cursor-pointer"
              >
                Change Password
              </Button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="text-foreground">Account ID</div>
                <div className="font-mono text-sm text-muted-foreground">
                  {`${user.id}-${user.email}`}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="privacy" className="mt-4">
        <Card className="border-border bg-card/50 p-6 backdrop-blur">
          <h3 className="mb-4 flex items-center gap-2 text-foreground">
            <Shield className="h-5 w-5" />
            Privacy Settings
          </h3>

          <div className="space-y-4">
            <PrivacyRow
              title="Direct Messages"
              description="Who can send you direct messages"
            />

            <PrivacyRow
              title="Friend Requests"
              description="Who can send you friend requests"
            />

            <PrivacyRow
              title="Read Receipts"
              description="Let others know when you've read their messages"
            />
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="appearance" className="mt-4">
        <Card className="border-border bg-card/50 p-6 backdrop-blur">
          <h3 className="mb-4 flex items-center gap-2 text-foreground">
            <Palette className="h-5 w-5" />
            Theme and Accent
          </h3>

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm text-muted-foreground">Theme Mode</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {MODE_OPTIONS.map((mode) => {
                  const isActive = themePreferences.mode === mode.value;
                  return (
                    <Button
                      key={mode.value}
                      type="button"
                      variant={isActive ? "secondary" : "outline"}
                      onClick={() => setMode(mode.value)}
                      className="justify-start"
                    >
                      {mode.value === "light" ? (
                        <Sun className="mr-2 h-4 w-4" />
                      ) : (
                        <Moon className="mr-2 h-4 w-4" />
                      )}
                      {mode.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm text-muted-foreground">Accent Color</p>
              <div className="flex flex-wrap gap-2">
                {ACCENT_OPTIONS.map((accent) => {
                  const isActive = themePreferences.accent === accent.value;
                  return (
                    <Button
                      key={accent.value}
                      type="button"
                      variant={isActive ? "secondary" : "outline"}
                      onClick={() => setAccent(accent.value)}
                      className="capitalize"
                    >
                      {accent.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm text-muted-foreground">
                Galaxy Wallpaper
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {WALLPAPER_OPTIONS.map((wallpaper) => {
                  const isActive =
                    themePreferences.wallpaper === wallpaper.value;
                  return (
                    <Button
                      key={wallpaper.value}
                      type="button"
                      variant={isActive ? "secondary" : "outline"}
                      onClick={() => setWallpaper(wallpaper.value)}
                      className="justify-start"
                    >
                      {wallpaper.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Saved per account on this device.
            </p>
          </div>
        </Card>
      </TabsContent>

      {showModal && <ChangePasswordModal onClose={() => setShowModal(false)} />}
    </Tabs>
  );
}

function PrivacyRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-none">
      <div>
        <div className="text-foreground">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>

      <select className="rounded-md border border-input bg-input-background px-3 py-2 text-foreground">
        <option>Everyone</option>
        <option>Friends Only</option>
        <option>No One</option>
      </select>
    </div>
  );
}
