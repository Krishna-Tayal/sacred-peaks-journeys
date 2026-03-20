export interface Destination {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  thumbnailImage: string;
  bestTimeToVisit: string;
  altitude: string;
  gallery: string[];
  galleryImages: string[];
}

export interface TravelPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  destinationIds: string[];
  facilities: string[];
  description: string;
  image: string;
  thumbnailImage: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  travelDate: string;
  travelers: number;
  packageId: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar: string;
}

const placeholders = [
  "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
];

export const destinations: Destination[] = [
  {
    id: "1",
    name: "Kedarnath",
    slug: "kedarnath",
    shortDescription: "Holy temple in Himalayas",
    description: "A sacred pilgrimage.",
    image: placeholders[0],
    thumbnailImage: placeholders[1],
    bestTimeToVisit: "May-October",
    altitude: "3583m",
    gallery: [placeholders[0], placeholders[1], placeholders[2]],
    galleryImages: [placeholders[0], placeholders[1], placeholders[2]],
  },
  {
    id: "2",
    name: "Badrinath",
    slug: "badrinath",
    shortDescription: "Sacred Vishnu temple.",
    description: "A Char Dham site.",
    image: placeholders[1],
    thumbnailImage: placeholders[2],
    bestTimeToVisit: "May-November",
    altitude: "3133m",
    gallery: [placeholders[1], placeholders[2], placeholders[3]],
    galleryImages: [placeholders[1], placeholders[2], placeholders[3]],
  },
];

export const packages: TravelPackage[] = [
  {
    id: "1",
    name: "Char Dham Yatra",
    price: 25999,
    duration: "12 Days",
    destinationIds: ["1", "2"],
    facilities: ["Hotel", "Meals", "Transport"],
    description: "Complete Char Dham package.",
    image: placeholders[0],
    thumbnailImage: placeholders[1],
  },
];

export const testimonials: Testimonial[] = [
  { id: "1", name: "Rajesh", location: "Delhi", text: "Great journey!", rating: 5, avatar: "RS" },
];

export const galleryImages = [
  { id: "1", src: placeholders[0], alt: "Mountain" },
  { id: "2", src: placeholders[1], alt: "Temple" },
];
