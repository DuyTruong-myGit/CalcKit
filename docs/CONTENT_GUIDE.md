# CONTENT_GUIDE: how to write pages for this site

## 1. Standard

Every page should help a real homeowner finish a real task. If a paragraph does not help with that, cut it. Google and AdSense both penalize thin and templated pages, so each page needs content that is specific to its topic, not the same text with the material name swapped.

## 2. Length and structure

600 to 900 words outside the calculator. Sections in this order: intro, how it works, worked examples, quick reference table, common mistakes, FAQ, related calculators, disclaimer. A page with the same sections as another page must still have different examples, a different table and different mistakes.

## 3. Voice

- US English. Short sentences. Active voice. Sentence case headings.
- Talk to one person doing one project ("measure the length and width of the bed").
- No hype, no filler, no clichés. Banned phrases include: "in conclusion", "it is important to note", "whether you are a seasoned pro or a beginner", "look no further", "ultimate guide", "game changer".
- Do not state prices, statistics, brand names, building-code requirements or safety guarantees unless the owner supplied them.
- Every page says results are estimates and to confirm with the supplier.

## 4. Fact discipline

- Numbers in the text must come from the formula, the constants, or the worked examples in the repo. Recompute every example by hand or with the test runner.
- If a topic needs a fact the repo does not contain (a typical depth, a recommended seed rate), leave a `TODO(owner): supply or verify` marker instead of guessing.

## 5. Prompt templates for drafting with an AI model

Use these with a small, cheap model. Paste in the verified formula and examples. Always review the output line by line.

**A. Draft sections**

> You are writing for a US homeowner planning a DIY project. Topic: {topic}. Use only the formula, default values and worked examples I provide; do not invent numbers, prices, statistics or product claims. Write: (1) a 90-word introduction, (2) a plain-language "How it works" section, (3) two worked examples using exactly these numbers: {examples}, (4) five FAQs about common mistakes. Use US units, short sentences, no hype. State that results are estimates and that quantities should be confirmed with the supplier. Formula and defaults: {formula}.

**B. Make the text read naturally**

> Rewrite the text below so it reads naturally and plainly. Keep every number and unit unchanged. Vary sentence length, remove filler phrases such as "it is important to note" and "in conclusion", and avoid repeating the same sentence structure. Text: {text}

**C. Title and meta description**

> Write 3 title options under 60 characters and 3 meta descriptions under 155 characters for a page about {topic}. Natural wording, no clickbait.

## 6. Owner review checklist (before setting `status: "reviewed"`)

- [ ] Every number in the text matches the calculator output for the same inputs.
- [ ] Default constants match the labels or supplier information the owner checked.
- [ ] No invented prices, brands, statistics or code claims.
- [ ] Reads like a person wrote it; no filler or repeated sentence patterns.
- [ ] Different enough from every other page (examples, table, mistakes).
- [ ] Title and meta description within limits and not misleading.
- [ ] Related links point to pages that exist.

## 7. Required page templates

These are starting points, not legal advice. Edit them to match what the site actually does.

**About**

> [SITE_NAME] offers free calculators that help homeowners estimate how much material they need for common projects such as mulch, gravel, concrete and paint. Our formulas use standard conversions and typical product sizes, and we show how each result is calculated so you can check it yourself. We are an independent site and are not affiliated with any retailer or manufacturer. If you spot a mistake, email us at [EMAIL].

**Contact**

> Questions, corrections or suggestions? Email [EMAIL]. We aim to reply within [N] business days.

**Privacy Policy** (sections to include)

- Information we collect: the calculators run in your browser and the numbers you enter are not sent to or stored by us.
- Analytics: we use [ANALYTICS TOOL, or "no analytics"] to understand how the site is used.
- Advertising (once ads are enabled): we use Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this and other websites. Users can opt out of personalized advertising through Google's ad settings.
- Cookies: what they are and how to control them in the browser.
- Third-party links: we are not responsible for other sites' practices.
- Children: the site is not directed to children under 13.
- Your choices and rights: contact [EMAIL] for any privacy request.
- Changes and date of last update.
- If the site has meaningful EU or UK traffic, add a consent mechanism for cookies before serving personalized ads.

**Terms and Disclaimer**

> The calculators on this site provide estimates for planning purposes only. Actual material needs depend on site conditions, product dimensions, waste and installation methods. Always confirm quantities with your supplier or a qualified professional before purchasing, especially for structural work such as concrete, roofing, decks and retaining walls. The site is provided as is, without warranties, and we are not liable for losses arising from its use.
>
> If affiliate links are used, add: Some links on this site are affiliate links. We may earn a commission at no extra cost to you.

## 8. Short disclaimer shown on every calculator page

> Results are estimates. Confirm quantities with your supplier before you buy.
