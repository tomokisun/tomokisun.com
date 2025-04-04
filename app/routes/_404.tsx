import type { NotFoundHandler } from 'hono'
import { createRoute } from 'honox/factory'

const handler: NotFoundHandler = (c) => {
  c.status(404)
  return c.render(
    <div className="container">
      <table border={1} cellSpacing={0} cellPadding={5} align="center" bgcolor="#FFFFFF">
        <tr>
          <td align="center" bgcolor="#000000">
            <h1 className="blink">404 Error</h1>
          </td>
        </tr>
        <tr>
          <td valign="top">
            <div className="content">
              <div className="section">
                <div className="section-header">
                  PAGE NOT FOUND
                </div>
                <div className="section-content">
                  <p>The page you are looking for doesn't exist or has been moved.</p>
                  <div className="marquee-container">
                    <marquee scrollamount="3" behavior="alternate">Where did that page go? 🤔</marquee>
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

export default handler
