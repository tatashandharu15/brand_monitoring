/**
 * Utility functions for avatar handling
 */

/**
 * Generate a color based on a string (name)
 */
export function getAvatarColor(name: string): string {
  const colors = [
    '#7B61FF', // Purple
    '#6DD5ED', // Cyan
    '#22C55E', // Green
    '#EAB308', // Yellow
    '#EF4444', // Red
    '#F97316', // Orange
    '#8B5CF6', // Violet
    '#06B6D4', // Sky
    '#10B981', // Emerald
    '#F59E0B', // Amber
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Generate initials from a name
 */
export function getInitials(name: string): string {
  if (!name) return 'U';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

/**
 * Generate a data URL for an SVG avatar with initials
 */
export function generateAvatarSvg(name: string): string {
  const initials = getInitials(name);
  const color = getAvatarColor(name);
  
  const svg = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" fill="${color}" rx="20"/>
      <text x="20" y="26" text-anchor="middle" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600">
        ${initials}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Check if an image URL is valid and accessible
 */
export async function isImageValid(url: string): Promise<boolean> {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && (contentType?.startsWith('image/') ?? false);
  } catch {
    return false;
  }
}

/**
 * Get the best available avatar source
 */
export function getAvatarSrc(profilePic?: string, name?: string): string {
  if (profilePic && profilePic.trim()) {
    return profilePic.trim();
  }
  
  if (name) {
    return generateAvatarSvg(name);
  }
  
  return '/placeholder.svg';
}