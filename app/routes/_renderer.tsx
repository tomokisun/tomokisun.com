import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'

export default jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
        <title>tomokisun's homepage</title>
        <meta name="description" content="Welcome to tomokisun's personal homepage! Best viewed in Netscape Navigator 4.0 or Internet Explorer 5.0." />
        <meta name="keywords" content="tomokisun, personal, homepage, web, mobile, iOS, engineer, 90s, retro" />
      </head>
      <body>
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Mouse trail effect
            document.addEventListener('DOMContentLoaded', function() {
              const body = document.querySelector('body');
              const container = document.querySelector('.container');
              
              // Create cursor trail effect
              function createTrailElement(x, y) {
                const trail = document.createElement('div');
                trail.className = 'cursor-trail';
                trail.style.left = x + 'px';
                trail.style.top = y + 'px';
                body.appendChild(trail);
                
                // Remove the element after animation completes
                setTimeout(() => {
                  trail.remove();
                }, 1000);
              }
              
              // Check if mouse is inside a table within container
              function isInsideContainer(e) {
                if (!container) return false;
                
                // Get the element under the cursor
                const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
                
                // Check if the element is a table or is inside a table
                let currentElement = elementUnderCursor;
                while (currentElement) {
                  // If we found a table element that's inside the container
                  if (currentElement.tagName === 'TABLE') {
                    // Check if this table is inside the container
                    let parent = currentElement;
                    while (parent) {
                      if (parent === container) {
                        return true; // It's a table inside the container
                      }
                      parent = parent.parentElement;
                    }
                  }
                  currentElement = currentElement.parentElement;
                }
                
                return false; // Not inside a table within container
              }
              
              // Track mouse movement and create trail elements
              document.addEventListener('mousemove', function(e) {
                // Skip trail creation if mouse is inside container
                if (isInsideContainer(e)) return;
                
                // Throttle the creation of trail elements (every 50ms)
                if (!this.throttleTimeout) {
                  this.throttleTimeout = setTimeout(() => {
                    createTrailElement(e.clientX, e.clientY);
                    this.throttleTimeout = null;
                  }, 50);
                }
              });
              
              // Add click effect
              document.addEventListener('click', function(e) {
                // Skip click effect if inside container
                if (isInsideContainer(e)) return;
                
                // Create multiple particles for click effect
                for (let i = 0; i < 8; i++) {
                  setTimeout(() => {
                    const trail = document.createElement('div');
                    trail.className = 'cursor-trail';
                    
                    // Random position around click point
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * 30;
                    const x = e.clientX + Math.cos(angle) * distance;
                    const y = e.clientY + Math.sin(angle) * distance;
                    
                    trail.style.left = x + 'px';
                    trail.style.top = y + 'px';
                    body.appendChild(trail);
                    
                    setTimeout(() => {
                      trail.remove();
                    }, 1000);
                  }, i * 50);
                }
              });
            });
          `
        }} />
      </body>
    </html>
  )
})
