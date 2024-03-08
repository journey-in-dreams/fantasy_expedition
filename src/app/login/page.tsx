'use client';
import { SessionProvider } from 'next-auth/react';
import { signIn, useSession, signOut } from 'next-auth/react'
import { useEffect } from 'react'

export default function Login() {
  const { data, status } = useSession()
  useEffect(() => {
    console.log(111, data)
  }, [data, data?.user.userId])
  return (
    <SessionProvider>
      <div>
        <button onClick={() => signIn('github')}>github登陆</button>
        <button onClick={() => signOut()}>退出</button>
      </div>
    </SessionProvider>
  )
}