# liker.land — static redirector

liker.land has been retired. The Nuxt application, its three Cloud Functions
(`ssrapp`, `api`, `pubsub`) and the `api.like.co` integrations that went with
them are gone. What remains is a Firebase Hosting site whose only job is to
`301` every incoming URL to its nearest equivalent on
[3ook.com](https://3ook.com).

The entire configuration is [`firebase.json`](firebase.json). There is no build
step, no `node_modules`, and nothing to run locally.

## How the redirect table works

liker.land served every route under a locale prefix (`strategy: 'prefix'`, with
`en` and `zh-Hant`), and the app itself redirected bare `/store` to
`/zh-Hant/store` at runtime. That runtime hop died with the app, so the table
has to resolve bare, `/en/…` and `/zh-Hant/…` forms on its own.

3ook.com is the mirror image: `zh-Hant` is its default locale and is served
*unprefixed*, English lives under `/en/…`. So each route family needs two rules:

| liker.land | 3ook.com |
| --- | --- |
| `/en/<path>` | `https://3ook.com/en/<dest>` |
| `/zh-Hant/<path>` or bare `/<path>` | `https://3ook.com/<dest>` |

The second case is one rule, not two, because the regex makes the prefix
optional: `^(?:/zh-Hant)?/about(?:/.*)?$`.

Rules are evaluated **top to bottom, first match wins**, so the two catch-alls
must stay last. Specific families (`about`, `civic`, `settings`, the shelf
group) come first, and two regex rules preserve deep links that still resolve on
3ook.com:

- `/…/nft/class/0x…` → `https://3ook.com/store/0x…` — EVM book permalinks
- `/…/0x<40 hex>` → `https://3ook.com/store?owner_wallet=0x…` — EVM portfolios

Legacy Cosmos identifiers (`likenft1…`, `like1…`, ISCN IDs) have no equivalent
on 3ook.com and deliberately fall through to `/store`.

`/creators` is the one route that does not go to 3ook.com — it keeps pointing at
the Civic Liker guide on `docs.like.co`, which is still live.

Every 3ook.com destination carries `utm_source=likerland`, matching the
convention the application used before it was removed.

## Things that no longer work, on purpose

Firebase evaluates `redirects` **before** static content and offers no way to
exempt a path, so the final `**` rule shadows everything else on the domain:

- `robots.txt` — redirects to 3ook.com. Google follows robots.txt redirects and
  applies the target's rules, so crawling stays permitted.
- `sitemap.xml` — was generated per-request by `ssrapp`; it no longer exists.
- `.well-known/apple-developer-merchantid-domain-association` — Apple Pay
  verification, only ever needed for Stripe checkout on liker.land.
- `.well-known/apple-app-site-association` and `.well-known/assetlinks.json` —
  Firebase-generated universal/app-link associations claiming liker.land URLs
  for the 3ook mobile app (`land.liker.book3app`). Legacy links now open the
  browser and follow the `301` instead of opening the app directly; 3ook.com
  serves its own associations for links on that domain.

## Deploying

Pushing to `deploy/main` deploys to the `civic-liker` Firebase project;
`deploy/sepolia` deploys to `civic-liker-sepolia`. Both run
`firebase deploy --only hosting` — scoped to `hosting` so a deploy can never
implicitly add or remove Cloud Functions.

Note that `firebase.json` hardcodes production `3ook.com` destinations, so the
sepolia environment verifies redirect *mechanics* (matching, ordering, status
codes) rather than testnet destinations.

To check a change before shipping it:

```bash
for p in / /en/store /zh-Hant/about /en/civic /en/settings/email \
         /en/nft/class/0x1234567890abcdef1234567890abcdef12345678 \
         /en/0x1234567890123456789012345678901234567890 /robots.txt; do
  printf '%-60s ' "$p"
  curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' "https://liker.land$p"
done
```

Every line should be `301`, with English paths landing on `3ook.com/en/…` and
everything else on `3ook.com/…`. Assert the `Location`, not just the status — a
rule that fails to match silently falls through to a catch-all and looks almost
right.

## Changelog

Please read the changelog [here](CHANGELOG.md).
