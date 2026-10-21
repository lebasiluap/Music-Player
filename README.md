# Afterhours

A focused listening space. Explore the demo collection or bring your own audio files.

A complete redesign and functional expansion of Paul Sackey’s original Music-Player portfolio project.

## Features and scope

Local audio-file import, playback, seek, volume, queue removal, previous/next, shuffle and repeat modes. Original ambient demo audio is synthesized as WAV in the browser with no remote audio service. Uploaded files are not transmitted; local tracks last until tab close.

## Run
Serve this repository with any static HTTP server, then open `/`. No build or account required.

## Test
Run `npm test` (Node.js 20+).

## Design
Responsive layout, visible keyboard focus, semantic controls, and reduced-motion support. Google Fonts is optional; system fallbacks work offline.

## Data and privacy
Browser storage is local to this device. No analytics, accounts, or backend. See the interface for external data/media attribution.

## Deployment
Publish this repository as a static site. Root index redirects to the original project directory to preserve existing nested links.

## Art direction

A retro listening studio with oversized condensed type, vinyl artwork and warm orange accents.

Responsive layouts were checked at 360px, 768px and 1440px viewport widths. Compact layouts use larger touch controls and stack or recompose desktop sections. Reduced-motion preferences are supported.

## Live app

[Open Afterhours](https://bigmindhub.netlify.app/projects/afterhours/) · [Portfolio](https://bigmindhub.netlify.app/#projects)
