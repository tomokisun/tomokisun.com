import ThemeButton from '../islands/theme-button';

export const Header = () => {
  return (
    <header className="flex justify-between items-center mb-8">
      <title>tomokisun - Personal Website</title>
      <h1 className="text-3xl font-bold">tomokisun</h1>
      <ThemeButton />
    </header>
  );
}
