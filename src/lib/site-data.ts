import {
  benefits,
  digitalServices,
  serviceCatalog,
  type DigitalIcon,
  type ServiceIcon,
} from "@/lib/site-data";
export const benefits = [
  ["01", "Affordable pricing", "Clear quotes from ₹6,500 — no surprise agency mark-ups."],
  ["02", "Mobile responsive", "Designed phone-first so customers can act with one thumb."],
  ["03", "SEO-ready", "Clean structure and fast pages to support local search visibility."],
  ["04", "WhatsApp integration", "One tap from your website to the conversations you already manage."],
  ["05", "Fast delivery", "A focused process that gets your business online without long delays."],
  ["06", "Easy to manage", "Simple updates, clear handover, and support after launch."],
] as const;

export const services = [
  ["Business websites", "Professional pages for local businesses, service providers, construction and real estate teams.", "From ₹6,500"],
  ["Restaurant & café sites", "Menus, food photos, maps and direct WhatsApp ordering for food businesses.", "From ₹5,500"],
  ["Landing pages", "Focused pages for campaigns, property enquiries, memberships and appointment requests.", "From ₹3,000"],
] as const;

export const process = [
  ["Step 1", "Free demo", "Share your business name and a few details. I prepare a first look before you commit."],
  ["Step 2", "Build & review", "We agree on the scope and price, then refine your website together."],
  ["Step 3", "Launch & support", "Your website goes live, and I remain available for updates and questions."],
] as const;

export type ServiceIcon = "briefcase" | "utensils" | "cart" | "rocket" | "layout" | "wrench";
export const serviceCatalog: { icon: ServiceIcon; title: string; description: string; price: string; features: string[] }[] = [
  { icon: "briefcase", title: "Business Website", description: "A professional online home for local businesses and service providers.", price: "Starting from ₹6,500", features: ["Professional business website", "Mobile responsive", "WhatsApp integration", "Contact form", "Basic SEO setup", "Fast loading", "Support after launch"] },
  { icon: "utensils", title: "Restaurant / Cafe / Cloud Kitchen Website", description: "Show your menu beautifully and let customers order on WhatsApp.", price: "Starting from ₹5,500", features: ["Menu display", "Food/product images", "WhatsApp ordering", "Location/map", "Contact details", "Mobile responsive design"] },
  { icon: "cart", title: "E-commerce Website", description: "Sell your products online with a store you can manage yourself.", price: "Starting from ₹12,000", features: ["Product catalog", "Admin panel", "Product management", "Online payment integration", "WhatsApp integration", "Mobile responsive", "Basic shipping setup"] },
  { icon: "rocket", title: "Landing Page", description: "One focused page built to turn visitors into enquiries.", price: "Starting from ₹3,000", features: ["Modern landing page", "Mobile responsive", "Lead/contact form", "WhatsApp CTA", "SEO-ready structure"] },
  { icon: "layout", title: "WordPress Website", description: "An easy-to-edit WordPress site, set up and handed over with training.", price: "Starting from ₹6,500", features: ["WordPress setup", "Responsive design", "Pages and content", "Contact form", "Basic SEO", "Training/support"] },
  { icon: "wrench", title: "Website Maintenance", description: "Ongoing help to keep your website fresh, accurate and working well.", price: "Custom pricing", features: ["Content updates", "Product updates", "Minor design changes", "Technical assistance"] },
];

export type DigitalIcon = "palette" | "idcard" | "map-pin" | "camera" | "qr-code" | "whatsapp";
export const digitalServices: { icon: DigitalIcon; title: string; description: string; price: string; features: string[] }[] = [
  { icon: "palette", title: "Logo Design", description: "Professional and memorable logo designed to match your business brand.", price: "Starting from ₹499", features: ["Custom logo concept", "Professional design", "High-quality files", "PNG & JPG formats", "2 revisions"] },
  { icon: "idcard", title: "Business Card + Letterhead", description: "Professional business cards and letterheads that create a strong brand identity.", price: "Starting from ₹1,000", features: ["Business card design", "Letterhead design", "Print-ready files", "Digital files", "Professional branding"] },
  { icon: "map-pin", title: "Google Business Profile Setup", description: "Set up and optimize your Google Business Profile so local customers can easily find your business.", price: "Starting from ₹1,500", features: ["Business information setup", "Category optimization", "Services & products", "Photo setup", "Google Maps visibility"] },
  { icon: "camera", title: "Instagram Post Design", description: "Eye-catching Instagram posts to promote your products, services and special offers.", price: "₹500 per post", features: ["Custom post design", "Brand colors & logo", "Promotional designs", "Product/service posts", "High-quality social media format"] },
  { icon: "qr-code", title: "Digital Menu + QR", description: "A mobile-friendly digital menu that customers can open instantly by scanning a QR code.", price: "Starting from ₹999", features: ["Digital menu", "QR code", "WhatsApp ordering", "Mobile-friendly design"] },
  { icon: "whatsapp", title: "WhatsApp Business Setup", description: "Set up WhatsApp Business so customers can easily contact, enquire and order from you.", price: "Starting from ₹999", features: ["Business profile", "Catalogue setup", "Greeting message", "Quick replies", "WhatsApp QR code"] },
];
