/*
  PROJECT.918 PRODUCT DATABASE

  To add a product:
  1) Copy one product block.
  2) Change id, name, price, images, sizes/colors.
  3) Save + push to GitHub/Cloudflare.
*/

const SITE_CONFIG = {
  brandName: "project.918",
  instagramUrl: "https://instagram.com/project.918",
  logoUrl: "https://i.ibb.co/zWGZfVTF/textlogo-D.png",
  faviconUrl: "https://cdn.buymeacoffee.com/uploads/profile_pictures/2025/06/c0781a21d7ef67a74375c422ce5d52f8.png@300w_0e.webp",

  // Hero/header image area. You can replace these later with a real editorial/header image.
  hero: {
    eyebrow: "DROP 01",
    title: "SPORT ICONS REWORKED",
    subtitle: "Clean graphic tees inspired by championship moments. Free worldwide shipping.",
    imageLeft: "https://files.tapstitch.com/hugepod/material/custom_printing/4cbae2cf54ec474d892bb8596343b534.png?x-oss-process=style/hugepod-product-webp",
    imageRight: "https://files.tapstitch.com/hugepod/material/custom_printing/d228e19f6999439490b24bd1e57bc73a.png?x-oss-process=style/hugepod-product-webp"
  },

  shippingLine: "FREE WORLDWIDE SHIPPING — DISPATCHES WITHIN 10 BUSINESS DAYS",

  // BMC support widget id
  bmcId: "project.918"
};

const PRODUCTS = [
  {
    id: "jordan-97-champions-tee",
    name: "Jordan 97' Champions Tee",
    price: 36,
    currency: "$",
    category: "Tops",
    colorOptions: ["Black"],
    sizeOptions: ["S", "M", "L", "XL", "2XL"],
    frontImage: "https://files.tapstitch.com/hugepod/material/custom_printing/4cbae2cf54ec474d892bb8596343b534.png?x-oss-process=style/hugepod-product-webp",
    backImage: "https://files.tapstitch.com/hugepod/material/custom_printing/f2f069ffafea4cc492164f38b06bad09.png?x-oss-process=style/hugepod-product-webp",
    description: "Black tee with Project.918 championship artwork.",
    active: true
  },
  {
    id: "messi-23-eight-rings-tee",
    name: "Messi 23' Eight Rings Tee",
    price: 36,
    currency: "$",
    category: "Tops",
    colorOptions: ["Black"],
    sizeOptions: ["S", "M", "L", "XL", "2XL"],
    frontImage: "https://files.tapstitch.com/hugepod/material/custom_printing/d228e19f6999439490b24bd1e57bc73a.png?x-oss-process=style/hugepod-product-webp",
    backImage: "https://files.tapstitch.com/hugepod/material/custom_printing/db48d051ab7944f2ab8d3d14ec051d28.png?x-oss-process=style/hugepod-product-webp",
    description: "Black tee with Project.918 eight rings artwork.",
    active: true
  }
];
