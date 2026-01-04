"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Wand2, Loader2 } from "lucide-react"

export function Editor() {
  const [prompt, setPrompt] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
        setGeneratedImage(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!image || !prompt) return

    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image,
          prompt,
        }),
      })

      const data = await response.json()
      console.log("openai data", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image")
      }

      if (data.image) {
        setGeneratedImage(data.image)
      } else {
        throw new Error("No image returned from API")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while generating the image")
      console.error("Generation error:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id="editor" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Try The AI Editor</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Experience the power of nano-banana&apos;s natural language image editing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Upload Image</h3>

              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-accent transition-colors cursor-pointer">
                <input type="file" id="image-upload" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {image ? (
                    <img src={image || "/placeholder.svg"} alt="Uploaded" className="max-h-64 mx-auto rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <Upload className="h-12 w-12 text-muted-foreground" />
                      <p className="text-sm font-medium">Click to upload image</p>
                      <p className="text-xs text-muted-foreground">Max 10MB</p>
                    </div>
                  )}
                </label>
              </div>

              <div className="mt-6">
                <label className="text-sm font-medium mb-2 block">Main Prompt</label>
                <Textarea
                  placeholder="Describe how you want to transform your image..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-32 resize-none"
                />
              </div>

              <Button
                className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
                disabled={!image || !prompt || isGenerating}
                onClick={handleGenerate}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Now
                  </>
                )}
              </Button>
            </Card>

            {/* Output Section */}
            <Card className="p-6 bg-card">
              <h3 className="text-xl font-semibold mb-4">Output Gallery</h3>

              <div className="border-2 border-border rounded-lg p-12 min-h-80 flex items-center justify-center bg-muted/50">
                {isGenerating ? (
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-sm font-medium mb-2">Generating your image...</p>
                    <p className="text-xs text-muted-foreground">This may take a few moments</p>
                  </div>
                ) : error ? (
                  <div className="text-center">
                    <span className="text-6xl mb-4 block">⚠️</span>
                    <p className="text-sm font-medium mb-2 text-destructive">Error</p>
                    <p className="text-xs text-muted-foreground">{error}</p>
                  </div>
                ) : generatedImage ? (
                  <div className="w-full">
                    <img
                      src={generatedImage}
                      alt="Generated"
                      className="max-h-96 mx-auto rounded-lg w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="text-6xl mb-4 block">🍌</span>
                    <p className="text-sm font-medium mb-2">Ready for instant generation</p>
                    <p className="text-xs text-muted-foreground">Enter your prompt and unleash the power</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
