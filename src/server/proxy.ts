import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';
import { JSDOM } from 'jsdom'; // Import JSDOM
import fs from 'fs'; // Node.js file system module
import puppeteer from 'puppeteer'; // For Cloudflare bypass
import UserAgent from 'user-agents'; // For realistic browser user-agent


const app = express();

// Configurable cache directory
const CACHE_DIR = process.env.PROXY_CACHE_DIR || './proxy_cache';
// Ensure cache directory exists at startup
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Utility: Cache fetched HTML responses to disk for debugging or offline use
function cacheHtmlToFile(url: string, html: string) {
  try {
    const safeFilename = url.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 100) + '.html';
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR);
    }
    const filePath = `${CACHE_DIR}/${safeFilename}`;
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`[Proxy Cache] Cached HTML for ${url} at ${filePath}`);
  } catch (e) {
    logError(`[Proxy Cache] Failed to cache HTML: ${e}`);
  }
}

// Utility: Cache non-HTML responses (e.g., images, scripts)
function cacheBufferToFile(url: string, buffer: Buffer, contentType: string) {
  try {
    let ext = '.bin';
    if (contentType.includes('image/png')) ext = '.png';
    else if (contentType.includes('image/jpeg')) ext = '.jpg';
    else if (contentType.includes('application/javascript')) ext = '.js';
    else if (contentType.includes('text/css')) ext = '.css';
    else if (contentType.includes('application/json')) ext = '.json';
    const safeFilename = url.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 100) + ext;
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR);
    }
    const filePath = `${CACHE_DIR}/${safeFilename}`;
    fs.writeFileSync(filePath, buffer);
    console.log(`[Proxy Cache] Cached buffer for ${url} at ${filePath}`);
  } catch (e) {
    logError(`[Proxy Cache] Failed to cache buffer: ${e}`);
  }
}

// Logging functions are now no-ops
function logRequest(method: string, url: string, ip: string) {}
function logError(message: string) {}

// Enable CORS for all origins, allowing credentials, and all headers/methods.
app.use(cors({
  credentials: true,
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}));
app.use(cookieParser());
app.options('*', cors()); // Pre-flight OPTIONS handler

// Middleware to parse raw body for POST requests
app.use(express.raw({ type: '*/*' }));

/**
 * Rewrites URLs within HTML content to be proxied.
 * @param htmlString The original HTML content.
 * @param originalRequestUrl The URL that was originally requested by the client for this HTML.
 * @returns The HTML string with all relevant URLs rewritten.
 */
