import { createRoute } from 'honox/factory'
import { Header } from '../components/Header'
import { ProfileSection } from '../components/ProfileSection'
import { JobSection } from '../components/JobSection'
import { DevSection } from '../components/DevSection'
import { ContactSection } from '../components/ContactSection'
import { Footer } from '../components/Footer'

export default createRoute((c) => {
  return c.render(
    <PersonalWebsite />
  )
})

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
