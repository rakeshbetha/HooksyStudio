import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Debug: Check if environment variable is loaded
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  console.error('OPENAI_API_KEY is not set in environment variables')
  console.error('Available environment variables:', Object.keys(process.env).filter(key => key.includes('OPENAI')))
}

const openai = new OpenAI({
  apiKey: apiKey || '',
})

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please check your .env.local file.' },
        { status: 500 }
      )
    }

    const { topic, tone, isRemix = false, platform } = await request.json()

    if (!topic || !tone) {
      return NextResponse.json(
        { error: 'Topic and tone are required' },
        { status: 400 }
      )
    }

    const getToneInstructions = (tone: string) => {
      const toneMap: { [key: string]: string } = {
        professional: "Use formal, authoritative language. Focus on expertise, credibility, and business value. Make it sound corporate and trustworthy.",
        funny: "Use humor, wit, and playful language. Include jokes, puns, or clever wordplay. Make it entertaining and shareable.",
        emotional: "Use heartfelt, passionate language. Appeal to feelings, personal stories, and emotional connections. Make it touching and relatable.",
        shocking: "Use surprising, controversial, or unexpected language. Create intrigue and curiosity. Make it attention-grabbing and buzzworthy.",
        educational: "Use informative, instructional language. Focus on learning, tips, and valuable insights. Make it educational and helpful.",
        motivational: "Use inspiring, empowering language. Focus on achievement, success, and positive energy. Make it uplifting and encouraging."
      }
      return toneMap[tone] || toneMap.professional
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
    
    const remixInstruction = isRemix 
      ? "\n\nIMPORTANT: This is a remix request. Create a completely different variation of the hook, title, hashtags, and CTA while maintaining the same topic and tone. Make it fresh and unique from the original."
      : ""
    
    const platformSpecificPrompt = platform 
      ? `\n\nPlatform Guidelines: ${platformInstructions}\n\nGenerate content specifically optimized for ${platform.toUpperCase()} platform.`
      : ""
    
    const prompt = `Generate viral content for the topic: "${topic}" with a ${tone} tone.${platformSpecificPrompt}

Tone Instructions: ${toneInstructions}${remixInstruction}

IMPORTANT: Avoid these weak, overused phrases:
- "Unleash your potential"
- "The ultimate path"
- "Unlock the secrets"
- "Discover the hidden"
- "Master the art of"
- "Transform your life"
- "Revolutionary breakthrough"
- "Game-changing strategy"

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

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a viral content expert who specializes in creating engaging hooks, titles, hashtags, and CTAs for social media. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000,
    })

    const responseText = completion.choices[0]?.message?.content

    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    // Try to parse the JSON response
    let parsedResponse
    try {
      parsedResponse = JSON.parse(responseText)
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Invalid response format from OpenAI')
      }
    }

    // Validate the response structure
    const requiredKeys = ['hooks', 'titles', 'hashtags', 'ctas']
    const hasAllKeys = requiredKeys.every(key => 
      Array.isArray(parsedResponse[key]) && parsedResponse[key].length > 0
    )

    if (!hasAllKeys) {
      throw new Error('Invalid response structure from OpenAI')
    }

    // Add platform information to the response
    const responseWithPlatform = {
      ...parsedResponse,
      platform: platform || 'general'
    }

    return NextResponse.json(responseWithPlatform)

  } catch (error) {
    console.error('Error generating content:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API key not configured. Please check your .env.local file.' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('401')) {
        return NextResponse.json(
          { error: 'Invalid OpenAI API key. Please check your API key.' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('429')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: `Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 