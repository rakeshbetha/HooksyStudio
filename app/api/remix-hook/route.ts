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
        { error: 'Hook is required and must be a string' },
        { status: 400 }
      )
    }

    const remixPrompt = `You are a skilled copywriter specializing in viral social media hooks. Rewrite the following hook into six different tones while maintaining the core message and making each version compelling and engaging.

Original Hook: "${hook}"

Tones to create:
- Funny: Humorous, witty, entertaining
- Emotional: Heartfelt, touching, relatable
- Shocking: Surprising, controversial, attention-grabbing
- Educational: Informative, enlightening, valuable
- Motivational: Inspiring, empowering, action-oriented
- Professional: Business-focused, authoritative, polished

Requirements:
- Keep each remix under 200 characters
- Make each tone distinct and authentic
- Maintain the core message of the original hook
- Ensure each version is highly engaging and shareable

Return ONLY a valid JSON object in this exact format:
{
  "funny": "funny version here",
  "emotional": "emotional version here", 
  "shocking": "shocking version here",
  "educational": "educational version here",
  "motivational": "motivational version here",
  "professional": "professional version here"
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: remixPrompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    let remixes
    try {
      remixes = JSON.parse(content)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content)
      throw new Error('Invalid response format from AI')
    }

    // Validate that all required tones are present
    const requiredTones = ['funny', 'emotional', 'shocking', 'educational', 'motivational', 'professional']
    const missingTones = requiredTones.filter(tone => !remixes[tone])

    if (missingTones.length > 0) {
      throw new Error(`Missing tones: ${missingTones.join(', ')}`)
    }

    return NextResponse.json(remixes)
  } catch (error) {
    console.error('Remix generation error:', error)
    
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'OpenAI API key is missing or invalid' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate remixes. Please try again.' },
      { status: 500 }
    )
  }
} 