/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Allow all origins for dev to prevent the cross-origin warning
    // In production, this doesn't apply the same way.
    // Note: allowedDevOrigins is for the Next.js dev server specifically.
    experimental: {
        // This server actions feature might be needed depending on version, 
        // but allowedDevOrigins is usually sufficient if on newer versions.
    }
};

module.exports = nextConfig;
