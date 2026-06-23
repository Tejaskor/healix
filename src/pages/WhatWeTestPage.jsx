import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AnnouncementBar from '@/components/layout/AnnouncementBar/AnnouncementBar'
import HealixLogo from '@/components/common/HealixLogo/HealixLogo'
import UserMenu from '@/components/common/UserMenu/UserMenu'
import LabsOffcanvas from '@/components/sections/LabsOffcanvas/LabsOffcanvas'
import Footer from '@/components/layout/Footer/Footer'
import './LabsPage.scss'
import './WhatWeTestPage.scss'

// Same center-nav links Labs page uses, so the nav stays consistent across
// Labs sub-pages. "What We Test" is the active one here.
const navLinks = [
  { label: 'Health Check', to: '/labs' },
  { label: 'What We Test', to: '/labs/what-we-test' },
  { label: 'How It Works', to: '/labs/how-it-works' },
  { label: 'Action Plan', to: '/labs/action-plan' },
  { label: 'Cancer Screening', to: '/labs/cancer-screening' },
]

const panelTabs = [
  'Heart',
  'Metabolic',
  'Hormone',
  'Inflammation & Stress',
  'Thyroid',
  'Kidney',
  'Liver',
  'Immune',
  'Nutrients',
  'Blood',
]

const bloodBiomarkers = [
  {
    title: 'Hematocrit',
    body: 'Hematocrit measures how much of your blood is made up of red blood cells. Healthy levels support efficient oxygen delivery across your body.',
    // learnMore: 'Learn more about Hematocrit',
  },
  {
    title: 'Hemoglobin',
    body: 'Hemoglobin is the oxygen-carrying protein in red blood cells. Balanced levels ensure your organs and tissues receive the oxygen they need.',
    // learnMore: 'Learn more about Hemoglobin',
  },
  {
    title: 'Mean Corpuscular Hemoglobin Concentration (MCHC)',
    body: 'MCHC shows how concentrated hemoglobin is within your red blood cells. Normal levels indicate effective oxygen transport and healthy red blood cell function.',
    // learnMore: 'Learn more about Mean Corpuscular Hemoglobin Concentration (MCHC)',
  },
  {
    title: 'Mean Corpuscular Hemoglobin (MCH)',
    body: 'MCH reflects the average amount of hemoglobin in each red blood cell. Healthy values support proper oxygen circulation in the body.',
    // learnMore: 'Learn more about Mean Corpuscular Hemoglobin (MCH)',
  },
  {
    title: 'Mean Corpuscular Volume (MCV)',
    body: 'MCV measures the size of your red blood cells. It can help identify potential imbalances related to nutrition or blood health.',
    // learnMore: 'Learn more about Mean Corpuscular Volume (MCV)',
  },
  {
    title: 'Mean Platelet Volume (MPV)',
    body: 'MPV indicates the average size of your platelets, which are important for clotting. Balanced levels suggest normal platelet function.',
    // learnMore: 'Learn more about Mean Platelet Volume (MPV)',
  },
  {
    title: 'Platelet Count',
    body: 'Platelets help your body stop bleeding by forming clots. Healthy levels support proper healing and protection.',
    // learnMore: 'Learn more about Platelet Count',
  },
  {
    title: 'Red Blood Cell Count',
    body: 'This measures the number of red blood cells in your blood. Balanced levels indicate efficient oxygen transport.',
    // learnMore: 'Learn more about Red Blood Cell Count',
  },
  {
    title: 'Red Cell Distribution Width (RDW)',
    body: 'RDW shows how consistent your red blood cells are in size. Stable levels suggest effective and uniform oxygen delivery.',
    // learnMore: 'Learn more about Red Cell Distribution Width (RDW)',
  },
]

const nutrientsBiomarkers = [
  {
    title: 'Vitamin B12',
    body: 'Vitamin B12 is important for energy production, nerve function, and red blood cell formation. Healthy levels support sustained energy and overall vitality.',
    // learnMore: 'Learn more about Vitamin B12',
  },
  {
    title: 'Ferritin',
    body: 'Ferritin reflects the amount of stored iron in your body. Balanced levels indicate sufficient reserves to support oxygen transport and energy.',
    // learnMore: 'Learn more about Ferritin',
  },
  {
    title: 'Folate, RBC',
    body: 'Folate supports DNA formation and helps produce healthy red blood cells. Adequate levels contribute to proper cellular function.',
    // learnMore: 'Learn more about Folate, RBC',
  },
  {
    title: 'Homocysteine',
    body: 'This amino acid is linked to how your body processes key vitamins. Healthy levels suggest proper nutrient metabolism.',
    // learnMore: 'Learn more about Homocysteine',
  },
  {
    title: 'Iron',
    body: 'Iron is essential for carrying oxygen in the blood. Balanced levels help maintain energy and focus.',
    // learnMore: 'Learn more about Iron',
  },
  {
    title: 'Iron Binding Capacity',
    body: 'This measures how effectively your blood can transport iron. Healthy levels indicate efficient iron movement throughout the body.',
    // learnMore: 'Learn more about Iron Binding Capacity',
  },
  {
    title: 'Iron Saturation',
    body: 'This shows how much iron is being carried in your blood. Proper levels ensure your tissues receive enough oxygen.',
    // learnMore: 'Learn more about Iron Saturation',
  },
  {
    title: 'Magnesium, RBC',
    body: 'Magnesium supports muscle function, nerve activity, and energy production. Healthy levels help maintain overall balance in the body.',
    // learnMore: 'Learn more about Magnesium, RBC',
  },
  {
    title: 'Vitamin D',
    body: 'Vitamin D plays a key role in bone strength, immune support, and mood regulation. Adequate levels support overall wellness.',
    // learnMore: 'Learn more about Vitamin D',
  },
  {
    title: 'Zinc',
    body: 'Zinc supports immune health, healing, and sensory functions like taste and smell. Balanced levels help maintain strong defenses.',
    // learnMore: 'Learn more about Zinc',
  },
  {
    title: 'Carbon Dioxide',
    body: 'This helps regulate the body\u2019s acid-base balance, supporting proper breathing and energy levels.',
    // learnMore: 'Learn more about Carbon Dioxide',
  },
  {
    title: 'Calcium',
    body: 'Calcium is essential for strong bones, muscle function, and proper nerve signaling. Healthy levels support overall body function.',
    // learnMore: 'Learn more about Calcium',
  },
  {
    title: 'Chloride',
    body: 'Chloride helps maintain fluid balance and supports digestion by contributing to stomach acid production.',
    // learnMore: 'Learn more about Chloride',
  },
  {
    title: 'Potassium',
    body: 'Potassium supports heart rhythm, muscle movement, and nerve signals. Balanced levels are important for daily function.',
    // learnMore: 'Learn more about Potassium',
  },
  {
    title: 'Sodium',
    body: 'Sodium helps regulate fluid balance, blood pressure, and nerve activity. Healthy levels support overall stability in the body.',
    // learnMore: 'Learn more about Sodium',
  },
]

