import { createRoute } from 'honox/factory'
import { ProfileSection } from '../components/profile-section'
import { JobSection } from '../components/job-section'
import { DevSection } from '../components/dev-section'
import { ContactSection } from '../components/contact-section'
import { Footer } from '../components/footer'
import { Header } from '../components/header'

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
