
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Folder, Tag, X } from "lucide-react"
import { toast } from "sonner"

interface Project {
  id: string
  name: string
}

interface Label {
  id: string
  name: string
}

interface ProjectSelectorProps {
  selectedProjectId: string | null
  projects: Project[]
  labels: Label[]
  onProjectSelect?: (projectId: string | null) => void
  selectedLabels?: string[]
  onLabelSelect?: (labelId: string) => void
}

export const ProjectSelector = ({
  selectedProjectId,
  projects,
  labels,
  onProjectSelect,
  selectedLabels = [],
  onLabelSelect,
}: ProjectSelectorProps) => {
  const handleProjectClick = (projectId: string | null) => {
    onProjectSelect?.(projectId);
    toast.success(projectId ? `Switched to ${projects.find(p => p.id === projectId)?.name}` : "Showing all projects");
  };

  const handleLabelClick = (labelId: string) => {
    onLabelSelect?.(labelId);
    toast.success(
      selectedLabels.includes(labelId)
        ? `Removed label: ${labels.find(l => l.id === labelId)?.name}`
        : `Added label: ${labels.find(l => l.id === labelId)?.name}`
    );
  };

  return (
    <Card className="p-6 glass-morphism">
      <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-6">
        <div className="w-full">
          <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Projects
          </h3>
          <ScrollArea className="h-[120px]">
            <div className="flex flex-wrap gap-2 pr-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant={selectedProjectId === null ? "default" : "outline"} 
                  className="whitespace-nowrap transition-all hover:shadow-md"
                  onClick={() => handleProjectClick(null)}
                >
                  All Projects
                </Button>
              </motion.div>
              {projects?.map((p: Project) => (
                <motion.div key={p.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant={selectedProjectId === p.id ? "default" : "outline"}
                    className="whitespace-nowrap transition-all hover:shadow-md flex items-center gap-2"
                    onClick={() => handleProjectClick(p.id)}
                  >
                    <Folder className="h-4 w-4" />
                    {p.name}
                  </Button>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {labels && labels.length > 0 && (
          <div className="w-full">
            <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Labels
            </h3>
            <ScrollArea className="h-[120px]">
              <div className="flex flex-wrap gap-2 pr-4">
                {labels.map((label: Label) => (
                  <motion.div
                    key={label.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge 
                      variant={selectedLabels.includes(label.id) ? "default" : "outline"}
                      className="transition-all hover:shadow-md cursor-pointer py-2 px-3 flex items-center gap-2"
                      onClick={() => handleLabelClick(label.id)}
                    >
                      {selectedLabels.includes(label.id) ? (
                        <X className="h-3 w-3" />
                      ) : (
                        <Tag className="h-3 w-3" />
                      )}
                      {label.name}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </Card>
  )
}
