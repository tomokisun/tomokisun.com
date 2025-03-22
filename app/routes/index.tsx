import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  return c.render(
    <PersonalWebsite />
  )
})

function PersonalWebsite() {
  return (
    <>
      <div class="min-h-screen">
        <div class="container mx-auto px-4 py-8 max-w-3xl">
          <header class="flex justify-between items-center mb-8">
            <title>tomokisun - Personal Website</title>
            <h1 class="text-3xl font-bold">tomokisun</h1>
            <button 
              id="dark-mode-toggle"
              class="p-2 rounded-full bg-gray-800 text-white"
              aria-label="Toggle dark mode"
            >
              <span id="mode-icon">🌙</span>
            </button>
          </header>

          <main>
            <section class="mb-12">
              <h2 class="text-2xl font-bold mb-4 flex items-center">
                <span class="mr-2">😺</span> tomokisun
              </h2>
              <p class="mb-4">
                I'm originally an iOS engineer, but now I do everything mobile, web, backend, blockchain, etc.
              </p>
              <p class="mb-4">
                Not good at infrastructure layer though lol.
              </p>
            </section>

            <section class="mb-12">
              <h2 class="text-2xl font-bold mb-4 flex items-center">
                <span class="mr-2">🚀</span> Job
              </h2>
              
              <div class="mb-8">
                <h3 class="text-xl font-semibold mb-2">
                  <a 
                    href="https://camp-fire.jp" 
                    class="underline"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    CAMPFIRE, Inc.
                  </a> - prev
                </h3>
                <p class="mb-2">It is one of the largest crowdfunding sites in Japan.</p>
                <p class="mb-2">Responsible for mobile app launch.</p>
                <p>During the startup phase, 3 engineers were in charge, but after that, I was in charge of all development including iOS, Android, API Server, etc. almost by myself.</p>
              </div>
              
              <div>
                <h3 class="text-xl font-semibold mb-2">
                  <a 
                    href="https://github.com/0x1-company" 
                    class="underline"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    ONE, Inc.
                  </a> - now
                </h3>
                <p class="mb-2">I co-founded this company with a friend.</p>
                <p class="mb-2">Currently developing a social mobile app for teens.</p>
                <ul class="list-disc list-inside ml-4">
                  <li>
                    <a 
                      href="https://0x1.company" 
                      class="underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      https://0x1.company
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://github.com/0x1-company" 
                      class="underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      https://github.com/0x1-company
                    </a>
                  </li>
                </ul>
              </div>
            </section>

            <section class="mb-12">
              <h2 class="text-2xl font-bold mb-4 flex items-center">
                <span class="mr-2">👨🏻‍💻</span> Dev
              </h2>
              <ul class="space-y-3">
                {[
                  {
                    name: "0x1company/ios-monorepo",
                    url: "https://github.com/0x1-company/ios-monorepo",
                    description: "Social mobile app for teens."
                  },
                  {
                    name: "0x1company/god-ios",
                    url: "https://github.com/0x1-company/god-ios",
                    description: "See who likes you"
                  },
                  {
                    name: "@caaaption",
                    url: "https://github.com/caaaption",
                    description: "Get timely onchain information on your Home Screen with iPhone Widgets."
                  },
                  {
                    name: "@dcnsdomains",
                    url: "https://github.com/dcnsdomains",
                    description: "Your web3 username on Dogechain Decentralised naming for wallets, websites."
                  },
                  {
                    name: "tomokisun/Daily_App",
                    url: "https://github.com/tomokisun/Daily_App",
                    description: "We made one fucking app a day for 90 days starting January 26, 2019."
                  },
                  {
                    name: "0x1company/nererun",
                    url: "https://github.com/0x1-company/nererun",
                    description: "Open source voice application for children built in Flutter and Firebase."
                  }
                ].map((project, index) => (
                  <li key={index} class="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                    <a 
                      href={project.url} 
                      class="font-medium underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {project.name}
                    </a>
                    <p class="mt-1">{project.description}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-bold mb-4 flex items-center">
                <span class="mr-2">📫</span> Contact
              </h2>
              <p class="mb-4">Feel free to reach out!</p>
              <div class="flex space-x-4">
                <a 
                  href="https://twitter.com/tomokisun" 
                  class="inline-flex items-center px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 !text-white font-medium transition-colors duration-200"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
                <a 
                  href="https://www.linkedin.com/in/tomokisun" 
                  class="inline-flex items-center px-4 py-2 rounded-full bg-blue-700 hover:bg-blue-800 !text-white font-medium transition-colors duration-200"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            </section>
          </main>

          <footer class="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} tomokisun. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </>
  )
}
