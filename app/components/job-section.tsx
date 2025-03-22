import { JobExperience } from './job-experience';
import { SectionTitle } from './section-title';

export function JobSection() {
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
