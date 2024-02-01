'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createCompletion } from '@/app/actions';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';

export default function Form() {
  async function action(formData: FormData) {
    const prompt = formData.get('prompt');

    const result = await createCompletion(prompt as string);
    if (result?.error) {
      toast.error(result.error, {
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      });
    }
  }

  return (
    <section className='mx-auto max-w-lg w-full'>
      <Card className='border-0 shadow-none'>
        <CardHeader>
          <CardTitle className='text-center text-3xl'>
            Next AI Blogger
          </CardTitle>
          <CardDescription className='text-center py-2'>
            Generate a blog post about anything
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className='mt-2' action={action}>
            <Input
              name='prompt'
              placeholder='What should I write about?'
              className='rounded-lg'
            />
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <>
      <SignedIn>
        <Button
          size='sm'
          type='submit'
          className={cn('mt-3 w-full rounded-lg', pending && 'animate-pulse')}
        >
          {pending ? 'Working on it...' : 'Submit'}
        </Button>
      </SignedIn>

      <SignedOut>
        <SignInButton mode='modal'>
          <Button
            size='sm'
            type='button'
            variant='secondary'
            className='mt-3 w-full rounded-lg'
          >
            Sign in to start
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