const immuneBiomarkers = [
  {
    title: 'Basophils (absolute count)',
    body: 'Basophils are a type of white blood cell that help your body respond to allergens and fight certain parasites.',
    // learnMore: 'Learn more about Basophils (absolute count)',
    badge: 'Tested 2x/year',
  },
  {
    title: 'Basophils (percentage)',
    body: 'Basophils typically make up less than 1% of your total white blood cells and help trigger allergic responses and fight certain parasites. A healthy percentage means your blood contains the expected proportion of basophils, which are important for normal immune function.',
    // learnMore: 'Learn more about Basophils (percentage)',
    badge: 'Tested 2x/year',
  },
  {
    title: 'Eosinophils (absolute count)',
    body: 'Eosinophils are a type of white blood cell that help to control allergy-related inflammation and protect against certain parasites. A healthy count means your blood contains the expected number of eosinophils, which are important for normal immune function.',
    // learnMore: 'Learn more about Eosinophils (absolute count)',
    badge: 'Tested 2x/year',
  },
  {
    title: 'Eosinophils (percentage)',
    body: 'Eosinophils normally make up about 1-4% of your total white blood cells and help your body fight parasites and control allergy-related inflammation. A healthy percentage means your blood contains the expected proportion of eosinophils, which are important for normal immune function.',
    // learnMore: 'Learn more about Eosinophils (percentage)',
    badge: 'Tested 2x/year',
  },
  {
    title: 'Lymphocytes (absolute count)',
    body: 'Lymphocytes are a type of white blood cell that play a key role in building long-term immunity by recognizing and attacking viruses. A healthy count means your immune system is equipped to defend against infections and maintain balance.',
    // learnMore: 'Learn more about Lymphocytes (absolute count)',
    badge: 'Tested 2x/year',
  },
  {
    title: 'Lymphocytes (percentage)',
    body: 'Lymphocytes typically make up 20-40% of your total white blood cells and help your body fight viral infections while building long-term immunity. A healthy percentage means your blood contains the expected proportion of lymphocytes, which are important for normal immune function.',
    // learnMore: 'Learn more about Lymphocytes (percentage)',
    badge: 'Tested 2x/year',
  },
  {
    title: 'Monocytes (absolute count)',
    body: 'Monocytes are a type of white blood cell that help your body defend against bacteria and clean up damaged cells. A healthy count means your immune system is working efficiently to support your healing and protect against infection.',
    // learnMore: 'Learn more about Monocytes (absolute count)',
    badge: 'Tested 2x/year',
  },
  {
    title: 'Monocytes (percentage)',
    body: 'Monocytes typically make up about 2-8% of your total white blood cells. They act as your body\u2019s clean-up crew to remove damaged cells and help fight bacterial infections. A healthy percentage means your blood contains the expected proportion of monocytes, which are important for normal immune function.',
    // learnMore: 'Learn more about Monocytes (percentage)',
    badge: 'Tested 2x/year',
  },
  {
    title: 'Neutrophils (absolute count)',
    body: 'Neutrophils are the most common type of white blood cell and act as your body\u2019s first line of defense against bacterial infections. A healthy count means your immune system is well-prepared to respond quickly to infection when needed.',
    // learnMore: 'Learn more about Neutrophils (absolute count)',
    badge: 'Tested 2x/year',
  },
  {
    title: 'Neutrophils (percentage)',
    body: 'Neutrophils are the most common type of white blood cell, typically making up 50\u201370% of your total white blood cells. They act as your body\u2019s first line of defense against bacterial infections. A healthy percentage means your blood contains the expected proportion of neutrophils, which are important for normal immune function.',
    // learnMore: 'Learn more about Neutrophils (percentage)',
    badge: 'Tested 2x/year',
  },
  {
    title: 'White Blood Cell Count',
    body: 'White blood cells are an essential part of your immune system, helping your body fight infections and support healing. A healthy count means your immune defenses are strong and ready to respond in case infection arises.',
    // learnMore: 'Learn more about White Blood Cell Count',
    badge: 'Tested 2x/year',
  },
  {
    title: 'Systemic Immune-Inflammation Index (SII)',
    body: 'The systemic immune-inflammation index (SII) combines three key blood markers, platelets, neutrophils, and lymphocytes, to reflect the balance between inflammation and your immune defenses. A healthy SII means your immune system is well-regulated, not under excess inflammatory strain, and ready to defend your body against infection effectively.',
    // learnMore: 'Learn more about Systemic Immune-Inflammation Index (SII)',
    badge: 'Tested 2x/year',
  },
]

const liverBiomarkers = [
  {
    title: 'Alanine Transaminase (ALT)',
    body: 'ALT is an enzyme found in liver cells that helps process proteins. Healthy levels suggest your liver cells are functioning properly.',
    // learnMore: 'Learn more about Alanine Transaminase (ALT)',
  },
  {
    title: 'Aspartate Aminotransferase (AST)',
    body: 'AST is an enzyme present in both the liver and muscles. Balanced levels indicate that these tissues are not under stress or damage.',
    // learnMore: 'Learn more about Aspartate Aminotransferase (AST)',
  },
  {
    title: 'Alkaline Phosphatase (ALP)',
    body: 'ALP is linked to liver function and bile flow. Normal levels support healthy liver activity and overall metabolic processes.',
    // learnMore: 'Learn more about Alkaline Phosphatase (ALP)',
  },
  {
    title: 'Albumin',
    body: 'Albumin is a protein produced by the liver that helps transport essential substances in the blood and maintain fluid balance.',
    // learnMore: 'Learn more about Albumin',
  },
  {
    title: 'Total Protein',
    body: 'This measures the combined amount of important proteins in your blood that support immune function and nutrient transport.',
    // learnMore: 'Learn more about Total Protein',
  },
  {
    title: 'Globulin',
    body: 'Globulins are proteins that play a role in immune defense and transporting nutrients. Healthy levels reflect proper liver and immune function.',
    // learnMore: 'Learn more about Globulin',
  },
  {
    title: 'Albumin/Globulin (A/G) Ratio',
    body: 'This ratio compares two key blood proteins to assess overall liver health and immune system balance.',
    // learnMore: 'Learn more about Albumin/Globulin (A/G) Ratio',
  },
]

