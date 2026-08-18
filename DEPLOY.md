# Putting the KiTi-Bat site live on xneelo

Everything that goes on the server is in the `site/` folder. Nothing needs to be
built or compiled — it is plain HTML, CSS, JavaScript, images and video.

## What to upload

Upload **the contents of `site/`** (not the folder itself) into the web root on
xneelo. On xneelo shared hosting that is usually:

```
/home/<your-account>/public_html/
```

So `index.html` must end up at `public_html/index.html`, and the assets at
`public_html/assets/...`.

**Include the hidden `.htaccess` file.** Most FTP clients hide dotfiles by
default — switch on "show hidden files" before you upload, or the caching,
compression and the 404 page will not work.

### Ways to upload

- **xneelo File Manager** (konsoleH → Web Hosting → File Manager). Easiest for a
  one-off: upload `kiti-bat-site.zip` and extract it in `public_html`.
- **FTP/SFTP client** such as FileZilla or Cyberduck, using the FTP details from
  konsoleH. Drag the contents of `site/` into `public_html`.

## After the first upload

1. **Check it loads** at your domain, and click through all six pages.
2. **Turn on SSL** in konsoleH (xneelo includes a free Let's Encrypt
   certificate). Once the certificate is active, open `.htaccess` and uncomment
   the HTTPS redirect block near the top so `http://` visitors are sent to
   `https://`.
3. **Add the sitemap line** to `robots.txt` once the domain is confirmed, and
   upload `sitemap.xml`.
4. **Submit to Google** at search.google.com/search-console — add the property,
   verify it, and submit the sitemap.

## Making changes later

Edit the files in `site/`, then re-upload only what changed.

One rule: **if you change `style.css` or `main.js`, the `?v=` number in every
HTML page must change too.** That number is what forces browsers to fetch the
new file instead of showing a visitor the old cached one. Run this from the
project folder and it updates every page for you:

```bash
python3 - <<'PY'
import pathlib, re, hashlib
site = pathlib.Path("site")
cv = hashlib.sha1((site/"assets/css/style.css").read_bytes()).hexdigest()[:8]
jv = hashlib.sha1((site/"assets/js/main.js").read_bytes()).hexdigest()[:8]
for f in site.glob("*.html"):
    s = f.read_text()
    s = re.sub(r'(href="/?assets/css/style\.css)(\?v=[a-f0-9]+)?"', rf'\1?v={cv}"', s)
    s = re.sub(r'(src="/?assets/js/main\.js)(\?v=[a-f0-9]+)?"', rf'\1?v={jv}"', s)
    f.write_text(s)
print("updated to", cv, jv)
PY
```

## What is on each page

| File | Page |
|---|---|
| `index.html` | Home — the range, how it works, workshop, Catch-It |
| `kiti-bat.html` | KiTi-Bat, 45 × 7 cm, American poplar, R350 |
| `kiti-junior.html` | KiTi Junior, 30 × 11 cm, SA pine ply, R165 |
| `catch-it-trainer.html` | Catch-It Trainer, R2 000 |
| `about.html` | Our story, Nico, the workshop |
| `order.html` | Price list, bulk, delivery, contact |
| `404.html` | Shown for any broken or mistyped link |

## Contact details on the site

Nico Botha — 082 824 2213 — bothanic@gmail.com — Johannesburg.
Instagram `@catch_it_trainer`, Facebook `/cathittrainer`.
These appear in every page footer and on the order page, so if anything changes,
search and replace across `site/*.html`.
