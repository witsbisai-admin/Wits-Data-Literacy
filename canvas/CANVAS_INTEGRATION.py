# ═══════════════════════════════════════════════════════════════
#  Wits Data Literacy Platform — Canvas LMS Integration Guide
#  Option D: Embed via Canvas External Tool / iFrame
# ═══════════════════════════════════════════════════════════════

# OVERVIEW
# ─────────
# Canvas supports three ways to embed the platform:
#
#   Method 1: Redirect Tool (easiest) — links out to the hosted URL
#   Method 2: iFrame Embed in Page    — embeds inline in a Canvas page
#   Method 3: LTI External Tool       — full grade passback (requires server)
#
# For a single-file static platform, Method 1 + Method 2 cover most needs.
# This file documents all three.

# ═══════════════════════════════════════════════════════════════
# METHOD 1: REDIRECT TOOL (5 minutes — no IT needed)
# ═══════════════════════════════════════════════════════════════
#
# This creates a button in your Canvas course that opens the platform
# in a new tab. Works with any hosting (Netlify, your own server, etc.)
#
# Steps in Canvas:
#   1. Go to your course → Settings → Apps → View App Configurations
#   2. Click "+ App"
#   3. Select Configuration Type: "By URL" or "Manual Entry"
#   4. Fill in:
#        Name:         Data Literacy for Data Champions
#        Consumer Key: wits-datalit (any value for redirect tools)
#        Shared Secret: (any value)
#        Launch URL:   https://your-deployed-platform-url.com
#   5. Save
#   6. The tool now appears as a link in your course Modules

# ═══════════════════════════════════════════════════════════════
# METHOD 2: iFRAME EMBED IN CANVAS PAGE (10 minutes)
# ═══════════════════════════════════════════════════════════════
#
# Embeds the platform directly inside a Canvas Page using HTML.
# Note: Canvas restricts iframes — you may need admin to whitelist your domain.
#
# Steps:
#   1. In your Canvas course, create a new Page
#   2. Click the HTML editor button (</>)
#   3. Paste the iframe code below (replace URL with your hosted URL):

CANVAS_IFRAME_CODE = """
<div style="width:100%; height:85vh; min-height:700px; border:none; overflow:hidden;">
  <iframe
    src="https://YOUR-PLATFORM-URL.com"
    width="100%"
    height="100%"
    style="border:none; display:block;"
    allow="fullscreen"
    title="Data Literacy for Data Champions — Wits BISO"
    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-storage-access-by-user-activation">
  </iframe>
</div>
<p style="font-size:12px; color:#666; margin-top:8px;">
  Having trouble? <a href="https://YOUR-PLATFORM-URL.com" target="_blank">Open in full window →</a>
</p>
"""

#   4. Save the page
#   5. Add it to your course Modules
#
# IMPORTANT — Canvas iFrame whitelist:
#   Canvas blocks iframes from unknown domains by default.
#   Ask your Canvas admin to whitelist your domain:
#     Admin → Security → Content Security Policy → Add your domain
#   OR use Netlify/Vercel which are usually pre-whitelisted.

# ═══════════════════════════════════════════════════════════════
# METHOD 3: LTI 1.3 EXTERNAL TOOL (full grade passback)
# ═══════════════════════════════════════════════════════════════
#
# LTI 1.3 allows Canvas to pass the learner's identity to the platform
# and receive grade/completion data back into the Canvas gradebook.
#
# This requires a small backend server (not just a static file).
# Recommended for institutions wanting Canvas gradebook integration.
#
# LTI 1.3 Tool Configuration (provide to Canvas admin):

LTI_CONFIG = {
    "title":            "Data Literacy for Data Champions",
    "description":      "NQF Level 7 Short Learning Programme — Wits BISO",
    "target_link_uri":  "https://YOUR-PLATFORM-URL.com",
    "oidc_initiation_url": "https://YOUR-PLATFORM-URL.com/lti/login",
    "public_jwk_url":   "https://YOUR-PLATFORM-URL.com/lti/jwks",
    "scopes": [
        "https://purl.imsglobal.org/spec/lti-ags/scope/lineitem",
        "https://purl.imsglobal.org/spec/lti-ags/scope/result.readonly",
        "https://purl.imsglobal.org/spec/lti-ags/scope/score"
    ],
    "extensions": [
        {
            "platform": "canvas.instructure.com",
            "settings": {
                "platform":     "canvas.instructure.com",
                "text":         "Data Literacy for Data Champions",
                "icon_url":     "https://YOUR-PLATFORM-URL.com/icon.png",
                "placements": [
                    {
                        "placement":       "course_navigation",
                        "message_type":    "LtiResourceLinkRequest",
                        "target_link_uri": "https://YOUR-PLATFORM-URL.com",
                        "text":            "Data Literacy Platform",
                        "icon_url":        "https://YOUR-PLATFORM-URL.com/icon.png"
                    }
                ]
            }
        }
    ]
}

# Steps for LTI 1.3 (Canvas admin required):
#   1. Canvas Admin → Developer Keys → + Developer Key → LTI Key
#   2. Paste the config above (adjust URLs)
#   3. Enable the key
#   4. Go to course → Settings → Apps → + App → by Client ID
#   5. Paste the Client ID from the Developer Key
#
# For LTI 1.3 backend implementation, a Node.js/Python server
# is needed to handle the OIDC handshake and grade passback.
# Recommended library: ltijs (Node.js) — https://cvmcosta.me/ltijs/

# ═══════════════════════════════════════════════════════════════
# CANVAS DOMAIN WHITELIST (ask your Canvas admin)
# ═══════════════════════════════════════════════════════════════
#
# Add these to Canvas Admin > Security > Allowlist:
#   - https://fonts.googleapis.com   (Google Fonts — used by the platform)
#   - https://fonts.gstatic.com      (Google Fonts static files)
#   - https://YOUR-PLATFORM-DOMAIN   (your deployed platform URL)
#
# Without these, the platform's fonts may fall back to system fonts
# (the platform still works, just with different typography).

# ═══════════════════════════════════════════════════════════════
# RECOMMENDED: NETLIFY → CANVAS (fastest setup)
# ═══════════════════════════════════════════════════════════════
#
# 1. Deploy platform/index.html to Netlify (free, 2 minutes)
#    → Get URL like: https://wits-datalit.netlify.app
#
# 2. In Canvas course → Pages → New Page
#    → Switch to HTML editor
#    → Paste the iframe code above with your Netlify URL
#
# 3. Add page to Modules
#    → Set as a required item for course completion
#
# Total time: ~15 minutes, zero IT involvement required.
