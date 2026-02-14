import { createClient } from 'honox/client'
import {
  setupRightClickPrevention,
  setupMouseTrail,
  setupClickEffect,
} from './client/effects'

// Create the client
createClient()

// Setup right-click prevention immediately (original was outside DOMContentLoaded)
setupRightClickPrevention()

// Setup mouse trail and click effects after DOM is ready (original was inside DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
  setupMouseTrail()
  setupClickEffect()
})
