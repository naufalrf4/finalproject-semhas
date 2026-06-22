import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { getConfig } from '#/lib/config'

function loadUmami() {
  const { umamiSrc, umamiWebsiteId } = getConfig()
  if (!umamiSrc || !umamiWebsiteId) return
  if (document.querySelector('script[data-website-id]')) return
  const s = document.createElement('script')
  s.async = true
  s.defer = true
  s.src = umamiSrc
  s.setAttribute('data-website-id', umamiWebsiteId)
  document.head.appendChild(s)
}

loadUmami()

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<RouterProvider router={router} />)
}
