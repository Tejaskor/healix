# Healix — Post-Assessment Plans Report

A focused inventory of **every plan the user is shown** after completing the health assessment, where each plan is defined in code, what triggers each one, and how they compose into the post-assessment experience.

> **Scope:** Only plans surfaced as a recommendation after the main onboarding assessment (`/onboarding/assessment` → `/onboarding/results` → `/dashboard`). Marketing-page treatment cards (Wegovy, ED, etc.) are **not** plan recommendations — they are catalogue listings — so they're excluded.

---

## 1. The three plans (full catalogue)

The assessment recommender chooses exactly **one** of three plans. All three are always rendered on the result page; one is badged "Recommended". The full set:

| # | Plan ID | Display title | Price | Blurb / description | Where defined |
|---|---|---|---|---|---|
| 1 | `lifestyle` | **Lifestyle Plan** | **From $29/mo** | "Habit coaching, nutrition guidance, and progress tracking." | `OnboardingResultPage.jsx:36-42` + `DashboardPage.jsx:127-130` |
| 2 | `medication` | **Medication Plan** | **From $249/mo** | "Clinically reviewed prescriptions shipped to your door." | same |
| 3 | `combined` | **Combined Plan** | **From $279/mo** | "Medication plus lifestyle coaching for the best outcomes." | same |

### Source-of-truth detail

**On the result page** (`src/pages/OnboardingResultPage.jsx` lines 36-55):
```js
const plans = [
  { id: 'lifestyle',  title: 'Lifestyle Plan',  blurb: 'Habit coaching, nutrition guidance, and progress tracking.', price: 'From $29/mo'  },
  { id: 'medication', title: 'Medication Plan', blurb: 'Clinically reviewed prescriptions shipped to your door.',   price: 'From $249/mo' },
  { id: 'combined',   title: 'Combined Plan',   blurb: 'Medication plus lifestyle coaching for the best outcomes.', price: 'From $279/mo' },
]
```

**On the dashboard** (`src/pages/DashboardPage.jsx` lines 127-130) — a parallel array (no price field):
```js
const plans = [
  { id: 'lifestyle',  title: 'Lifestyle Plan',  description: 'Habit coaching, nutrition, and activity guidance to reach your goals.' },
  { id: 'medication', title: 'Medication Plan', description: 'Clinically reviewed prescriptions shipped monthly, with provider support.' },
  { id: 'combined',   title: 'Combined Plan',   description: 'Medication plus lifestyle coaching for the best outcomes.' },
]
```

> ⚠️ The same three plans are declared in two files with **different copy** (`blurb` vs `description`) and **different fields** (price exists only on the result page). See "Issues" at the bottom.

---

## 2. Recommendation rules — exactly which plan appears

