
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface TaskCommentsProps {
  comments: any[];
  isLoading: boolean;
  expanded: boolean;
}

export const TaskComments = ({ comments, isLoading, expanded }: TaskCommentsProps) => (
  <AnimatePresence>
    {expanded && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="mt-4"
      >
        <ScrollArea className="h-[200px] rounded-md border p-4">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : comments?.length ? (
            <div className="space-y-4">
              {comments.map((comment: any) => (
                <div key={comment.id} className="text-sm">
                  <div className="font-medium">{comment.content}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {format(new Date(comment.posted_at), "PPP p")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No comments yet</p>
          )}
        </ScrollArea>
      </motion.div>
    )}
  </AnimatePresence>
);
