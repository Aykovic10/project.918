# Project.918 Storefront

Clean static storefront for Project.918 with product pages, checkout page, FAQ, and Buy Me a Coffee payment widget.

## What changed in this version

- No product popup modal.
- No cart sidebar/drawer.
- Product cards open real product pages.
- Customer picks size/color/quantity, then goes to checkout page.
- Checkout page collects shipping/contact info.
- BMC widget opens only from the checkout page.
- `/faq/` is a real folder route, so `/faq` should work on Cloudflare Pages.
- Products are managed from `products.js`.

## Edit products

Open `products.js` and add/edit product objects inside `window.PROJECT918_PRODUCTS`.

Each product needs:

```js
{
  id: "unique-product-id",
  name: "Product Name",
  price: 36,
  color: "Black",
  colors: ["Black"],
  sizes: ["S", "M", "L", "XL", "2XL"],
  description: "Short product description.",
  frontImage: "FRONT_IMAGE_URL",
  backImage: "BACK_IMAGE_URL",
  active: true
}
```

## Deploy on Cloudflare Pages

1. Upload this folder to your GitHub repo root.
2. Cloudflare → Workers & Pages → Pages/Static project → connect GitHub repo.
3. Build settings:
   - Framework preset: None
   - Build command: leave empty
   - Build output directory: `/`
4. Deploy.
5. Add custom domain `project918.store` and `www.project918.store` under Domains & Routes / Custom domains.

## Important BMC limitation

BMC support widget does not let this website force the exact amount automatically. The checkout page copies order details and asks the customer to enter the total in BMC and paste the order details in the message box.
