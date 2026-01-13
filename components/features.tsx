import { Card } from "@/components/ui/card"
import { MessageSquare, Users, Layers, Zap, Images, Sparkles } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "Natural Language Editing",
    description:
      "Edit images using simple text prompts. Describe what you want to change and get an updated result.",
  },
  {
    icon: Users,
    title: "Character Consistency",
    description:
      "Helps maintain key character details across edits, especially for faces and identity-sensitive changes.",
  },
  {
    icon: Layers,
    title: "Scene Preservation",
    description:
      "Blend edits with the original scene so results look coherent with the existing background.",
  },
  {
    icon: Zap,
    title: "One-Shot Editing",
    description:
      "Get results quickly with a single prompt, with the option to iterate when needed.",
  },
  {
    icon: Images,
    title: "Multi-Image Context",
    description: "Process multiple images simultaneously. Support for advanced multi-image editing workflows",
  },
  {
    icon: Sparkles,
    title: "AI Content Creation",
    description:
      "Create variations for social media and marketing, including product-style imagery.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Core Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            A simple workflow for prompt-based image editing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <feature.icon className="h-10 w-10 mb-4 text-accent" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}