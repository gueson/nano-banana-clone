import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is Nano Banana?",
    answer:
      "Nano Banana is an AI image editor that transforms photos using natural language prompts. Upload an image, describe the edit you want, and the app generates an updated version.",
  },
  {
    question: "How does it work?",
    answer:
      "Upload an image and describe your desired edits in natural language. The app processes the prompt and generates edited images that you can download or iterate on.",
  },
  {
    question: "What kinds of edits work well?",
    answer:
      "Common workflows include background changes, object placement, style transfers, and adjustments while trying to preserve the overall look of the original image.",
  },
  {
    question: "Can I use it for commercial projects?",
    answer:
      "Depending on your plan, commercial use may be available. Review the plan details on the Pricing page and the Terms of Service for the latest usage terms.",
  },
  {
    question: "What types of edits can it handle?",
    answer:
      "It supports a range of edits including face completion, background changes, object placement, style transfers, and character modifications. Results can vary depending on the input image and prompt.",
  },
  {
    question: "Where can I try Nano Banana?",
    answer:
      "You can try Nano Banana through our web interface. Upload your image, enter a text prompt describing your desired edits, and review the generated results.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">FAQs</h2>
          <p className="text-lg text-muted-foreground text-pretty">Frequently Asked Questions</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}