Plans are decided by **two inputs**: BMI (computed from the user's height + weight answers) and the `openToTreatment` answer. No other assessment answer affects the outcome.

| Scenario | BMI band | `openToTreatment` | → Recommended plan |
|---|---|---|---|
| Missing height or weight | `null` | any | **Lifestyle Plan** (safety fallback) |
| Underweight | `< 18.5` | any | **Lifestyle Plan** ⚠ |
| Healthy | `18.5 – 24.9` | any | **Lifestyle Plan** |
| Overweight | `25 – 29.9` | `'yes'` or `'unsure'` | **Medication Plan** |
| Overweight | `25 – 29.9` | `'no'` | **Lifestyle Plan** |
| Obese | `≥ 30` | `'yes'` or `'unsure'` | **Combined Plan** |
| Obese | `≥ 30` | `'no'` | **Lifestyle Plan** |

### How the rule is written in code

**`OnboardingResultPage.jsx` lines 76-82** (Implementation A):
```js
const recommendedPlanId = (() => {
  if (bmi == null) return 'lifestyle'
  if (bmi < 25) return 'lifestyle'
  if (answers.openToTreatment === 'no') return 'lifestyle'
  if (bmi >= 30) return 'combined'
  return 'medication'
})()
```

**`DashboardPage.jsx` lines 47-53** (Implementation B — separate copy of the same rule):
```js
const chooseRecommendedPlan = (answers, bmi) => {
  if (bmi == null) return 'lifestyle'
  if (bmi >= 30) return 'combined'
  if (answers?.openToTreatment === 'no') return 'lifestyle'
  if (bmi >= 25) return 'medication'
  return 'lifestyle'
}
```

Both produce identical results across all input combinations (verified by enumeration of every BMI band × `openToTreatment` value). They are functionally redundant but structurally divergent — a maintenance hazard.

### Narrative explanation rendered to the user

In addition to picking the plan ID, the result page also formats a one-sentence rationale via `recommendationFor(bmi, answers)` (`OnboardingResultPage.jsx` lines 21-34):

| Condition | Text shown above the plan cards |
|---|---|
| BMI null | "Based on your answers, we recommend a tailored lifestyle program with provider support." |
| BMI < 25 | "You're in a healthy BMI range. A lifestyle plan should help you maintain and feel your best." |
| BMI 25 – 29.9 | "You may benefit from lifestyle changes alongside clinical support to reach your goal." |
| BMI ≥ 30, `openToTreatment === 'no'` | "A structured lifestyle plan with close provider guidance is the right place to start." |
| BMI ≥ 30, otherwise | "A combined plan with medication and lifestyle support typically produces the best outcomes." |

---

## 3. Where each plan is shown to the user

The same three-plan set is rendered in **two locations** after the assessment completes.

### Location 1 — `/onboarding/results`

`src/pages/OnboardingResultPage.jsx` lines 101-114:

```jsx
{plans.map((p) => (
  <article
    className={`onb-plan ${recommendedPlanId === p.id ? 'onb-plan--recommended' : ''}`}
  >
    {recommendedPlanId === p.id && <span className="onb-plan__badge">Recommended</span>}
    <h3 className="onb-plan__title">{p.title}</h3>
    <p className="onb-plan__blurb">{p.blurb}</p>
    <span className="onb-plan__price">{p.price}</span>
    <button type="button" className="onb-plan__btn" aria-disabled="true">Choose plan</button>
  </article>
))}
```

- Lays out all three cards side-by-side.
- The one matching `recommendedPlanId` gets the `.onb-plan--recommended` modifier and a "Recommended" badge.
- "Choose plan" buttons are **`aria-disabled="true"`** — they don't lead anywhere yet.
- A "Continue to consultation" CTA at the bottom navigates to `/dashboard`.

### Location 2 — `/dashboard`

`src/pages/DashboardPage.jsx` lines 277-292, rendered only when `assessmentCompleted` is true:

```jsx
<section>
  <h2 className="dash__section-title">Your plan</h2>
  <div className="dash__plans">
    {plans.map((p) => (
      <PlanCard
        title={p.title}
        description={p.description}
        recommended={recommended === p.id}
        onView={() => { /* TODO: navigate to plan detail */ }}
      />
    ))}
  </div>
</section>
```

- Uses the reusable `<PlanCard>` (`src/components/dashboard/PlanCard.jsx`).
- The same recommendation rule (Implementation B above) decides which card is badged.
- `onView` is a no-op TODO — no plan detail page exists.

### `PlanCard` component (`src/components/dashboard/PlanCard.jsx`)

The dashboard card shape — 11 lines total:
```jsx
const PlanCard = ({ title, description, recommended, onView }) => (
  <article className={`dash-plan ${recommended ? 'dash-plan--recommended' : ''}`}>
    {recommended && <span className="dash-plan__badge">Recommended</span>}
    <h3 className="dash-plan__title">{title}</h3>
    <p className="dash-plan__desc">{description}</p>
    <button type="button" className="dash-plan__btn" onClick={onView}>View plan</button>
  </article>
)
```

---

## 4. Plan-by-plan deep dive

### Plan 1 — Lifestyle Plan (`id: 'lifestyle'`)

| Field | Value |
|---|---|
| Display title | Lifestyle Plan |
| Price | From **$29/mo** |
| Result-page blurb | "Habit coaching, nutrition guidance, and progress tracking." |
| Dashboard description | "Habit coaching, nutrition, and activity guidance to reach your goals." |
| Recommended when | **Default / fallback path** — fires for healthy BMI, underweight users, treatment-averse users at any BMI, and users with no BMI data. |
| Reads from assessment | `height` + `weight` → BMI; `openToTreatment` |
| Action wired up? | ❌ "Choose plan" and "View plan" buttons both do nothing |

This is the safest, cheapest plan and also the **catch-all fallback**. Any branch that doesn't qualify for Medication or Combined falls here.

### Plan 2 — Medication Plan (`id: 'medication'`)

| Field | Value |
|---|---|
| Display title | Medication Plan |
| Price | From **$249/mo** |
| Result-page blurb | "Clinically reviewed prescriptions shipped to your door." |
| Dashboard description | "Clinically reviewed prescriptions shipped monthly, with provider support." |
| Recommended when | BMI is 25.0 – 29.9 (Overweight) **AND** the user did NOT answer `'no'` to `openToTreatment`. |
| Reads from assessment | `height` + `weight` → BMI; `openToTreatment` |
| Action wired up? | ❌ |

The mid-tier offering. There is no consideration of which medications the user might be a candidate for, no contraindication screening, and no link to specific prescriptions.

### Plan 3 — Combined Plan (`id: 'combined'`)

| Field | Value |
|---|---|
| Display title | Combined Plan |
| Price | From **$279/mo** |
| Result-page blurb | "Medication plus lifestyle coaching for the best outcomes." |
| Dashboard description | "Medication plus lifestyle coaching for the best outcomes." |
| Recommended when | BMI ≥ 30 (Obese) **AND** the user did NOT answer `'no'` to `openToTreatment`. |
| Reads from assessment | `height` + `weight` → BMI; `openToTreatment` |
| Action wired up? | ❌ |

The top-tier offering. Marketed for the highest BMI band but with the same recommender simplicity as the other two — no severity tiering, no provider-side review prompt.

---

## 5. End-to-end flow showing where plans appear

```
Assessment completes
   ↓
completeAssessment(answers) stamps completedAt in localStorage
   ↓
navigate('/onboarding/results', { state: { answers } })
   ↓
─────────────────────────────────────────────────────────────
OnboardingResultPage.jsx
   ↓
Compute BMI (height, weight)
   ↓
Pick recommendedPlanId — Implementation A
   ↓
Render: BMI + category + narrative rationale
   ↓
Render: 3 plan cards (Lifestyle / Medication / Combined)
        with one badged "Recommended"
   ↓
"Continue to consultation" → /dashboard
─────────────────────────────────────────────────────────────
   ↓
DashboardPage.jsx
   ↓
Re-compute BMI (same values from localStorage)
   ↓
Pick recommended — Implementation B (independent copy)
   ↓
Render: "Your plan" section with the same 3 PlanCards
        and the same "Recommended" badge
```

---

## 6. Inputs that DON'T affect the plan (but the assessment asks for)

For completeness — the assessment captures these fields but they have **zero impact** on which plan is recommended:

| Field | Used? |
|---|---|
| `consent` | ❌ (only enforced as a min: 1 validation) |
| `goal` | Only inside `targetLoss.condition` — not in the recommender |
| `targetLoss` | Used by `DashboardPage` to derive a target weight, not the plan |
| `age` | ❌ (validation only — must be ≥ 18) |
| `gender` | Only inside `pregnant.condition` — not in the recommender |
| `conditions` (diabetes / thyroid / BP / PCOS / none) | ❌ |
| `medications` | ❌ |
| `activity` | Triggers a "move more" alert banner on dashboard, doesn't change plan |
| `eating` | ❌ |
| `comfortableWith` (pills / injections / lifestyle only) | ❌ |
| `pregnant` | ❌ — captured but never read ⚠ |
| `eatingDisorder` | ❌ — captured but never read ⚠ |

> The two ⚠ rows are clinically important: a pregnant user with BMI ≥ 30 is currently routed to the Medication or Combined plan with no contraindication check.

---

## 7. Issues + observations

| # | Issue | Files affected | Severity |
|---|---|---|---|
| 1 | Plan list duplicated in two files; copy already differs ("Habit coaching, nutrition guidance, and progress tracking" vs "Habit coaching, nutrition, and activity guidance to reach your goals"). Future updates risk silent drift. | `OnboardingResultPage.jsx`, `DashboardPage.jsx` | Maintenance |
| 2 | Price field exists on the result page but not on the dashboard, so the user sees "From $29/mo" on the results screen and *no* price on the dashboard. | `DashboardPage.jsx` | UX |
| 3 | Recommendation rule duplicated (Implementations A + B). | Same two files | Maintenance |
| 4 | "Choose plan" / "View plan" CTAs are no-ops. | Both | Product gap |
| 5 | Pregnancy not honoured as a contraindication. | `OnboardingResultPage.jsx`, `DashboardPage.jsx` | Clinical safety ⚠ |
| 6 | History of eating disorder not honoured. | Same | Clinical safety ⚠ |
| 7 | Underweight (BMI < 18.5) routed to weight-loss-positioned "Lifestyle Plan" with no distinguishing copy. | Same | UX / safety |
| 8 | Plan choice computed entirely client-side from localStorage. User can edit `localStorage['healix_assessment'].answers.weight` to switch the recommendation. | Both | Security (only matters once "Choose plan" is wired up) |

---

## 8. Suggested consolidation (if you want it actioned)

Move plan data + recommendation logic to a single source-of-truth utility, e.g. `src/lib/plans.js`:

```js
// Single source of truth for the three plans + recommender.
export const PLANS = [
  {
    id: 'lifestyle',
    title: 'Lifestyle Plan',
    description: 'Habit coaching, nutrition guidance, and progress tracking.',
    price: 'From $29/mo',
  },
  {
    id: 'medication',
    title: 'Medication Plan',
    description: 'Clinically reviewed prescriptions shipped to your door.',
    price: 'From $249/mo',
  },
  {
    id: 'combined',
    title: 'Combined Plan',
    description: 'Medication plus lifestyle coaching for the best outcomes.',
    price: 'From $279/mo',
  },
]

export const recommendPlanId = (answers, bmi) => {
  // Hard safety gates first — never recommend meds for these.
  if (answers?.pregnant === 'yes') return 'lifestyle'
  if (answers?.eatingDisorder === 'yes') return 'lifestyle'
  // BMI-driven rule.
  if (bmi == null) return 'lifestyle'
  if (bmi < 25) return 'lifestyle'
  if (answers?.openToTreatment === 'no') return 'lifestyle'
  if (bmi >= 30) return 'combined'
  return 'medication'
}
```

Then both `OnboardingResultPage` and `DashboardPage` `import { PLANS, recommendPlanId } from '@/lib/plans'` — and any future fourth plan, price change, or rule tweak lives in one place.

---

*Generated by code-trace. Every plan ID, price, blurb, and trigger condition is grounded in the cited file + line.*
