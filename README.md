# Infinite AI Income

Recovered standalone funnel for `infiniteaiincome.com`, with an NMI-hosted-fields checkout.

## Recovered public flow

1. `/fe1` — opt-in VSL and lead form
2. `/fe2` — sales VSL and $67 offer
3. `/checkout` — replacement NMI checkout
4. `/thankyou` — order confirmation
5. `/refund-policy`, `/ftc`, `/earnings-disclaimer` — recovered policy pages

The original Explodely checkout is intentionally replaced. Original public videos remain embedded from their recovered HLS sources; offline recovery copies are excluded from Git because of GitHub's file-size limits.

## Required deployment variables

Copy `.env.example` and configure a database dedicated to this offer plus its NMI keys. Use NMI sandbox credentials until a complete test order passes.

```text
DATABASE_URL=
NMI_ENV=sandbox
NMI_PUBLIC_KEY=
NMI_PRIVATE_KEY=
SESSION_SECRET=
```

Run locally with `npm install` and `npm start`.
