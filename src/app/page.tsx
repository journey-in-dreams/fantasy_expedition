import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link
        className={buttonVariants({
          size: 'lg',
          className: 'mt-5',
        })}
        href="/dashboard"
      >
        Get started
      </Link>
      <Button className="mt-4">多写几个字</Button>
    </main>
  );
}
