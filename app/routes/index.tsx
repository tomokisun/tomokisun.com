import { createRoute } from 'honox/factory'
import Header from '../components/header.js'
import ProfileSection from '../components/profile-section.js'
import JobSection from '../components/job-section.js'
import DevSection from '../components/dev-section.js'
import ContactSection from '../components/contact-section.js'
import Footer from '../components/footer.js'

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
