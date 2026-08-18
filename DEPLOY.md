# KiTi-Bat — hosting on Vercel

The site is live on Vercel and building from the `site/` folder.

- **Live now:** https://kiti-bats.vercel.app
- **Project:** `kiti-bats` under `louise-du-plessis-projects`
- **Domain to attach:** www.kiti-bats.co.za (already added to the project — it
  just needs DNS pointed at Vercel)

## Pointing the domain (done at xneelo, in konsoleH)

The domain is registered with xneelo and its DNS still points at the old site
(41.203.18.177). Two records need to change in konsoleH → DNS management:

| Type | Name | Value |
|---|---|---|
| A | `@` (or `kiti-bats.co.za`) | `76.76.21.21` |
| A | `www` | `76.76.21.21` |

A CNAME on `www` pointing to `cname.vercel-dns.com` also works and is slightly
better, but xneelo's panel does not always allow it — the A record above is fine.

**Leave the MX records alone.** `kiti-bats.co.za` currently has mail on
`mail.kiti-bats.co.za`. Changing the A records moves only the website; touching
the MX records would break email.

DNS changes usually take 15 minutes to a few hours. Vercel issues the HTTPS
certificate automatically once it sees the records, so there is nothing to
install — https:// will simply start working.

To check progress:

```bash
vercel domains inspect www.kiti-bats.co.za
```

### There is an old site on that domain

`www.kiti-bats.co.za` currently serves a placeholder page from December 2021.
Once DNS is repointed, that page is gone from public view. It stays on the
xneelo server, so nothing is destroyed — but take a copy first if it matters.

## Deploying changes

From the project folder:

```bash
cd site && vercel deploy --prod
```

That uploads whatever is in `site/` and makes it live. There is no build step.

To publish a test version first (a private URL, nothing public changes):

```bash
cd site && vercel deploy
```

## One rule when editing CSS or JavaScript

If you change `assets/css/style.css` or `assets/js/main.js`, the `?v=` number in
every page must change too, or returning visitors keep seeing the old file. Run
this from the project folder before deploying:

```bash
python3 - <<'PY'
import pathlib, re, hashlib
site = pathlib.Path("site")
cv = hashlib.sha1((site/"assets/css/style.css").read_bytes()).hexdigest()[:8]
jv = hashlib.sha1((site/"assets/js/main.js").read_bytes()).hexdigest()[:8]
for f in site.glob("*.html"):
    s = f.read_text()
    s = re.sub(r'(href="/assets/css/style\.css)(\?v=[a-f0-9]+)?"', rf'\1?v={cv}"', s)
    s = re.sub(r'(src="/assets/js/main\.js)(\?v=[a-f0-9]+)?"', rf'\1?v={jv}"', s)
    f.write_text(s)
print("updated to", cv, jv)
PY
```

## How the URLs work

`vercel.json` turns on clean URLs, so pages have no `.html` on the end:

| File | Address |
|---|---|
| `index.html` | `/` |
| `kiti-bat.html` | `/kiti-bat` |
| `kiti-junior.html` | `/kiti-junior` |
| `catch-it-trainer.html` | `/catch-it-trainer` |
| `about.html` | `/about` |
| `order.html` | `/order` |
| `404.html` | shown for any address that does not exist |

Assets are cached for a year (they are versioned), pages are re-checked on every
visit, so content edits appear immediately after a deploy.

## After the domain is live

Add the site to Google Search Console (search.google.com/search-console),
verify it, and submit `https://www.kiti-bats.co.za/sitemap.xml`.

## Contact details on the site

Nico Botha — 082 824 2213 — bothanic@gmail.com — Johannesburg.
Instagram `@catch_it_trainer`, Facebook `/cathittrainer`.
These appear in every footer and on the order page.
