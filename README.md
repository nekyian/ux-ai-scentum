<<<<<<< HEAD
=======
# Scentum

> A taste engine disguised as a shop.

Scentum is not a perfume store. It's a navigable aesthetic space — built to help people explore identity through scent, not just buy a product. Every interaction is interpretive, not transactional.

---

## Architecture

```mermaid
flowchart TD
    DS[(Dataset\n30 perfumes JSON)]
    NL[Normalization Layer]
    DFL[Derived Features Layer\nscores · tags · accords]
    UI[UI Layer]
    FE[Filter Engine]
    RE[Recommendation Engine]
    REN[Render]

    DS --> NL --> DFL --> UI
    UI --> FE --> REN
    UI --> RE --> REN
```

---

## Data Pipeline

```mermaid
flowchart LR
    subgraph Input
        A[raw notes]
        B[accords]
        C[keywords]
        D[ratings]
    end

    subgraph Derived["Derived Features (Critical Layer)"]
        E[ScoreVector\nauthenticity · projection\nlongevity · complexity · versatility]
        F[Vibe Tags\nquiet-luxury · romantic\narchive-core · experimental\nclean · late-french-theory]
    end

    subgraph Output
        G[FilterPanel]
        H[ProductCard]
        I[ProductDetail]
        J[Recommendations]
    end

    A & B & C & D --> E
    A & B & C & D --> F
    E & F --> G & H & I & J
```

---

## Data Model

```mermaid
classDiagram
    class Perfume {
        +string id
        +string slug
        +string brand
        +string name
        +string description
        +string[] imageUrls
        +number price
        +string[] notes
        +string[] accords
        +string[] tags
        +ScoreVector scores
        +Review review
        +Geo geo
    }

    class ScoreVector {
        +number authenticity
        +number projection
        +number longevity
        +number complexity
        +number versatility
    }

    class Review {
        +number ratingAvg
        +number reviewCount
        +number sentiment
    }

    class Geo {
        +string country
        +string perfumer
    }

    Perfume --> ScoreVector
    Perfume --> Review
    Perfume --> Geo
```

---

## UI Component Tree

```mermaid
flowchart TD
    APP[App Layout]
    APP --> HEADER[Header + ThemeToggle]
    APP --> LISTING[Listing Page /]
    APP --> DETAIL[Product Page /product/slug]

    LISTING --> FP[FilterPanel]
    LISTING --> PG[Product Grid]
    PG --> PC[ProductCard\nimage · accords · ScoreBadges · vibe tags]

    FP --> VS[VibeSelector\nchip multi-select]
    FP --> AS[AccordSelector\nchip multi-select]
    FP --> SG[SliderGroup\n5 score dimensions]
    FP --> RS[Rating Slider]

    DETAIL --> HERO[Hero\nimage · name · brand · tags]
    DETAIL --> SUM[Interpretive Summary\nAI-generated text bridge]
    DETAIL --> NV[Notes Visualization\npyramid · chips]
    DETAIL --> SB[ScoreBadges\nbar encoding]
    DETAIL --> RR[RecommendationRows\nsimilar · cheaper · more daring]
```

---

## Score Dimensions

Each perfume carries a **ScoreVector** — a 5D perception profile derived from raw data, not editorial opinion.

| Dimension | Heuristic Source | Slider Label |
|---|---|---|
| `authenticity` | natural notes ratio vs synthetic descriptors | Synthetic ↔ Natural |
| `projection` | keywords: "strong", "beast", "skin" | Intimate ↔ Projecting |
| `longevity` | rating data + keywords | Fleeting ↔ Lasting |
| `complexity` | note count + diversity | Simple ↔ Complex |
| `versatility` | sentiment variance + tag spread | Singular ↔ Versatile |

Visual encoding in UI: bars, not numbers.

```
Projection:   ▓▓▓░░
Authenticity: ▓▓▓▓░
Complexity:   ▓▓░░░
```

---

## Filtering Pipeline

```mermaid
flowchart LR
    DATA[Full Dataset] --> FILTER[Filter]
    FILTER --> SCORE[Score Match]
    SCORE --> SORT[Sort]
    SORT --> RENDER[Render Grid]

    FILTER -.->|matchAccords| A[accord chips]
    FILTER -.->|matchTags| B[vibe chips]
    FILTER -.->|matchScores| C[dimension sliders]
    FILTER -.->|matchRating| D[rating slider]
```

All active filters are `AND` conditions — the result space narrows with each selection, giving users a precise multi-dimensional query without ever typing one.

---

## Recommendation Engine

```mermaid
flowchart TD
    P[Source Perfume] --> SIM[Similarity Score]
    SIM --> OUT[Ranked List]

    SIM --> C1[cosine · ScoreVector]
    SIM --> C2[tag overlap]
    SIM --> C3[accord overlap]
    SIM --> C4[rating distance]

    OUT --> R1[Similar structure]
    OUT --> R2[Same mood, cheaper]
    OUT --> R3[More daring versions]
```

**Similarity formula:**

```
similarity =
  w1 × cosine(scoreVector)
+ w2 × tagOverlap
+ w3 × accordOverlap
+ w4 × ratingDistance
```

Recommendations are contextual — each row has a semantic intent, not just a score.

---

## Vibe Tags

Perfumes are mapped to cultural/aesthetic clusters via accord + keyword heuristics:

| Tag | Heuristic |
|---|---|
| `quiet-luxury` | woody + minimal + understated |
| `romantic` | powdery + iris + floral |
| `archive-core` | retro accords + vintage descriptors |
| `clean` | aquatic + fresh + soap |
| `experimental` | unusual accord combinations |
| `late-french-theory` | abstract + intellectual + niche |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Components | shadcn/ui + Base UI React |
| Icons | Lucide React |
| Package Manager | Bun |

---

## Milestones

```mermaid
gantt
    title MVP Roadmap
    dateFormat  YYYY-MM-DD
    section Milestone 1
    Static dataset (30 perfumes)   :done, 2025-01-01, 2025-01-07
    Listing page                   :done, 2025-01-01, 2025-01-07
    Filter panel                   :done, 2025-01-01, 2025-01-07
    section Milestone 2
    Product detail page            :active, 2025-01-08, 2025-01-14
    Recommendation engine          :active, 2025-01-08, 2025-01-14
    section Milestone 3
    Refined score heuristics       : 2025-01-15, 2025-01-21
    Interpretive summaries (AI)    : 2025-01-15, 2025-01-21
```

---

## Design Principles

**Interpretive over factual** — raw data becomes meaningful axes.

**Multidimensional taste** — no single score, everything is a vector space of perception.

**Familiar shell, new soul** — e-commerce layout with semantic filters underneath.

**Legible intelligence** — users should always feel: *"I understand why this is recommended."*

---

> The real product is the **translation layer between data and perception** — turning structured perfume data into a navigable aesthetic space.
>>>>>>> abde63d (first commit)
# ux-ai-scentum
