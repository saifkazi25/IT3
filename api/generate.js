import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  try {
    const { selfie, answers } = req.body;
    const prompt = `Create a dreamy, cinematic portrait of this person living their dream life, based on the following elements: ${answers.join(', ')}`;

    const result = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024'
    });

    res.status(200).json({ generatedImageUrl: result.data[0].url });
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: 'Image generation failed' });
  }
}

