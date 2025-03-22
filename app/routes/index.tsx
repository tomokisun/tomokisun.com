import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  return c.render(
    <PersonalWebsite />
  )
})

// Header component with title and dark mode toggle
function Header() {
  return (
    <header className="flex justify-between items-center mb-8">
      <title>tomokisun - Personal Website</title>
      <h1 className="text-3xl font-bold">tomokisun</h1>
      <button 
        id="dark-mode-toggle"
        className="p-2 rounded-full bg-gray-800 text-white"
        aria-label="Toggle dark mode"
      >
        <span id="mode-icon">🌙</span>
      </button>
    </header>
  );
}

// Section title component for consistent section headers
function SectionTitle({ emoji, title }: { emoji: string; title: string }) {
  return (
    <h2 className="text-2xl font-bold mb-4 flex items-center">
      <span className="mr-2">{emoji}</span> {title}
    </h2>
  );
}

// Profile section component
function ProfileSection() {
  return (
    <section className="mb-12">
      <SectionTitle emoji="😺" title="tomokisun" />
      <p className="mb-4">
        I'm originally an iOS engineer, but now I do everything mobile, web, backend, blockchain, etc.
      </p>
      <p className="mb-4">
        Not good at infrastructure layer though lol.
      </p>
    </section>
  );
}

// Job experience component
function JobExperience({ 
  company, 
  url, 
  status, 
  description, 
  children 
}: { 
  company: string; 
  url: string; 
  status: string; 
  description?: string; 
  children?: any;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">
        <a 
          href={url} 
          className="underline"
          target="_blank" 
          rel="noopener noreferrer"
        >
          {company}
        </a> - {status}
      </h3>
      {description && <p className="mb-2">{description}</p>}
      {children}
    </div>
  );
}

// Job section component
function JobSection() {
  return (
    <section className="mb-12">
      <SectionTitle emoji="🚀" title="Job" />
      
      <JobExperience 
        company="CAMPFIRE, Inc." 
        url="https://camp-fire.jp" 
        status="prev"
        description="It is one of the largest crowdfunding sites in Japan."
      >
        <p className="mb-2">Responsible for mobile app launch.</p>
        <p>During the startup phase, 3 engineers were in charge, but after that, I was in charge of all development including iOS, Android, API Server, etc. almost by myself.</p>
      </JobExperience>
      
      <JobExperience 
        company="ONE, Inc." 
        url="https://github.com/0x1-company" 
        status="now"
        description="I co-founded this company with a friend."
      >
        <p className="mb-2">Currently developing a social mobile app for teens.</p>
        <ul className="list-disc list-inside ml-4">
          <li>
            <a 
              href="https://0x1.company" 
              className="underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              https://0x1.company
            </a>
          </li>
          <li>
            <a 
              href="https://github.com/0x1-company" 
              className="underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              https://github.com/0x1-company
            </a>
          </li>
        </ul>
      </JobExperience>
    </section>
  );
}

// Project item component
function ProjectItem({ 
  name, 
  url, 
  description 
}: { 
  name: string; 
  url: string; 
  description: string;
}) {
  return (
    <li className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
      <a 
        href={url} 
        className="font-medium underline"
        target="_blank" 
        rel="noopener noreferrer"
      >
        {name}
      </a>
      <p className="mt-1">{description}</p>
    </li>
  );
}

// Dev section component
function DevSection() {
  const projects = [
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
  ];

  return (
    <section className="mb-12">
      <SectionTitle emoji="👨🏻‍💻" title="Dev" />
      <ul className="space-y-3">
        {projects.map((project, index) => (
          <ProjectItem 
            key={index} 
            name={project.name} 
            url={project.url} 
            description={project.description} 
          />
        ))}
      </ul>
    </section>
  );
}

// Contact section component
function ContactSection() {
  return (
    <section>
      <SectionTitle emoji="📫" title="Contact" />
      <p className="mb-4">Feel free to reach out!</p>
      <div className="flex space-x-4">
        <a 
          href="https://twitter.com/tomokisun" 
          className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 !text-white font-medium transition-colors duration-200"
          target="_blank" 
          rel="noopener noreferrer"
        >
          Twitter
        </a>
        <a 
          href="https://www.linkedin.com/in/tomokisun" 
          className="inline-flex items-center px-4 py-2 rounded-full bg-blue-700 hover:bg-blue-800 !text-white font-medium transition-colors duration-200"
          target="_blank" 
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}

// Footer component
function Footer() {
  return (
    <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
      <p>© {new Date().getFullYear()} tomokisun. All rights reserved.</p>
    </footer>
  );
}

// Main PersonalWebsite component
function PersonalWebsite() {
  return (
    <>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Header />

          <main>
            <ProfileSection />
            <JobSection />
            <DevSection />
            <ContactSection />
          </main>

          <Footer />
        </div>
      </div>
    </>
  )
}
