
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bookmark, Flag, Link as LinkIcon, MoreHorizontal } from "lucide-react";

export const TaskActionsDropdown = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Flag className="h-4 w-4 mr-2" />
        Set Priority
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Bookmark className="h-4 w-4 mr-2" />
        Add to Favorites
      </DropdownMenuItem>
      <DropdownMenuItem>
        <LinkIcon className="h-4 w-4 mr-2" />
        Copy Link
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