const rewriteHtmlUrls = (htmlString: string, originalRequestUrl: string): string => {
  try {
    const dom = new JSDOM(htmlString);
    const document = dom.window.document;
    const baseUrl = new URL(originalRequestUrl); // Use the original request URL as the base for resolving relative paths

    // Remove any existing <base> tags to prevent conflicts
    document.querySelectorAll('base').forEach(baseTag => baseTag.remove());

    // Inject a <base> tag to control relative URL resolution
    const baseTag = document.createElement('base');
    // Determine the base URL for relative paths. This should be the *root* of the original domain, proxied.
    // For example, if originalRequestUrl is https://discord.com/login, the base should be https://discord.com/
    const originalDomainRoot = new URL('/', baseUrl).href; // Ensures we get 'https://discord.com/'
    baseTag.href = `http://localhost:3001/proxy?url=${encodeURIComponent(originalDomainRoot)}`;
    document.head.prepend(baseTag); // Prepend to ensure it's processed early

    console.log(`[Server Rewriter] Injected <base href="${baseTag.href}">`);


    // Select elements with common URL attributes
    const elementsWithUrls = document.querySelectorAll(
      '[href], [src], [srcset], [data], [action], [formaction]' // Added formaction for buttons
    );

    elementsWithUrls.forEach(el => {
      let attrName = '';
      let originalUrlValue = '';

      if (el.hasAttribute('href')) {
        attrName = 'href';
      } else if (el.hasAttribute('src')) {
        attrName = 'src';
      } else if (el.hasAttribute('data')) {
        attrName = 'data';
      } else if (el.hasAttribute('action')) {
        attrName = 'action';
      } else if (el.hasAttribute('formaction')) { // For <button type="submit" formaction="...">
        attrName = 'formaction';
      } else if (el.hasAttribute('srcset')) {
        // srcset is complex (e.g., "url1 1x, url2 2x"). Requires more advanced parsing.
        // For now, we'll skip it to avoid breaking things, but it's a known limitation.
        return;
      }

      if (attrName) {
        originalUrlValue = el.getAttribute(attrName) || '';

        // Skip if empty, data URL, mailto, tel, fragment, javascript, about:blank, or already processed
        if (!originalUrlValue ||
            originalUrlValue.startsWith('data:') ||
            originalUrlValue.startsWith('mailto:') ||
            originalUrlValue.startsWith('tel:') ||
            originalUrlValue.startsWith('#') ||
            originalUrlValue.startsWith('javascript:') ||
            originalUrlValue.startsWith('about:blank') ||
            originalUrlValue.startsWith('http://localhost:3001/proxy?url=')) { // Also skip if already proxied
          return;
        }

        try {
          // Resolve the URL to an absolute path using the original base URL
          const absoluteOriginalUrl = new URL(originalUrlValue, baseUrl).href;
          // All attributes and elements now go through the proxy
          const proxiedUrl = `http://localhost:3001/proxy?url=${encodeURIComponent(absoluteOriginalUrl)}`;
          
          el.setAttribute(attrName, proxiedUrl);

          // Enhanced logging for all rewritten attributes
          if (attrName === 'href') {
            console.log(`[Server Rewriter] Rewrote href: "${originalUrlValue}" -> "${proxiedUrl}" for element: ${el.tagName}`);
          } else if (attrName === 'src') {
            console.log(`[Server Rewriter] Rewrote src: "${originalUrlValue}" -> "${proxiedUrl}" for element: ${el.tagName}`);
          } else {
            console.log(`[Server Rewriter] Rewrote ${attrName}: "${originalUrlValue}" -> "${proxiedUrl}" for element: ${el.tagName}`);
          }

        } catch (e) {
          console.warn(`[Server Proxy] Could not rewrite URL "${originalUrlValue}" with base "${baseUrl.href}":`, e);
        }
      }
    });

    // Inject a script to handle internal navigation and history API calls
    // This script will run inside the iframe and communicate with the parent
    const injectedScript = document.createElement('script');
    injectedScript.type = 'text/javascript';
    // Use a self-executing anonymous function to avoid polluting global scope
    injectedScript.textContent = `
      (function() {
        const PROXY_SERVER_URL = 'http://localhost:3001/proxy?url=';
        // The iframe's current location will be a proxied URL, use it as base for internal resolutions
        const IFRAME_CURRENT_PROXIED_URL = window.location.href;

        // Attempt to override Webpack's public path for dynamic chunk loading
        // This is crucial for sites using Webpack to load additional JS/WASM chunks
        // Ensure the path ends with a slash '/'
        try {
            // Base for webpack public path should be the proxied root of the original site
            const originalBaseUrl = decodeURIComponent(new URL(IFRAME_CURRENT_PROXIED_URL).searchParams.get('url') || IFRAME_CURRENT_PROXIED_URL);
            const proxiedRootForWebpack = PROXY_SERVER_URL + encodeURIComponent(new URL('/', originalBaseUrl).href);
            window.__webpack_public_path__ = proxiedRootForWebpack;
            console.log('[Injected Script] Set __webpack_public_path__ to: ' + window.__webpack_public_path__);
        } catch (e) {
            console.error('[Injected Script] Failed to set __webpack_public_path__: ' + e);
        }


        // Helper to resolve URLs to absolute and then prepend proxy URL
        function getProxiedUrl(originalUrl) {
          try {
            // Resolve against the *original* URL of the currently loaded page,
            // which can be extracted from the iframe's current proxied URL.
            const baseForResolution = decodeURIComponent(new URL(IFRAME_CURRENT_PROXIED_URL).searchParams.get('url') || IFRAME_CURRENT_PROXIED_URL);
            const absoluteUrl = new URL(originalUrl, baseForResolution).href;
            console.log('[Injected Script] getProxiedUrl (for dynamic requests): Original: ' + originalUrl + ' Base: ' + baseForResolution + ' -> Absolute: ' + absoluteUrl + ' -> Proxied: ' + (PROXY_SERVER_URL + encodeURIComponent(absoluteUrl)));
            return PROXY_SERVER_URL + encodeURIComponent(absoluteUrl);
          } catch (e) {
            console.error('[Injected Script] Failed to get proxied URL for: ' + originalUrl + ' ' + e);
            return originalUrl; // Fallback to original if error
          }
        }

        // Helper to send navigation requests to the parent window
        function postNavigateMessage(url) {
          try {
            if (window.parent) {
              console.log('[Injected Script] Sending navigate message to parent for URL: ' + url);
              window.parent.postMessage({ type: 'navigate', url: url }, '*');
            }
          } catch (e) {
            console.error('[Injected Script] Error sending postMessage to parent: ' + e);
          }
        }

        // Function to rewrite a single element's URL attribute dynamically
        // This is primarily for elements whose URLs might be set by client-side JS
        function rewriteElementUrl(el, attrName) {
            const originalUrlValue = el.getAttribute(attrName) || '';
            if (!originalUrlValue ||
                originalUrlValue.startsWith('data:') ||
                originalUrlValue.startsWith('mailto:') ||
                originalUrlValue.startsWith('tel:') ||
                originalUrlValue.startsWith('#') ||
                originalUrlValue.startsWith('javascript:') ||
                originalUrlValue.startsWith('about:blank') ||
                originalUrlValue.startsWith(PROXY_SERVER_URL)) { // Also skip if already proxied
                return;
            }
            try {
                const proxiedUrl = getProxiedUrl(originalUrlValue);
                if (el.getAttribute(attrName) !== proxiedUrl) { // Only set if different to avoid infinite loops
                    el.setAttribute(attrName, proxiedUrl);
                    console.log('[Injected Script] Rewrote dynamic ' + attrName + ': "' + originalUrlValue + '" -> "' + proxiedUrl + '"');
                }
            } catch (e) {
                console.warn('[Injected Script] Could not rewrite dynamic ' + attrName + ' "' + originalUrlValue + '": ' + e);
            }
        }

        // --- Intercept link clicks ---
        document.addEventListener('click', function(event) {
          let target = event.target;
          while (target && target.tagName !== 'A' && target !== document.body) { // Add document.body to stop traversal
            target = target.parentElement;
          }
          if (target && target.tagName === 'A') {
            const href = target.getAttribute('href');
            if (href && !href.startsWith('data:') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('#') && !href.startsWith('javascript:') && !href.startsWith('about:blank')) {
              // If it's already proxied, or a relative/absolute URL that should be proxied
              if (href.startsWith(PROXY_SERVER_URL) || !href.includes('://')) { // Check for non-absolute or already proxied
                event.preventDefault(); // Crucial: Prevent default navigation
                let originalUrl;
                if (href.startsWith(PROXY_SERVER_URL)) {
                    originalUrl = decodeURIComponent(new URL(href).searchParams.get('url') || '');
                } else {
                    originalUrl = new URL(href, decodeURIComponent(new URL(IFRAME_CURRENT_PROXIED_URL).searchParams.get('url') || IFRAME_CURRENT_PROXIED_URL)).href;
                }
                console.log('[Injected Script] Link Click Intercepted: ' + href + ' -> Original URL: ' + originalUrl);
                postNavigateMessage(originalUrl);
              }
            }
          }
        }, true); // Use capture phase to ensure we intercept before other handlers

        // --- Intercept form submissions ---
        document.addEventListener('submit', function(event) {
          const form = event.target;
          if (form && form.tagName === 'FORM') {
            const action = form.getAttribute('action');
            const method = (form.getAttribute('method') || 'GET').toUpperCase();

            if (action && !action.startsWith('data:') && !action.startsWith('mailto:') && !action.startsWith('tel:') && !action.startsWith('#') && !action.startsWith('javascript:') && !action.startsWith('about:blank')) {
              if (action.startsWith(PROXY_SERVER_URL) || !action.includes('://')) {
                if (method === 'GET') {
                  event.preventDefault(); // Prevent default form submission
                  const formData = new FormData(form);
                  const queryString = new URLSearchParams(formData).toString();
                  const originalActionUrl = decodeURIComponent(new URL(action).searchParams.get('url') || '');
                  const newOriginalUrl = originalActionUrl.includes('?') ?
                    originalActionUrl + '&' + queryString :
                    originalActionUrl + '?' + queryString;
                  postNavigateMessage(newOriginalUrl);
                }
                // For POST, we let the form submit to the rewritten action.
                // The proxy server will handle it, and the iframe will load the new content.
              }
            }
          }
        }, true);

        // --- Intercept XMLHttpRequest ---
        const originalXhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
          const proxiedUrl = getProxiedUrl(url);
          console.log('[Injected Script] Intercepted XHR: ' + url + ' -> ' + proxiedUrl);
          return originalXhrOpen.apply(this, [method, proxiedUrl, ...args]);
        };

        // --- Intercept Fetch API ---
        const originalFetch = window.fetch;
        window.fetch = function(input, init) {
          let proxiedInput = input;
          if (typeof input === 'string') {
            proxiedInput = getProxiedUrl(input);
          } else if (input instanceof Request) {
            proxiedInput = new Request(getProxiedUrl(input.url), input);
          }
          console.log('[Injected Script] Intercepted Fetch: ' + input + ' -> ' + proxiedInput);
          return originalFetch.apply(this, [proxiedInput, init]);
        };

        // --- Intercept History API (pushState, replaceState) ---
        const originalPushState = history.pushState;
        history.pushState = function(state, title, url) {
          if (url && typeof url === 'string' && !url.startsWith('about:blank')) {
            const targetOriginalUrl = url.startsWith(PROXY_SERVER_URL) ?
              decodeURIComponent(new URL(url).searchParams.get('url') || '') :
              new URL(url, decodeURIComponent(new URL(IFRAME_CURRENT_PROXIED_URL).searchParams.get('url') || IFRAME_CURRENT_PROXIED_URL)).href;

            console.log('[Injected Script] Intercepted pushState: ' + url + ' -> Original URL: ' + targetOriginalUrl);
            postNavigateMessage(targetOriginalUrl);
            return; // Prevent default history manipulation in iframe
          }
          return originalPushState.apply(this, [state, title, url]);
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function(state, title, url) {
          if (url && typeof url === 'string' && !url.startsWith('about:blank')) {
            const targetOriginalUrl = url.startsWith(PROXY_SERVER_URL) ?
              decodeURIComponent(new URL(url).searchParams.get('url') || '') :
              new URL(url, decodeURIComponent(new URL(IFRAME_CURRENT_PROXIED_URL).searchParams.get('url') || IFRAME_CURRENT_PROXIED_URL)).href;

            console.log('[Injected Script] Intercepted replaceState: ' + url + ' -> Original URL: ' + targetOriginalUrl);
            postNavigateMessage(targetOriginalUrl);
            return;
          }
          return originalReplaceState.apply(this, [state, title, url]);
        };

        // --- Intercept window.location assignments ---
        // Store original location object before overriding
        const originalLocation = window.location;
        Object.defineProperty(window, 'location', {
            get: () => ({
                ...originalLocation, // Spread existing properties
                assign: function(url) {
                    if (url && typeof url === 'string' && !url.startsWith('about:blank')) {
                        const targetOriginalUrl = url.startsWith(PROXY_SERVER_URL) ?
                          decodeURIComponent(new URL(url).searchParams.get('url') || '') :
                          new URL(url, decodeURIComponent(new URL(IFRAME_CURRENT_PROXIED_URL).searchParams.get('url') || IFRAME_CURRENT_PROXIED_URL)).href;
                        console.log('[Injected Script] Intercepted window.location.assign: ' + url + ' -> Original URL: ' + targetOriginalUrl);
                        postNavigateMessage(targetOriginalUrl);
                        return;
                    }
                    originalLocation.assign.apply(window.location, [url]);
                },
                replace: function(url) {
                    if (url && typeof url === 'string' && !url.startsWith('about:blank')) {
                        const targetOriginalUrl = url.startsWith(PROXY_SERVER_URL) ?
                          decodeURIComponent(new URL(url).searchParams.get('url') || '') :
                          new URL(url, decodeURIComponent(new URL(IFRAME_CURRENT_PROXIED_URL).searchParams.get('url') || IFRAME_CURRENT_PROXIED_URL)).href;
                        console.log('[Injected Script] Intercepted window.location.replace: ' + url + ' -> Original URL: ' + targetOriginalUrl);
                        postNavigateMessage(targetOriginalUrl);
                        return;
                    }
                    originalLocation.replace.apply(window.location, [url]);
                },
                set href(url) {
                    if (url && typeof url === 'string' && !url.startsWith('about:blank')) {
                        const targetOriginalUrl = url.startsWith(PROXY_SERVER_URL) ?
                          decodeURIComponent(new URL(url).searchParams.get('url') || '') :
                          new URL(url, decodeURIComponent(new URL(IFRAME_CURRENT_PROXIED_URL).searchParams.get('url') || IFRAME_CURRENT_PROXIED_URL)).href;
                        console.log('[Injected Script] Intercepted window.location.href setter: ' + url + ' -> Original URL: ' + targetOriginalUrl);
                        postNavigateMessage(targetOriginalUrl);
                        return;
                    }
                    originalLocation.href = url; // Fallback to original setter
                }
            }),
            set: (newValue) => {
                // This setter might be called if a script tries to assign a whole new location object.
                // We can't fully prevent this, but we'll log it.
                console.warn('[Injected Script] Attempt to set window.location object directly: ' + newValue);
            }
        });

        // --- Intercept window.open ---
        const originalWindowOpen = window.open;
        window.open = function(url, name, features) {
            if (url && typeof url === 'string' && !url.startsWith('about:blank')) {
                const targetOriginalUrl = url.startsWith(PROXY_SERVER_URL) ?
                  decodeURIComponent(new URL(url).searchParams.get('url') || '') :
                  new URL(url, decodeURIComponent(new URL(IFRAME_CURRENT_PROXIED_URL).searchParams.get('url') || IFRAME_CURRENT_PROXIED_URL)).href;
                
                const proxiedUrlForNewTab = PROXY_SERVER_URL + encodeURIComponent(targetOriginalUrl);

                // If target is _blank or not specified, allow original window.open with proxied URL
                if (!name || name === '_blank') {
                    console.log('[Injected Script] Intercepted window.open (new tab): ' + url + ' -> Proxied URL: ' + proxiedUrlForNewTab);
                    return originalWindowOpen.apply(this, [proxiedUrlForNewTab, name, features]);
                } else {
                    // Otherwise, it's likely meant for current tab or a named frame, so navigate parent
                    console.log('[Injected Script] Intercepted window.open (current tab/named frame): ' + url + ' -> Original URL: ' + targetOriginalUrl);
                    postNavigateMessage(targetOriginalUrl);
                    return null; // Prevent iframe from opening directly if we're handling via parent
                }
            }
            return originalWindowOpen.apply(this, [url, name, features]);
        };

        // --- MutationObserver to dynamically rewrite URLs ---
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes') {
                    const target = mutation.target as HTMLElement;
                    if (mutation.attributeName === 'href' && target.tagName === 'A') {
                        rewriteElementUrl(target, 'href');
                    } else if (mutation.attributeName === 'src' && (target.tagName === 'SCRIPT' || target.tagName === 'IMG' || target.tagName === 'IFRAME')) {
                        rewriteElementUrl(target, 'src');
                    } else if (mutation.attributeName === 'action' && target.tagName === 'FORM') {
                        rewriteElementUrl(target, 'action');
                    } else if (mutation.attributeName === 'formaction' && target.tagName === 'BUTTON') {
                        rewriteElementUrl(target, 'formaction');
                    }
                } else if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const element = node as HTMLElement;
                            // Check the added element itself
                            if (element.hasAttribute('href')) rewriteElementUrl(element, 'href');
                            if (element.hasAttribute('src')) rewriteElementUrl(element, 'src');
                            if (element.hasAttribute('action')) rewriteElementUrl(element, 'action');
                            if (element.hasAttribute('formaction')) rewriteElementUrl(element, 'formaction');
                            
                            // Check for children with href, src, action attributes
                            element.querySelectorAll('[href], [src], [action], [formaction]').forEach(el => {
                                if (el.hasAttribute('href')) rewriteElementUrl(el, 'href');
                                if (el.hasAttribute('src')) rewriteElementUrl(el, 'src');
                                if (el.hasAttribute('action')) rewriteElementUrl(el, 'action');
                                if (el.hasAttribute('formaction')) rewriteElementUrl(el, 'formaction');
                            });
                        }
                    });
                }
            });
        });

        // Start observing the document body for attribute and child list changes
        observer.observe(document.body, {
            attributes: true, // Observe attribute changes
            childList: true,  // Observe direct children being added/removed
            subtree: true,    // Observe all descendants
        });

      })(); // End of self-executing function
    `;
    document.head.appendChild(injectedScript);

    return dom.serialize(); // Return the modified HTML string
  } catch (e) {
    console.error('[Server Proxy] Error rewriting HTML:', e);
    return htmlString; // Return original HTML if rewriting fails
  }
};

