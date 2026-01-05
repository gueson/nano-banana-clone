import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Helper function to get the site URL from request
function getSiteUrl(request: NextRequest): string {
  // First, check environment variable
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  // In production (Vercel), use x-forwarded-host header
  const forwardedHost = request.headers.get('x-forwarded-host')
  if (forwardedHost) {
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    return `${protocol}://${forwardedHost}`
  }

  // Fallback to request origin
  const origin = new URL(request.url).origin
  return origin
}

export async function POST(request: NextRequest) {
  try {
    const { image, prompt } = await request.json()

    if (!image || !prompt) {
      return NextResponse.json(
        { error: "Image and prompt are required" },
        { status: 400 }
      )
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      )
    }

    // Create OpenAI client with dynamic site URL
    const siteUrl = getSiteUrl(request)
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": siteUrl,
        "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "Image Editor",
      },
    })

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-image",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: image
              }
            }
          ]
        }
      ]
    })

    const responseMessage = completion.choices[0]?.message

    if (!responseMessage) {
      return NextResponse.json(
        { error: "No response from API" },
        { status: 500 }
      )
    }

    // Extract image from response
    // OpenRouter/Gemini API may return images in an images field
    let generatedImage = null
    
    // Type assertion to access OpenRouter-specific fields
    const messageWithImages = responseMessage as any
    
    // First, check for images field (OpenRouter/Gemini specific)
    if (messageWithImages.images && Array.isArray(messageWithImages.images) && messageWithImages.images.length > 0) {
      const imageData = messageWithImages.images[0]
      // Handle different image formats
      if (typeof imageData === "string") {
        // Direct URL or base64 string
        if (imageData.startsWith("data:")) {
          generatedImage = imageData
        } else if (imageData.startsWith("http")) {
          generatedImage = imageData
        } else {
          // Assume base64 without data URI prefix
          generatedImage = `data:image/png;base64,${imageData}`
        }
      } else if (imageData.url) {
        generatedImage = imageData.url
      } else if (imageData.data) {
        // Base64 data with mime type
        const mimeType = imageData.mime_type || "image/png"
        generatedImage = `data:${mimeType};base64,${imageData.data}`
      }
    }
    
    // Fallback: check content field
    if (!generatedImage && responseMessage.content) {
      // Check if content is an array (multimodal response)
      if (Array.isArray(responseMessage.content)) {
        const imagePart = responseMessage.content.find(
          (part: any) => part.type === "image_url" || part.type === "image"
        )
        if (imagePart) {
          generatedImage = imagePart.image_url?.url || imagePart.url
        }
        // Check for base64 inline data
        const inlineDataPart = responseMessage.content.find(
          (part: any) => part.type === "image" && part.inline_data
        )
        if (inlineDataPart?.inline_data?.data) {
          generatedImage = `data:${inlineDataPart.inline_data.mime_type || "image/png"};base64,${inlineDataPart.inline_data.data}`
        }
      } else if (typeof responseMessage.content === "string") {
        // Try to extract image URL from text response
        const urlMatch = responseMessage.content.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i)
        if (urlMatch) {
          generatedImage = urlMatch[0]
        }
        // Check if the entire response is an image URL
        if (responseMessage.content.startsWith("http")) {
          generatedImage = responseMessage.content
        }
      }
    }

    // If no image found, check for native Gemini format in the raw response
    if (!generatedImage && (completion as any).candidates) {
      const candidates = (completion as any).candidates
      if (candidates?.[0]?.content?.parts) {
        const parts = candidates[0].content.parts
        const imagePart = parts.find((part: any) => part.inline_data)
        if (imagePart?.inline_data?.data) {
          generatedImage = `data:${imagePart.inline_data.mime_type || "image/png"};base64,${imagePart.inline_data.data}`
        }
      }
    }

    return NextResponse.json({
      success: true,
      image: generatedImage,
      message: responseMessage.content,
      fullResponse: responseMessage
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate image" },
      { status: 500 }
    )
  }
}

