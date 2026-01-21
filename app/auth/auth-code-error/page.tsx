import { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Authentication Error - Nano Banana AI Image Editor",
  description: "There was an error during authentication. Please try again or contact support for assistance.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/auth-code-error`,
  },
}

export default function AuthCodeError() {
  return (
    <div className="container mx-auto px-4 py-20">
      <Card className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="text-muted-foreground mb-6">
          There was an error during authentication. Please try again.
        </p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </Card>
    </div>
  )
}

