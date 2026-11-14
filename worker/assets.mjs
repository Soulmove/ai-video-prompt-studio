// The build replaces this function with the exact versioned static asset bundle.
export function serveAsset(){return new Response('Run npm run build before deploying.',{status:503});}
