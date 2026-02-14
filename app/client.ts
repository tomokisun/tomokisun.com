import { createClient } from 'honox/client'
import {
  setupRightClickPrevention,
  setupMouseTrail,
  setupClickEffect,
  setupWelcomePopup,
  setupPageTransition,
} from './client/effects'

// Create the client
createClient()

// Setup right-click prevention immediately
setupRightClickPrevention()

// Setup effects after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setupMouseTrail()
  setupClickEffect()
  setupWelcomePopup()
  setupPageTransition()
})
