import { createClient } from 'honox/client'
import {
  setupClickEffect,
  setupMouseTrail,
  setupPageTransition,
  setupRightClickPrevention,
  setupWelcomePopup,
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
