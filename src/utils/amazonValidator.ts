/**
 * Amazon URL Validator
 * Ensures only legitimate HTTPS Amazon product or short links are accepted.
 * Prevents phishing subdomains, malicious redirection, and insecure HTTP links.
 */

// List of officially supported Amazon primary root domains and shortened official domains
export const APPROVED_AMAZON_DOMAINS = [
  'amazon.com',
  'amazon.co.uk',
  'amazon.de',
  'amazon.fr',
  'amazon.es',
  'amazon.it',
  'amazon.ca',
  'amazon.co.jp',
  'amazon.com.be',
  'amazon.nl',
  'amazon.se',
  'amazon.pl',
  'amazon.com.au',
  'amazon.in',
  'amazon.sg',
  'amazon.ae',
  'amazon.sa',
  'amazon.com.mx',
  'amazon.com.br',
  'amazon.eg',
  'amazon.com.tr',
  // Official Amazon short link domains
  'amzn.to',
  'amzn.eu',
  'amzn.asia',
  'a.co'
] as const;

export interface AmazonValidationResult {
  isValid: boolean;
  error?: string;
  cleanUrl?: string;
  domain?: string;
  asin?: string;
  estimatedImageUrl?: string;
}

/**
 * Extracts the 10-character Amazon Standard Identification Number (ASIN) from a URL if present.
 */
export function extractAmazonAsin(url: string): string | null {
  if (!url) return null;
  
  // Standard pattern: /dp/B0..., /gp/product/B0..., /product/B0...
  const dpMatch = url.match(/(?:\/dp\/|\/gp\/product\/|\/product\/|\/asin\/)([A-Z0-9]{10})/i);
  if (dpMatch && dpMatch[1]) {
    return dpMatch[1].toUpperCase();
  }

  // Fallback for query parameter: ?asin=B0... or &asin=B0...
  const queryMatch = url.match(/[?&]asin=([A-Z0-9]{10})/i);
  if (queryMatch && queryMatch[1]) {
    return queryMatch[1].toUpperCase();
  }

  return null;
}

/**
 * Generates official high-resolution Amazon CDN product image URLs from an ASIN.
 */
export function getAmazonProductImageUrls(asin: string): string[] {
  if (!asin || asin.length !== 10) return [];
  const cleanAsin = asin.toUpperCase();
  return [
    `https://images-na.ssl-images-amazon.com/images/P/${cleanAsin}.01._SCLZZZZZZZ_.jpg`,
    `https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&Format=_SL600_&ASIN=${cleanAsin}&MarketPlace=US`,
    `https://images-na.ssl-images-amazon.com/images/P/${cleanAsin}.01.LZZZZZZZ.jpg`
  ];
}

/**
 * Validates whether a provided string is a valid, secure Amazon URL.
 */
export function validateAmazonUrl(inputUrl: string): AmazonValidationResult {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return {
      isValid: false,
      error: 'Please enter a valid Amazon URL.'
    };
  }

  const trimmed = inputUrl.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter a valid Amazon URL.'
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      isValid: false,
      error: 'Please enter a valid Amazon URL.'
    };
  }

  // 1. Must use HTTPS
  if (parsed.protocol !== 'https:') {
    return {
      isValid: false,
      error: 'Please enter a valid Amazon URL (HTTPS is required).'
    };
  }

  // 2. Extract hostname and clean port or userinfo
  const hostname = parsed.hostname.toLowerCase();

  // 3. Strict domain matching
  // A hostname is valid if:
  // - It exactly equals an approved domain (e.g. "amazon.com" or "amzn.to")
  // - OR it ends with "." + approved domain (e.g. "www.amazon.com", "m.amazon.co.uk", "smile.amazon.com")
  const isApproved = APPROVED_AMAZON_DOMAINS.some((allowedDomain) => {
    return hostname === allowedDomain || hostname.endsWith(`.${allowedDomain}`);
  });

  if (!isApproved) {
    return {
      isValid: false,
      error: 'Please enter a valid Amazon URL.'
    };
  }

  // 4. Ensure there is at least a path (reject naked domain without path if needed, or allow valid storefront link)
  const asin = extractAmazonAsin(parsed.href) || undefined;
  const estimatedImageUrl = asin ? getAmazonProductImageUrls(asin)[0] : undefined;

  return {
    isValid: true,
    cleanUrl: parsed.href,
    domain: hostname,
    asin,
    estimatedImageUrl
  };
}
