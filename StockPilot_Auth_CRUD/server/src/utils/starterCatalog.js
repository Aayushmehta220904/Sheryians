import { Product } from "../models/Product.js";

const starterProducts = [
  {
    name: "AeroPulse ANC Headphones",
    description: "Over-ear wireless headphones with active noise cancellation, long battery life and a comfortable travel-first fit.",
    category: "Audio",
    price: 8999,
    stock: 18,
    imageUrl: "",
  },
  {
    name: "NovaKey Mechanical Keyboard",
    description: "Compact mechanical keyboard with hot-swappable switches, tactile feedback and a clean desk-friendly layout.",
    category: "Accessories",
    price: 5499,
    stock: 24,
    imageUrl: "",
  },
  {
    name: "Orbit 4K Webcam",
    description: "Sharp 4K webcam with auto framing, dual microphones and reliable low-light performance for meetings and streaming.",
    category: "Cameras",
    price: 7499,
    stock: 9,
    imageUrl: "",
  },
  {
    name: "FluxCharge 100W GaN",
    description: "Compact 100W GaN wall charger with multiple USB-C ports for laptops, tablets, phones and everyday carry.",
    category: "Power",
    price: 3999,
    stock: 31,
    imageUrl: "",
  },
  {
    name: "Vector Pro Wireless Mouse",
    description: "Precision wireless mouse with programmable controls, ergonomic shaping and multi-device connectivity.",
    category: "Accessories",
    price: 3299,
    stock: 15,
    imageUrl: "",
  },
  {
    name: "SlateBook Stand",
    description: "Adjustable aluminium laptop stand designed to improve desk ergonomics while keeping airflow unobstructed.",
    category: "Workspace",
    price: 2199,
    stock: 27,
    imageUrl: "",
  },
  {
    name: "EchoMini Bluetooth Speaker",
    description: "Portable Bluetooth speaker with balanced sound, splash resistance and enough battery for a full day outdoors.",
    category: "Audio",
    price: 2799,
    stock: 5,
    imageUrl: "",
  },
  {
    name: "PixelDock USB-C Hub",
    description: "Seven-in-one USB-C hub with HDMI, card reader, data ports and pass-through charging for modern laptops.",
    category: "Connectivity",
    price: 4499,
    stock: 12,
    imageUrl: "",
  },
  {
    name: "LumaDesk Monitor Light",
    description: "Screen-mounted desk light with adjustable brightness and colour temperature for comfortable late-night work.",
    category: "Workspace",
    price: 1899,
    stock: 4,
    imageUrl: "",
  },
  {
    name: "VaultDrive Portable SSD",
    description: "Fast portable solid-state drive with USB-C connectivity and a durable compact enclosure for everyday backups.",
    category: "Storage",
    price: 6999,
    stock: 20,
    imageUrl: "",
  },
];

export async function ensureStarterCatalog(ownerId) {
  if (process.env.SEED_STARTER_PRODUCTS === "false") return false;

  const existingProducts = await Product.estimatedDocumentCount();
  if (existingProducts > 0) return false;

  await Product.insertMany(starterProducts.map((product) => ({ ...product, owner: ownerId })));
  return true;
}