const kidneyBiomarkers = [
  {
    title: 'Blood Urea Nitrogen (BUN)',
    body: 'BUN measures the level of waste produced from protein breakdown in your blood. Balanced levels indicate your kidneys are effectively clearing this waste.',
    // learnMore: 'Learn more about Blood Urea Nitrogen (BUN)',
  },
  {
    title: 'BUN/Creatinine Ratio',
    body: 'This ratio compares two important waste markers to provide insight into hydration and how your body processes protein. Healthy values suggest proper kidney function and fluid balance.',
    // learnMore: 'Learn more about BUN/Creatinine Ratio',
  },
  {
    title: 'Creatinine',
    body: 'Creatinine is a natural waste product generated by muscle activity. Stable levels show that your kidneys are filtering waste efficiently.',
    // learnMore: 'Learn more about Creatinine',
  },
  {
    title: 'Estimated Glomerular Filtration Rate (eGFR)',
    body: 'eGFR estimates how well your kidneys are filtering blood. A healthy range reflects effective waste removal and proper kidney performance.',
    // learnMore: 'Learn more about Estimated Glomerular Filtration Rate (eGFR)',
  },
]

const thyroidBiomarkers = [
  {
    title: 'Thyroglobulin Antibodies (TgAb)',
    body: 'These antibodies can affect the proteins your thyroid uses to produce hormones. Lower levels suggest your immune system is not interfering with normal thyroid function.',
    // learnMore: 'Learn more about Thyroglobulin Antibodies (TgAb)',
  },
  {
    title: 'Thyroid Peroxidase Antibodies (TPOAb)',
    body: 'These antibodies may impact enzymes involved in hormone production. Healthy levels indicate your thyroid can produce hormones without disruption.',
    // learnMore: 'Learn more about Thyroid Peroxidase Antibodies (TPOAb)',
  },
  {
    title: 'Free Triiodothyronine (T3)',
    body: 'T3 is the active form of thyroid hormone that supports energy, metabolism, and overall function. Balanced levels help maintain steady energy and daily performance.',
    // learnMore: 'Learn more about Free Triiodothyronine (T3)',
  },
  {
    title: 'Thyroid-Stimulating Hormone (TSH)',
    body: 'TSH signals your thyroid to produce hormones. A balanced level shows proper communication between your brain and thyroid for stable metabolism and energy.',
    // learnMore: 'Learn more about Thyroid-Stimulating Hormone (TSH)',
  },
  {
    title: 'Free Thyroxine (T4)',
    body: 'T4 is the primary hormone produced by the thyroid, which your body converts into its active form when needed. Healthy levels support consistent hormone availability.',
    // learnMore: 'Learn more about Free Thyroxine (T4)',
  },
]

const inflammationBiomarkers = [
  {
    title: 'Cortisol',
    body: 'Cortisol is a key hormone released during stress that plays a role in energy levels, metabolism, and immune response. Balanced levels support better focus, stable mood, and overall resilience.',
    // learnMore: 'Learn more about Cortisol',
  },
  {
    title: 'DHEA-S',
    body: 'DHEA-S is produced by the adrenal glands and helps regulate the effects of stress hormones. Healthy levels contribute to balanced energy, mood stability, and long-term wellness.',
    // learnMore: 'Learn more about DHEA-S',
  },
]

const hormoneBiomarkers = [
  {
    title: 'Insulin-like Growth Factor 1 (IGF-1)',
    body: 'IGF-1 reflects how active your growth hormone system is. Balanced levels support healthy muscle, bone strength, and tissue repair.',
    // learnMore: 'Learn more about Insulin-like Growth Factor 1 (IGF-1)',
  },
  {
    title: 'IGF-1 Z-score',
    body: 'This value compares your IGF-1 level with others in your age group. It helps show whether your levels are within a typical range based on age and development.',
    // learnMore: 'Learn more about IGF-1 Z-score',
  },
  {
    title: 'Estradiol',
    body: 'Estradiol is a form of estrogen present in men, produced from testosterone. Healthy levels support bone health, brain function, and overall well-being.',
    // learnMore: 'Learn more about Estradiol',
  },
  {
    title: 'Follicle Stimulating Hormone (FSH)',
    body: 'FSH is produced by the brain and plays an important role in reproductive health, including sperm production.',
    // learnMore: 'Learn more about Follicle Stimulating Hormone (FSH)',
  },
  {
    title: 'Luteinizing Hormone (LH)',
    body: 'LH helps regulate testosterone production and is essential for maintaining hormonal balance in the body.',
    // learnMore: 'Learn more about Luteinizing Hormone (LH)',
  },
  {
    title: 'Prostate Specific Antigen (PSA)',
    body: 'PSA is a protein made by the prostate gland and is commonly used to assess prostate health.',
    // learnMore: 'Learn more about Prostate Specific Antigen (PSA)',
  },
  {
    title: 'Sex Hormone Binding Globulin (SHBG)',
    body: 'SHBG is a protein that binds to hormones like testosterone, controlling how much is available for your body to use.',
    // learnMore: 'Learn more about Sex Hormone Binding Globulin (SHBG)',
  },
  {
    title: 'Free Testosterone',
    body: 'This is the portion of testosterone that is readily available for use in the body, supporting energy, strength, and overall vitality.',
    // learnMore: 'Learn more about Free Testosterone',
  },
  {
    title: 'Total Testosterone',
    body: 'This measures the overall amount of testosterone in your bloodstream, including both active and bound forms, and helps assess hormonal health.',
    // learnMore: 'Learn more about Total Testosterone',
  },
]

