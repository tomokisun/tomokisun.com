type FooterProps = {
  year?: number
  className?: string
}

export default function Footer({ 
  year = 2025, 
  className = ''
}: FooterProps) {
  return (
    <td colSpan={2} align="center" bgcolor="#000000" className={`footer ${className}`}>
      <div>© {year} tomokisun</div>
    </td>
  )
}
