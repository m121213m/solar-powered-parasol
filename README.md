# solar-powered-parasol
Innovation Group builds modular outdoor power + comfort products for campers, beachgoers, and tour operators. - Values: durability, safety (BMS protections), user-first design.

## Updating imagery and branding

Follow the steps below to swap in your own visuals for the storefront.

### Header logo

1. Open `index.html` and locate the header anchor that currently renders the text logo: `<a href="#top" class="logo">Innovation Group</a>`.
2. Replace the anchor contents with an `<img>` tag pointing to your asset, for example:
   ```html
   <a href="#top" class="logo">
     <img src="assets/images/innovation-group-logo.svg" alt="Innovation Group logo" />
   </a>
   ```
3. Save your logo file inside `assets/images/` (see **Uploading images from your computer** below) and reference it with a relative path such as `assets/images/innovation-group-logo.svg`.
4. Keep the `logo` class on the anchor—`assets/css/style.css` defines responsive sizing so any inline SVG/PNG up to ~2rem tall will align with the navigation.【F:assets/css/style.css†L61-L72】
5. Update the organization schema logo URL near the end of `index.html` if you host the logo at a new location (`<script type="application/ld+json">` block).【F:index.html†L348-L379】

### Product detail gallery

1. In `index.html`, find the `<section id="product-parasol" …>` block.
2. Replace the `<img>` `src` values inside the `.detail-gallery` container with your preferred product shots. Provide descriptive `alt` text for accessibility.【F:index.html†L132-L176】

### Shop listing thumbnails (accessories & parasol)

1. Open `assets/js/main.js` and adjust the `image` property for each object in the `products` array (parasol, fan, LED, battery).【F:assets/js/main.js†L1-L38】
2. Image paths default to local files inside `assets/images/`; drop your JPG/PNG/WebP files there and reference them with a relative path (for example, `assets/images/parasol-card.jpg`).
3. Each product also includes a `fallbackImage` URL. If you do not replace the local file, the storefront automatically loads the fallback stock photo so the layout never breaks.

### Hero, bundle, and other section images

1. Still in `index.html`, update the `src` attribute of the `<img>` tags in the hero, bundle, and any other visual blocks you want to customize (look for classes such as `.hero-visual` and `.bundle-visual`).【F:index.html†L32-L116】
2. Store the new files in `assets/images/` and reference them with a relative path (for example, `assets/images/hero.jpg`). Every image also defines a `data-fallback` attribute pointing to a hosted stock photo—if your local file is missing, the browser automatically swaps to the fallback.
3. The current markup already includes `loading="lazy"`; swapping the URLs is sufficient.

### Uploading images from your computer

1. Open the project folder on your machine and place your image assets (hero photos, product shots, logos) inside `assets/images/`.
2. Keep intuitive filenames (e.g., `hero.jpg`, `bundle.jpg`, `parasol-gallery-1.jpg`) so they match the default paths already referenced in the HTML and JavaScript.
3. If you prefer different filenames, update the corresponding `src` attributes in `index.html` and the `image` fields in `assets/js/main.js` to point to your files.
4. No build step is required—once the files are inside `assets/images/`, reload the page in your browser to see them.

### Tips

- Prefer compressed JPG/WebP assets served from your domain or a CDN to maintain performance.
- When replacing any image, keep meaningful `alt` text to preserve accessibility.
- If you add new local assets, store them under `assets/images/` (create the folder if needed) and update paths accordingly.
