import logo from "./logo.png";
import search_icon from "./search_icon.svg";
import remove_icon from "./remove_icon.svg";
import arrow_right_icon_colored from "./arrow_right_icon_colored.svg";
import star_icon from "./star_icon.svg";
import star_dull_icon from "./star_dull_icon.svg";
import cart_icon from "./cart_icon.svg";
import nav_cart_icon from "./nav_cart_icon.svg";
import add_icon from "./add_icon.svg";
import refresh_icon from "./refresh_icon.svg";
import product_list_icon from "./product_list_icon.svg";
import order_icon from "./order_icon.svg";
import upload_area from "./upload_area.png";
import profile_icon from "./profile_icon.png";
import menu_icon from "./menu_icon.svg";
import delivery_truck_icon from "./delivery_truck_icon.svg";
import leaf_icon from "./leaf_icon.svg";
import coin_icon from "./coin_icon.svg";
import box_icon from "./box_icon.svg";
import trust_icon from "./trust_icon.svg";
import black_arrow_icon from "./black_arrow_icon.svg";
import white_arrow_icon from "./white_arrow_icon.svg";
import main_banner_bg from "./main_banner_bg.png";
import main_banner_bg_sm from "./main_banner_bg_sm.png";
import bottom_banner_image from "./bottom_banner_image.png";
import bottom_banner_image_sm from "./bottom_banner_image_sm.png";
import add_address_iamge from "./add_address_image.svg";

import original_artwork_image from "./originalartwork.png";
import refurbished_tech_image from "./refurbished-tech.png";
import vintage_finds_image from "./vintage-finds.png";
import home_decor_image from "./home-decor.png";
import creative_supplies_image from "./creative-supplies.png";
import collector_picks_image from "./collectors-picks.png";
import everyday_essentials_image from "./everyday-essentials.png";

export const assets = {
  logo,
  search_icon,
  remove_icon,
  arrow_right_icon_colored,
  star_icon,
  star_dull_icon,
  cart_icon,
  nav_cart_icon,
  add_icon,
  refresh_icon,
  product_list_icon,
  order_icon,
  upload_area,
  profile_icon,
  menu_icon,
  delivery_truck_icon,
  leaf_icon,
  coin_icon,
  trust_icon,
  black_arrow_icon,
  white_arrow_icon,
  main_banner_bg,
  main_banner_bg_sm,
  bottom_banner_image,
  bottom_banner_image_sm,
  add_address_iamge,
  box_icon,
};

export const categories = [
  {
    text: "Original Artwork",
    path: "original-artwork",
    image: original_artwork_image,
    bgColor: "#FEF6DA",
  },
  {
    text: "Refurbished Tech",
    path: "refurbished-tech",
    image: refurbished_tech_image,
    bgColor: "#FEE0E0",
  },
  {
    text: "Vintage Finds",
    path: "vintage-finds",
    image: vintage_finds_image,
    bgColor: "#F0F5DE",
  },
  {
    text: "Home Decor",
    path: "home-decor",
    image: home_decor_image,
    bgColor: "#E1F5EC",
  },
  {
    text: "Creative Supplies",
    path: "creative-supplies",
    image: creative_supplies_image,
    bgColor: "#FEE6CD",
  },
  {
    text: "Collector Picks",
    path: "collector-picks",
    image: collector_picks_image,
    bgColor: "#E0F6FE",
  },
  {
    text: "Everyday Essentials",
    path: "everyday-essentials",
    image: everyday_essentials_image,
    bgColor: "#F1E3F9",
  },
];

export const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { text: "Home", url: "/" },
      { text: "Browse Collection", url: "/products" },
      { text: "Contact Us", url: "/contact" },
      { text: "FAQs", url: "/faqs" },
    ],
  },
  {
    title: "Need help?",
    links: [
      { text: "Return & Refund Policy", url: "/return-policy" },
      { text: "Contact Us", url: "/contact" },
    ],
  },
  {
    title: "Follow Us",
    links: [
      { text: "Telegram", url: "" },
      { text: "Twitter", url: "" },
      { text: "Linkedin", url: "" },
    ],
  },
];

export const features = [
  {
    icon: delivery_truck_icon,
    title: "Fast Dispatch",
    description: "Orders are packed and shipped quickly with live updates.",
  },
  {
    icon: leaf_icon,
    title: "Condition Checked",
    description: "Art and refurbished items are reviewed before listing.",
  },
  {
    icon: coin_icon,
    title: "Fair Pricing",
    description: "Transparent pricing for unique pieces and restored products.",
  },
  {
    icon: trust_icon,
    title: "Trusted Marketplace",
    description: "Built for buyers who value quality, style, and reliability.",
  },
];