const metabolicBiomarkers = [
  {
    title: 'Uric Acid',
    body: 'Uric acid forms when your body breaks down certain foods. It is normally filtered out by the kidneys. Balanced levels indicate your body is processing waste effectively.',
    // learnMore: 'Learn more about Uric Acid',
  },
  {
    title: 'Glucose',
    body: 'Glucose is the primary source of energy in your bloodstream. Stable levels show that your body is effectively managing blood sugar.',
    // learnMore: 'Learn more about Glucose',
  },
  {
    title: 'Hemoglobin A1c (HbA1c)',
    body: 'This test reflects your average blood sugar levels over the past few months. Consistent readings within range suggest good long-term glucose control.',
    // learnMore: 'Learn more about Hemoglobin A1c (HbA1c)',
  },
  {
    title: 'Insulin',
    body: 'Insulin is a hormone that helps move sugar from your blood into your cells for energy. Healthy levels indicate efficient blood sugar regulation and metabolic balance.',
    // learnMore: 'Learn more about Insulin',
  },
]

const heartBiomarkers = [
  {
    title: 'Apolipoprotein B (ApoB)',
    body: 'ApoB is a protein linked to particles that carry harmful cholesterol in the blood. Lower levels suggest fewer of these particles and better support for heart health.',
    // learnMore: 'Learn more about Apolipoprotein B',
  },
  {
    title: 'High-Sensitivity C-Reactive Protein (hs-CRP)',
    body: 'This protein increases when there is inflammation in the body. Lower levels are generally associated with a healthier heart.',
    // learnMore: 'Learn more about High-Sensitivity C-Reactive Protein',
  },
  {
    title: 'Lipoprotein (a) [Lp(a)]',
    body: 'Lp(a) is a type of cholesterol particle influenced by genetics. Lower levels are typically considered better for maintaining heart health.',
    // learnMore: 'Learn more about Lipoprotein (a)',
  },
  {
    title: 'Non-HDL Cholesterol',
    body: 'This includes all cholesterol types that may contribute to plaque buildup in arteries. Keeping levels in a healthy range supports cardiovascular wellness.',
    // learnMore: 'Learn more about Non-HDL Cholesterol',
  },
  {
    title: 'HDL Cholesterol',
    body: 'Often called "good" cholesterol, HDL helps remove excess fats from the bloodstream. Higher levels can support better heart protection.',
    // learnMore: 'Learn more about HDL Cholesterol',
  },
  {
    title: 'LDL Cholesterol',
    body: 'Known as "bad" cholesterol, LDL can contribute to plaque formation in arteries. Lower levels help reduce this risk.',
    // learnMore: 'Learn more about LDL Cholesterol',
  },
  {
    title: 'Total Cholesterol',
    body: 'This measures the combined amount of different cholesterol types in your blood, offering an overall view of your cholesterol status.',
    // learnMore: 'Learn more about Total Cholesterol',
  },
  {
    title: 'Cholesterol/HDL Ratio',
    body: 'This compares total cholesterol with HDL levels to give a clearer picture of heart health balance.',
    // learnMore: 'Learn more about Cholesterol/HDL Ratio',
  },
  {
    title: 'Triglycerides',
    body: 'These are fats stored in the body for energy. Healthy levels indicate better fat metabolism and support overall cardiovascular health.',
    // learnMore: 'Learn more about Triglycerides',
  },
]

const WhatWeTestPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [labsOpen, setLabsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Heart')
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)
  const [openBiomarker, setOpenBiomarker] = useState(0)
  const [openMetabolic, setOpenMetabolic] = useState(-1)
  const [openHormone, setOpenHormone] = useState(-1)
  const [openInflammation, setOpenInflammation] = useState(-1)
  const [openThyroid, setOpenThyroid] = useState(-1)
  const [openKidney, setOpenKidney] = useState(-1)
  const [openLiver, setOpenLiver] = useState(-1)
  const [openImmune, setOpenImmune] = useState(-1)
  const [openNutrients, setOpenNutrients] = useState(-1)
  const [openBlood, setOpenBlood] = useState(-1)
  const tabsRef = useRef(null)

  useEffect(() => {
    const handler = () => setLabsOpen(true)
    window.addEventListener('open-labs-offcanvas', handler)
    return () => window.removeEventListener('open-labs-offcanvas', handler)
  }, [])

  // Track whether there's hidden content on the left/right so we can show
  // the corresponding arrow on hover (hidden on whichever side is fully
  // scrolled).
  useEffect(() => {
    const el = tabsRef.current
    if (!el) return
    const update = () => {
      setCanLeft(el.scrollLeft > 4)
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const scrollTabs = (dir) => {
    const el = tabsRef.current
    if (!el) return
    el.scrollBy({ left: dir * 250, behavior: 'smooth' })
  }

  return (
    <div className="labs-page">
      <AnnouncementBar
        iconSrc={null}
        message={(
          <span style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Full-body lab testing without the high cost
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        )}
        ctaText=""
        ctaHref=""
        className="announcement-bar--labs"
      />

      {/* Shared Labs navbar */}
      <header className="labs-nav">
        <div className="labs-nav__container">
          <Link to="/" className="labs-nav__logo" aria-label="Healix homepage">
            <HealixLogo color="dark" size="md" />
          </Link>

          <div className="labs-nav__center">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <button
                  key={link.label}
                  className={`labs-nav__link ${isActive ? 'labs-nav__link--active' : ''}`}
                  onClick={() => navigate(link.to)}
                >
                  {link.label}
                </button>
              )
            })}
          </div>

          <div className="labs-nav__right">
            <UserMenu className="labs-nav__login" />
            <button
              className="labs-nav__hamburger"
              onClick={() => setLabsOpen(true)}
              aria-label="Open menu"
            >
              <span className="labs-nav__hamburger-bar" />
              <span className="labs-nav__hamburger-bar" />
              <span className="labs-nav__hamburger-bar" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="wwt-hero">
        <div className="wwt-hero__container">
          {/* Performance: this is the LCP image for /labs/what-we-test.
              Eager + fetchpriority="high" pairs with the route-aware
              preload hint in index.html so the bytes start flowing during
              HTML parse instead of after the page chunk renders. */}
          <img
            src="/images/h_biomarker_hero-d-2.webp"
            alt=""
            className="wwt-hero__bg"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
          <div className="wwt-hero__overlay" aria-hidden="true" />
          <div className="wwt-hero__content">
            <h1 className="wwt-hero__heading">
              Smarter insights
              <br />
              into your health
            </h1>
            <p className="wwt-hero__sub">
              Detect early signals across 1,000+ health conditions with advanced testing.
            </p>
            <div className="wwt-hero__actions">
              <button type="button" className="wwt-hero__btn wwt-hero__btn--primary" aria-disabled="true">Get started</button>
              <button type="button" className="wwt-hero__btn wwt-hero__btn--secondary" aria-disabled="true">Learn more</button>
            </div>
          </div>
        </div>

        <p className="wwt-hero__disclaimer">
          Not offered in all locations. Eligibility and a provider&rsquo;s approval may be required. Lab results are for informational purposes only and are not a substitute for medical diagnosis, treatment, or care.{' '}
          {/* <a href="#" className="wwt-hero__more" aria-disabled="true">Learn more</a> */}
        </p>
      </section>

      {/* Panel — heading + paragraph + scrollable category tabs */}
      <section className="wwt-panel">
        <div className="wwt-panel__inner">
          <header className="wwt-panel__header">
            <h2 className="wwt-panel__heading">Explore the details behind your health insights</h2>
            <p className="wwt-panel__desc">
              Gain a deeper understanding of your overall health through carefully curated tests, organized to provide a well-rounded and meaningful overview of your body.
            </p>
          </header>

          <div className={`wwt-panel__tabs-wrap ${canLeft ? 'can-left' : ''} ${canRight ? 'can-right' : ''}`}>
            <button
              type="button"
              className="wwt-panel__arrow wwt-panel__arrow--left"
              onClick={() => scrollTabs(-1)}
              aria-label="Scroll tabs left"
              aria-hidden={!canLeft}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="wwt-panel__tabs" ref={tabsRef} role="tablist">
              {panelTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={tab === activeTab}
                  className={`wwt-panel__tab ${tab === activeTab ? 'wwt-panel__tab--active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="wwt-panel__arrow wwt-panel__arrow--right"
              onClick={() => scrollTabs(1)}
              aria-label="Scroll tabs right"
              aria-hidden={!canRight}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          {/* Heart Health — category info (left) + biomarker accordion (right) */}
          <div className="wwt-heart">
            <div className="wwt-heart__left">
              <img
                src="/images/h--heart-health--category-texture-2.webp"
                alt=""
                className="wwt-heart__img"
               loading="lazy" decoding="async"/>
              <h3 className="wwt-heart__heading">Heart health</h3>
              <p className="wwt-heart__desc">
                Your heart plays a vital role in circulating oxygen and nutrients throughout your body. Monitoring cholesterol levels and inflammation helps provide important insights into your cardiovascular health and overall risk.
              </p>
              <div className="wwt-heart__actions">
                <button type="button" className="wwt-heart__btn wwt-heart__btn--primary" aria-disabled="true">Get started</button>
                <button type="button" className="wwt-heart__btn wwt-heart__btn--outline" aria-disabled="true">Learn more</button>
              </div>
            </div>

            <ul className="wwt-heart__list">
              {heartBiomarkers.map((b, idx) => {
                const isOpen = openBiomarker === idx
                return (
                  <li
                    key={b.title}
                    className={`wwt-heart__item ${isOpen ? 'wwt-heart__item--open' : ''}`}
                  >
                    <button
                      type="button"
                      className="wwt-heart__item-head"
                      aria-expanded={isOpen}
                      onClick={() => setOpenBiomarker(isOpen ? -1 : idx)}
                    >
                      <span className="wwt-heart__item-title">{b.title}</span>
                      {b.badge && <span className="wwt-heart__badge">{b.badge}</span>}
                      <svg className="wwt-heart__chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div className="wwt-heart__item-body">
                      <div className="wwt-heart__item-body-inner">
                        <p>{b.body}</p>
                        {b.learnMore && (
                          <a href="#" className="wwt-heart__learn" aria-disabled="true">{b.learnMore}</a>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Metabolic Health — same layout/styles as the heart block */}
          <div className="wwt-heart">
            <div className="wwt-heart__left">
              <img
                src="/images/h--metabolic-health--category-texture-2.webp"
                alt=""
                className="wwt-heart__img"
               loading="lazy" decoding="async"/>
              <h3 className="wwt-heart__heading">Metabolic health</h3>
              <p className="wwt-heart__desc">
                Your metabolism supports how your body produces energy and repairs cells. Monitoring blood sugar and insulin levels helps ensure your system is functioning efficiently and staying balanced.
              </p>
              <div className="wwt-heart__actions">
                <button type="button" className="wwt-heart__btn wwt-heart__btn--primary" aria-disabled="true">Get started</button>
                <button type="button" className="wwt-heart__btn wwt-heart__btn--outline" aria-disabled="true">Learn more</button>
              </div>
            </div>

            <ul className="wwt-heart__list">
              {metabolicBiomarkers.map((b, idx) => {
                const isOpen = openMetabolic === idx
                return (
                  <li
                    key={b.title}
                    className={`wwt-heart__item ${isOpen ? 'wwt-heart__item--open' : ''}`}
                  >
                    <button
                      type="button"
                      className="wwt-heart__item-head"
                      aria-expanded={isOpen}
                      onClick={() => setOpenMetabolic(isOpen ? -1 : idx)}
                    >
                      <span className="wwt-heart__item-title">{b.title}</span>
                      {b.badge && <span className="wwt-heart__badge">{b.badge}</span>}
                      <svg className="wwt-heart__chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div className="wwt-heart__item-body">
                      <div className="wwt-heart__item-body-inner">
                        <p>{b.body}</p>
                        {b.learnMore && (
                          <a href="#" className="wwt-heart__learn" aria-disabled="true">{b.learnMore}</a>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Hormone Health — same layout/styles as the heart block */}
          <div className="wwt-heart">
            <div className="wwt-heart__left">
              <img
                src="/images/h--hormone-health--category-texture-2.webp"
                alt=""
                className="wwt-heart__img"
               loading="lazy" decoding="async"/>
              <h3 className="wwt-heart__heading">Hormone health</h3>
              <p className="wwt-heart__desc">
                Hormones act as your body&rsquo;s internal messengers, influencing energy levels, mood, and reproductive health. Tracking these levels helps determine how well your endocrine system is functioning and staying balanced.
              </p>
              <div className="wwt-heart__actions">
                <button type="button" className="wwt-heart__btn wwt-heart__btn--primary" aria-disabled="true">Get started</button>
                <button type="button" className="wwt-heart__btn wwt-heart__btn--outline" aria-disabled="true">Learn more</button>
              </div>
            </div>

            <ul className="wwt-heart__list">
              {hormoneBiomarkers.map((b, idx) => {
                const isOpen = openHormone === idx
                return (
                  <li
                    key={b.title}
                    className={`wwt-heart__item ${isOpen ? 'wwt-heart__item--open' : ''}`}
                  >
                    <button
                      type="button"
                      className="wwt-heart__item-head"
                      aria-expanded={isOpen}
                      onClick={() => setOpenHormone(isOpen ? -1 : idx)}
                    >
                      <span className="wwt-heart__item-title">{b.title}</span>
                      {b.badge && <span className="wwt-heart__badge">{b.badge}</span>}
                      <svg className="wwt-heart__chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div className="wwt-heart__item-body">
                      <div className="wwt-heart__item-body-inner">
                        <p>{b.body}</p>
                        {b.learnMore && (
                          <a href="#" className="wwt-heart__learn" aria-disabled="true">{b.learnMore}</a>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Inflammation & Stress — same layout/styles as the heart block */}
          <div className="wwt-heart">
            <div className="wwt-heart__left">
              <img
                src="/images/h--inflammation-and-stress--category-texture-2.webp"
                alt=""
                className="wwt-heart__img"
               loading="lazy" decoding="async"/>
              <h3 className="wwt-heart__heading">Inflammation &amp; stress</h3>
              <p className="wwt-heart__desc">
                Your body&rsquo;s response to stress and internal balance can be understood through key markers related to inflammation and hormone activity. These insights help reflect how well your body manages energy, recovery, and overall well-being.
              </p>
              <div className="wwt-heart__actions">
                <button type="button" className="wwt-heart__btn wwt-heart__btn--primary" aria-disabled="true">Get started</button>
                <button type="button" className="wwt-heart__btn wwt-heart__btn--outline" aria-disabled="true">Learn more</button>
              </div>
            </div>

            <ul className="wwt-heart__list">
              {inflammationBiomarkers.map((b, idx) => {
                const isOpen = openInflammation === idx
                return (
                  <li
                    key={b.title}
                    className={`wwt-heart__item ${isOpen ? 'wwt-heart__item--open' : ''}`}
                  >
                    <button
                      type="button"
                      className="wwt-heart__item-head"
                      aria-expanded={isOpen}
                      onClick={() => setOpenInflammation(isOpen ? -1 : idx)}
                    >
                      <span className="wwt-heart__item-title">{b.title}</span>
                      {b.badge && <span className="wwt-heart__badge">{b.badge}</span>}
                      <svg className="wwt-heart__chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div className="wwt-heart__item-body">
                      <div className="wwt-heart__item-body-inner">
                        <p>{b.body}</p>
                        {b.learnMore && (
                          <a href="#" className="wwt-heart__learn" aria-disabled="true">{b.learnMore}</a>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Thyroid Health — same layout/styles as the heart block */}
          <div className="wwt-heart">
            <div className="wwt-heart__left">
              <img
                src="/images/h--thyroid-health--category-texture-5.webp"
                alt=""
                className="wwt-heart__img"
               loading="lazy" decoding="async"/>
              <h3 className="wwt-heart__heading">Thyroid health</h3>
              <p className="wwt-heart__desc">
                The thyroid plays a key role in regulating hormones that control metabolism, energy levels, and mood. Monitoring these markers helps identify whether your thyroid is functioning at a healthy and balanced level.
              </p>
              <div className="wwt-heart__actions">
                <button type="button" className="wwt-heart__btn wwt-heart__btn--primary" aria-disabled="true">Get started</button>
                <button type="button" className="wwt-heart__btn wwt-heart__btn--outline" aria-disabled="true">Learn more</button>
              </div>
            </div>

            <ul className="wwt-heart__list">
              {thyroidBiomarkers.map((b, idx) => {
                const isOpen = openThyroid === idx
                return (
                  <li
                    key={b.title}
                    className={`wwt-heart__item ${isOpen ? 'wwt-heart__item--open' : ''}`}
                  >
                    <button
                      type="button"
                      className="wwt-heart__item-head"
                      aria-expanded={isOpen}
                      onClick={() => setOpenThyroid(isOpen ? -1 : idx)}
                    >
                      <span className="wwt-heart__item-title">{b.title}</span>
                      {b.badge && <span className="wwt-heart__badge">{b.badge}</span>}
                      <svg className="wwt-heart__chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div className="wwt-heart__item-body">
                      <div className="wwt-heart__item-body-inner">
                        <p>{b.body}</p>
                        {b.learnMore && (
                          <a href="#" className="wwt-heart__learn" aria-disabled="true">{b.learnMore}</a>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Kidney Health — same layout/styles as the heart block */}
          <div className="wwt-heart">
            <div className="wwt-heart__left">
              <img
                src="/images/h--kidney-health--category-texture-4.webp"
                alt=""
                className="wwt-heart__img"
               loading="lazy" decoding="async"/>
              <h3 className="wwt-heart__heading">Kidney health</h3>
              <p className="wwt-heart__desc">
                Your kidneys play an essential role in filtering waste and maintaining fluid balance in the body. Monitoring key markers helps assess how efficiently your kidneys are removing waste and supporting overall health.
              </p>
              <div className="wwt-heart__actions">
                <button type="button" className="wwt-heart__btn wwt-heart__btn--primary" aria-disabled="true">Get started</button>
                <button type="button" className="wwt-heart__btn wwt-heart__btn--outline" aria-disabled="true">Learn more</button>
              </div>
            </div>

            <ul className="wwt-heart__list">
              {kidneyBiomarkers.map((b, idx) => {
                const isOpen = openKidney === idx
                return (
                  <li
                    key={b.title}
                    className={`wwt-heart__item ${isOpen ? 'wwt-heart__item--open' : ''}`}
                  >
                    <button
                      type="button"
                      className="wwt-heart__item-head"
                      aria-expanded={isOpen}
                      onClick={() => setOpenKidney(isOpen ? -1 : idx)}
                    >
                      <span className="wwt-heart__item-title">{b.title}</span>
                      {b.badge && <span className="wwt-heart__badge">{b.badge}</span>}
                      <svg className="wwt-heart__chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div className="wwt-heart__item-body">
                      <div className="wwt-heart__item-body-inner">
                        <p>{b.body}</p>
                        {b.learnMore && (
                          <a href="#" className="wwt-heart__learn" aria-disabled="true">{b.learnMore}</a>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Liver Health — same layout/styles as the heart block */}
          <div className="wwt-heart">
            <div className="wwt-heart__left">
              <img
                src="/images/h--liver-health--category-texture8.webp"
                alt=""
                className="wwt-heart__img"
               loading="lazy" decoding="async"/>
              <h3 className="wwt-heart__heading">Liver health</h3>
              <p className="wwt-heart__desc">
                Your liver plays a key role in processing nutrients, removing toxins, and supporting metabolism. Monitoring specific markers helps evaluate how well your liver is functioning and maintaining overall balance in the body.
              </p>
              <div className="wwt-heart__actions">
                <button type="button" className="wwt-heart__btn wwt-heart__btn--primary" aria-disabled="true">Get started</button>
                <button type="button" className="wwt-heart__btn wwt-heart__btn--outline" aria-disabled="true">Learn more</button>
              </div>
            </div>

            <ul className="wwt-heart__list">
              {liverBiomarkers.map((b, idx) => {
                const isOpen = openLiver === idx
                return (
                  <li
                    key={b.title}
                    className={`wwt-heart__item ${isOpen ? 'wwt-heart__item--open' : ''}`}
                  >
                    <button
                      type="button"
                      className="wwt-heart__item-head"
                      aria-expanded={isOpen}
                      onClick={() => setOpenLiver(isOpen ? -1 : idx)}
                    >
                      <span className="wwt-heart__item-title">{b.title}</span>
                      {b.badge && <span className="wwt-heart__badge">{b.badge}</span>}
                      <svg className="wwt-heart__chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div className="wwt-heart__item-body">
                      <div className="wwt-heart__item-body-inner">
                        <p>{b.body}</p>
                        {b.learnMore && (
                          <a href="#" className="wwt-heart__learn" aria-disabled="true">{b.learnMore}</a>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Immune Defense — same layout/styles as the heart block */}
          <div className="wwt-heart">
            <div className="wwt-heart__left">
              <img
                src="/images/h--immune-defense--category-texture-12.webp"
                alt=""
                className="wwt-heart__img"
               loading="lazy" decoding="async"/>
              <h3 className="wwt-heart__heading">Immune Defense</h3>
              <p className="wwt-heart__desc">
                Immunity is your body&rsquo;s readiness to fight infections, respond to allergens, and recover from illness. Different types of white blood cells gauge your overall wellness.
              </p>
              <div className="wwt-heart__actions">
                <button type="button" className="wwt-heart__btn wwt-heart__btn--primary" aria-disabled="true">Get started</button>
                <button type="button" className="wwt-heart__btn wwt-heart__btn--outline" aria-disabled="true">Learn more</button>
              </div>
            </div>

            <ul className="wwt-heart__list">
              {immuneBiomarkers.map((b, idx) => {
                const isOpen = openImmune === idx
                return (
                  <li
                    key={b.title}
                    className={`wwt-heart__item ${isOpen ? 'wwt-heart__item--open' : ''}`}
                  >
                    <button
                      type="button"
                      className="wwt-heart__item-head"
                      aria-expanded={isOpen}
                      onClick={() => setOpenImmune(isOpen ? -1 : idx)}
                    >
                      <span className="wwt-heart__item-title">{b.title}</span>
                      {b.badge && <span className="wwt-heart__badge">{b.badge}</span>}
                      <svg className="wwt-heart__chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div className="wwt-heart__item-body">
                      <div className="wwt-heart__item-body-inner">
                        <p>{b.body}</p>
                        {b.learnMore && (
                          <a href="#" className="wwt-heart__learn" aria-disabled="true">{b.learnMore}</a>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Nutrients — same layout/styles as the heart block */}
          <div className="wwt-heart">
            <div className="wwt-heart__left">
              <img
                src="/images/h--nutrients--category-texture-16.webp"
                alt=""
                className="wwt-heart__img"
               loading="lazy" decoding="async"/>
              <h3 className="wwt-heart__heading">Nutrients</h3>
              <p className="wwt-heart__desc">
                Nutrients play a vital role in supporting energy, immunity, muscle function, and overall health. Monitoring these levels helps ensure your body is getting the essential elements it needs to perform at its best.
              </p>
              <div className="wwt-heart__actions">
                <button type="button" className="wwt-heart__btn wwt-heart__btn--primary" aria-disabled="true">Get started</button>
                <button type="button" className="wwt-heart__btn wwt-heart__btn--outline" aria-disabled="true">Learn more</button>
              </div>
            </div>

            <ul className="wwt-heart__list">
              {nutrientsBiomarkers.map((b, idx) => {
                const isOpen = openNutrients === idx
                return (
                  <li
                    key={b.title}
                    className={`wwt-heart__item ${isOpen ? 'wwt-heart__item--open' : ''}`}
                  >
                    <button
                      type="button"
                      className="wwt-heart__item-head"
                      aria-expanded={isOpen}
                      onClick={() => setOpenNutrients(isOpen ? -1 : idx)}
                    >
                      <span className="wwt-heart__item-title">{b.title}</span>
                      {b.badge && <span className="wwt-heart__badge">{b.badge}</span>}
                      <svg className="wwt-heart__chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div className="wwt-heart__item-body">
                      <div className="wwt-heart__item-body-inner">
                        <p>{b.body}</p>
                        {b.learnMore && (
                          <a href="#" className="wwt-heart__learn" aria-disabled="true">{b.learnMore}</a>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Blood — same layout/styles as the heart block */}
          <div className="wwt-heart">
            <div className="wwt-heart__left">
              <img
                src="/images/h--blood--category-texture-9.webp"
                alt=""
                className="wwt-heart__img"
               loading="lazy" decoding="async"/>
              <h3 className="wwt-heart__heading">Blood health</h3>
              <p className="wwt-heart__desc">
                Your blood supports essential functions by carrying oxygen, nutrients, and immune cells throughout the body. It also helps remove waste. Monitoring these markers gives a clear picture of how well your body is functioning at a cellular level.
              </p>
              <div className="wwt-heart__actions">
                <button type="button" className="wwt-heart__btn wwt-heart__btn--primary" aria-disabled="true">Get started</button>
                <button type="button" className="wwt-heart__btn wwt-heart__btn--outline" aria-disabled="true">Learn more</button>
              </div>
            </div>

            <ul className="wwt-heart__list">
              {bloodBiomarkers.map((b, idx) => {
                const isOpen = openBlood === idx
                return (
                  <li
                    key={b.title}
                    className={`wwt-heart__item ${isOpen ? 'wwt-heart__item--open' : ''}`}
                  >
                    <button
                      type="button"
                      className="wwt-heart__item-head"
                      aria-expanded={isOpen}
                      onClick={() => setOpenBlood(isOpen ? -1 : idx)}
                    >
                      <span className="wwt-heart__item-title">{b.title}</span>
                      {b.badge && <span className="wwt-heart__badge">{b.badge}</span>}
                      <svg className="wwt-heart__chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div className="wwt-heart__item-body">
                      <div className="wwt-heart__item-body-inner">
                        <p>{b.body}</p>
                        {b.learnMore && (
                          <a href="#" className="wwt-heart__learn" aria-disabled="true">{b.learnMore}</a>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Biological Age */}
      <section className="wwt-bioage">
        <div className="wwt-bioage__inner">
          <div className="wwt-bioage__left">
            <h2 className="wwt-bioage__heading">Healthspan Score</h2>
            <span className="wwt-bioage__badge">Health Metrics</span>
            <p className="wwt-bioage__desc">
              Discover how your lifestyle and health markers may influence the way your body ages over time.Understand the connection between your health markers and overall vitality.
            </p>
            <div className="wwt-bioage__actions">
              <button type="button" className="wwt-bioage__btn wwt-bioage__btn--primary" aria-disabled="true">Start Your Analysis</button>
              <button type="button" className="wwt-bioage__btn wwt-bioage__btn--outline" aria-disabled="true">Explore the Science</button>
            </div>
            <p className="wwt-bioage__disclaimer">
              Consult a healthcare professional for personalized medical guidance and treatment decisions.
            </p>
          </div>
          <div className="wwt-bioage__right">
            <img
              src="/images/h_biomarker_bioage-3.webp"
              alt=""
              className="wwt-bioage__img"
             loading="lazy" decoding="async"/>
          </div>
        </div>
      </section>

      {/* What are biomarkers? — top heading, then image left + content right */}
      <section className="wwt-bio">
        <div className="wwt-bio__inner">
          <h2 className="wwt-bio__title">Your health signals</h2>
          <div className="wwt-bio__grid">
            <div className="wwt-bio__left">
              <img
                src="/images/h_biomarker_whatarebiomarkers-3.webp"
                alt=""
                className="wwt-bio__img"
               loading="lazy" decoding="async"/>
            </div>
            <div className="wwt-bio__right">
              <h3 className="wwt-bio__heading">Guided by your data</h3>
              <p className="wwt-bio__desc">
                Health markers are measurable values in your blood that reflect how your body is performing. Each result offers insight into different areas such as heart health, metabolism, hormones, nutrition, and inflammation.
              </p>
              <p className="wwt-bio__desc">
                By tracking these markers regularly, you can spot changes early, monitor your progress, and make informed decisions to support your overall health.
              </p>
              <div className="wwt-bio__actions">
                <button type="button" className="wwt-bio__btn wwt-bio__btn--primary" aria-disabled="true">Get started</button>
                <button type="button" className="wwt-bio__btn wwt-bio__btn--outline" aria-disabled="true">Learn more</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Better health is in your hands */}
      <section className="wwt-hands">
        <div className="wwt-hands__inner">
          <h2 className="wwt-hands__title">Take control of your health journey</h2>
          <div className="wwt-hands__grid">
            <div className="wwt-hands__left">
              <img
                src="/images/h_biomarker_inyourhands-3.webp"
                alt=""
                className="wwt-hands__img"
               loading="lazy" decoding="async"/>
            </div>
            <div className="wwt-hands__right">
              <h3 className="wwt-hands__heading">Progress over perfection</h3>
              <p className="wwt-hands__desc">
                Standard checkups cover only a limited set of health indicators. Our advanced approach provides a more in-depth view, helping you better understand how your body is performing.
              </p>
              <p className="wwt-hands__desc">
                With regular testing throughout the year, you can track changes over time, gain meaningful insights, and make smarter decisions for your future health.
              </p>
              <div className="wwt-hands__actions">
                <button type="button" className="wwt-hands__btn" aria-disabled="true">Explore Your Results</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Soft footer — reusing the Labs page .labs-sf styles */}
      <section className="labs-sf labs-sf--wwt">
        <div className="labs-sf__wrapper">
          <img
            src="/images/h_biomarker_onyourmarks-d.webp"
            alt=""
            className="labs-sf__bg-img"
           loading="lazy" decoding="async"/>
          <div className="labs-sf__content">
            <div className="labs-sf__top-text">
              <h2 className="labs-sf__heading-top">Better health</h2>
              <h2 className="labs-sf__heading-bottom">starts inside</h2>
            </div>
            <button type="button" className="labs-sf__btn" aria-disabled="true">Start testing</button>
          </div>
        </div>
      </section>

      <LabsOffcanvas isOpen={labsOpen} onClose={() => setLabsOpen(false)} />

      <Footer />
    </div>
  )
}

export default WhatWeTestPage
