interface SectionTitleProps {
  emoji: string;
  title: string;
}

export function SectionTitle({ emoji, title }: SectionTitleProps) {
  return (
    <h2 className="text-2xl font-bold mb-4 flex items-center">
      <span className="mr-2">{emoji}</span> {title}
    </h2>
  );
}
