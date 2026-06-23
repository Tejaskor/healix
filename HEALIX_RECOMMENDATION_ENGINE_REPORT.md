# Healix Recommendation Engine — Technical Report

A complete, code-traced analysis of how the health assessment captures answers and how those answers are turned into a recommended plan on the dashboard.

> **Top-line finding (read this first):** The recommendation engine is **rule-based, not medically scored**. It uses **three inputs only — BMI, `openToTreatment`, and the assessment-completed flag** — to map the user to one of three hardcoded plans (`lifestyle` / `medication` / `combined`). All other 13 questions in the assessment are collected but **never read by the recommendation function**. Assessment answers are stored exclusively in `localStorage` (`healix_assessment`); they are **never written to Supabase**.

---

## 1. Assessment Flow Overview

### End-to-end user journey

| Step | What happens | Where |
|---|---|---|
| 1 | User signs up / logs in via Supabase | `src/components/sections/AuthOffcanvas/`, `src/contexts/AuthContext.jsx` |
| 2 | Protected route gates `/dashboard` if no assessment | `src/components/routes/ProtectedRoute.jsx` |
| 3 | User is bounced to `/onboarding/assessment` | `src/routes/AppRouter.jsx` (lazy route) |
| 4 | Assessment engine boots with the health-flow config | `src/pages/OnboardingAssessmentPage.jsx` → `AssessmentContainer` → `AssessmentProvider` |
| 5 | Each answer is captured + auto-saved | `src/components/assessment/AssessmentContext.jsx`, `setAnswer` + `onProgress` callback |
| 6 | On every step, `saveAssessmentProgress` writes `{answers, step}` to `localStorage['healix_assessment']` | `src/contexts/AuthContext.jsx` |
| 7 | When the last question resolves, `goNext` flips `status: 'done'` | `AssessmentContext.jsx` (line 87) |
| 8 | `AssessmentInner` `useEffect` fires `onComplete(answers)` | `src/components/assessment/AssessmentContainer.jsx` |
| 9 | `OnboardingAssessmentPage.handleComplete` calls `completeAssessment(answers)` (stamps `completedAt`) and navigates to `/onboarding/results` with answers in `location.state` | `src/pages/OnboardingAssessmentPage.jsx` |
| 10 | Result page computes BMI + recommended plan and renders the three plan cards | `src/pages/OnboardingResultPage.jsx` |
| 11 | "Continue to consultation" navigates to `/dashboard` | `OnboardingResultPage.jsx` line 120 |
| 12 | Dashboard re-derives BMI + recommended plan from the same answers | `src/pages/DashboardPage.jsx` |

### Files / hooks / contexts involved

| Concern | File |
|---|---|
| Routing + lazy boundaries | `src/routes/AppRouter.jsx` |
| Auth + assessment persistence | `src/contexts/AuthContext.jsx` |
| Protected-route gate | `src/components/routes/ProtectedRoute.jsx` |
| Assessment state machine | `src/components/assessment/AssessmentContext.jsx` |
| Assessment shell + lifecycle | `src/components/assessment/AssessmentContainer.jsx` |
| Question rendering | `src/components/assessment/QuestionRenderer.jsx` + `questions/*.jsx` |
| Progress / nav / result UI | `ProgressBar.jsx`, `NavigationControls.jsx`, `ResultScreen.jsx`, `LoadingScreen.jsx` |
| Onboarding page | `src/pages/OnboardingAssessmentPage.jsx` |
| Result page | `src/pages/OnboardingResultPage.jsx` |
| Dashboard re-derivation | `src/pages/DashboardPage.jsx` |
| Question definitions | `src/config/healthAssessmentConfig.js` (main), `wegovyAssessmentConfig.js`, `hairAssessmentConfig.js`, `assessmentConfig.js` |
| Persistence | `localStorage['healix_assessment']` — **no Supabase table** |

---

## 2. Question Analysis

### Where questions live

Four config files in `src/config/`:

