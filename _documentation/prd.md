# Product Requirements Document (PRD)

## Project Overview  
**Name:** Simplify & Dumb-Down LinkedIn Post Rewriter Extension  
**Description:** A solo-built React-based browser extension that **automatically detects LinkedIn posts, rewrites them in-place** into simpler vocabulary, shorter sentences, and a lightly “dumber” tone using the Gemini API, and **displays the rewritten content directly within the LinkedIn feed as an overlay or replacement.**

---

## 1. Goals & Objectives  
- **Primary Goal:** Allow a single developer to build and ship a React-based extension that **seamlessly integrates with the LinkedIn feed to automatically transform** professional‐sounding posts into an intentionally simplified, casual tone, **modifying the displayed content directly.**  
- **Objectives:**  
  1. **Accuracy:** Preserve original meaning and key takeaways.  
  2. **Simplicity:** Reduce average sentence length by ~30%.  
  3. **Tone Shift:** Inject mild colloquialisms (“um,” “like,” “you know”) without offense.  
  4. **Performance:** Rewrite in under 2 seconds on modern consumer hardware.  
  5. **Privacy:** Communicate privacy trade-offs clearly; minimal text sent to API.

---

## 2. User Personas & Use Cases  

| Persona                 | Description                                           | Use Case                                               |
|-------------------------|-------------------------------------------------------|--------------------------------------------------------|
| **Casual Influencer**   | Wants to appear relatable and down-to-earth in posts. | Takes a formal announcement and makes it “chill.”      |
| **Social Media Manager**| Manages a small business LinkedIn page solo.          | Quickly experiments with tone variants for engagement. |
| **Language Learner**    | Non-native English speaker practicing informal tone.  | Rewrites professional posts to learn colloquialisms.   |

---

## 3. Functional Requirements  

1. **Content Extraction**  
   - **Automatically detect LinkedIn post text within the page DOM as the user scrolls or navigates.**  
   - Trigger via extension icon click or right-click menu.

2. **Rewrite Engine (Gemini API)**  
   - Send extracted text plus user settings to Google’s Gemini API over HTTPS.  
   - Payload includes: raw text, desired simplification level, “dumbify” toggle, filler-word frequency.  
   - Receive JSON response with rewritten text.  
   - Handle API errors and rate limits gracefully.

3. **User Controls & Settings**  
   - **Simplification Level:** Low / Medium / High (configurable in settings).  
   - **Dumbify Toggle:** On / Off (configurable in settings).  
   - **Filler Frequency:** None / Rare / Frequent (configurable in settings).  
   - **Rewritten Display:** Rewritten posts are displayed directly on the page. An optional, toggleable React-powered overlay/element may show a side-by-side original vs. rewritten comparison for individual posts, or provide quick actions.

4. **Output Integration**  
   - **Primarily, directly replace or overlay original post content in the LinkedIn feed with the rewritten version.**  
   - **Options to view original text, copy rewritten text, or report a poor rewrite should be available per post.**
   - Functionality to apply rewrites to the LinkedIn post editor (when composing a post) may be a secondary feature.

5. **Feedback & Analytics**  
   - In-extension button/mechanism (e.g., on the rewritten post overlay) to log poor rewrites (local storage).  
   - Optional anonymous telemetry: request latency, settings usage (with user consent).

---

## 4. Non-Functional Requirements  

| Category         | Requirement                                               |
|------------------|-----------------------------------------------------------|
| **Performance**  | ≥90% of requests complete in <2s (network + API).         |
| **Security**     | All API calls over TLS; API key stored securely in extension. |
| **Privacy**      | Only post text and minimal metadata sent; privacy policy explains. |
| **Compatibility**| Chrome, Firefox, Edge (latest two versions).             |
| **Accessibility**| WCAG AA contrast; full keyboard navigation.               |
| **Localization** | English only (MVP).                                       |

---

## 5. UX/UI & Interaction Flows  

1. **Install & Onboarding**  
   - Install from browser store → modal explains “what data is sent,” privacy settings, and how the automatic rewriting works.

2. **Rewriting a Post (Automatic In-Feed)**  
   - **As the user browses their LinkedIn feed, the extension automatically detects posts.**  
   - **Post content is sent to the Gemini API for rewriting based on current user settings.**  
   - **The original post text in the feed is replaced by (or overlaid with) the rewritten version.**  
   - **Users may have an option (e.g., a small icon or minimal UI element on/near the post) to view original text, copy the rewritten text, or report a poor rewrite.**
   - Adjusting simplification sliders/toggles for an *already rewritten post* might require interaction with an injected UI element or redirect to the main settings panel.

3. **Settings Panel**  
   - Accessible via the browser extension icon (the popup UI can serve as this settings panel).
   - Controls for default simplification, “dumbify,” filler frequency, telemetry opt-in/out, API key input (if needed), and “Reset.”

---

## 6. Technical Architecture  

- **Extension UI:**  
  - **Framework:** React (functional components + hooks)  
  - **Styling:** Tailwind CSS via CDN  
  - Chrome/Firefox/Edge WebExtension manifest v3

- **Rewrite Engine:**  
  - **API:** Google Gemini REST endpoint  
  - **Auth:** API key stored in extension’s secure storage  
  - **Rate-Limit Handling:** exponential backoff, user notification on quota hit

- **Data Flow:**  
  1. Content script extracts post text.  
  2. Background script sends HTTPS POST to Gemini API.  
  3. Gemini returns rewritten text.  
  4. UI (React) displays and applies it.

---

## 7. Milestones & Timeline  

_All work done sequentially by one developer._

| Phase                | Duration   | Deliverables                                    |
|----------------------|------------|-------------------------------------------------|
| **Design & Setup**   | 1 week     | Wireframes, manifest, repo scaffolding          |
| **Core Build**       | 3 weeks    | React UI + extraction + Gemini integration      |
| **Tuning & QA**      | 1 week     | Prompt engineering, performance & error testing |
| **Beta Release**     | 1 week     | Publish beta, gather user feedback              |
| **Polish & Launch**  | 1 week     | Final fixes, store submission, docs             |

**Total:** 7 weeks

---

## 8. Success Metrics  

- **Installs:** 1,000 in first month  
- **Usage:** ≥20 rewrites per active user per month  
- **Performance:** ≥90% of rewrites under 2s  
- **Feedback:** <5% of rewrites flagged poor  
- **Retention:** ≥30% monthly active rate  

---

## 9. Risks & Mitigations  

| Risk                         | Mitigation                                         |
|------------------------------|----------------------------------------------------|
| API costs spike              | Monitor usage; implement quota alerts             |
| Privacy concerns             | Clear privacy policy; minimal data collection     |
| Network downtime             | Cache last successful rewrite; offline notice     |
| Solo bandwidth constraints   | Prioritize core features; postpone extras         |

---

## 10. Approval  

- **Solo Developer:** __________________________  
- **Date:** ______________________  
