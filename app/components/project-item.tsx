interface ProjectItemProps {
  name: string;
  url: string;
  description: string;
}

export const ProjectItem = (props: ProjectItemProps) => {
  return (
    <li className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
      <a 
        href={props.url} 
        className="font-medium underline"
        target="_blank" 
        rel="noopener noreferrer"
      >
        {props.name}
      </a>
      <p className="mt-1">{props.description}</p>
    </li>
  );
}
