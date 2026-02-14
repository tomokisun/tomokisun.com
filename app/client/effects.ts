// Constants
const NOTIFICATION_DURATION_MS = 3000
const TRAIL_FADE_DURATION_MS = 1000
const TRAIL_THROTTLE_MS = 50
const CLICK_PARTICLE_COUNT = 8
const CLICK_PARTICLE_DELAY_MS = 50
const CLICK_PARTICLE_SPREAD = 30
const POPUP_FADE_DURATION_MS = 200
const PAGE_TRANSITION_DURATION_MS = 300
const MAX_TRAIL_ELEMENTS = 30

// Function to show notification
const showNotification = (message: string): void => {
  const notification = document.createElement('div')
  notification.textContent = message
  notification.className = 'notification-toast'

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, NOTIFICATION_DURATION_MS)
}

// Prevent right-click context menu and show notification
export function setupRightClickPrevention(): void {
  document.addEventListener(
    'contextmenu',
    (event: MouseEvent) => {
      event.preventDefault()
      showNotification('右クリックは無効になっています')
    },
    false,
  )
}

// Check if mouse is inside the layout grid within container
function isInsideContainer(e: MouseEvent, container: Element | null): boolean {
  if (!container) return false

  const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY)

  let currentElement = elementUnderCursor
  while (currentElement) {
    if (currentElement.classList.contains('layout-grid')) {
      let parent: Element | null = currentElement
      while (parent) {
        if (parent === container) {
          return true
        }
        parent = parent.parentElement
      }
    }
    currentElement = currentElement.parentElement
  }

  return false
}

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
  while (trailElements.length >= MAX_TRAIL_ELEMENTS) {
    const oldest = trailElements[0]
    if (!oldest) break
    removeTrailElement(oldest)
  }

  const trail = document.createElement('div')
  trail.className = 'cursor-trail'
  trail.style.left = `${x}px`
  trail.style.top = `${y}px`
  document.body.appendChild(trail)
  trailElements.push(trail)

  setTimeout(() => {
    removeTrailElement(trail)
  }, TRAIL_FADE_DURATION_MS)
}

// Mouse trail effect
export function setupMouseTrail(): void {
  const container = document.querySelector('.container')
  let throttleTimeout: ReturnType<typeof setTimeout> | null = null

  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (isInsideContainer(e, container)) return

    if (!throttleTimeout) {
      throttleTimeout = setTimeout(() => {
        createTrailElement(e.clientX, e.clientY)
        throttleTimeout = null
      }, TRAIL_THROTTLE_MS)
    }
  })
}

// Click particle effect
export function setupClickEffect(): void {
  const container = document.querySelector('.container')

  document.addEventListener('click', (e: MouseEvent) => {
    if (isInsideContainer(e, container)) return

    for (let i = 0; i < CLICK_PARTICLE_COUNT; i++) {
      setTimeout(() => {
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * CLICK_PARTICLE_SPREAD
        const x = e.clientX + Math.cos(angle) * distance
        const y = e.clientY + Math.sin(angle) * distance

        createTrailElement(x, y)
      }, i * CLICK_PARTICLE_DELAY_MS)
    }
  })
}

// Welcome popup (Windows 95 style)
export function setupWelcomePopup(): void {
  try {
    if (sessionStorage.getItem('welcomeShown')) return
    sessionStorage.setItem('welcomeShown', 'true')
  } catch {
    return
  }

  const overlay = document.createElement('div')
  overlay.className = 'welcome-popup-overlay'
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-modal', 'true')
  overlay.setAttribute('aria-label', 'ウェルカムメッセージ')

  const popup = document.createElement('div')
  popup.className = 'welcome-popup'

  const titlebar = document.createElement('div')
  titlebar.className = 'welcome-popup-titlebar'

  const titleText = document.createElement('span')
  titleText.textContent = 'ようこそ！'
  titlebar.appendChild(titleText)

  const closeBtn = document.createElement('button')
  closeBtn.className = 'welcome-popup-close'
  closeBtn.setAttribute('aria-label', 'ウェルカムポップアップを閉じる')
  closeBtn.textContent = '×'
  titlebar.appendChild(closeBtn)

  popup.appendChild(titlebar)

  const body = document.createElement('div')
  body.className = 'welcome-popup-body'

  const icon = document.createElement('div')
  icon.className = 'welcome-popup-icon'
  icon.textContent = '💻'
  body.appendChild(icon)

  const welcomeMsg = document.createElement('p')
  const boldText = document.createElement('b')
  boldText.textContent = 'tomokisunのホームページへようこそ！'
  welcomeMsg.appendChild(boldText)
  body.appendChild(welcomeMsg)

  const browserMsg = document.createElement('p')
  browserMsg.textContent = 'このサイトはNetscape Navigator 4.0またはInternet Explorer 5.0で最適にご覧いただけます。'
  body.appendChild(browserMsg)

  const resolution = document.createElement('p')
  resolution.className = 'welcome-popup-resolution'
  resolution.textContent = '解像度: 800x600推奨'
  body.appendChild(resolution)

  const okBtn = document.createElement('button')
  okBtn.className = 'welcome-popup-ok'
  okBtn.textContent = 'OK'
  body.appendChild(okBtn)

  popup.appendChild(body)
  overlay.appendChild(popup)
  document.body.appendChild(overlay)

  const closePopup = (): void => {
    overlay.classList.add('welcome-popup-overlay--closing')
    setTimeout(() => overlay.remove(), POPUP_FADE_DURATION_MS)
  }

  closeBtn.addEventListener('click', closePopup)
  okBtn.addEventListener('click', closePopup)
  overlay.addEventListener('click', (e: MouseEvent) => {
    if (e.target === overlay) closePopup()
  })
}

// Page transition wipe effect
export function setupPageTransition(): void {
  const transitionOverlay = document.createElement('div')
  transitionOverlay.className = 'page-transition-overlay'
  document.body.appendChild(transitionOverlay)

  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const link = target.closest('a')
    if (!link) return

    const href = link.getAttribute('href')
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return

    e.preventDefault()
    transitionOverlay.classList.add('active')
    setTimeout(() => {
      window.location.href = href
    }, PAGE_TRANSITION_DURATION_MS)
  })

  window.addEventListener('pageshow', () => {
    transitionOverlay.classList.add('active')
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        transitionOverlay.classList.remove('active')
      })
    })
  })
}
