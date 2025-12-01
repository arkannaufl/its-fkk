export function getInitials(name: string | null | undefined): string {
  if (!name || name.trim().length === 0) {
    return "U";
  }

  const words = name.trim().split(/\s+/);
  
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  
  const firstInitial = words[0][0].toUpperCase();
  const lastInitial = words[words.length - 1][0].toUpperCase();
  
  return `${firstInitial}${lastInitial}`;
}

import { API_BASE_URL } from '../services/api';

export function getAvatarUrl(avatar: string | null | undefined): string | null {
  if (!avatar) return null;
  
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar;
  }
  
  const BASE_URL = API_BASE_URL.replace('/api', '');
  return `${BASE_URL}${avatar.startsWith('/') ? '' : '/'}${avatar}`;
}

