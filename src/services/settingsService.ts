import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { WebsiteSettings } from '../types';
import defaultAvatarImg from '../assets/images/luxury_beauty_avatar_1788282643561.jpg';

const SETTINGS_DOC_ID = 'creator_profile';
const SETTINGS_COLLECTION = 'settings';

export const DEFAULT_SETTINGS: WebsiteSettings = {
  creatorName: 'Luxury Beauty',
  creatorHandle: '@luxurybeauty289',
  bio: 'Welcome to my official Amazon recommendations storefront! Discover all the luxury beauty, skincare, and viral favorites featured in my TikTok videos.',
  profilePictureUrl: defaultAvatarImg,
  logoUrl: '',
  mainTitle: 'Featured Luxury Beauty & Amazon Finds',
  mainDescription: 'Curated beauty and lifestyle products tested and reviewed in my latest TikTok videos. Tap any item to view directly on Amazon.',
  tiktokUrl: 'https://www.tiktok.com/@luxurybeauty289?_r=1&_t=ZS-99NHwFMSjyv',
  instagramUrl: '',
  youtubeUrl: '',
  facebookUrl: '',
  amazonDisclosureText: 'Some links on this website may be Amazon affiliate links. We may earn a commission if you make a purchase through these links, at no additional cost to you.',
};

/**
 * Subscribes to real-time updates for website settings.
 */
export function subscribeSettings(
  onData: (settings: WebsiteSettings) => void,
  onError?: (error: Error) => void
) {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);

  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onData({
          creatorName: data.creatorName || DEFAULT_SETTINGS.creatorName,
          creatorHandle: data.creatorHandle || DEFAULT_SETTINGS.creatorHandle,
          bio: data.bio || DEFAULT_SETTINGS.bio,
          profilePictureUrl: data.profilePictureUrl || '',
          logoUrl: data.logoUrl || '',
          mainTitle: data.mainTitle || DEFAULT_SETTINGS.mainTitle,
          mainDescription: data.mainDescription || DEFAULT_SETTINGS.mainDescription,
          tiktokUrl: data.tiktokUrl || '',
          instagramUrl: data.instagramUrl || '',
          youtubeUrl: data.youtubeUrl || '',
          facebookUrl: data.facebookUrl || '',
          amazonDisclosureText: data.amazonDisclosureText || DEFAULT_SETTINGS.amazonDisclosureText,
          updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : Date.now(),
        });
      } else {
        // Return defaults if not initialized in Firestore yet
        onData(DEFAULT_SETTINGS);
      }
    },
    (err) => {
      console.warn('Settings snapshot fallback to defaults:', err);
      onData(DEFAULT_SETTINGS);
      if (onError) onError(err);
    }
  );
}

/**
 * Updates website settings in Firestore (Authorized admin only).
 */
export async function updateWebsiteSettings(settings: Partial<WebsiteSettings>): Promise<void> {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  await setDoc(
    docRef,
    {
      ...settings,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
