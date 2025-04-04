type FooterProps = {
  year?: number
  lastUpdated?: string
  className?: string
}

export default function Footer({ 
  year = 2025, 
  lastUpdated = '2025年4月4日',
  className = ''
}: FooterProps) {
  return (
    <td colSpan={2} align="center" bgcolor="#000000" className={`footer ${className}`}>
      <div>© {year} tomokisun - 最終更新日: {lastUpdated}</div>
    </td>
  )
}
