# Perfume UX App — Gen Z Interpretive Commerce (MVP Spec)

## 1. Vision

This is not a classic e-commerce app.

This is a **taste engine disguised as a shop**.

We are not helping users "buy perfume".
We are helping them:

* explore identity
* navigate aesthetic signals
* understand scent as language

The UX must feel:

* interpretive, not transactional
* expressive, not mechanical
* slightly poetic, but grounded in data

---

## 2. Core Principles

### 2.1 Interpretive over factual

Raw data (notes, ratings) is not enough.
We transform it into **meaningful axes**.

### 2.2 Multidimensional taste

No single "score".
Everything is a **vector space of perception**.

### 2.3 Familiar shell, new soul

* layout = familiar e-commerce
* interaction = new semantic filters

### 2.4 Legible intelligence

No black box.
User should feel:

> "I understand why this is recommended"

---

## 3. MVP Scope

### Views

#### 1. Listing Page (`/`)

* product grid
* expressive filter panel
* real-time filtering

#### 2. Product Page (`/product/[slug]`)

* scent profile
* interpretive breakdown
* recommendations

---

## 4. Data Model (Perfume-focused)

```ts
export type ScoreVector = {
  authenticity: number        // natural vs synthetic feel
  projection: number          // intimate vs loud
  longevity: number
  complexity: number
  versatility: number
}

export type Perfume = {
  id: string
  slug: string
  brand: string
  name: string

  description: string
  imageUrls: string[]

  price?: number
  currency?: string

  notes: string[]            // raw pyramid notes
  accords: string[]          // dominant accords

  tags: string[]             // vibe tags

  scores: ScoreVector

  review: {
    ratingAvg: number
    reviewCount: number
    sentiment?: number
  }

  geo?: {
    country?: string
    perfumer?: string
  }
}
```

---

## 5. Derived Features (Critical Layer)

We do NOT rely directly on raw dataset fields.
We build a **derived semantic layer**.

### 5.1 Score Vector Generation

From:

* accords
* notes
* keywords
* ratings

We derive:

| Dimension    | Heuristic                                    |
| ------------ | -------------------------------------------- |
| authenticity | natural notes ratio vs synthetic descriptors |
| projection   | keywords like "strong", "beast", "skin"      |
| longevity    | rating + keywords                            |
| complexity   | number + diversity of notes                  |
| versatility  | sentiment variance + tags                    |

---

### 5.2 Vibe Tagging

Map perfumes into cultural/aesthetic clusters:

* `quiet-luxury`
* `romantic`
* `archive-core`
* `clean`
* `experimental`
* `late-french-theory`

Heuristics:

* powdery + iris → romantic
* woody + minimal → quiet-luxury
* unusual accords → experimental

---

## 6. UI Architecture

## 6.1 Layout Structure

```
[ Header ]
[ Filter Panel ] [ Product Grid ]
```

Mobile:

```
[ Header ]
[ Filter Drawer ]
[ Product Grid ]
```

---

## 7. Core UI Components

## 7.1 FilterPanel

### Purpose

Bridge between **user intent** and **data space**.

### Components inside

#### A. SliderGroup (Key innovation)

Each slider maps to a score dimension.

Examples:

* Intimate ←→ Projecting
* Natural ←→ Synthetic-feeling
* Simple ←→ Complex
* Soft ←→ Loud

```ts
<Slider label="Projection" value={...} onChange={...} />
```

#### B. AccordSelector

Chip-based selection:

```ts
<Chip label="woody" />
<Chip label="powdery" />
<Chip label="amber" />
```

Multi-select → AND / OR logic

#### C. VibeSelector

Highly important for UX tone

```ts
<Chip label="late-french-theory" />
<Chip label="romantic" />
<Chip label="clean" />
```

These map directly to `tags`

#### D. Rating + Popularity

Classic filters remain:

* rating threshold
* review count

---

## 7.2 ProductCard

### Purpose

Compress multidimensional identity into a glance

### Layout

* image
* name + brand
* 2–3 key accords
* mini score bars
* vibe tags

### Micro-interaction

Hover (desktop):

* reveal more scores
* show short interpretive sentence

Example:

> "Powdery, intimate, slightly nostalgic"

---

## 7.3 ScoreBadges

### Visual encoding

Instead of numbers → bars / dots

Example:

```
Projection: ▓▓▓░░
Authenticity: ▓▓▓▓░
Complexity: ▓▓░░░
```

### Reason

Make the model **felt**, not read

---

## 7.4 ProductDetail

### Sections

#### A. Hero

* image
* name
* brand
* vibe tags

#### B. Interpretive Summary (VERY IMPORTANT)

Generated from data:

> "A soft, powdery composition with moderate projection and a strong romantic profile"

This is the **bridge between ML and UX**

---

#### C. Accord + Notes Visualization

* chips
* optional pyramid

---

#### D. Score Breakdown

Use same ScoreBadges component

---

#### E. Recommendation Rows

Multiple rows, each with semantic meaning:

* "Similar structure"
* "Same mood, cheaper"
* "More daring versions"

---

## 7.5 RecommendationRow

### Input

```ts
recommend(product, context)
```

### Context examples

* similar
* cheaper
* more intense
* more natural

---

## 8. Filtering Logic

### 8.1 Pipeline

```
DATA → FILTER → SCORE → SORT → RENDER
```

### 8.2 Filter Function

```ts
function filterProducts(products, filters) {
  return products.filter(p => {
    return (
      matchAccords(p, filters.accords) &&
      matchTags(p, filters.tags) &&
      matchScores(p, filters.sliders) &&
      matchRating(p, filters.rating)
    )
  })
}
```

---

## 9. Recommendation Engine (MVP)

### Vector similarity

```ts
similarity =
  w1 * cosine(scoreVector)
+ w2 * tagOverlap
+ w3 * accordOverlap
+ w4 * ratingDistance
```

### Output

Sorted list of products

---

## 10. UX Details that Matter

### 10.1 Latency

* instant filtering
* no loading spinners for MVP

### 10.2 Feedback

* filter count updates live
* subtle animations

### 10.3 Language

Avoid corporate tone

Use:

* "soft"
* "dry"
* "textured"
* "intimate"

Avoid:

* "optimized"
* "high performance"

---

## 11. Data Flow (End-to-End)

```
Dataset (JSON)
    ↓
Normalization
    ↓
Derived Features (scores + tags)
    ↓
UI Components
    ↓
User interaction
    ↓
Filter + Recommend
    ↓
Render
```

---

## 12. MVP Milestones

### Milestone 1

* static dataset (30 perfumes)
* listing page
* filter panel

### Milestone 2

* product detail
* recommendations

### Milestone 3

* refined score heuristics
* improved summaries

---

## 13. What makes this special

Not the data.
Not the models.

But the **translation layer between data and perception**.

This is the real product:

> Turning structured perfume data into a navigable aesthetic space.
