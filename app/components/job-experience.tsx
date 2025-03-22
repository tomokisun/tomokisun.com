interface JobExperienceProps {
  company: string;
  url: string;
  status: string;
  description?: string;
  children?: any;
}

export default function JobExperience({ 
  company, 
  url, 
  status, 
  description, 
  children 
}: JobExperienceProps) {
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
