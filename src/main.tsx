
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add process polyfill for yahoo-finance2
window.process = { env: {} };

createRoot(document.getElementById("root")!).render(<App />);
