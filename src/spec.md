# Specification

## Summary
**Goal:** Build InspiraBoard as an inspiration-sharing app with Internet Identity accounts, posting and discovery, 1:1 messaging, and 1:1 voice/video calling (WebRTC) using canister-mediated polling for refresh/signaling, all wrapped in a cohesive non-blue/purple visual theme.

**Planned changes:**
- Add Internet Identity sign-in/out and a persisted user profile (display name, avatar, bio) tied to principal, with a profile screen showing the user’s posts.
- Implement Pinterest-like posts: create (image + caption, optional tags), home feed browsing, post detail view, and persistence/retrieval from the Motoko canister.
- Add discovery: backend-powered search by caption/tags and browsing/filtering by tag.
- Implement 1:1 direct messaging: user selection, conversation list, message history, send text messages, persistence, and polling-based refresh (no WebSockets).
- Implement 1:1 voice/video calling: initiate calls, incoming call prompt, accept/decline, in-call controls (mute, camera toggle for video, hang up), stable termination states, and canister-mediated signaling via non-WebSocket requests (e.g., polling).
- Apply a consistent distinctive theme across all screens (feed, create, detail, profile, messaging, calling) with primary colors not blue/purple by default.
- Add and use generated static assets (logo/app mark and empty-state illustrations) loaded from `frontend/public/assets/generated`.

**User-visible outcome:** Users can sign in with Internet Identity, set up a profile, post inspirations with images and captions, discover content via feed/search/tags, message other users 1:1 with auto-refresh, and start/receive 1:1 voice or video calls with basic controls in a consistently themed UI.
