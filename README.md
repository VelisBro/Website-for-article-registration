# Website-for-article-registration

Next.js 16 project for the IU-5 department website.

## Local run

Install dependencies if they are missing:

```bash
npm install
```

Start the app:

```bash
npm run dev
```

If port `3000` is already occupied or serves an empty page from another local server, run:

```bash
npm run dev:local
```

Then open:

- `http://localhost:3000`
- `http://localhost:3001` for `dev:local`

## Important note

The `frontend/` folder does not contain the real site entry point. The actual application lives in the `app/` directory and must be started through Next.js.
