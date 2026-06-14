# Project.918 Website

Clean static storefront for project918.store.

## Files

- `index.html` — landing page, product grid, cart drawer, BMC widget checkout
- `faq.html` — how to order + shipping countries
- `products.js` — product database. Add/edit products here.
- `assets/css/styles.css` — full site styling
- `assets/js/app.js` — product/cart/checkout behavior
- `assets/js/faq.js` — shipping country list
- `CNAME` — custom domain for GitHub Pages
- `_headers` / `_redirects` — Cloudflare Pages config

## Add a product

Open `products.js` and copy one product block:

```js
{
  id: "new-product-id",
  name: "Product Name",
  price: 36,
  currency: "$",
  category: "Tops",
  colorOptions: ["Black"],
  sizeOptions: ["S", "M", "L", "XL", "2XL"],
  frontImage: "FRONT_IMAGE_URL",
  backImage: "BACK_IMAGE_URL",
  description: "Short product text.",
  active: true
}
```

## Important BMC limitation

The cart copies the full order details to the customer's clipboard and opens the BMC widget. The customer must enter the exact total in BMC and paste the order details into the message box.

BMC support widget does not let a static website force the payment amount automatically.

## GitHub Pages setup

1. Create a GitHub repository named `project918` or any name you want.
2. Upload all files in this folder to the repository root.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Save.
6. Your temporary URL will look like:
   `https://YOURUSERNAME.github.io/project918/`

### Custom domain on GitHub Pages

1. In GitHub Pages settings, add:
   `project918.store`
2. In your domain DNS, add:
   - `CNAME` record for `www` → `YOURUSERNAME.github.io`
   - For apex/root domain, follow GitHub Pages DNS instructions or use Cloudflare flattening.
3. Keep the `CNAME` file in this repo.

## Cloudflare Pages setup

1. Push the project to GitHub.
2. Go to Cloudflare Dashboard → Workers & Pages → Pages.
3. Click **Create application** → **Pages** → connect GitHub repo.
4. Build settings:
   - Framework preset: `None`
   - Build command: leave empty
   - Build output directory: `/`
5. Deploy.
6. Add custom domain:
   `project918.store`

Cloudflare Pages will use `_headers` and `_redirects` automatically.
