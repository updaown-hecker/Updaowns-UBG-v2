import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, RotateCcw, ArrowLeft, ArrowRight, Plus, X } from 'lucide-react'; // Importing icons

export const ProxyView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const iframeRefs = useRef<{ [key: string]: HTMLIFrameElement | null }>({});

  const [tabs, setTabs] = useState<{
    id: string;
    url: string;
    title: string;
    loading: boolean;
    error: string | null;
    srcDoc: string | null;
    history: string[];
    historyIndex: number;
  }[]>([
    { id: 'tab-1', url: '', title: 'New Tab', loading: false, error: null, srcDoc: null, history: [], historyIndex: -1 },
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');
  const [currentUrlInput, setCurrentUrlInput] = useState('');

  // Find the currently active tab object
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  // Memoized function to update a specific tab's state
  const updateTab = useCallback((id: string, updates: Partial<typeof tabs[0]>) => {
    setTabs(prevTabs =>
      prevTabs.map(tab => (tab.id === id ? { ...tab, ...updates } : tab))
    );
  }, []);

  // Function to extract title from HTML string
  const getTitleFromHtml = (htmlString: string): string => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      const title = doc.querySelector('title')?.textContent;
      return title || 'Untitled';
    } catch (e) {
      console.error("Error parsing HTML for title:", e);
      return 'Untitled';
    }
  };

  // Function to rewrite URLs within HTML content to go through the proxy and inject a script
  const rewriteUrlsAndInjectScript = useCallback((htmlString: string, baseUrl: string, tabId: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Remove <base> tags as they can interfere with our URL rewriting logic.
    doc.querySelectorAll('base').forEach(baseTag => baseTag.remove());

    // Select all elements that can contain URLs in their attributes.
    const elementsWithUrls = doc.querySelectorAll(
      '[href], [src], [srcset], [data], [action]'
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
      } else if (el.hasAttribute('action')) {
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
    // This script will capture clicks and form submissions inside the iframe
    // and send messages to the parent window to trigger navigation in the main app.
    script.textContent = `
      function decodeAndPostMessage(proxiedUrl) {
        try {
          const urlParam = new URL(proxiedUrl).searchParams.get('url');
          if (urlParam) {
            const originalUrl = decodeURIComponent(urlParam);
            window.parent.postMessage({ type: 'navigate', url: originalUrl, tabId: '${tabId}' }, '*');
          }
        } catch (e) {
          console.error('Error decoding proxied URL:', e);
        }
      }

      document.addEventListener('click', function(event) {
        let target = event.target;
        while (target && target.tagName !== 'A') {
          target = target.parentElement;
        }

        if (target && target.tagName === 'A') {
          const href = target.getAttribute('href');
          if (href && href.startsWith('http://localhost:3001/proxy?url=')) {
            event.preventDefault();
            decodeAndPostMessage(href);
          }
        }
      });

      document.addEventListener('submit', function(event) {
        const form = event.target;
        if (form && form.tagName === 'FORM') {
          const action = form.getAttribute('action');
          if (action && action.startsWith('http://localhost:3001/proxy?url=')) {
            // For forms, we let the form submit to the proxied action.
            // The proxy server will then fetch the result, and our parent ProxyView
            // will re-render with the new content.
            // No need to prevent default here if the action is already proxied.
          }
        }
      });
    `;
    // Append the script to the head for early execution.
    doc.head.appendChild(script);

    return doc.documentElement.outerHTML;
  }, []); // Dependencies for useCallback

  // Function to fetch content from the proxy server
  const fetchContent = useCallback(async (tabId: string, url: string) => {
    updateTab(tabId, { loading: true, error: null, srcDoc: null });

    try {
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
        const text = await response.text();
        console.log('Received HTML content (first 200 chars):', text.substring(0, 200));

        const rewrittenHtml = rewriteUrlsAndInjectScript(text, url, tabId);
        updateTab(tabId, { srcDoc: rewrittenHtml, loading: false, title: getTitleFromHtml(text) });
      } else {
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        console.log('Non-HTML content, redirecting to object URL:', objectUrl);
        // For non-HTML content (like PDFs, images), we typically want the browser to handle it directly
        // rather than embed it in an iframe. This will cause the main browser window to navigate.
        window.location.href = objectUrl;
      }
    } catch (err) {
      console.error('ProxyView fetch error:', err);
      updateTab(tabId, { error: err instanceof Error ? err.message : 'An unknown error occurred during fetch.', loading: false });
    }
  }, [updateTab, rewriteUrlsAndInjectScript]); // Dependencies for useCallback

  // Effect to handle URL from query parameters (initial load or external navigation)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlFromQuery = searchParams.get('url');

    // Ensure we have an active tab to work with
    if (!activeTab) return;

    if (urlFromQuery && activeTab.url !== urlFromQuery) {
      const newHistory = [...activeTab.history.slice(0, activeTab.historyIndex + 1), urlFromQuery];
      updateTab(activeTabId, { url: urlFromQuery, title: 'Loading...', history: newHistory, historyIndex: newHistory.length - 1 });
      setCurrentUrlInput(urlFromQuery);
    } else if (!urlFromQuery && activeTab.url === '') {
      // If no URL in query and it's a new tab, set a default
      const defaultUrl = 'https://www.google.com'; // Or your desired home page
      updateTab(activeTabId, { url: defaultUrl, title: 'Google', history: [defaultUrl], historyIndex: 0 });
      setCurrentUrlInput(defaultUrl);
    }
  }, [location.search, activeTabId, tabs, updateTab, activeTab]); // 'activeTab' is already included here

  // Effect to trigger content fetching when the active tab's URL changes
  useEffect(() => {
    if (activeTab && activeTab.url) {
      fetchContent(activeTab.id, activeTab.url);
    }
  }, [activeTab?.url, activeTab?.id, fetchContent]);

  // Effect to listen for messages from iframes (for internal navigation)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'navigate' && event.data.tabId) {
        const { url: newUrl, tabId } = event.data;
        console.log('Received navigation request from iframe:', newUrl, 'for tab:', tabId);
        const tabToUpdate = tabs.find(tab => tab.id === tabId);
        if (tabToUpdate) {
          const newHistory = [...tabToUpdate.history.slice(0, tabToUpdate.historyIndex + 1), newUrl];
          updateTab(tabId, { url: newUrl, history: newHistory, historyIndex: newHistory.length - 1 });
          setCurrentUrlInput(newUrl);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [tabs, updateTab]); // Dependencies: tabs state to re-evaluate when tabs change, updateTab is stable

  // Navigation handlers
  const handleGoBack = () => {
    if (activeTab && activeTab.historyIndex > 0) {
      const newIndex = activeTab.historyIndex - 1;
      const newUrl = activeTab.history[newIndex];
      updateTab(activeTabId, { url: newUrl, historyIndex: newIndex });
      setCurrentUrlInput(newUrl);
    }
  };

  const handleGoForward = () => {
    if (activeTab && activeTab.historyIndex < activeTab.history.length - 1) {
      const newIndex = activeTab.historyIndex + 1;
      const newUrl = activeTab.history[newIndex];
      updateTab(activeTabId, { url: newUrl, historyIndex: newIndex });
      setCurrentUrlInput(newUrl);
    }
  };

  const handleReload = () => {
    if (activeTab) {
      fetchContent(activeTabId, activeTab.url);
    }
  };

  const handleNewTab = () => {
    const newTabId = `tab-${tabs.length + 1}`;
    const defaultUrl = 'https://www.google.com';
    setTabs(prevTabs => [
      ...prevTabs,
      { id: newTabId, url: defaultUrl, title: 'New Tab', loading: false, error: null, srcDoc: null, history: [defaultUrl], historyIndex: 0 },
    ]);
    setActiveTabId(newTabId);
    setCurrentUrlInput(defaultUrl);
  };

  const handleCloseTab = (id: string) => {
    setTabs(prevTabs => {
      const filteredTabs = prevTabs.filter(tab => tab.id !== id);
      if (filteredTabs.length === 0) {
        // If no tabs left, create a new one to prevent an empty browser
        handleNewTab();
        return []; // Return empty for now, newTab will add itself
      } else if (id === activeTabId) {
        // If active tab is closed, switch to the first remaining tab
        setActiveTabId(filteredTabs[0].id);
        setCurrentUrlInput(filteredTabs[0].url);
      }
      return filteredTabs;
    });
  };

  const handleHome = () => {
    navigate('/'); // Navigate back to the main application home page
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab && currentUrlInput) {
      let urlToLoad = currentUrlInput;
      // Basic URL validation/prefixing
      if (!urlToLoad.startsWith('http://') && !urlToLoad.startsWith('https://')) {
        urlToLoad = `https://${urlToLoad}`; // Default to https
      }
      const newHistory = [...activeTab.history.slice(0, activeTab.historyIndex + 1), urlToLoad];
      updateTab(activeTabId, { url: urlToLoad, history: newHistory, historyIndex: newHistory.length - 1 });
      setCurrentUrlInput(urlToLoad);
    }
  };

  if (!activeTab) {
    return <div className="flex items-center justify-center h-screen text-gray-400 bg-gradient-to-br from-gray-900 to-black">Loading tab...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-black text-white font-inter">
      {/* Tab Bar */}
      <div className="flex items-center bg-gray-800 p-2 shadow-lg z-20">
        <button
          onClick={handleNewTab}
          className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-sm mr-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <Plus size={16} className="mr-1" /> New Tab
        </button>
        <div className="flex flex-grow overflow-x-auto custom-scrollbar">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`flex items-center px-4 py-2 rounded-t-lg text-sm cursor-pointer whitespace-nowrap transition-colors duration-200
                ${activeTabId === tab.id ? 'bg-gray-700 shadow-inner' : 'bg-gray-600 hover:bg-gray-700'}`}
              onClick={() => {
                setActiveTabId(tab.id);
                setCurrentUrlInput(tab.url);
              }}
            >
              <span className="truncate max-w-[120px]">{tab.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent tab activation when closing
                  handleCloseTab(tab.id);
                }}
                className="ml-2 p-1 hover:bg-gray-500 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                title="Close Tab"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center bg-gray-800 p-2 shadow-lg border-t border-gray-700 z-10">
        <button
          onClick={handleHome}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors duration-200 mr-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          title="Home"
        >
          <Home size={20} />
        </button>
        <button
          onClick={handleGoBack}
          disabled={activeTab.historyIndex <= 0}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors duration-200 mr-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={handleGoForward}
          disabled={activeTab.historyIndex >= activeTab.history.length - 1}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors duration-200 mr-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          title="Forward"
        >
          <ArrowRight size={20} />
        </button>
        <button
          onClick={handleReload}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors duration-200 mr-4 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          title="Reload"
        >
          <RotateCcw size={20} />
        </button>
        <form onSubmit={handleSearchSubmit} className="flex-grow flex">
          <input
            type="text"
            value={currentUrlInput}
            onChange={(e) => setCurrentUrlInput(e.target.value)}
            placeholder="Enter URL or search term"
            className="flex-grow p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 text-white text-sm"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Go
          </button>
        </form>
      </div>

      {/* Iframe Container */}
      <div className="flex-grow relative">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`absolute inset-0 ${activeTabId === tab.id ? 'block' : 'hidden'}`}
          >
            {tab.loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10">
                <div className="text-blue-400 text-lg">Loading...</div>
              </div>
            )}
            {tab.error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-75 z-10 p-4 text-center">
                <div className="text-red-300 text-lg">Error: {tab.error}</div>
              </div>
            )}
            <iframe
              ref={el => (iframeRefs.current[tab.id] = el)}
              // Only set srcDoc if it's available and not null. An empty string will also work for blank iframe.
              srcDoc={tab.srcDoc || ''}
              // Sandbox attributes are crucial for allowing scripts and communication.
              // allow-top-navigation-by-user-activation is important for external links
              // that open in a new tab or window by user interaction.
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
              className="w-full h-full border-none"
              title={`Proxy View - ${tab.title}`}
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};
