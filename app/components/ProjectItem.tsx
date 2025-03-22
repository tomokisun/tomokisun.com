interface ProjectItemProps {
  name: string;
  url: string;
  description: string;
}

export function ProjectItem({ name, url, description }: ProjectItemProps) {
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
