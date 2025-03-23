import type { JSX } from "hono/jsx/jsx-runtime";

interface JobExperienceProps {
  company: string;
  url: string;
  status: string;
  description?: string;
  children: JSX.Element;
}

export const JobExperience = (props: JobExperienceProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">
        <a 
          href={props.url} 
          className="underline"
          target="_blank" 
          rel="noopener noreferrer"
        >
          {props.company}
        </a> - {props.status}
      </h3>
      {props.description && <p className="mb-2">{props.description}</p>}
      {props.children}
    </div>
  );
}