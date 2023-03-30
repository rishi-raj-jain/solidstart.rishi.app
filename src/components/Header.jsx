import Toggle from './Toggle'
import { For } from 'solid-js'
import { A, useLocation } from 'solid-start'

const routes = [
  {
    name: 'Home',
    route: '/',
  },
  {
    name: 'About',
    route: '/about',
  },
  {
    name: 'Blogs',
    route: '/blogs',
  },
]

export default function Header() {
  const location = useLocation()
  const active = (path) => (path == location.pathname ? 'underline' : '')
  return (
    <nav class="sticky top-0 z-10 flex w-full flex-col items-center bg-white dark:bg-black">
      <div class="flex w-full max-w-[90vw] flex-row items-center justify-between sm:px-10 lg:max-w-[75vw]">
        <Toggle />
        <div class="relative flex max-w-[258px] flex-row items-center space-x-5 overflow-x-scroll sm:max-w-none sm:overflow-x-hidden">
          <For each={routes}>
            {(i) => (
              <A class={`dark:text-white ${active(i.route)}`} href={i.route}>
                {i.name}
              </A>
            )}
          </For>
        </div>
      </div>
    </nav>
  )
}
