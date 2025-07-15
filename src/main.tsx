import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // Keep if you still need router
import express from 'express'; // Import express
import path from 'path'; // Import path
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ThemeProvider } from './components/ThemeProvider.tsx';
import { Toaster } from './components/ui/toaster.tsx';
const app = express();
app.use('/proxy', createProxyMiddleware({target: 'http://localhost:3001', changeOrigin: true}));
app.use(express.static(path.join(__dirname, '../dist'))); // Assuming your build output is in a 'dist' folder
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});
const port = 3000; app.listen(port, () => {console.log(`Server listening on port ${port}`);});
