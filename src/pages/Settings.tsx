
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Clock, Award, Calendar } from "lucide-react";
import { format } from "date-fns";

interface SettingsProps {
  todoistToken: string;
}

export const Settings = ({ todoistToken }: SettingsProps) => {
  const { data: user, isLoading } = useUserProfile(todoistToken);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl space-y-8">
        <Skeleton className="h-12 w-48" />
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Profile Settings
      </h1>

      <Card className="p-8 backdrop-blur-xl bg-white/50 dark:bg-zinc-900/50">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback>
                <User className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>
            <Button variant="outline">Update Avatar</Button>
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm text-zinc-500 dark:text-zinc-400">Full Name</div>
                <div className="flex items-center gap-2 text-lg font-medium">
                  <User className="h-4 w-4" />
                  {user?.full_name}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-zinc-500 dark:text-zinc-400">Email</div>
                <div className="flex items-center gap-2 text-lg">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-zinc-500 dark:text-zinc-400">Time Zone</div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {user?.timezone}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-zinc-500 dark:text-zinc-400">Premium Status</div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  {user?.is_premium ? (
                    <span className="text-green-600 dark:text-green-400">Premium User</span>
                  ) : (
                    "Free User"
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-zinc-500 dark:text-zinc-400">Joined Date</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {user?.join_date && format(new Date(user.join_date), "PPP")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
