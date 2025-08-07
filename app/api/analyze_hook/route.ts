import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { hook } = await request.json()

    if (!hook || typeof hook !== 'string') {
      return NextResponse.json(
        { error: 'Hook text is required' },
        { status: 400 }
      )
    }

    const prompt = `You're a hook analysis AI. Analyze the given hook and score it across curiosity, virality, clarity, and emotional impact. Suggest 2 stronger rewrites. Highlight any weak or overused phrases.

Hook to analyze: "${hook}"

Please provide your analysis in the following JSON format:
{
  "scores": {
    "curiosity": <score 1-10>,
    "virality": <score 1-10>,
    "clarity": <score 1-10>,
    "emotion": <score 1-10>
  },
  "suggestions": [
    "<first improved hook>",
    "<second improved hook>"
  ],
  "weak_phrases": [
    "<weak phrase 1>",
    "<weak phrase 2>"
  ]
}

Scoring guidelines:
- Curiosity (1-10): How much does it make people want to know more?
- Virality (1-10): How likely is it to be shared?
- Clarity (1-10): How clear and easy to understand is it?
- Emotion (1-10): How much emotional impact does it have?

Only return valid JSON, no additional text.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a hook analysis AI. Analyze the given hook and score it across curiosity, virality, clarity, and emotional impact. Suggest 2 stronger rewrites. Highlight any weak or overused phrases.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const responseText = completion.choices[0]?.message?.content || ''
    
    // Try to parse the JSON response
    let analysis
    try {
      analysis = JSON.parse(responseText)
    } catch (error) {
      console.error('Failed to parse OpenAI response:', responseText)
      return NextResponse.json(
        { error: 'Failed to analyze hook' },
        { status: 500 }
      )
    }

    // Validate the response structure
    if (!analysis.scores || !analysis.suggestions || !analysis.weak_phrases) {
      return NextResponse.json(
        { error: 'Invalid analysis response' },
        { status: 500 }
      )
    }

    return NextResponse.json(analysis)

  } catch (error) {
    console.error('Hook analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze hook' },
      { status: 500 }
    )
  }
} 