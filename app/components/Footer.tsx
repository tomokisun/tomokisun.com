export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
      <p>© {year} tomokisun. All rights reserved.</p>
    </footer>
  );
}
