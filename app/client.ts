import { createClient } from 'honox/client'

// Create the client
createClient()

/**
 * 右クリック禁止機能
 * 
 * このコードはウェブサイト上での右クリックを無効化し、
 * ユーザーが右クリックを試みた際に通知を表示します。
 */

// Function to show notification
const showNotification = (message: string) => {
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
document.addEventListener('contextmenu', (event) => {
  event.preventDefault()
  showNotification('右クリックは無効になっています')
  return false
}, false)
