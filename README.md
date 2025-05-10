StreamElements Overlay Suite for IRL Streaming

This repository contains a modular set of StreamElements Widgets and Overlay Extensions designed for immersive livestreaming experiences, especially IRL and GTA-style roleplay. The system is built using HTML/CSS/JS and utilizes StreamElements counters, fieldData inputs, and SE_API for full control without requiring OAuth.

🔧 Features Overview

🎛️ Control & Debug Panel

Full counter overview categorized by purpose (Overlay, Inventory, Misc)

Toggle buttons and +1/-1 adjusters for each counter

Live event log viewer (via onEventReceived)

📱 Smartphone HUD (GTA-style)

iPhone mockup with customizable backgrounds

Live weather data via OpenWeatherMap API

Real-time clock with precise syncing

Phone display modes: hidden, minimized, full (controlled via Phone counter)

Social stats: last follower, sub, donation

Event-based chat popup for all platforms (Twitch/YouTube)

GPS icon toggle based on Map counter

Bluetooth icon toggle based on Watch counter

Notification system with styled bars and animations

Dock with 4 app icons (customizable PNGs)

⌚ Apple Watch Mini-Widget

Black display surface embedded in mockup

Live stats shown dynamically from JSON (speed, heading, altitude)

Controlled visibility via Watch counter

🗺️ GTA-Style Mini-Map Widget

Leaflet-based map using Mapbox custom style or fallback

White GTA-style GPS marker

Map follows user’s location (RTIRL API)

Map + 3 status bars (health, stamina, armor)

Slide-in effect from left, toggled via Map counter

📍 Location Widget

Displays current location name (reverse geocoded via Mapbox)

Font: Dancing Script

Fades in/out based on Map counter

🌐 Event Feed (Moblin)

Transparent log of the latest stream events

Auto-colored entries based on event type (follow, sub, cheer, tip, raid)

Responsive and readable on mobile

💬 Live Chat Panel

Unified Twitch & YouTube message rendering

Emotes fully rendered (Twitch CDN)

Sender name + badge + platform icon

Messages from moderators are highlighted

Messages starting with ! are ignored

🧠 Tech Notes

Emote parsing avoids raw emote text rendering

All widgets use onWidgetLoad to initialize state via SE_API.counters.get

Dynamic updates via onEventReceived

All counters handled without OAuth using internal StreamElements logic

Overlay is compatible with OBS browser source

📁 Structure

/images/ – all HUD assets, icons, mockups (hosted via GitHub CDN)

/widgets/ – modular widget folders (phone, watch, map, chat, control, etc.)

🚀 Deployment

Create overlays in streamelements.com

Add a Custom Widget

Paste the full HTML/CSS/JS code into the widget editor

Use FieldData to define tokens and configurable values

Position widgets freely in the OBS scene

📌 Counters Used

Phone, PhoneBackground, Watch, Map, Scoreboard, Inventory,
Stars, Equipment, Cola, Wasserflasche, Rucksack, Bilal,
Boxhandschuhe, iPhone, Team1, Team2

💡 Example Use Cases

Stream IRL city walks with GTA-style map and phone

Manage roleplay HUD elements visually

Control inventory and triggers via panel interface

Use mobile chat viewer while streaming on the go

📬 Contact

Created by @vnxcnt – Feel free to open issues or reach out on GitHub if you want to contribute or extend the widget suite.
