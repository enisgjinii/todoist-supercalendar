
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

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
}

export const ProjectSelector = ({
  selectedProjectId,
  projects,
  labels,
}: ProjectSelectorProps) => {
  return (
    <Card className="p-6 glass-morphism">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="w-full">
          <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Projects
          </h3>
          <ScrollArea className="h-20">
            <div className="flex gap-2">
              <Button 
                variant={selectedProjectId === null ? "default" : "outline"} 
                className="whitespace-nowrap transition-all hover:scale-105"
              >
                All Projects
              </Button>
              {projects?.map((p: Project) => (
                <Button
                  key={p.id}
                  variant={selectedProjectId === p.id ? "default" : "outline"}
                  className="whitespace-nowrap transition-all hover:scale-105"
                >
                  {p.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
        {labels && labels.length > 0 && (
          <div className="w-full">
            <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Labels
            </h3>
            <div className="flex gap-2 flex-wrap">
              {labels.map((label: Label) => (
                <Badge 
                  key={label.id} 
                  variant="outline"
                  className="transition-all hover:scale-105 cursor-pointer"
                >
                  {label.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
