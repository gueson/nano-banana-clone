import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function PricingSuccessPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
              <CardDescription>
                Thank you for subscribing to Nano Banana. Your subscription is now active.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  What&apos;s next?
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Start creating amazing images with AI</li>
                  <li>• Access all premium features</li>
                  <li>• Check your account for subscription details</li>
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link href="/#editor">Start Creating</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">Go to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}




