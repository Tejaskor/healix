// Reusable personalized result screen. The `result` object is produced by each
// assessment config's getResult(answers), so the summary, insights,
// recommendation cards and CTAs all change based on the user's answers.
// Shape:
//   {
//     heading, summary,
//     insights: string[],
//     recommendationsTitle, recommendations: [{ title, description }],
//     ctas: [{ label }],   // first → primary (dark), rest → outline
//     disclaimer,
//   }
const AssessmentResult = ({ result, onCta }) => {
  if (!result) return null

  return (
    <div className="ha-result">
      {result.heading && <h2 className="ha-result__heading">{result.heading}</h2>}
      {result.summary && <p className="ha-result__summary">{result.summary}</p>}

      {result.insights && result.insights.length > 0 && (
        <div className="ha-insights">
          {result.insights.map((insight) => (
            <div key={insight} className="ha-insight">
              <span className="ha-insight__dot" aria-hidden="true" />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      )}

      {result.recommendations && result.recommendations.length > 0 && (
        <>
          <h3 className="ha-result__section-title">
            {result.recommendationsTitle || 'Recommended for you'}
          </h3>
          <div className="ha-recs">
            {result.recommendations.map((rec) => (
              <div key={rec.title} className="ha-rec">
                <div className="ha-rec__title">{rec.title}</div>
                {rec.description && <div className="ha-rec__desc">{rec.description}</div>}
              </div>
            ))}
          </div>
        </>
      )}

      {result.ctas && result.ctas.length > 0 && (
        <div className="ha-result__ctas">
          {result.ctas.map((cta, i) => (
            <button
              key={cta.label}
              type="button"
              className={`ha-btn ${i === 0 ? 'ha-btn--dark' : 'ha-btn--outline'}`}
              onClick={onCta}
            >
              {cta.label}
            </button>
          ))}
        </div>
      )}

      {result.disclaimer && <p className="ha-result__disclaimer">{result.disclaimer}</p>}
    </div>
  )
}

export default AssessmentResult
