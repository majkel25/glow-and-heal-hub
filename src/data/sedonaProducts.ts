export interface SedonaProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  fullDescription: string;
  badge: string;
  category: string;
  specs: {
    frequency?: string;
    intensity?: string;
    programs?: string;
    waveforms?: string[];
    applicators?: string[];
    dimensions?: string;
    warranty?: string;
  };
  features: string[];
  includes: string[];
}

export const sedonaProducts: SedonaProduct[] = [
  {
    id: "sedona-pemf-chair",
    name: "SEDONA PEMF Chair",
    price: 12500,
    image: "https://sedonawellness.com/cdn/shop/files/PEMFChair.jpg?v=1744720092&width=800",
    images: [
      "https://sedonawellness.com/cdn/shop/files/PEMFChair.jpg?v=1744720092&width=1946",
      "https://sedonawellness.com/cdn/shop/files/PEMF_Chair.jpg?v=1744719989&width=1946",
      "https://sedonawellness.com/cdn/shop/files/IMG_4299.heic?v=1744719881&width=1946",
      "https://sedonawellness.com/cdn/shop/files/IMG_4293.heic?v=1744719881&width=1946",
    ],
    description: "Luxury PEMF lounge chair combining pulsed electromagnetic field therapy with micro-vibration massage technology.",
    fullDescription: "Transform your wellness routine with the luxurious PEMF Lounge Chair, meticulously designed for unparalleled comfort and cutting-edge therapeutic benefits. This state-of-the-art chair combines the healing power of Pulsed Electromagnetic Field (PEMF) therapy with the soothing effects of microvibration technology, creating a rejuvenating experience like no other.",
    badge: "Flagship",
    category: "PEMF Chairs",
    specs: {
      dimensions: "Length: 215cm, Width: 90cm (+10cm controller), Height: 50cm",
      warranty: "2 Year Standard Warranty (Lifetime available)",
    },
    features: [
      "Advanced PEMF Therapy: Promotes cellular regeneration, reduces stress, and enhances overall well-being",
      "Microvibration Technology: Delivers gentle vibrations that improve circulation and relieve tension",
      "Ergonomic Design: Sleek, modern silhouette ensures maximum comfort and elegance",
      "Premium Build: Crafted from high-quality materials for durability and aesthetic appeal",
      "Perfect for homes, clinics, or luxury wellness spaces",
    ],
    includes: [
      "SEDONA PEMF Lounge Chair",
      "Control Unit",
      "User Manual",
    ],
  },
  {
    id: "sedona-elite-pemf-mat",
    name: "SEDONA Elite PEMF Mat",
    price: 6200,
    image: "https://sedonawellness.com/cdn/shop/files/PEMFMatOpenElite.jpg?v=1715416503&width=800",
    images: [
      "https://sedonawellness.com/cdn/shop/files/PEMFMatOpenElite.jpg?v=1715416503&width=1946",
      "https://sedonawellness.com/cdn/shop/files/9-C06A7367copy_small_4f20f7f7-a6c2-4623-b46a-c8a526d20669.jpg?v=1715416503&width=1946",
      "https://sedonawellness.com/cdn/shop/files/48-C06A7539copy_6eaa9a2c-ed71-412a-b098-0a9e67e83232.jpg?v=1715416503&width=1946",
      "https://sedonawellness.com/cdn/shop/files/sedona_procomplete_set_1_8d5efcbf-2872-4b28-9329-3c8d7b322e32.png?v=1715416503&width=1946",
    ],
    description: "Most advanced PEMF mat featuring DNA frequency technology for cellular and genetic healing.",
    fullDescription: "The SEDONA Elite PEMF Mat is our latest modification and our most advanced, first of its kind, PEMF Mat. This system represents a significant advancement in the field of bio electromagnetics and molecular biology. By converting the constant magnetic field into a variable one using wave genetics, this system has been upgraded to communicate with DNA in a language understood by it. This means that instead of simply exposing individuals to a predetermined magnetic field, the system now interacts with the genetic code, providing specific information to cells for altering their properties and qualities.",
    badge: "Most Advanced",
    category: "PEMF Mats",
    specs: {
      frequency: "0.01 - 15,000 Hz",
      intensity: "0.3 - 100 Gauss (30 - 10,000 µT)",
      programs: "16 Pre-Set Programs + 8 Custom Programs",
      waveforms: ["Sine Wave", "Rectangular Wave", "Sawtooth Wave", "Multi Impulse"],
      applicators: ["PEMF Mat", "PEMF Local Applicator"],
      warranty: "2 Year Standard Warranty (Lifetime available for £295)",
    },
    features: [
      "DNA Frequency Technology for cellular and genetic healing",
      "Targeted activation of DNA and immune system enhancement",
      "Regenerative processes in the cardiovascular system",
      "16 different set programs (8 Wellness + 8 Longevity)",
      "8 customizable programs with any frequency, intensity, and waveform",
      "30 minute sessions",
      "Run mat and local applicator simultaneously",
    ],
    includes: [
      "SEDONA Elite Control Unit",
      "SEDONA PEMF Mat",
      "SEDONA PEMF Local Applicator",
      "User Manual",
    ],
  },
  {
    id: "sedona-pro-plus-pemf-mat",
    name: "SEDONA Pro Plus PEMF Mat",
    price: 5400,
    image: "https://sedonawellness.com/cdn/shop/files/PEMFMatOpenProPlus_f7c3bc32-f0e2-4a86-8d95-b2f4f1e243be.jpg?v=1715416466&width=800",
    images: [
      "https://sedonawellness.com/cdn/shop/files/PEMFMatOpenProPlus_f7c3bc32-f0e2-4a86-8d95-b2f4f1e243be.jpg?v=1715416466&width=1946",
      "https://sedonawellness.com/cdn/shop/files/48-C06A7539copy_f514cffe-ebf9-4ca9-a013-6d0a9d760342.jpg?v=1715416466&width=1946",
      "https://sedonawellness.com/cdn/shop/files/9-C06A7367copy_small_82874cd1-7037-43d2-8194-33ea61190ee8.jpg?v=1715416466&width=1946",
      "https://sedonawellness.com/cdn/shop/files/sedona_procomplete_set_1_b2738c2d-521c-4b81-b964-09821745a9d7.png?v=1715416466&width=1946",
    ],
    description: "Professional-grade PEMF mat with enhanced frequency capabilities and customizable programs.",
    fullDescription: "The SEDONA Pro Plus PEMF Mat is the same as our SEDONA Pro PEMF Mat but it includes a customize section where you can customize and save 12 different programs with any frequency, intensity or wave form that you would like. It comes with the same 36 set programs of the SEDONA Pro PEMF Mat. The SEDONA Pro Plus PEMF Mat comes with the PEMF Mat and the PEMF Local Applicator, that can be run simultaneously with the same frequency or with two different frequencies.",
    badge: "Professional",
    category: "PEMF Mats",
    specs: {
      frequency: "0.01 - 15,000 Hz",
      intensity: "0.3 - 100 Gauss",
      programs: "36 Set Programs + 12 Custom Programs",
      waveforms: ["Sinus", "Rectangular", "Multi Resonance and Impulse", "Sawtooth"],
      applicators: ["PEMF Mat", "PEMF Local Applicator"],
      warranty: "2 Year Standard Warranty (Lifetime available for £295)",
    },
    features: [
      "36 pre-set programs across multiple categories",
      "12 fully customizable programs",
      "Choose any frequency, intensity, or waveform",
      "Run two applicators simultaneously",
      "Professional-grade therapy for home or clinic use",
    ],
    includes: [
      "SEDONA Pro Plus Control Unit",
      "SEDONA PEMF Mat",
      "SEDONA PEMF Local Applicator",
      "User Manual",
    ],
  },
  {
    id: "sedona-pro-pemf-mat",
    name: "SEDONA Pro PEMF Mat",
    price: 4600,
    image: "https://sedonawellness.com/cdn/shop/files/PEMFMatOpenPro.jpg?v=1715509049&width=800",
    images: [
      "https://sedonawellness.com/cdn/shop/files/PEMFMatOpenPro.jpg?v=1715509049&width=1946",
      "https://sedonawellness.com/cdn/shop/files/48-C06A7539copy.jpg?v=1715509049&width=1946",
      "https://sedonawellness.com/cdn/shop/files/9-C06A7367copy_small_7b2bde45-81c6-4363-83a9-baf1b7ac85e9.jpg?v=1715509049&width=1946",
      "https://sedonawellness.com/cdn/shop/products/sedona_procomplete_set_1.png?v=1715509049&width=1946",
    ],
    description: "Entry-level professional PEMF mat system with 36 programs and multiple waveforms.",
    fullDescription: "The SEDONA Pro PEMF Mat is our standard PEMF Mat. It comes with 36 set programs in three different categories. The Sedona Pro PEMF Mat comes with the PEMF Mat and the PEMF Local Applicator, that can be run simultaneously with the same frequency or with two different frequencies.",
    badge: "Best Value",
    category: "PEMF Mats",
    specs: {
      frequency: "0.01 - 15,000 Hz",
      intensity: "0.3 - 100 Gauss",
      programs: "36 Set Programs",
      waveforms: ["Sinus", "Rectangular", "Multi Resonance and Impulse", "Sawtooth"],
      applicators: ["PEMF Mat", "PEMF Local Applicator"],
      warranty: "2 Year Standard Warranty (Lifetime available for £295)",
    },
    features: [
      "36 pre-set programs in three categories",
      "Four different waveforms for versatile therapy",
      "Run two applicators simultaneously",
      "Great entry point for professional PEMF therapy",
      "Ideal for home use or professional settings",
    ],
    includes: [
      "SEDONA Pro Control Unit",
      "SEDONA PEMF Mat",
      "SEDONA PEMF Local Applicator",
      "User Manual",
    ],
  },
  {
    id: "sedona-pemf-face-mask",
    name: "SEDONA PEMF Face Mask",
    price: 305,
    image: "https://sedonawellness.com/cdn/shop/products/DSC03117small.jpg?v=1712147573&width=800",
    images: [
      "https://sedonawellness.com/cdn/shop/products/DSC03117small.jpg?v=1712147573&width=1946",
      "https://sedonawellness.com/cdn/shop/files/facemask_whats_in_the_box.png?v=1714023233&width=1946",
    ],
    description: "Revolutionary PEMF face mask for skin rejuvenation and mental clarity.",
    fullDescription: "The SEDONA PEMF Face Mask is a revolutionary device designed for skin rejuvenation and enhanced mental clarity. Using targeted PEMF therapy directly on the face and head, this mask promotes cellular renewal, reduces fine lines, and provides therapeutic benefits for overall well-being through cranial therapy.",
    badge: "Beauty",
    category: "Accessories",
    specs: {
      warranty: "1 Year Standard Warranty",
    },
    features: [
      "Targeted PEMF therapy for facial rejuvenation",
      "Promotes cellular renewal and skin health",
      "Reduces appearance of fine lines",
      "Enhances mental clarity through cranial therapy",
      "Lightweight and comfortable design",
      "Easy to use at home",
    ],
    includes: [
      "SEDONA PEMF Face Mask",
      "Controller",
      "Charging Cable",
      "User Manual",
    ],
  },
  {
    id: "timmyzzz-pemf-pillow",
    name: "TimmyZzz PEMF Pillow",
    price: 305,
    image: "https://sedonawellness.com/cdn/shop/files/IMG_9803.jpg?v=1735835985&width=800",
    images: [
      "https://sedonawellness.com/cdn/shop/files/S13_e291effe-eeb6-46d1-975e-ec9fea6d847c.jpg?v=1725952659&width=1946",
      "https://sedonawellness.com/cdn/shop/products/S08.jpg?v=1722963230&width=1946",
      "https://sedonawellness.com/cdn/shop/files/S14_e74dd0b2-0306-4cc4-8c9b-10a5d049879d.jpg?v=1725952659&width=1946",
      "https://sedonawellness.com/cdn/shop/files/IMG_9803.jpg?v=1735835985&width=1946",
    ],
    description: "Sleep-focused PEMF pillow designed to help you fall asleep faster and wake refreshed.",
    fullDescription: "The TimmyZzz PEMF Pillow utilizes advanced PEMF technology to induce relaxation and promote deeper sleep cycles. This PEMF Pillow is made out of 100% organic latex and wrapped in a 100% organic cotton cover. Drug-free solution for better sleep quality starting from the first night.",
    badge: "Sleep Aid",
    category: "Accessories",
    specs: {
      frequency: "3Hz, 7.83Hz, 25Hz, 1,200Hz",
      intensity: "0.6 Gauss",
      programs: "4 Different Program Settings",
      waveforms: ["Rectangular"],
      dimensions: "Flat: 66cm x 42cm x 11cm | Curve: 50cm x 33cm x 9cm",
      warranty: "1 Year Standard Warranty",
    },
    features: [
      "Program A (3Hz): Deep Sleep, Meridian Activation",
      "Program B (7.83Hz): Cell Rejuvenation, Deep Relaxation, Meditation",
      "Program C (25Hz): Better Concentration",
      "Program D (1,200Hz): Reduce Swelling, Pain Relief",
      "100% organic latex construction",
      "100% organic cotton cover",
      "Available in Flat or Curve shape",
      "Available in Medium or Firm softness",
    ],
    includes: [
      "TimmyZzz PEMF Pillow",
      "Controller",
      "USB Charging Cable",
      "User Manual",
    ],
  },
];

export const getProductBySlug = (slug: string): SedonaProduct | undefined => {
  return sedonaProducts.find((product) => product.id === slug);
};
