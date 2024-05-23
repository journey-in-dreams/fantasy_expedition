import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function Home({
  searchParams,
}: {
  searchParams: {
    error?: string
  }
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <p className="text-red">{searchParams?.error}</p>
      </div>
      <Link className={buttonVariants()} href="/signIn">
        Go SignIn
      </Link>
      <Link className={buttonVariants()} href="/star">
        Go Star
      </Link>
      <Link className={buttonVariants()} href="/three">
        Go Three
      </Link>
      <div>一起去冒险吧</div>
    </main>
  )
}
