import { SectionTitle } from './section-title';

export const ContactSection = () => {
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