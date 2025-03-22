import { SectionTitle } from './SectionTitle';
import { ProjectItem } from './ProjectItem';

export function DevSection() {
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
