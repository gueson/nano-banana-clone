"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { X } from "lucide-react"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if cookie consent has already been given
    const consent = localStorage.getItem("cookieConsent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted")
    setIsVisible(false)
  }

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected")
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 p-4 md:p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-2">Cookie Consent</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We use cookies to improve your experience and analyze site traffic. By clicking "Accept All", you consent to our use of cookies. You can manage your preferences in your account settings.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <Link href="/privacy" className="underline text-primary">
                Privacy Policy
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/terms" className="underline text-primary">
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" size="sm" onClick={handleReject}>
              Reject All
            </Button>
            <Button size="sm" onClick={handleAccept}>
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}