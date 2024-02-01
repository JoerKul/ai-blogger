import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

function Header() {
  return (
    <header className='py-6 px-10 '>
      <div className='flex mx-auto max-w-6xl items-center justify-between'>
        <Link href='/'>
          <h1>AI Blogger</h1>
        </Link>
        <SignedIn>
          <UserButton afterSignOutUrl='/' />
        </SignedIn>

        <SignedOut>
          <SignInButton mode='modal'>
            <Button size='sm' variant='ghost'>
              Sign in
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;
