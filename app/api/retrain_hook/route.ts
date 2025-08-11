import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { topic, tone, platform } = await request.json()

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    const getToneInstructions = (tone: string) => {
      const toneMap: { [key: string]: string } = {
        professional: "Professional: Use formal, authoritative language. Focus on expertise, credibility, and industry insights.",
        funny: "Funny: Use humor, wit, and playful language. Include jokes, puns, or unexpected twists.",
        emotional: "Emotional: Use heartfelt, passionate language. Focus on feelings, relationships, and personal stories.",
        shocking: "Shocking: Use surprising, controversial, or unexpected statements. Create 'wow' moments.",
        educational: "Educational: Use informative, instructive language. Focus on learning, tips, and valuable insights.",
        motivational: "Motivational: Use inspiring, empowering language. Focus on action, achievement, and positive energy."
      }
      return toneMap[tone] || "Professional: Use formal, authoritative language."
    }

    const getPlatformInstructions = (platform: string) => {
      const platformMap: { [key: string]: string } = {
        instagram: "Instagram: Create short, punchy, curiosity-driven hooks under 150 characters. Use casual, conversational tone with emojis. Focus on visual appeal and storytelling.",
        youtube: "YouTube: Create high-suspense, first-second grabber hooks. Use emotional language and create urgency. Focus on curiosity gaps and 'what happens next' moments.",
        twitter: "Twitter: Create concise, witty, shareable hooks under 280 characters. Use clever wordplay and trending language. Focus on virality and engagement.",
        email: "Email: Create emotional, open-loop structure hooks. Use conversational, personal tone. Focus on storytelling and relationship building."
      }
      return platformMap[platform] || ""
    }

    const toneInstructions = getToneInstructions(tone)
    const platformInstructions = platform ? getPlatformInstructions(platform) : ""

    const platformSpecificPrompt = platform
      ? `\n\nPlatform Guidelines: ${platformInstructions}\n\nGenerate content specifically optimized for ${platform.toUpperCase()} platform.`
      : ""

    const generatePrompt = `Generate viral content for the topic: "${topic}" with a ${tone} tone.${platformSpecificPrompt}

Tone Instructions: ${toneInstructions}

IMPORTANT: Avoid these weak, overused phrases:
- "Unleash your potential"
- "The ultimate guide"
- "Secrets revealed"
- "Master the art of"
- "Transform your life"
- "Revolutionary breakthrough"
- "Game-changing strategy"
- "Discover the hidden"
- "Unlock the secrets"
- "The ultimate path"

Instead, use:
- Specific, concrete language
- Emotional triggers
- Curiosity gaps
- Personal stories or scenarios
- Numbers and specific results
- Action-oriented language

Please provide:
1. 1 viral hook that grabs attention immediately (make it bold and compelling)
2. 1 compelling title for social media posts
3. 5 relevant hashtags for maximum reach (in blue color)
4. 1 strong call-to-action (CTA) phrase (highlighted in yellow)

Format the response as a JSON object with these exact keys:
{
  "hooks": ["hook1"],
  "titles": ["title1"],
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
  "ctas": ["cta1"]
}

Make sure the hook is attention-grabbing and makes people want to read more. The title should be compelling and shareable. Hashtags should be relevant and trending. The CTA should be action-oriented and persuasive.`

    const analyzePrompt = `You're a marketing content analyzer trained to evaluate hooks based on impact and originality.

Analyze the given hook and score it across curiosity, virality, clarity, emotion, and originality.

Hook to analyze: "{hook}"

Please provide your analysis in the following JSON format:
{
  "scores": {
    "curiosity": <score 1-10>,
    "virality": <score 1-10>,
    "clarity": <score 1-10>,
    "emotion": <score 1-10>,
    "originality": <score 1-10>
  }
}

Scoring guidelines:
- Curiosity (1-10): How much does it make people want to know more?
- Virality (1-10): How likely is it to be shared?
- Clarity (1-10): How clear and easy to understand is it?
- Emotion (1-10): How much emotional impact does it have?
- Originality (1-10): How unique and fresh is the approach?

Only return valid JSON, no additional text.`

    // Try up to 5 times to get a hook with virality >= 8
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        // Generate hook
        const generateResponse = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a viral content generator. Create hooks that are attention-grabbing and shareable.'
            },
            {
              role: 'user',
              content: generatePrompt
            }
          ],
          temperature: 0.8,
          max_tokens: 500,
        })

        const generateText = generateResponse.choices[0]?.message?.content || ''
        let parsedResponse
        try {
          parsedResponse = JSON.parse(generateText)
        } catch (error) {
          console.error('Failed to parse generate response:', generateText)
          continue
        }

        if (!parsedResponse.hooks || !parsedResponse.hooks[0]) {
          continue
        }

        const hook = parsedResponse.hooks[0]

        // Analyze the generated hook
        const analyzeResponse = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a marketing content analyzer. Evaluate hooks for virality and impact.'
            },
            {
              role: 'user',
              content: analyzePrompt.replace('{hook}', hook)
            }
          ],
          temperature: 0.7,
          max_tokens: 300,
        })

        const analyzeText = analyzeResponse.choices[0]?.message?.content || ''
        let analysis
        try {
          analysis = JSON.parse(analyzeText)
        } catch (error) {
          console.error('Failed to parse analysis response:', analyzeText)
          continue
        }

        // Check if virality score is >= 8
        if (analysis.scores && analysis.scores.virality >= 8) {
          return NextResponse.json({
            hook,
            scores: analysis.scores,
            content: parsedResponse,
            attempts: attempt
          })
        }

        // If this is the last attempt, return the best one we found
        if (attempt === 5) {
          return NextResponse.json({
            hook,
            scores: analysis.scores,
            content: parsedResponse,
            attempts: attempt,
            note: "Best available after 5 attempts"
          })
        }

      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error)
        if (attempt === 5) {
          throw error
        }
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate high-scoring hook after 5 attempts' },
      { status: 500 }
    )

  } catch (error) {
    console.error('Retrain hook error:', error)
    return NextResponse.json(
      { error: 'Failed to retrain hook' },
      { status: 500 }
    )
  }
} 