// Proxy endpoint for GET requests
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  logRequest('GET', String(targetUrl), String(req.ip));
  if (!targetUrl || typeof targetUrl !== 'string') {
    logError('Proxy GET error: URL parameter is missing or invalid. Raw query: ' + JSON.stringify(req.query));
    return res.status(400).json({ error: 'URL parameter is required and must be a string' });
  }

  try {
    const decodedUrl = decodeURIComponent(targetUrl);
    console.log(`[Server Proxy] Proxying GET request to: ${decodedUrl}`);

    // Try fetch first
    let response;
    let contentType = '';
    let html = '';
    let statusCode = 200;
    let usedPuppeteer = false;
    try {
      // ...existing code for headers...
      const userAgent = new UserAgent();
      function randomIPv4() {
        return Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');
      }
      const fakeIP = randomIPv4();
      const headersToSend: Record<string, string> = {
        'User-Agent': userAgent.toString(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Referer': 'https://www.google.com/',
        'X-Forwarded-For': fakeIP,
        'X-Real-IP': fakeIP,
        'Client-IP': fakeIP,
      };
      if (req.headers['cookie']) {
        headersToSend['Cookie'] = req.headers['cookie'] as string;
      }
      response = await fetch(decodedUrl, {
        method: 'GET',
        headers: headersToSend,
        redirect: 'follow',
      });
      contentType = response.headers.get('content-type') || '';
      statusCode = response.status;
    } catch (err) {
      response = null;
    }

    // If Cloudflare challenge detected or fetch failed, use puppeteer
    let shouldUsePuppeteer = false;
    if (response) {
      if (response.status === 403 || response.status === 503) {
        // Check for Cloudflare IUAM challenge
        const text = await response.text();
        if (text.includes('cf-browser-verification') || text.includes('Cloudflare') || text.includes('Attention Required!')) {
          shouldUsePuppeteer = true;
        } else {
          html = text;
        }
      } else if (contentType.includes('text/html')) {
        html = await response.text();
      }
    } else {
      shouldUsePuppeteer = true;
    }

    if (shouldUsePuppeteer) {
      usedPuppeteer = true;
      try {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setUserAgent(new UserAgent().toString());
        await page.goto(decodedUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        // Wait for Cloudflare challenge to disappear
        await page.waitForFunction(() => !document.querySelector('div[id*="cf-browser-verification"], .challenge-running, #challenge-form'), { timeout: 15000 }).catch(() => {});
        html = await page.content();
        contentType = 'text/html';
        statusCode = 200;
        await browser.close();
      } catch (e) {
        logError('[Server Proxy] Puppeteer error: ' + e);
        return res.status(500).json({ error: 'Failed to bypass Cloudflare' });
      }
    }

    // --- Header Stripping and Overrides ---
    const headersToRemove = [
      'x-frame-options',
      'content-security-policy',
      'set-cookie',
      'content-encoding',
      'transfer-encoding',
      'content-length'
    ];
    if (response && response.headers) {
      response.headers.forEach((value, name) => {
        if (!headersToRemove.includes(name.toLowerCase())) {
          res.set(name, value);
        }
      });
    }
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Content-Security-Policy', '');

    if (contentType.includes('text/html')) {
      const rewrittenHtml = rewriteHtmlUrls(html, decodedUrl);
      res.status(statusCode).send(rewrittenHtml);
    } else if (response) {
      res.setHeader('Content-Type', contentType || 'application/octet-stream');
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.status(statusCode).send(buffer);
    } else {
      res.status(500).json({ error: 'Failed to proxy URL' });
    }
  } catch (error) {
    logError('[Server Proxy] Proxy GET error during fetch or rewriting: ' + error);
    res.status(500).json({ error: 'Failed to proxy URL' });
  }
});

