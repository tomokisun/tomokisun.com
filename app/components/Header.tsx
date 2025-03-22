export function Header() {
  return (
    <header className="flex justify-between items-center mb-8">
      <title>tomokisun - Personal Website</title>
      <h1 className="text-3xl font-bold">tomokisun</h1>
      <button 
        id="dark-mode-toggle"
        className="p-2 rounded-full bg-gray-800 text-white"
        aria-label="Toggle dark mode"
      >
        <span id="mode-icon">🌙</span>
      </button>
    </header>
  );
}
