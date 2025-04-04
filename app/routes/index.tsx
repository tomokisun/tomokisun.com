import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  let visitorsCount = await c.env.KV.get('VISITORS_COUNT');
  if (visitorsCount) {
    const next = Number(visitorsCount) + 1;
    await c.env.KV.put('VISITORS_COUNT', next.toString());
    visitorsCount = next.toString();
  } else {
    visitorsCount = '1';
    await c.env.KV.put('VISITORS_COUNT', visitorsCount);
  }

  return c.render(
    <div className="container">
      <table border={1} cellSpacing={0} cellPadding={5} align="center" bgcolor="#FFFFFF">
        <tr>
          <td colSpan={2} align="center" bgcolor="#000000">
            <h1 className="blink">Welcome to tomokisun's Homepage</h1>
            <div className="under-construction">
              <span>Always Under Construction</span>
            </div>
          </td>
        </tr>
        <tr>
          <td width={200} valign="top" bgcolor="#CCCCFF" className="sidebar">
            <div className="menu-header">MENU</div>
            <div className="menu-item"><a href="#about">About Me</a></div>
            <div className="menu-item"><a href="#job">My Job</a></div>
            <div className="menu-item"><a href="mailto:example@example.com">Email Me</a></div>
            <div className="counter">
              <div>Visitors:</div>
              <div className="counter-number">{visitorsCount.padStart(8, '0')}</div>
            </div>
          </td>
          <td width={600} valign="top">
            <div className="content">
              <a name="about"></a>
              <div className="section">
                <div className="section-header">
                  ABOUT ME
                </div>
                <div className="section-content">
                  <span className="name">tomokisun</span>
                  <p>I'm originally an iOS engineer, but now I do everything mobile, web, backend, blockchain, etc.</p>
                  <p>Not good at infrastructure layer though lol.</p>
                  <div className="marquee-container">
                    <marquee scrollamount="3" behavior="alternate">personal web site 👀</marquee>
                  </div>
                </div>
              </div>
              
              <hr className="rainbow" />
              
              <a name="job"></a>
              <div className="section">
                <div className="section-header">
                  JOB EXPERIENCE
                </div>
                <div className="section-content">
                  <p><blink>CAMPFIRE, Inc. - prev</blink></p>
                  <p>It is one of the largest crowdfunding sites in Japan.</p>
                  <p>Responsible for mobile app launch.</p>
                  <p>During the startup phase, 3 engineers were in charge, but after that, I was in charge of all development including iOS, Android, API Server, etc. almost by myself.</p>
                </div>
                <div className="section-content">
                  <p><blink>ONE, Inc. - now</blink></p>
                  <p>I co-founded this company with a friend.</p>
                  <p>Currently developing a social mobile app for teens.</p>
                </div>
              </div>
              
              <hr className="rainbow" />
              
              <div className="guestbook">
                <div className="guestbook-header">SIGN MY GUESTBOOK</div>
                <div className="guestbook-content">
                  <form>
                    <div>Name: <input type="text" className="form-input" /></div>
                    <div>Message: <textarea className="form-input"></textarea></div>
                    <div><button type="button" className="submit-button">Submit</button></div>
                  </form>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td colSpan={2} align="center" bgcolor="#000000" className="footer">
            <div>© 2025 tomokisun's Homepage - Last updated: April 4, 2025</div>
          </td>
        </tr>
      </table>
    </div>
  )
})
