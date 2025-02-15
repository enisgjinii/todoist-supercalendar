
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, CheckCircle, Flag } from "lucide-react"
import { format } from "date-fns"

interface EventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent: any;
  isEditing: boolean;
  editedTitle: string;
  setEditedTitle: (title: string) => void;
  editedDescription: string;
  setEditedDescription: (description: string) => void;
  setIsEditing: (editing: boolean) => void;
  handleSave: () => void;
  handleDelete: () => void;
}

export const EventDialog = ({
  isOpen,
  onOpenChange,
  selectedEvent,
  isEditing,
  editedTitle,
  setEditedTitle,
  editedDescription,
  setEditedDescription,
  setIsEditing,
  handleSave,
  handleDelete,
}: EventDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          {isEditing ? (
            <input
              className="w-full text-xl font-semibold p-2 border rounded"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          ) : (
            <DialogTitle className="text-xl font-semibold">
              {selectedEvent?.title}
            </DialogTitle>
          )}
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Due Date:</span>
            <span className="font-medium">
              {selectedEvent?.start
                ? format(new Date(selectedEvent.start), "PPP")
                : "No date set"}
            </span>
          </div>
          
          {selectedEvent?.extendedProps?.priority && (
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Priority:</span>
              <span className="font-medium">
                Priority {selectedEvent.extendedProps.priority}
              </span>
            </div>
          )}

          {selectedEvent?.extendedProps?.completed && (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">Completed</span>
            </div>
          )}

          {selectedEvent?.extendedProps?.labels?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedEvent.extendedProps.labels.map((label: string) => (
                <Badge key={label} variant="outline">
                  {label}
                </Badge>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <span className="text-sm text-gray-500">Description:</span>
            {isEditing ? (
              <textarea
                className="w-full p-2 border rounded min-h-[100px]"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Add a description..."
              />
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {selectedEvent?.extendedProps?.description || "No description provided."}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleSave}>Save</Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
