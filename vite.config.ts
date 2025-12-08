import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// KEEP this line, even though it causes issues on Netlify, because it works locally
import { cloudflare } from "@cloudflare/vite-plugin"; 

// Check for the Netlify environment variable
const isNetlifyBuild = process.env.NETLIFY === 'true';

export default defineConfig({
  plugins: [
    react(), 
    // Conditionally include the cloudflare plugin
    // It will be included if NOT a Netlify build (i.e., local dev or Cloudflare build)
    !isNetlifyBuild && cloudflare() 
  ].filter(Boolean), // The .filter(Boolean) removes the 'false' value when on Netlify
  server: {
    allowedHosts: true, 
  },
  build: {    
    chunkSizeWarningLimit: 5000,
  },
  resolve: {
    alias: {      
      "@": path.resolve(__dirname, "./src"),
    },
  },
});