import type { Metadata }
from "next"

import "./globals.css"

import QueryProvider
from "@/providers/query-provider"

import { Toaster }
from "sonner"


export const metadata: Metadata = {
  title: "Knowledge Hub",
  description: "Personal Knowledge Hub — Organize, store, and access your knowledge resources"
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (

    <html lang="en" className="dark">

      <body className="antialiased">

        <QueryProvider>

          {children}

          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              style: {
                background: 'oklch(0.17 0.010 270)',
                border: '1px solid oklch(0.25 0.012 270)',
                color: 'oklch(0.95 0.005 270)',
              },
            }}
          />

        </QueryProvider>

      </body>

    </html>
  )
}