| File | Used by |
|---|---|
| `healthAssessmentConfig.js` | The main onboarding flow (`/onboarding/assessment`). **This is the one used for plan recommendations.** |
| `wegovyAssessmentConfig.js` | Weight-loss in-page wizard triggered from Hero cards (`open-wegovy-assessment` event) |
| `hairAssessmentConfig.js` | Hair regrowth in-page wizard (`open-hair-assessment` event) |
| `assessmentConfig.js` | Standalone `/assessment` page (separate offering, not used by onboarding) |

### Structure of a question

Every question in `healthAssessmentConfig.questions` follows a uniform shape:

```js
{
  id: 'goal',                          // unique key — used as answers[id]
  type: 'single',                      // single | multi | input | yesno | card | slider
  question: 'What is your goal?',      // headline shown above options
  subtitle: '…',                       // optional supporting copy
  options: [{ value, label }],         // for choice types
  inputType: 'number',                 // for input type
  placeholder: '…', suffix: 'kg',      // for input type
  condition: (answers) => boolean,     // optional — skips the question if false
  validation: { required, min, validate(value) },
}
```

### Six question types

| Type | Renderer | Captures |
|---|---|---|
| `single` | `SingleChoiceQuestion.jsx` | single string from `options.value` |
| `multi` | `MultiSelectQuestion.jsx` | array of `options.value` |
| `card` | `CardSelectQuestion.jsx` | single string (richer visual choice grid) |
| `yesno` | `YesNoQuestion.jsx` | `'yes'` or `'no'` |
| `input` | `InputQuestion.jsx` | typed string (often numeric, validated) |
| `slider` | `SliderQuestion.jsx` | numeric value within a configured range |

### Validation logic

Lives inside each question entry in the config — there is **no central validator**. Each question can declare:
- `validation.required: true` — input must be non-empty.
- `validation.min: N` — for multi-select, minimum number of selections.
- `validation.validate(value)` — function returning `true` or an error string.

Examples from `healthAssessmentConfig.js`:
```js
// age
validate: (v) => {
  const n = Number(v)
  if (!Number.isFinite(n)) return 'Enter a valid number'
  if (n < 18) return 'You must be 18 or older'
  if (n > 100) return 'Enter a realistic age'
  return true
}
// height
if (n < 120 || n > 230) return 'Enter a realistic height in cm'
// weight
if (n < 30 || n > 300) return 'Enter a realistic weight in kg'
```

### Branching

Two mechanisms:

1. **`condition: (answers) => boolean`** — skips the question entirely if false. Example: `pregnant` is only asked when `gender === 'female'`; `targetLoss` only when `goal === 'lose'`.
2. **`next: id | (answers) => id`** — overrides the default "next index" pointer. **Not currently used in `healthAssessmentConfig.js`** — the flow is purely linear with conditional skips.

