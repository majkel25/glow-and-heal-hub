export interface FnctionProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  fullDescription: string;
  badge?: string;
  category: string;
  flavor?: string;
  packSize?: string;
  nutritionalClaims?: string[];
  ingredients: {
    name: string;
    amount: string;
  }[];
  nutritionalInfo: {
    servingSize: string;
    energy: string;
    fat: string;
    saturates: string;
    carbohydrates: string;
    sugars: string;
    fiber: string;
    protein: string;
    salt: string;
  };
  features: string[];
  includes?: string[];
}

export const fnctionProducts: FnctionProduct[] = [
  {
    id: "calm",
    name: "CALM",
    brand: "F+NCTION",
    price: 115.00,
    image: "https://fnction.co/cdn/shop/files/New_Web_Images_EH-02.png?v=1752285638&width=800",
    images: [
      "https://fnction.co/cdn/shop/files/New_Web_Images_EH-02.png?v=1752285638&width=1445",
      "https://fnction.co/cdn/shop/files/Salt_Choc_1_copy.jpg?v=1755253547&width=1445",
    ],
    description: "Rest & Recovery Drink with Marine Collagen - 780g Salted Chocolate",
    fullDescription: "Our Evening Stress Relief and Sleep Support drink is a soothing blend formulated to reduce stress, calm the central nervous system, and promote high-quality sleep and recovery. With added Marine Collagen for Skin, Joint & Muscle Repair.",
    badge: "Bestseller",
    category: "Rest & Recovery",
    flavor: "Salted Chocolate",
    packSize: "780g (30 Servings)",
    nutritionalClaims: ["High Protein", "High Fibre", "Low Sugar", "Low Fat"],
    ingredients: [
      { name: "Marine Collagen", amount: "10,000mg" },
      { name: "Vitamin C", amount: "100mg" },
      { name: "Vitamin B6", amount: "2.45mg" },
      { name: "Vitamin B12", amount: "10µg" },
      { name: "Copper", amount: "0.24mg" },
      { name: "Pink Himalayan Salt", amount: "200mg" },
      { name: "Magnesium Bisglycinate", amount: "112.5mg" },
      { name: "L-Glutamine", amount: "4,200mg" },
      { name: "L-Glycine", amount: "3,000mg" },
      { name: "L-Theanine (from green tea)", amount: "100mg" },
      { name: "Ashwagandha Root 10:1 Extract", amount: "3,000mg" },
      { name: "Chamomile Flower 5:1 Extract", amount: "167mg" },
      { name: "Blue Passion Flower 4:1 Extract", amount: "60mg" },
      { name: "Reishi Mushroom 4:1 Extract", amount: "100mg" },
    ],
    nutritionalInfo: {
      servingSize: "26g",
      energy: "260 kJ / 62 kcal",
      fat: "<0.7g",
      saturates: "0.4g",
      carbohydrates: "2.2g",
      sugars: "0.1g",
      fiber: "2.0g",
      protein: "11g",
      salt: "0.2g",
    },
    features: [
      "Reduces stress and calms the central nervous system",
      "Promotes high-quality sleep and recovery",
      "10g Marine Collagen for skin, joint & muscle repair",
      "Contains Ashwagandha to regulate cortisol levels",
      "Reishi mushroom for immune support",
      "Only £3.50 per serving",
      "30 day money-back guarantee",
    ],
  },
  {
    id: "calm-starter-pack",
    name: "CALM Starter Pack",
    brand: "F+NCTION",
    price: 142.00,
    image: "https://fnction.co/cdn/shop/files/Fnction_Web_flow_DEV_EH-03_45f2cbde-1cec-41d0-a0c3-91f90448737d.jpg?v=1752683233&width=800",
    images: [
      "https://fnction.co/cdn/shop/files/Fnction_Web_flow_DEV_EH-03_45f2cbde-1cec-41d0-a0c3-91f90448737d.jpg?v=1752683233&width=1445",
      "https://fnction.co/cdn/shop/files/Salt_Choc_1_copy.jpg?v=1755253547&width=1445",
      "https://fnction.co/cdn/shop/files/Calm_Box_Final_Visual_EH-01_dd15c02f-2c18-4275-8255-6c4dc1d73452.png?v=1755253547&width=1445",
      "https://fnction.co/cdn/shop/files/Calm_Box_Final_Visual_EH-02_21e3eb13-93ea-4916-ae58-374bc12ad0c6.png?v=1755253547&width=1445",
    ],
    description: "The ultimate way to begin your nightly ritual - complete starter bundle",
    fullDescription: "The ultimate way to begin your nightly ritual. This premium starter pack includes everything you need to establish the perfect bedtime routine with CALM. Clinically formulated to support restful recovery, deep sleep, and immune health with 14 key vitamins & minerals, marine collagen, reishi mushroom, and ashwagandha.",
    badge: "Value Pack",
    category: "Rest & Recovery",
    flavor: "Salted Chocolate",
    packSize: "Complete Bundle",
    nutritionalClaims: ["High Protein", "High Fibre", "Low Sugar", "Low Fat"],
    ingredients: [
      { name: "Marine Collagen", amount: "10,000mg" },
      { name: "Vitamin C", amount: "100mg" },
      { name: "Vitamin B6", amount: "2.45mg" },
      { name: "Vitamin B12", amount: "10µg" },
      { name: "Copper", amount: "0.24mg" },
      { name: "Pink Himalayan Salt", amount: "200mg" },
      { name: "Magnesium Bisglycinate", amount: "112.5mg" },
      { name: "L-Glutamine", amount: "4,200mg" },
      { name: "L-Glycine", amount: "3,000mg" },
      { name: "L-Theanine (from green tea)", amount: "100mg" },
      { name: "Ashwagandha Root 10:1 Extract", amount: "3,000mg" },
      { name: "Chamomile Flower 5:1 Extract", amount: "167mg" },
      { name: "Blue Passion Flower 4:1 Extract", amount: "60mg" },
      { name: "Reishi Mushroom 4:1 Extract", amount: "100mg" },
    ],
    nutritionalInfo: {
      servingSize: "26g",
      energy: "260 kJ / 62 kcal",
      fat: "<0.7g",
      saturates: "0.4g",
      carbohydrates: "2.2g",
      sugars: "0.1g",
      fiber: "2.0g",
      protein: "11g",
      salt: "0.2g",
    },
    features: [
      "Restful Sleep — Reishi mushroom & magnesium ease you into deeper rest",
      "Recovery & Repair — 10g marine collagen supports skin, joint, and muscle health overnight",
      "Stress Support — Ashwagandha helps regulate cortisol and calm the mind",
      "Immune Boost — Vitamin C, D, zinc, and other nutrients strengthen immune defence",
    ],
    includes: [
      "CALM — 30 Servings (Salted Chocolate Flavour)",
      "FNCTION Double-Walled Glass — Premium insulated glass",
      "Rechargeable FNCTION Frother — USB-rechargeable for perfect frothy drinks",
      "The Ritual Card — Science-backed steps to maximise CALM's effects",
      "Premium FNCTION Welcome Box — Matte black, magnetic-close presentation box",
    ],
  },
  {
    id: "focus",
    name: "FOCUS (4PK)",
    brand: "F+NCTION",
    price: 16.00,
    image: "https://fnction.co/cdn/shop/files/Fnction_RTD_DEV_EHxTR-06.png?v=1753116501&width=800",
    images: [
      "https://fnction.co/cdn/shop/files/Fnction_RTD_DEV_EHxTR-06.png?v=1753116501&width=1445",
      "https://fnction.co/cdn/shop/files/IMG_3653.jpg?v=1753116501&width=1445",
      "https://fnction.co/cdn/shop/files/4_pack_focus.png?v=1753116501&width=1445",
      "https://fnction.co/cdn/shop/files/IMG_3651.jpg?v=1752599613&width=1445",
    ],
    description: "Optimal Brain Performance Vitamin Drink - 4x 250ml Ready-to-Drink Cans",
    fullDescription: "Our Morning Cognitive Enhancement Supplement is a revolutionary blend designed to kickstart your day with a powerful formula that boosts brain function, focus, and provides an energised start. With Marine Collagen for skin, joint and muscle repair. Still in development - coming soon!",
    badge: "Coming Soon",
    category: "Focus & Energy",
    flavor: "Raspberry Lemonade",
    packSize: "4x 250ml Cans",
    nutritionalClaims: ["High Protein", "Zero Sugar", "Low Fat"],
    ingredients: [
      { name: "Marine Collagen", amount: "10,000mg" },
      { name: "Vitamin C", amount: "280mg" },
      { name: "Vitamin B12", amount: "12.5µg" },
      { name: "Vitamin D3", amount: "25µg" },
      { name: "Vitamin B6", amount: "1.75mg" },
      { name: "Magnesium", amount: "188mg" },
      { name: "Potassium", amount: "300mg" },
      { name: "Pink Himalayan Salt", amount: "280mg" },
      { name: "Zinc", amount: "11mg" },
      { name: "Folic Acid", amount: "400µg" },
      { name: "Taurine", amount: "1,000mg" },
      { name: "N-Acetyl L-Tyrosine", amount: "500mg" },
      { name: "Citicoline CDP-Choline", amount: "250mg" },
      { name: "Natural Caffeine (from Coffee Extract)", amount: "100mg" },
      { name: "L-Theanine (from Green Tea Extract)", amount: "100mg" },
      { name: "Panax Ginseng 10:1 Extract", amount: "300mg" },
      { name: "Lion's Mane Mushroom 5:1 Extract", amount: "2,000mg" },
      { name: "Cordyceps Mushroom 4:1 Extract", amount: "400mg" },
      { name: "Chaga Mushroom 4:1 Extract", amount: "400mg" },
    ],
    nutritionalInfo: {
      servingSize: "16.5g",
      energy: "9kJ / 2kcal",
      fat: "<0.1g",
      saturates: "0g",
      carbohydrates: "0.5g",
      sugars: "0g",
      fiber: "0g",
      protein: "11g",
      salt: "0.28g",
    },
    features: [
      "Boosts brain function and mental clarity",
      "Natural caffeine from coffee extract (100mg)",
      "Lion's Mane mushroom for cognitive enhancement",
      "10g Marine Collagen for skin, joint & muscle repair",
      "Convenient ready-to-drink format",
      "Zero sugar formula",
      "30 day money-back guarantee",
    ],
  },
];

export const getFnctionProductBySlug = (slug: string): FnctionProduct | undefined => {
  return fnctionProducts.find((product) => product.id === slug);
};
