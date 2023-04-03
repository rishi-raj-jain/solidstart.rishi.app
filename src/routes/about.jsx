import { For, Show } from 'solid-js'
import Heart from '~/components/Heart'
import Header from '~/components/Header'
import { useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'
import { Storyblok as StoryblokClient } from '~/storyblok'

export function routeData() {
  return createServerData$(async () => {
    const resp = { tagline: null, timeline: [] }
    try {
      const { data } = await StoryblokClient.get('cdn/stories/taglines/about')
      resp['tagline'] = StoryblokClient.richTextResolver.render(data.story.content.Text)
    } catch (e) {
      console.log(e.message || e.toString())
    }
    try {
      const Timeline = {}
      const getStories = async (page, client) => {
        const res = await client.get('cdn/stories', {
          page: page,
          per_page: 100,
          starts_with: 'timeline/',
        })
        let stories = res.data.stories
        stories.forEach((story) => {
          const renderedText = client.richTextResolver.render(story.content.Description)
          if (Timeline.hasOwnProperty(story.content.Year)) {
            Timeline[story.content.Year].push({ ...story, renderedText })
          } else {
            Timeline[story.content.Year] = [{ ...story, renderedText }]
          }
        })
        let total = res.total
        let lastPage = Math.ceil(total / res.perPage)
        if (page <= lastPage) {
          page++
          await getStories(page, client)
        }
      }
      await getStories(1, StoryblokClient)
      resp['timeline'] = Timeline
    } catch (e) {
      console.log(e.message || e.toString())
    }
    return resp
  })
}

export default function Home() {
  const response = useRouteData()
  return (
    <div class={`min-h-screen bg-white font-display dark:bg-black overflow-hidden`}>
      <Header />
      <main class="flex flex-col items-center text-black dark:text-gray-200">
        <div class="flex w-full max-w-[90vw] flex-col py-10 sm:px-10 lg:max-w-[75vw]">
          <div class="flex w-full flex-col items-center text-[14px]">
            <div class="mt-10 flex w-[90vw] max-w-[540px] flex-col">
              <h1 class="text-3xl font-bold text-zinc-700 dark:text-gray-300">About Me</h1>
              {response() && <span class="mt-2 font-light text-slate-600 dark:text-slate-400" innerHTML={response().tagline} />}
              <h2 class="mt-16 text-3xl font-bold text-zinc-700 dark:text-gray-300">My Timeline</h2>
              {response() && (
                <For each={Object.keys(response().timeline).sort((a, b) => (a > b ? -1 : 1))}>
                  {(item) => (
                    <div class="mt-8 flex flex-col">
                      <span className="text-lg font-semibold text-zinc-600 dark:text-gray-400">{item}</span>
                      <For each={response().timeline[item]}>
                        {(exp) => (
                          <div class="relative mt-5 flex flex-row items-start space-x-5">
                            <div class="mt-1 h-[12px] w-[12px]">
                              <Heart width={12} height={21} />
                            </div>
                            <div class="flex flex-col">
                              <span class="text-md font-semibold text-zinc-600 dark:text-gray-400 sm:text-lg">{exp.content.Title}</span>
                              <div class="font-light text-slate-600 dark:text-slate-400" innerHTML={exp.renderedText} />
                            </div>
                          </div>
                        )}
                      </For>
                      <span></span>
                    </div>
                  )}
                </For>
              )}
              <div></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
