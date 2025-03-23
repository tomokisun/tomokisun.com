interface SectionTitleProps {
  emoji: string;
  title: string;
}

export const SectionTitle = (props: SectionTitleProps) => {
  return (
    <h2 className="text-2xl font-bold mb-4 flex items-center">
      <span className="mr-2">{props.emoji}</span> {props.title}
    </h2>
  );
}