// Function to show notification
const showNotification = (message: string): void => {
  // Create notification element
  const notification = document.createElement('div')
  notification.textContent = message
  notification.style.position = 'fixed'
  notification.style.top = '20px'
  notification.style.left = '50%'
  notification.style.transform = 'translateX(-50%)'
  notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
  notification.style.color = 'white'
  notification.style.padding = '10px 20px'
  notification.style.borderRadius = '5px'
  notification.style.zIndex = '9999'
  notification.style.fontFamily = 'sans-serif'
  notification.style.fontSize = '16px'
  notification.style.fontWeight = 'bold'
  notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'

  // Add to document
  document.body.appendChild(notification)

  // Remove after 3 seconds
  setTimeout(() => {
    document.body.removeChild(notification)
  }, 3000)
}

// Prevent right-click context menu and show notification
export function setupRightClickPrevention(): void {
  document.addEventListener(
    'contextmenu',
    (event) => {
      event.preventDefault()
      showNotification('右クリックは無効になっています')
      return false
    },
    false
  )
}

// Check if mouse is inside a table within container
function isInsideContainer(e: MouseEvent, container: Element | null): boolean {
  if (!container) return false

  // Get the element under the cursor
  const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY)

  // Check if the element is a table or is inside a table
  let currentElement = elementUnderCursor
  while (currentElement) {
    // If we found a table element that's inside the container
    if (currentElement.tagName === 'TABLE') {
      // Check if this table is inside the container
      let parent: Element | null = currentElement
      while (parent) {
        if (parent === container) {
          return true // It's a table inside the container
        }
        parent = parent.parentElement
      }
    }
    currentElement = currentElement.parentElement
  }

  return false // Not inside a table within container
}

// Maximum number of concurrent trail elements allowed in the DOM
const MAX_TRAIL_ELEMENTS = 30

// Explicitly managed array of trail element references
const trailElements: HTMLDivElement[] = []

// Remove a trail element from both the DOM and the tracking array
function removeTrailElement(trail: HTMLDivElement): void {
  const index = trailElements.indexOf(trail)
  if (index !== -1) {
    trailElements.splice(index, 1)
  }
  if (trail.parentNode) {
    trail.remove()
  }
}

// Create cursor trail effect
function createTrailElement(x: number, y: number): void {
  // Enforce the maximum limit: remove the oldest element(s) if at capacity
  while (trailElements.length >= MAX_TRAIL_ELEMENTS) {
    const oldest = trailElements[0]
    removeTrailElement(oldest)
  }

  const trail = document.createElement('div')
  trail.className = 'cursor-trail'
  trail.style.left = x + 'px'
  trail.style.top = y + 'px'
  document.body.appendChild(trail)
  trailElements.push(trail)

  // Remove the element after animation completes
  setTimeout(() => {
    removeTrailElement(trail)
  }, 1000)
}

// Mouse trail effect
export function setupMouseTrail(): void {
  const container = document.querySelector('.container')

  // Throttle state
  let throttleTimeout: ReturnType<typeof setTimeout> | null = null

  // Track mouse movement and create trail elements
  document.addEventListener('mousemove', function (e: MouseEvent) {
    // Skip trail creation if mouse is inside container
    if (isInsideContainer(e, container)) return

    // Throttle the creation of trail elements (every 50ms)
    if (!throttleTimeout) {
      throttleTimeout = setTimeout(() => {
        createTrailElement(e.clientX, e.clientY)
        throttleTimeout = null
      }, 50)
    }
  })
}

// Click particle effect
export function setupClickEffect(): void {
  const container = document.querySelector('.container')

  // Add click effect
  document.addEventListener('click', function (e: MouseEvent) {
    // Skip click effect if inside container
    if (isInsideContainer(e, container)) return

    // Create multiple particles for click effect
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        // Random position around click point
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 30
        const x = e.clientX + Math.cos(angle) * distance
        const y = e.clientY + Math.sin(angle) * distance

        // Use the shared createTrailElement which manages the element pool
        createTrailElement(x, y)
      }, i * 50)
    }
  })
}
