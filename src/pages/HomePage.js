import { Navigation } from "../components/Navigation.js";
import { HeroSection } from "../components/HeroSection.js";
import { BrandsSection } from "../components/BrandsSection.js";
import { ShowroomSection } from "../components/ShowroomSection.js";
import { TechSection } from "../components/TechSection.js";
import { FeaturesSection } from "../components/FeaturesSection.js";
import { TestimonialsSection } from "../components/TestimonialsSection.js";
import { FaqSection } from "../components/FaqSection.js";
import { ContactSection } from "../components/ContactSection.js";
import { Footer } from "../components/Footer.js";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp.js";

export function HomePage() {
  return [
    Navigation(),
    HeroSection(),
    BrandsSection(),
    ShowroomSection(),
    TechSection(),
    FeaturesSection(),
    TestimonialsSection(),
    FaqSection(),
    ContactSection(),
    Footer(),
    FloatingWhatsApp()
  ].join("\n");
}
