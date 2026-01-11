import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const showcaseItems = [
  {
    title: "Ultra-Fast Mountain Generation",
    description: "Created in 0.8 seconds with Nano Banana's optimized neural engine",
    badge: "Nano Banana Speed",
    imageSrc: "/showcase/mountain.svg",
    imageAlt: "Mountain landscape at sunset",
  },
  {
    title: "Instant Garden Creation",
    description: "Complex scene rendered in milliseconds using Nano Banana technology",
    badge: "Nano Banana Speed",
    imageSrc: "/showcase/garden.svg",
    imageAlt: "Zen garden with blossoms",
  },
  {
    title: "Real-time Beach Synthesis",
    description: "Nano Banana delivers photorealistic results at lightning speed",
    badge: "Nano Banana Speed",
    imageSrc: "/showcase/beach.svg",
    imageAlt: "Tropical beach with turquoise water",
  },
  {
    title: "Rapid Aurora Generation",
    description: "Advanced effects processed instantly with Nano Banana AI",
    badge: "Nano Banana Speed",
    imageSrc: "/showcase/aurora.svg",
    imageAlt: "Aurora over snowy landscape",
  },
]

export function Showcase() {
  return (
    <section id="showcase" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Lightning-Fast AI Creations</h2>
          <p className="text-lg text-muted-foreground text-pretty">See what Nano Banana generates in milliseconds</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {showcaseItems.map((item, index) => (
            <Card key={index} className="overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-muted relative overflow-hidden">
                <img
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-accent/90 backdrop-blur-sm text-accent-foreground text-xs font-medium px-3 py-1 rounded-full">
                    {item.badge}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-lg mb-6 text-muted-foreground">Experience the power of Nano Banana yourself</p>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <a href="/#editor">Try Nano Banana Generator</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
