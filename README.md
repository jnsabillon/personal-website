# Jackie Sabillon - Personal Portfolio

A minimal, single-page personal bio site, inspired by the calm, single-column
aesthetic of [drocarmo.com](https://drocarmo.com/). Built with plain
HTML, CSS, and a small amount of JavaScript - no build step required.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The page markup (greeting, bio, photo gallery, contact footer) |
| `styles.css` | Theme, typography, layout, responsive photo grid, lightbox |
| `script.js` | Subtle scroll fade-in + accessible photo lightbox |
| `images/` | Personality photos (`portrait.png`, `friends.png`, `wedding.png`) |

## Preview locally

Because everything is static, you can just open the file:

```bash
open index.html
```

Or serve it (recommended, so relative paths behave like in production):

```bash
# Python 3
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Customizing

### Swap or add photos

The page shows three photos in `images/` (`portrait.png`, `friends.png`,
`wedding.png`) as a scattered, overlapping snapshot collage to the left of the
bio. To change them:

1. Drop your images into the `images/` folder, ideally with a new filename so
   browsers do not serve a stale cached version.
2. In `index.html`, update the matching `<img src="images/...">` inside the
   `.collage` section to point at your file.
3. Update the `alt` text to accurately describe each photo for accessibility.

Square images look best, since each frame uses a 1:1 aspect ratio and
`object-fit: cover`. The source photos are scaled up slightly (`transform:
scale(1.14)` on `.snap__frame img` in `styles.css`) to crop out a baked-in gray
border; if your photos have no border, set that scale back to `1`. Position and
rotation of each photo live in the `.snap--portrait` / `.snap--friends` /
`.snap--wedding` rules.

### Update contact links

In `index.html`, edit the `.contact__links` list:

- Replace `hello@example.com` in the `mailto:` link with your real email.
- Replace the LinkedIn `href` with your profile URL.
- Add or remove `<li>` items for other links (Instagram, X, etc.).

### Tweak the look

Colors, fonts, and spacing live in the `:root` variables at the top of
`styles.css` (e.g. `--bg`, `--ink`, `--accent`, `--max-width`).

## Deploying

Any static host works - GitHub Pages, Netlify, Vercel, Cloudflare Pages.
Just publish the folder; `index.html` is the entry point.