The skip-walking algorithm lives in [`AssessmentContext.jsx` lines 48-68 (`resolveNext`)](src/components/assessment/AssessmentContext.jsx#L48-L68): it follows `next` (or the default index+1) and keeps stepping forward while the candidate question's `condition` returns false.

### Question inventory for the main assessment

15 questions; **5 actually feed any downstream logic** (marked ✔):

| id | type | category | Used for recommendation? |
|---|---|---|---|
| `consent` | multi | Legal | No |
| `goal` | single | Goals | No (only `targetLoss.condition` reads it) |
| `targetLoss` | single | Goals | Used in `DashboardPage` for `targetWeight` calc |
| `age` | input | Demographics | No |
| `gender` | single | Demographics | No (only `pregnant.condition` reads it) |
| `height` | input | Demographics | ✔ → BMI |
| `weight` | input | Demographics | ✔ → BMI |
| `conditions` | multi | Medical history | **No** |
| `medications` | yesno | Medical history | No |
| `activity` | single | Lifestyle | Shows "move more" alert on dashboard |
| `eating` | single | Lifestyle | No |
| `openToTreatment` | single | Preference | ✔ → plan branch |
| `comfortableWith` | multi | Preference | No |
| `pregnant` | yesno | Safety | **No** ⚠ |
| `eatingDisorder` | yesno | Safety | **No** ⚠ |

> ⚠ Captured but unused by the recommender — see Section 8 for the safety implications.

### "Weightage / scoring"

**There is none.** No weights are attached to any answer. There is no scoring system in the codebase. The recommender is a four-line `if/else` (see Section 3).

---

## 3. Recommendation Engine Logic

### Where it lives — three independent implementations (sic)

The recommendation logic is duplicated in **two places** with subtly different rules, plus a textual narrative function. None of them share code.

#### Implementation A — `src/pages/OnboardingResultPage.jsx` lines 76-82

```js
const recommendedPlanId = (() => {
  if (bmi == null) return 'lifestyle'
  if (bmi < 25) return 'lifestyle'
  if (answers.openToTreatment === 'no') return 'lifestyle'
  if (bmi >= 30) return 'combined'
  return 'medication'                  // bmi 25..29.9
})()
```

#### Implementation B — `src/pages/DashboardPage.jsx` lines 47-53

```js
const chooseRecommendedPlan = (answers, bmi) => {
  if (bmi == null) return 'lifestyle'
  if (bmi >= 30) return 'combined'
  if (answers?.openToTreatment === 'no') return 'lifestyle'
  if (bmi >= 25) return 'medication'
  return 'lifestyle'
}
```

#### Narrative text generator — `OnboardingResultPage.jsx` lines 21-34 (`recommendationFor`)

A four-branch string formatter that uses the same inputs to produce the prose paragraph displayed above the plan cards.

### Inputs actually consumed

| Input | Implementation A | Implementation B |
|---|---|---|
| `bmi` (derived from `answers.height` + `answers.weight`) | ✔ | ✔ |
| `answers.openToTreatment` | ✔ | ✔ |
| Anything else (age, conditions, medications, gender, pregnant, eatingDisorder, activity, eating, comfortableWith, goal, targetLoss, consent) | ✘ | ✘ |

### Thresholds + branching

- **BMI < 18.5** — Underweight, but treated the same as 18.5–24.9 by both impls (Lifestyle Plan).
- **BMI 25–29.9** — Overweight → Medication Plan, unless `openToTreatment === 'no'` → Lifestyle.
- **BMI ≥ 30** — Obese → Combined Plan, unless `openToTreatment === 'no'` → Lifestyle.
- **BMI null** (missing height or weight) — Lifestyle.

### Subtle divergence between Implementation A and B

A and B agree on every input combination — verified by enumeration:

| BMI band | openToTreatment | A returns | B returns | Same? |
|---|---|---|---|---|
| null | any | lifestyle | lifestyle | ✔ |
| <25 | any | lifestyle | lifestyle | ✔ |
| 25..30 | yes/unsure | medication | medication | ✔ |
| 25..30 | no | lifestyle | lifestyle | ✔ |
| ≥30 | yes/unsure | combined | combined | ✔ |
| ≥30 | no | lifestyle | lifestyle | ✔ |

Outputs match, but having the same logic in two files is a duplication bug — see Section 8.

---

## 4. Plan Mapping Report

The three plans are defined as static data in **both** `OnboardingResultPage.jsx` (with blurbs + prices) and `DashboardPage.jsx` (with `description`).

| Plan ID | Title | Price | Recommended when | Inputs read | Fallback? |
|---|---|---|---|---|---|
| `lifestyle` | Lifestyle Plan | From **$29/mo** | BMI < 25 **OR** BMI ≥ 25 with `openToTreatment === 'no'` **OR** BMI missing | `bmi`, `openToTreatment` | ✔ default when BMI is `null` |
| `medication` | Medication Plan | From **$249/mo** | BMI 25–29.9 **AND** `openToTreatment !== 'no'` | `bmi`, `openToTreatment` | — |
| `combined` | Combined Plan | From **$279/mo** | BMI ≥ 30 **AND** `openToTreatment !== 'no'` | `bmi`, `openToTreatment` | — |

### Priority score logic

**There is none.** The four `if` branches resolve to exactly one plan; no plan accumulates a "score" or competes. Order of evaluation is functionally the priority list:

1. Null BMI → lifestyle (safety fallback)
2. `bmi >= 30` (impl B) / `bmi < 25` (impl A) — first match wins
3. `openToTreatment === 'no'` overrides anything between 25 and 30+
4. Default catches the 25–30 case

### Why each plan appears (user-facing)

Lifestyle is presented as a habit-coaching path with no medication. Medication is positioned as clinical Rx-only. Combined is the "best outcomes" tier. All three are presented as Healix's own offering with no upstream provider/insurance check.

### Fallback

`lifestyle` is also the textual fallback in `recommendationFor()` when BMI is null:
> "Based on your answers, we recommend a tailored lifestyle program with provider support."

---

## 5. Supabase Database Investigation

### Critical finding

**Assessment answers are not stored in Supabase.** They live only in the user's browser under `localStorage['healix_assessment']`. Clearing site data wipes them. They are also not associated with the Supabase `user_id` at the database level.

### Persistence path

```
QuestionRenderer.onChange
   ↓
AssessmentContext.setAnswer(id, value)
   ↓
AssessmentContext useEffect (line 38)
   ↓
onProgress(answers, currentId)  ← prop from container
   ↓
OnboardingAssessmentPage.handleProgress  (line 30)
   ↓
AuthContext.saveAssessmentProgress({answers, step})
   ↓
localStorage.setItem('healix_assessment', JSON.stringify({answers, step, completedAt}))
```

On final question:
```
AssessmentContext.goNext → status:'done'
   ↓
AssessmentContainer useEffect → onComplete(answers)
   ↓
OnboardingAssessmentPage.handleComplete
   ↓
AuthContext.completeAssessment(answers)  → writes completedAt
   ↓
navigate('/onboarding/results', { state: { answers } })
```

### Supabase tables in this project (none for assessment)

Tables that DO exist (from the dashboard + auth migration rounds):

| Table | Purpose |
|---|---|
| `auth.users` (Supabase managed) | Account credentials, email, OAuth identities |
| `public.profiles` | Mirror of auth.users with `full_name`. Auto-populated by trigger `handle_new_user`. |
| `public.water_logs` | Per-user water intake events (ml) |
| `public.sleep_logs` | Sleep hours per night |
| `public.step_logs` | Step counts |
| `public.calorie_logs` | Manual calorie-burn entries |
| `public.workout_logs` | Workout sessions (currently unused by UI) |
| `public.weight_history` | Weight readings over time |
| `public.daily_tasks` | Checkable to-do items (schema present, UI uses static data) |

**No `assessments` / `responses` / `recommendations` / `health_scores` table exists.** Every plan recommendation is recomputed in the React component on each render from `localStorage`.

### RLS policies present

Every Supabase table above has the standard four-policy set, scoped to `auth.uid() = user_id`:
- `<table>_select_own`
- `<table>_insert_own`
- `<table>_update_own`
- `<table>_delete_own`

Plus the `delete_my_account()` security-definer RPC for self-deletion.

### Schema relationship diagram (current)

```
       auth.users(id)  ──┐
              │           │
              │           │ on delete cascade
              │           │
              ├──► public.profiles(id, full_name, email, created_at)
              ├──► public.water_logs(id, user_id, amount_ml, logged_at)
              ├──► public.sleep_logs(id, user_id, hours, logged_at)
              ├──► public.step_logs(id, user_id, steps, logged_at)
              ├──► public.calorie_logs(id, user_id, calories, logged_at)
              ├──► public.workout_logs(id, user_id, type, duration, calories, logged_at)
              ├──► public.weight_history(id, user_id, weight_kg, logged_at)
              └──► public.daily_tasks(id, user_id, title, completed, …)

       (No assessments table.)
       (No recommendations table.)
       (No health_scores table — derived in JS per render.)
```

---

## 6. Dashboard Data Flow

### What the dashboard reads + where from

| Concern | Source |
|---|---|
| User identity | `useAuth().user` (in-memory mirror of `healix_user` + Supabase session) |
| Assessment answers | `useAuth().assessmentData` ← `localStorage['healix_assessment'].answers` |
| Recommended plan | `chooseRecommendedPlan(answers, bmi)` — recomputed every render |
| BMI | `computeBmi(answers.height, answers.weight)` — recomputed every render |
| Current weight / target | Read from `assessmentData` + 10% loss heuristic (or `targetLoss` value if set) |
| Daily metrics | `useDashboardData()` — 7 parallel Supabase queries (`water_logs`, `sleep_logs`, `step_logs`, `calorie_logs`, `weight_history`, weekly aggregate, streak) |
| Health score | `calculateHealthScore(data)` — 5 dimensions × 20 points (steps / sleep / water / activity / BMI) |
| Recommendations | `buildRecommendations(data)` — heuristic tips by metric |

### State + storage map

| State | Layer | Notes |
|---|---|---|
| `healix_user` | localStorage + AuthContext | `{ email, fullName, supabaseId, provider, loggedInAt }` |
| `healix-supabase-auth` | localStorage (Supabase SDK) | Access + refresh tokens |
| `healix_assessment` | localStorage + AuthContext | `{ answers, step, completedAt }` — only persistence for assessment data |
| Daily metrics | Supabase tables, fetched on mount + after each tracker write | `useDashboardData` keeps the previous data on screen during refreshes (stale-while-revalidate) |

### Authentication dependency

Yes — `/dashboard` is wrapped in `ProtectedRoute` (`src/components/routes/ProtectedRoute.jsx`):
1. If `!isLoggedIn` → redirect to `/` and fire `open-auth` event.
2. If `isLoggedIn` && `!assessmentCompleted` → redirect to `/onboarding/assessment`.
3. Else render `<DashboardPage />`.

---

## 7. API + Backend Architecture

### Direct Supabase calls (no Express layer for the assessment)

The assessment path makes **zero network calls** end-to-end. Everything happens in the browser:

| Operation | Call site | Network? |
|---|---|---|
| Read existing answers (resume) | `AuthContext.readAssessment()` | localStorage only |
| Save partial progress | `AuthContext.saveAssessmentProgress()` | localStorage only |
| Mark complete | `AuthContext.completeAssessment()` | localStorage only |
| Compute BMI | `OnboardingResultPage.computeBmi()` | none |
| Compute recommended plan | `chooseRecommendedPlan()` / IIFE in result page | none |

### Supabase calls used elsewhere (dashboard, not assessment)

`src/lib/supabaseLogs.js` exposes the helpers consumed by the dashboard:

| Function | Table | Type |
|---|---|---|
| `todayWaterTotal` / `logWater` / `resetTodayWater` | water_logs | SELECT / INSERT / DELETE |
| `lastNightSleep` / `logSleep` | sleep_logs | SELECT / INSERT |
| `todaySteps` / `logSteps` / `resetTodaySteps` | step_logs | SELECT / INSERT / DELETE |
| `todayCalorieTotal` / `logCalories` / `resetTodayCalories` | calorie_logs | SELECT / INSERT / DELETE |
| `todayWorkoutTotals` | workout_logs | SELECT (unused after workouts were removed) |
| `latestWeight` | weight_history | SELECT |
| `weeklyActivity` | water/sleep/step/calorie | 4 parallel SELECTs |
| `currentStreak` | water/sleep/step/calorie | 4 parallel SELECTs |

### Edge functions

**None.** No Supabase Edge Functions, no serverless endpoints. The legacy Express server in `server/` is dead code post-Supabase migration — its routes are no longer referenced by any client code.

### Data transformation

All transformation happens client-side:
- ml → litres for water tile (`+(waterMl / 1000).toFixed(2)`)
- Weekly bucket aggregation in `weeklyActivity()` (logs grouped by Mon–Sun via `dayIndex()`)
- BMI calculation
- Plan branch evaluation

---

## 8. Recommendation Accuracy Review

### Is it medically meaningful?

**No — it is a clinically thin rule-based filter.** It would not be appropriate as a real medical recommendation engine. Specifically:

#### Hardcoded logic — issues

1. **15-question intake, 2-input output.** The assessment captures age, gender, conditions, medications, activity, eating, comfortableWith, goal, targetLoss, pregnant, eatingDisorder, eatingDisorder, consent — and discards all of it for the plan choice. Users will feel the assessment is "deep" but the output is decided by two values they entered in seconds (height + weight).
2. **BMI bands ignore population context.** A 30 BMI in an athletic 100 kg / 1.83 m frame is clinically different from a 30 BMI in a sedentary 90 kg / 1.73 m frame. Activity level is captured but unused.
3. **Underweight collapse.** BMI < 18.5 (clinically underweight, often warranting a different plan or a referral) is routed to the **Lifestyle Plan** identically to a healthy 22 BMI. The Lifestyle Plan is positioned as habit coaching for weight loss — wrong fit for underweight users.
4. **Open-to-treatment is binary.** `'no'` collapses everyone into Lifestyle regardless of severity. `'unsure'` is treated identically to `'yes'` — a user who's hesitant about meds gets pushed onto the Medication or Combined plan.
5. **Duplicate source of truth.** `OnboardingResultPage` and `DashboardPage` each carry their own copy of the rules. They agree today but will silently drift the first time someone updates only one of them.

#### Missing safety gates ⚠

1. **Pregnancy.** Captured (`pregnant` question), never read. A pregnant user with `bmi >= 30` is routed to the Combined Plan, which is described as "Medication plus lifestyle coaching" — GLP-1s are contraindicated in pregnancy. **High-priority bug.**
2. **History of eating disorder.** Captured, never read. A user reporting an eating disorder history is routed to medication-or-combined the same as anyone else. **High-priority bug.**
3. **Medications.** Captured, never read. No drug-interaction screening at all.
4. **Existing conditions** (diabetes / thyroid / BP / PCOS). Captured, never read. No plan adjustment.
5. **Age.** Validated to require ≥18 but otherwise unused.

#### Other observations

- **No persistence across browsers / devices.** Clearing site data, switching browsers, or using incognito wipes the user's assessment and forces them to redo it. Despite the user being authenticated via Supabase, none of the answers are linked to their `user_id`.
- **No audit trail.** No `completed_at` server-side, no version of the assessment recorded; if the questionnaire changes, old users' answers can't be replayed against the new rule set.
- **Idempotency.** `completeAssessment` overwrites the entire localStorage record every time. Retaking the assessment loses the prior answers permanently.

### Security concerns

- **Trust boundary.** Because the plan is computed client-side, the user could trivially edit `localStorage['healix_assessment'].answers.weight = 30` (or `openToTreatment = 'yes'` while underage / pregnant) to see a different recommendation. If plans were ever wired to a payment flow, this would let a user bypass medical gating. Today the Choose-plan buttons are `aria-disabled` so this is hypothetical, but any wiring to checkout should re-validate server-side.
- **No rate-limiting.** N/A for assessment because there are no API calls.
- **Anon key in browser.** Standard Supabase pattern — fine because RLS scopes every request to `auth.uid()`. Worth a reminder: if you ever add a `recommendations` table, it must also be RLS-scoped.

### Performance

- The whole assessment runs in-memory with `localStorage` writes. No network round-trips, no spinners. Very fast.
- BMI + plan re-computation on every dashboard render is trivial; both functions are O(1).
- The `useMemo` wrappers in `DashboardPage` already memoise `targetWeight` and the chart inputs.

### Potential bugs

| Bug | File | Impact |
|---|---|---|
| Plan logic duplicated in two files; will drift | `DashboardPage.jsx`, `OnboardingResultPage.jsx` | Bug surface |
| `chooseRecommendedPlan` reads `answers.openToTreatment` even when the question was skipped (no fallback for unanswered case) | `DashboardPage.jsx:47` | Edge case — relies on undefined ≠ `'no'` |
| Result page reads `state.answers` then falls back to `localStorage` directly bypassing `AuthContext` | `OnboardingResultPage.jsx:62-69` | Inconsistency — should use `useAuth().assessmentData` |
| `targetWeight` uses `answers.targetLoss` *or* a 10% reduction; not exposed in the assessment for non-`goal === 'lose'` users | `DashboardPage.jsx:71-79` | Confusing UX for users on Maintain / Improve Health |
| Question `consent` requires `min: 1` selection on a single-checkbox question — works but uses multi-select semantics for what is effectively a TOS gate | `healthAssessmentConfig.js:5-10` | Minor UX wart |

---

## 9. Visual Architecture

### Assessment → recommendation → dashboard flowchart

```
              ┌──────────────────────────────┐
              │  User signs up / logs in     │
              └──────────────┬───────────────┘
                             │
                  AuthContext.user populated
                             │
              ┌──────────────▼───────────────┐
              │  Visit /dashboard            │
              │  ProtectedRoute checks       │
              │  assessmentCompleted ?       │
              └──────┬───────────────┬───────┘
                     │               │
                  not yet           yes
                     │               │
                     ▼               ▼
        /onboarding/assessment   render DashboardPage
                     │
       ┌─────────────▼─────────────┐
       │  AssessmentContainer       │
       │   → AssessmentProvider     │
       │   → QuestionRenderer       │
       └──────────────┬─────────────┘
                      │
   on every answer    │
   ──────────────────►│  setAnswer + onProgress
                      │       │
                      │       ▼
                      │  AuthContext.saveAssessmentProgress
                      │       │
                      │       ▼
                      │  localStorage['healix_assessment'] = { answers, step }
                      │
   on last question   │  goNext → status: 'done'
   ──────────────────►│
                      │
   ┌──────────────────▼──────────────────┐
   │ AssessmentInner useEffect fires     │
   │  onComplete(answers)                │
   └──────────────────┬──────────────────┘
                      │
   ┌──────────────────▼──────────────────┐
   │ OnboardingAssessmentPage            │
   │  → completeAssessment(answers)      │
   │  → localStorage.completedAt = now() │
   │  → navigate('/onboarding/results',  │
   │              { state: { answers }}) │
   └──────────────────┬──────────────────┘
                      │
   ┌──────────────────▼──────────────────┐
   │ OnboardingResultPage                │
   │  BMI = w / (h/100)^2                │
   │  IIFE: bmi + openToTreatment        │
   │   → 'lifestyle' | 'medication'      │
   │   | 'combined'                      │
   │  Render 3 plan cards + recommended  │
   │  badge                              │
   └──────────────────┬──────────────────┘
                      │ "Continue to consultation"
                      ▼
   ┌─────────────────────────────────────┐
   │ DashboardPage                       │
   │  chooseRecommendedPlan(answers,bmi) │
   │   ← duplicate impl of the same rule │
   │  Renders the same 3 plan cards      │
   │  (separate static data array)       │
   └─────────────────────────────────────┘
```

### Component hierarchy (onboarding flow)

```
<AppRouter>
 └ <Suspense>
    └ <OnboardingAssessmentPage>
       └ <AssessmentContainer config={healthAssessmentConfig}>
          └ <AssessmentProvider>
             └ <AssessmentInner>
                ├ <ProgressBar />
                ├ <QuestionRenderer question={currentQuestion}>
                │   └ one of:
                │      <SingleChoiceQuestion>
                │      <MultiSelectQuestion>
                │      <CardSelectQuestion>
                │      <InputQuestion>
                │      <YesNoQuestion>
                │      <SliderQuestion>
                ├ <NavigationControls>
                ├ <LoadingScreen>   (transient — 'loading' state)
                └ <ResultScreen>    (when onComplete absent; not used in onboarding)

<OnboardingResultPage>
 ├ BMI summary block
 └ 3 × <article.onb-plan>  (Lifestyle / Medication / Combined)

<DashboardPage> (post-results)
 └ {assessmentCompleted ? Plan grid : null}
    └ 3 × <PlanCard recommended={recommended === p.id}>
```

### Database interaction diagram (assessment path)

```
   Browser memory                localStorage                  Supabase
  ┌──────────────┐         ┌──────────────────────┐         ┌─────────┐
  │ React state  │  ◄─────► │ healix_assessment    │         │  (no    │
  │ AssessmentCtx│         │   { answers, step,   │         │  table  │
  │   answers    │         │     completedAt }    │         │   for   │
  │   history    │         └──────────────────────┘         │  assess │
  │   status     │                                          │ -ment)  │
  └──────┬───────┘                                          └─────────┘
         │
         ▼
  ┌──────────────┐
  │ BMI compute  │  ── ► three-branch if/else ──► plan id (lifestyle | medication | combined)
  │ in JS only   │
  └──────────────┘
```

---

## 10. Final Deliverables

### File map referenced in this report

```
src/
├── routes/AppRouter.jsx
├── contexts/AuthContext.jsx
├── components/
│   ├── routes/ProtectedRoute.jsx
│   ├── assessment/
│   │   ├── AssessmentContainer.jsx
│   │   ├── AssessmentContext.jsx
│   │   ├── QuestionRenderer.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── NavigationControls.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── ResultScreen.jsx
│   │   └── questions/
│   │       ├── SingleChoiceQuestion.jsx
│   │       ├── MultiSelectQuestion.jsx
│   │       ├── CardSelectQuestion.jsx
│   │       ├── InputQuestion.jsx
│   │       ├── YesNoQuestion.jsx
│   │       └── SliderQuestion.jsx
│   └── dashboard/* (plan cards, score, etc.)
├── config/
│   ├── healthAssessmentConfig.js        ← onboarding questions
│   ├── wegovyAssessmentConfig.js        ← separate WL flow
│   ├── hairAssessmentConfig.js
│   └── assessmentConfig.js              ← standalone /assessment
├── pages/
│   ├── OnboardingAssessmentPage.jsx     ← runs the engine
│   ├── OnboardingResultPage.jsx         ← Implementation A of recommender
│   └── DashboardPage.jsx                ← Implementation B (duplicate)
└── lib/
    ├── supabase.js
    ├── supabaseAuth.js
    └── supabaseLogs.js                  ← dashboard data (not assessment)
```

### Improvement suggestions

#### Tier 1 — Correctness / safety (do these first)

1. **Move the recommender into a single utility** (`src/utils/recommendPlan.js`) and import it from both `OnboardingResultPage` and `DashboardPage`. Kills the duplication-drift risk.
2. **Add safety gates before the BMI branch.** Pregnant or eating-disorder history must short-circuit to Lifestyle Plan (or a "consult a provider" message), never Medication/Combined.
3. **Branch on `gender === 'female' && pregnant === 'yes'`** explicitly to surface a contraindication note.
4. **Reconsider Underweight (BMI < 18.5).** Either route to a different plan or surface "please consult a provider before starting weight-loss treatment."

#### Tier 2 — Architecture

5. **Persist assessments in Supabase.** Add a `public.assessments` table keyed by `user_id` with a `responses jsonb` column, `version`, and `completed_at`. Same RLS pattern as the other tables. This makes the assessment portable across devices and queryable by the care team later.
   ```sql
   create table public.assessments (
     id           bigserial primary key,
     user_id      uuid not null references auth.users(id) on delete cascade,
     responses    jsonb not null,
     config_version text default 'health-v1',
     completed_at timestamptz,
     created_at   timestamptz default now()
   );
   alter table public.assessments enable row level security;
   -- standard 4 policies …
   ```
6. **Persist the recommendation alongside** so the historical plan choice survives a rule change.

#### Tier 3 — Real signal

7. **Use the data you already collect.** Activity level → goal-step adjustment. Eating habits → calorie-goal adjustment. Comfortable-with `'lifestyle'` → bias toward Lifestyle Plan. Conditions/medications → contraindication checks.
8. **Replace the binary `openToTreatment === 'no'`** check with a richer preference signal (e.g. weight `'unsure'` differently from `'yes'`).
9. **Move plan computation server-side** (Postgres function or edge function) once it influences anything paid. Client-side computation is fine for display but should not be the only source of truth for a billable plan.

#### Tier 4 — Nice-to-haves

10. **Unify the four assessment configs.** `healthAssessmentConfig`, `wegovyAssessmentConfig`, `hairAssessmentConfig`, and `assessmentConfig` overlap on demographics + consent. Extract a shared `commonQuestions.js` and let each flow compose from it.
11. **Add a `version` to each config** so old answers can be replayed against the rules that were live when the answer was given.
12. **Visualise the recommendation rationale** to the user: instead of just a badge, show "Why this plan?" — the actual inputs it considered. Builds trust.

---

*Generated by code-trace audit. Every claim above is grounded in the referenced filename + line number; no hypothetical logic is inferred. If a question / file is not mentioned, it was inspected and confirmed not part of the recommendation pipeline.*
