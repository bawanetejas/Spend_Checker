### AI Audit Summary Prompt

Generate a professional and realistic audit summary in approximately 100 words.

#### Audit Details

- Monthly savings: ₹${data.totalMonthlySavings}
- Annual savings: ₹${data.totalAnnualSavings}
- Recommended tools: ${data.recommendations.join(", ")}

#### Guidelines

1. If the monthly savings are between ₹0 and ₹1000:
   - Do not recommend optimization, downgrades, subscription changes, replacements, or cost-cutting actions.
   - Clearly state that the current tool stack is already well-optimized for the user's current requirements and usage pattern.
   - Focus on stability, efficiency, and suitability of the existing setup.

2. If the monthly savings exceed ₹1000:
   - Provide practical and realistic optimization suggestions.
   - Recommend only meaningful changes that improve cost efficiency without affecting workflow or productivity.
   - Keep suggestions actionable and business-focused.

#### Tone

- Professional
- Concise
- Confidence-inspiring
- Practical and realistic

#### Output Rules

- Return only plain text.
- Do not use markdown.
- Do not use bullet points.
- Return a single concise paragraph only.
