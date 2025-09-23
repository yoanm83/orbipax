'use client'

import React from 'react'
import dynamic from 'next/dynamic'

interface NoSSRProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Component that prevents server-side rendering of its children
 * Useful for components that rely on browser APIs or generate unique IDs
 */
const NoSSRComponent: React.FC<NoSSRProps> = ({ children, fallback = null }) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export const NoSSR = NoSSRComponent

// Alternative using Next.js dynamic import
export const createNoSSRWrapper = <P extends {}>(
  Component: React.ComponentType<P>
) => {
  return dynamic(() => Promise.resolve(Component), {
    ssr: false
  })
}