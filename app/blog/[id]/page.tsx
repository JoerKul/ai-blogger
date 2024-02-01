import { getBlogById } from '@/lib/supabase';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Markdown from 'react-markdown';

export default async function Blog({ params }: { params: { id: string } }) {
  const { content, imageUrl } = await getBlogById(Number(params.id));

  return (
    <section className='mx-auto max-w-lg py-12'>
      <Link
        href='/'
        className='inline-flex items-center text-sm font-light text-gray-500'
      >
        <ChevronLeft strokeWidth={1} size={20} className='mr-2' />
        <span>Go Back</span>
      </Link>

      <section className='prose mt-6'>
        <Image
          src={imageUrl}
          width={1024}
          height={1024}
          alt='Image for a blog post'
        />
        <Markdown>{content}</Markdown>
      </section>
    </section>
  );
}
