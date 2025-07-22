import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate

export const ProxyView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeSrcDoc, setIframeSrcDoc] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      setIframeSrcDoc(null);

      try {
        const searchParams = new URLSearchParams(location.search);
        const url = searchParams.get('url');

        if (!url) {
          setError('No URL provided');
          setLoading(false);
          return;
        }

        console.log('Fetching content for URL:', url);
        const response = await fetch(`http://localhost:3001/proxy?url=${encodeURIComponent(url)}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        console.log('Received Content-Type:', contentType);

        if (contentType?.includes('text/html')) {
          const text = await response.text(); // Changed 'let' to 'const'
          console.log('Received HTML content (first 200 chars):', text.substring(0, 200));

          /**
           * Rewrites all relative and absolute URLs within the HTML string to go through the proxy.
           * Also injects a script to handle internal link clicks and form submissions.
           * @param htmlString The original HTML content as a string.
           * @param baseUrl The base URL of the original website (e.g., 'https://example.com').
           * @returns The HTML string with rewritten URLs and injected script.
           */
          const rewriteUrlsAndInjectScript = (htmlString: string, baseUrl: string): string => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');

            // Remove <base> tags as they can interfere with our URL rewriting logic.
            doc.querySelectorAll('base').forEach(baseTag => baseTag.remove());

            // Select all elements that can contain URLs in their attributes.
            const elementsWithUrls = doc.querySelectorAll(
              '[href], [src], [srcset], [data], [action]' // Added 'action' for forms
            );

            elementsWithUrls.forEach(el => {
              let attrName = '';
              let originalUrlAttributeValue = '';

              if (el.hasAttribute('href')) {
                attrName = 'href';
              } else if (el.hasAttribute('src')) {
                attrName = 'src';
              } else if (el.hasAttribute('data')) {
                attrName = 'data';
              } else if (el.hasAttribute('action')) { // Handle form actions
                attrName = 'action';
              } else if (el.hasAttribute('srcset')) {
                // srcset is more complex as it can contain multiple URLs.
                // For simplicity, we'll skip rewriting srcset for now.
                // A more robust solution would parse and rewrite each URL within srcset.
                return;
              }

              if (attrName) {
                originalUrlAttributeValue = el.getAttribute(attrName) || '';

                // Skip if the attribute value is empty, a data URL, mailto, tel,
                // a fragment identifier, a javascript: pseudo-protocol, or already proxied.
                if (!originalUrlAttributeValue ||
                    originalUrlAttributeValue.startsWith('data:') ||
                    originalUrlAttributeValue.startsWith('mailto:') ||
                    originalUrlAttributeValue.startsWith('tel:') ||
                    originalUrlAttributeValue.startsWith('#') ||
                    originalUrlAttributeValue.startsWith('javascript:') ||
                    originalUrlAttributeValue.startsWith('http://localhost:3001/proxy?url=')) {
                  return;
                }

                try {
                  // Use the URL constructor to resolve relative URLs against the original base URL.
                  const absoluteOriginalUrl = new URL(originalUrlAttributeValue, baseUrl).href;

                  // Construct the new URL that points to our proxy, with the absolute original URL encoded.
                  const proxiedUrl = `http://localhost:3001/proxy?url=${encodeURIComponent(absoluteOriginalUrl)}`;
                  el.setAttribute(attrName, proxiedUrl);
                } catch (e) {
                  console.warn(`Could not rewrite URL "${originalUrlAttributeValue}" with base "${baseUrl}":`, e);
                }
              }
            });

            // --- Inject script for internal navigation handling ---
            const script = doc.createElement('script');
            script.type = 'text/javascript';
            script.textContent = `
              // Function to decode proxied URLs and send them to the parent
              function decodeAndPostMessage(proxiedUrl) {
                try {
                  const urlParam = new URL(proxiedUrl).searchParams.get('url');
                  if (urlParam) {
                    const originalUrl = decodeURIComponent(urlParam);
                    window.parent.postMessage({ type: 'navigate', url: originalUrl }, '*');
                  }
                } catch (e) {
                  console.error('Error decoding proxied URL:', e);
                }
              }

              // Intercept link clicks
              document.addEventListener('click', function(event) {
                let target = event.target;
                // Traverse up the DOM tree to find the nearest anchor tag
                while (target && target.tagName !== 'A') {
                  target = target.parentElement;
                }

                if (target && target.tagName === 'A') {
                  const href = target.getAttribute('href');
                  // Only intercept if it's a proxied URL (or an internal link that should be proxied)
                  if (href && href.startsWith('http://localhost:3001/proxy?url=')) {
                    event.preventDefault(); // Prevent default navigation
                    decodeAndPostMessage(href);
                  }
                }
              });

              // Intercept form submissions
              document.addEventListener('submit', function(event) {
                const form = event.target;
                if (form && form.tagName === 'FORM') {
                  const action = form.getAttribute('action');
                  // Only intercept if it's a proxied URL
                  if (action && action.startsWith('http://localhost:3001/proxy?url=')) {
                    // For forms, we let the form submit to the proxied action.
                    // The proxy server will then fetch the result, and our parent ProxyView
                    // will re-render with the new content.
                    // No need to prevent default here if the action is already proxied.
                    // However, if we wanted to change the parent URL *before* submission,
                    // we'd preventDefault and handle it via postMessage.
                    // For simplicity, we'll rely on the server proxy's response.
                    // If the form method is GET, the browser's URL will change,
                    // which will naturally trigger a re-render in ProxyView.
                    // If it's POST, the iframe navigates, and we rely on the iframe's
                    // content changing to trigger a new srcdoc.
                  }
                }
              });
            `;
            // Append the script to the head or body. Appending to head is often safer for early execution.
            doc.head.appendChild(script);

            return doc.documentElement.outerHTML;
          };

          // Rewrite URLs and inject the script
          const rewrittenHtml = rewriteUrlsAndInjectScript(text, url);
          setIframeSrcDoc(rewrittenHtml);
        } else {
          // For non-HTML content, redirect the browser to the object URL.
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          console.log('Non-HTML content, redirecting to object URL:', objectUrl);
          window.location.href = objectUrl;
        }

        setLoading(false);
      } catch (err) {
        console.error('ProxyView fetch error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred during fetch.');
        setLoading(false);
      }
    };

    fetchContent();

    // --- Parent window message listener ---
    const handleMessage = (event: MessageEvent) => {
      // Ensure the message is from our iframe and has the 'navigate' type
      if (event.source === window.frames[0] && event.data && event.data.type === 'navigate') {
        const newUrl = event.data.url;
        console.log('Received navigation request from iframe:', newUrl);
        // Update the URL in the parent browser, which will trigger a re-fetch in this component
        navigate(`/proxy?url=${encodeURIComponent(newUrl)}`);
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [location.search, navigate]); // Add navigate to dependencies

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 bg-gray-100">
        <div className="text-lg font-semibold">Loading content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-100 text-red-700">
        <div className="text-lg font-semibold">Error: {error}</div>
      </div>
    );
  }

  return iframeSrcDoc ? (
    <iframe
      srcDoc={iframeSrcDoc}
      style={{ width: '100%', height: '100vh', border: 'none' }}
      // Sandbox attributes are crucial for allowing scripts and communication.
      // 'allow-scripts': Allows JavaScript execution.
      // 'allow-same-origin': Allows content to be treated as being from the same origin,
      //                      which is often needed for scripts that interact with cookies/storage.
      // 'allow-popups': Allows pop-up windows (e.g., for external links).
      // 'allow-forms': Allows form submissions.
      // 'allow-modals': Allows modal dialogs (e.g., alert(), prompt()).
      // 'allow-top-navigation': Allows the iframe to navigate the top-level browsing context.
      //                         This is important if some links explicitly target _top.
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-top-navigation"
    />
  ) : (
    <div className="w-full h-screen overflow-hidden" />
  );
};
