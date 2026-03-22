import kedarnathImg from "@/assets/kedarnath.jpg";
import badrinathImg from "@/assets/badrinath.jpg";
import gangotriImg from "@/assets/gangotri.jpg";
import yamunotriImg from "@/assets/yamunotri.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";

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

export const destinations: Destination[] = [
  {
    id: "1",
    name: "Kedarnath",
    slug: "kedarnath",
    shortDescription: "One of the holiest Hindu temples dedicated to Lord Shiva, nestled in the Garhwal Himalayas.",
    description: "Kedarnath Temple is one of the twelve Jyotirlingas of Lord Shiva, located at an altitude of 3,583 meters in the Garhwal Himalayan range. The temple is believed to have been built by the Pandavas and later revived by Adi Shankaracharya. Surrounded by breathtaking snow-capped peaks and the Mandakini river, Kedarnath offers a deeply spiritual and awe-inspiring pilgrimage experience.",
    image: kedarnathImg,
    thumbnailImage: kedarnathImg,
    bestTimeToVisit: "May to June & September to October",
    altitude: "3,583 meters",
    gallery: [kedarnathImg, gallery1, gallery3],
    galleryImages: [kedarnathImg, gallery1, gallery3],
  },
  {
    id: "2",
    name: "Badrinath",
    slug: "badrinath",
    shortDescription: "Sacred temple town dedicated to Lord Vishnu, set between the Nar and Narayana mountain ranges.",
    description: "Badrinath Temple, situated along the banks of the Alaknanda River, is one of the four Char Dhams and the most important of the four sites in India's Char Dham pilgrimage. The temple is dedicated to Lord Vishnu and is believed to have been established by Adi Shankaracharya in the 8th century. The surrounding landscape of snow-covered peaks and hot springs makes it a truly divine destination.",
    image: badrinathImg,
    thumbnailImage: badrinathImg,
    bestTimeToVisit: "May to June & September to November",
    altitude: "3,133 meters",
    gallery: [badrinathImg, gallery2, gallery1],
    galleryImages: [badrinathImg, gallery2, gallery1],
  },
  {
    id: "3",
    name: "Gangotri",
    slug: "gangotri",
    shortDescription: "The origin of the holy River Ganges and one of the four Char Dham pilgrimage sites.",
    description: "Gangotri is one of the four Char Dham sites and is the origin of the River Ganges. The Gangotri Temple, dedicated to Goddess Ganga, sits at an altitude of 3,100 meters on the banks of the Bhagirathi River. According to Hindu mythology, it was here that King Bhagirath performed penance to bring the Ganges from heaven to earth. The region offers spectacular views of the Himalayan glaciers.",
    image: gangotriImg,
    thumbnailImage: gangotriImg,
    bestTimeToVisit: "May to June & September to October",
    altitude: "3,100 meters",
    gallery: [gangotriImg, gallery3, gallery2],
    galleryImages: [gangotriImg, gallery3, gallery2],
  },
  {
    id: "4",
    name: "Yamunotri",
    slug: "yamunotri",
    shortDescription: "Source of the River Yamuna and the westernmost shrine of the Char Dham pilgrimage.",
    description: "Yamunotri is the source of the River Yamuna and is one of the four sacred Char Dhams. The temple is dedicated to Goddess Yamuna and sits at an altitude of 3,293 meters. The area features hot water springs and thermal springs, including Surya Kund, where pilgrims cook rice and potatoes as prasad. The trek to Yamunotri passes through scenic forests, streams, and breathtaking mountain views.",
    image: yamunotriImg,
    thumbnailImage: yamunotriImg,
    bestTimeToVisit: "May to June & September to October",
    altitude: "3,293 meters",
    gallery: [yamunotriImg, gallery1, gallery3],
    galleryImages: [yamunotriImg, gallery1, gallery3],
  },
];

export const packages: TravelPackage[] = [
  {
    id: "1",
    name: "Complete Char Dham Yatra",
    price: 25999,
    duration: "12 Days / 11 Nights",
    destinationIds: ["1", "2", "3", "4"],
    facilities: ["Hotel Accommodation", "All Meals", "Transport", "Guide", "Puja Arrangements", "Medical Kit"],
    description: "Experience the complete sacred journey covering all four Char Dham sites with premium accommodation and expert guides.",
    image: kedarnathImg,
    thumbnailImage: kedarnathImg,
  },
  {
    id: "2",
    name: "Kedarnath & Badrinath Express",
    price: 15999,
    duration: "7 Days / 6 Nights",
    destinationIds: ["1", "2"],
    facilities: ["Hotel Accommodation", "Breakfast & Dinner", "Transport", "Guide", "Helicopter Option"],
    description: "A focused pilgrimage covering the two most popular Char Dham destinations with comfortable stay and travel.",
    image: badrinathImg,
    thumbnailImage: badrinathImg,
  },
  {
    id: "3",
    name: "Kedarnath Solo Pilgrimage",
    price: 8999,
    duration: "4 Days / 3 Nights",
    destinationIds: ["1"],
    facilities: ["Hotel Accommodation", "All Meals", "Transport", "Guide", "Pony/Palki Option"],
    description: "A dedicated Kedarnath pilgrimage with all arrangements taken care of for a peaceful spiritual experience.",
    image: gangotriImg,
    thumbnailImage: gangotriImg,
  },
  {
    id: "4",
    name: "Gangotri & Yamunotri Trek",
    price: 12999,
    duration: "6 Days / 5 Nights",
    destinationIds: ["3", "4"],
    facilities: ["Camping & Hotel", "All Meals", "Transport", "Trek Guide", "Trekking Gear"],
    description: "Combine spirituality with adventure on this trek covering Gangotri and Yamunotri with expert trekking guides.",
    image: yamunotriImg,
    thumbnailImage: yamunotriImg,
  },
];

export const galleryImages = [
  { id: "1", src: kedarnathImg, alt: "Kedarnath Temple" },
  { id: "2", src: badrinathImg, alt: "Badrinath Temple" },
  { id: "3", src: gangotriImg, alt: "Gangotri Temple" },
  { id: "4", src: yamunotriImg, alt: "Yamunotri Temple" },
  { id: "5", src: gallery1, alt: "Himalayan Prayer Flags" },
  { id: "6", src: gallery2, alt: "Sacred River" },
  { id: "7", src: gallery3, alt: "Pilgrimage Trail" },
];
