import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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

