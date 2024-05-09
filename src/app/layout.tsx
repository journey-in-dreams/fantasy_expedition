import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { cn } from '@/lib/utils'
// import { GlobalContextProvider } from '@/context/GlobalContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn('min-h-screen font-sans antialiased', inter.className)}
      >
        <script
          dangerouslySetInnerHTML={{
            // 增加一个自执行的函数，用来在渲染主题色
            __html: `
              (function () {
                function setTheme(newTheme) {
                  window.__theme = newTheme;
                  if (newTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (newTheme === 'light') {
                    document.documentElement.classList.remove('dark');
                  }
                }
                var preferredTheme;
                try {
                  preferredTheme = localStorage.getItem('theme');
                } catch (err) { }
                window.__setPreferredTheme = function(newTheme) {
                  preferredTheme = newTheme;
                  setTheme(newTheme);
                  try {
                    localStorage.setItem('theme', newTheme);
                  } catch (err) { }
                };
                var initialTheme = preferredTheme;
                var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
                if (!initialTheme) {
                  initialTheme = darkQuery.matches ? 'dark' : 'light';
                }
                setTheme(initialTheme);
                darkQuery.addEventListener('change', function (e) {
                  if (!preferredTheme) {
                    setTheme(e.matches ? 'dark' : 'light');
                  }
                });
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  )
}
