# OG Tag Validator Skill

This skill provides a systematic way to audit and validate Open Graph (OG) meta tags in a Next.js project. Proper OG tags ensure that content looks premium and engaging when shared on social media platforms like Slack, Twitter, and LinkedIn.

## Core Requirements

Every public-facing page should ideally have the following Open Graph tags:

1.  **og:title**: The title of the page or specific content.
2.  **og:description**: A concise summary (120-160 characters).
3.  **og:url**: The canonical URL of the page.
4.  **og:image**: A high-quality preview image (1200x630 pixels recommended).
5.  **og:type**: Usually `website` or `article`.

## How to Audit OG Tags in this Project

### 1. Static Metadata Check
For static pages, verify if `export const metadata: Metadata` is defined at the page or layout level.

```bash
# Search for metadata definitions in the app directory
grep -r "export const metadata" app/
```

### 2. Dynamic Metadata Check
For dynamic routes (e.g., `[id]`), verify if `export async function generateMetadata` is implemented.

```bash
# Search for dynamic metadata generation
grep -r "generateMetadata" app/
```

### 3. Verification Checklist
- [ ] Does the page have a unique `og:title`?
- [ ] Is the `og:description` descriptive enough?
- [ ] Does the `og:image` path point to a valid asset (e.g., `/og-image.png`)?
- [ ] Is the `og:url` correctly pointing to the deployment domain?

## Metadata Recommendations by Page Type

| Page Type | Recommendation |
| :--- | :--- |
| **Landing** | High-level branding, service slogan, and general preview image. |
| **Pricing** | Focus on value proposition (e.g., "Premium Clarity at an Affordable Price"). |
| **Note Detail** | Dynamic title based on the note content to encourage click-through. |
| **Auth** | Clean, secure-looking tags (usually generic service branding). |

## Improvement Strategies

- **RSC Fetching**: In `generateMetadata`, use the same server-side logic (Repositories/Use Cases) as the page to fetch titles without duplication.
- **Image Generation**: Use the brand's primary colors and typography to create a consistent set of site cards.
