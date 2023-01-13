import React from "react";

import { HeroText } from "@/components/Hero";
import { ServicesGrid } from "@/components/Services";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <HeroText />
      <ServicesGrid title="" description="" />
      <Footer
        data={[
          {
            title: "Home",
            links: [
              { label: "Services", link: "http://localhost:3000/#services" },
            ],
          },
        ]}
      />
    </>
  );
}
