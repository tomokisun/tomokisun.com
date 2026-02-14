type ErrorPageProps = {
  code: number
  title: string
  message: string
  marqueeText: string
}

export default function ErrorPage({ code, title, message, marqueeText }: ErrorPageProps) {
  return (
    <div className="container">
      <table border={1} cellSpacing={0} cellPadding={5} align="center" bgcolor="#FFFFFF">
        <tr>
          <td align="center" bgcolor="#000000">
            <h1 className="blink">{code} Error</h1>
          </td>
        </tr>
        <tr>
          <td valign="top">
            <div className="content">
              <div className="section">
                <div className="section-header">
                  {title}
                </div>
                <div className="section-content">
                  <p>{message}</p>
                  <div className="marquee-container">
                    <marquee scrollamount="3" behavior="alternate">{marqueeText}</marquee>
                  </div>
                  <p style={{ textAlign: 'center', marginTop: '20px' }}>
                    <a href="/" className="home-link">Back to Home</a>
                  </p>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td align="center" bgcolor="#000000" className="footer">
            <div>© 2025 tomokisun's Homepage</div>
          </td>
        </tr>
      </table>
    </div>
  )
}
