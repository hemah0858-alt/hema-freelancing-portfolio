import type { ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const WHATSAPP_NUMBER = "917200795959";
export const DEFAULT_WHATSAPP_MESSAGE = "Hi Hemasri, I found First Step Future and I'm interested in getting a website for my business.";

export const whatsappLink = (message: string = DEFAULT_WHATSAPP_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
export const serviceMessage = (service: string) => `Hi Hemasri, I'm interested in your ${service} service. Please share the details.`;
export const projectMessage = (project: string) => `Hi Hemasri, I saw your ${project} project and I'm interested in a similar website.`;

type Props = {
  message?: string;
  children?: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
};

export function WhatsAppButton({ message, children = "Chat on WhatsApp", className, variant = "outline", size = "default" }: Props) {
  return (
    <Button asChild variant={variant} size={size} className={cn("rounded-xl", className)}>
      <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="size-4" aria-hidden />
        {children}
      </a>
    </Button>
  );
}

/** Floating round button for tablet/desktop; phones use the bottom action bar. */
export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Hemasri on WhatsApp"
      className="fixed bottom-6 right-6 z-40 hidden size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glass transition-transform hover:scale-105 sm:flex"
    >
      <MessageCircle className="size-6" aria-hidden />
    </a>
  );
}