// Proxy endpoint for POST requests
app.post('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  logRequest('POST', String(targetUrl), String(req.ip));
  if (!targetUrl || typeof targetUrl !== 'string') {
    logError('Proxy POST error: URL parameter is missing or invalid. Raw query: ' + JSON.stringify(req.query));
    return res.status(400).json({ error: 'URL parameter is required and must be a string' });
  }

  try {
    const decodedUrl = decodeURIComponent(targetUrl);
    console.log(`[Server Proxy] Proxying POST request to: ${decodedUrl}`);

    const headersToSend: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Content-Type': req.headers['content-type'] as string || 'application/octet-stream',
    };
    for (const headerName of ['accept', 'accept-language', 'cookie', 'referer']) {
      if (req.headers[headerName]) {
        if (headerName === 'cookie' && !req.headers['cookie']) { continue; }
        headersToSend[headerName] = req.headers[headerName] as string;
      }
    }

    const response = await fetch(decodedUrl, {
      method: 'POST',
      headers: headersToSend,
      body: req.body,
      redirect: 'follow',
    });

    const contentType = response.headers.get('content-type') || '';

    const headersToRemove = [
      'x-frame-options',
      'content-security-policy',
      'set-cookie',
      'content-encoding',
      'transfer-encoding',
      'content-length'
    ];

    response.headers.forEach((value, name) => {
      if (!headersToRemove.includes(name.toLowerCase())) {
        res.set(name, value);
      }
    });

    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Content-Security-Policy', '');

    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      logError('[Server Proxy] Stripped Set-Cookie header for debugging (POST): ' + cookies);
    }

    if (contentType.includes('text/html')) {
      const html = await response.text();
      const rewrittenHtml = rewriteHtmlUrls(html, decodedUrl);
      cacheHtmlToFile(decodedUrl, rewrittenHtml);
      res.status(response.status).send(rewrittenHtml);
    } else {
      res.setHeader('Content-Type', contentType || 'application/octet-stream');
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      cacheBufferToFile(decodedUrl, buffer, contentType);
      res.status(response.status).send(buffer);
    }
  } catch (error) {
    logError('[Server Proxy] Proxy POST error during fetch or rewriting: ' + error);
    res.status(500).json({ error: 'Failed to proxy URL' });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
