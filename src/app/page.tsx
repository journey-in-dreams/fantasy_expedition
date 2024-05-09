import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link className={buttonVariants()} href="/star">
        Get Star
      </Link>
      <Link className={buttonVariants()} href="/three">
        Get Three
      </Link>
      <div>一起去冒险吧</div>
      {/* <div>
        {[...new Array(100).keys()].map((key) => {
          const scale = Math.random() * 1.5
          return  <Image
              key={key}
              src="/star.png"
              width={50}
              height={50}
              alt="star"
              style={{
                position: 'absolute',
                left: parseInt((Math.random() * 1600).toString()) + 'px',
                top: parseInt((Math.random() * 1300).toString()) + 'px',
                zIndex: 1,
                scale: Math.random() * 1.5,
                animationName: 'flash',
                animationDelay:  Math.random() * 1.5 + 's',
                animationDuration: (Math.random() * 2 + 1) + 's',
                animationIterationCount: 'infinite',
                transform: 'scale('+ scale + ', ' + scale + ')'
              }}
            />
        })}
      </div> */}
    </main>
  )
}
