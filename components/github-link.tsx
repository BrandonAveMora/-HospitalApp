"use client"

import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getGitHubRepoUrl } from "@/lib/utils"

export default function GitHubLink() {
  return (
    <Button variant="outline" size="sm" className="gap-2" onClick={() => window.open(getGitHubRepoUrl(), "_blank")}>
      <Github className="h-4 w-4" />
      <span className="hidden sm:inline">Ver en GitHub</span>
    </Button>
  )
}
