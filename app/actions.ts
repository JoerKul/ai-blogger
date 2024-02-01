'use server';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function createCompletion(prompt: string) {
  if (!prompt) return { error: 'prompt is required' };

  const { userId } = auth();
  if (!userId) return { error: 'You must be logged in to create a blog post.' };

  // generate a blog post using GPT-3
  const messages: any = [
    {
      role: 'user',
      content: `Write a blog post around 200 words about following topic: ${prompt}`,
    },
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
  });

  const content = completion.choices[0].message.content;
  if (!content) return { error: 'Unable to generate the blog content.' };

  // generate an image using DALL-E
  const image = await openai.images.generate({
    model: 'dall-e-2',
    prompt: `This is an image of a blog post about ${prompt}.`,
    n: 1,
    size: '1024x1024',
    response_format: 'b64_json',
  });

  const imageName = `blog-${Date.now()}`;
  const imageData = image?.data?.[0]?.b64_json as string;
  if (!imageData) return { error: 'Unable to generate the blog image.' };

  // upload the image to supabase storage
  const { data: imageUpload, error: imageUploadError } = await supabase.storage
    .from('blogs')
    .upload(imageName, decode(imageData), {
      contentType: 'image/png',
    });

  if (imageUploadError)
    return { error: 'Unable to upload the blog image to Storage.' };

  const path = imageUpload?.path;
  const imageUrl = path
    ? `${process.env.SUPABASE_URL}/storage/v1/object/public/blogs/${path}`
    : null;

  // create a new blog post in supabase
  const { data: blogPost, error: blogPostError } = await supabase
    .from('blogs')
    .insert([
      {
        title: prompt,
        content,
        imageUrl,
        userId,
      },
    ])
    .select('*');

  if (blogPostError) return { error: 'Unable to create the blog post.' };

  const blogId = blogPost?.[0]?.id;
  revalidatePath('/');
  redirect(`/blog/${blogId}`);
}
