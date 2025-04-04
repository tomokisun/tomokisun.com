import type { ErrorHandler } from 'hono'
import { createRoute } from 'honox/factory'

const handler: ErrorHandler = (e, c) => {
  if ('getResponse' in e) {
    return e.getResponse()
  }
  console.error(e.message)
  c.status(500)
  return c.render(
    <div className="container">
      <table border={1} cellSpacing={0} cellPadding={5} align="center" bgcolor="#FFFFFF">
        <tr>
          <td align="center" bgcolor="#000000">
            <h1 className="blink">500 Error</h1>
          </td>
        </tr>
        <tr>
          <td valign="top">
            <div className="content">
              <div className="section">
                <div className="section-header">
                  INTERNAL SERVER ERROR
                </div>
                <div className="section-content">
                  <p>Sorry, something went wrong on our server.</p>
                  <div className="marquee-container">
                    <marquee scrollamount="3" behavior="alternate">Please try again later 😢</marquee>
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
