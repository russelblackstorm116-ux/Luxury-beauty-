import React from 'react';
import {
  CheckCircle2,
  Share2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { WebsiteSettings } from '../types';

// Custom lightweight SVG Icons for major social media platforms
const TikTokIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.88-4.47V8.4a8.28 8.28 0 0 0 4.89 1.57V6.69z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

interface CreatorHeroProps {
  settings: WebsiteSettings;
  productsCount: number;
  onOpenShare: () => void;
}

export const CreatorHero: React.FC<CreatorHeroProps> = ({
  settings,
  productsCount,
  onOpenShare,
}) => {
  return (
    <section className="relative pt-6 pb-8 px-4 max-w-4xl mx-auto text-center" id="creator-hero-section">
      <div className="flex flex-col items-center">
        {/* Creator Avatar */}
        <div className="relative mb-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-stone-800 to-amber-600 shadow-md">
            <div className="w-full h-full rounded-full bg-stone-900 overflow-hidden flex items-center justify-center text-white border-2 border-white">
              {settings.profilePictureUrl ? (
                <img
                  src={settings.profilePictureUrl}
                  alt={settings.creatorName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-amber-300">
                  {settings.creatorName ? settings.creatorName.charAt(0) : 'T'}
                </span>
              )}
            </div>
          </div>
          {/* Verified Badge */}
          <div
            className="absolute bottom-1 right-1 bg-white text-blue-600 rounded-full p-0.5 shadow"
            title="Verified Creator Storefront"
          >
            <CheckCircle2 className="w-5 h-5 fill-blue-600 text-white" />
          </div>
        </div>

        {/* Creator Name and Handle */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center justify-center gap-2">
          {settings.creatorName}
        </h1>

        {settings.creatorHandle && (
          <p className="text-sm font-semibold text-stone-500 mt-0.5 mb-3">
            {settings.creatorHandle.startsWith('@') ? settings.creatorHandle : `@${settings.creatorHandle}`}
          </p>
        )}

        {/* Bio Text */}
        {settings.bio && (
          <p className="text-stone-700 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-5">
            {settings.bio}
          </p>
        )}

        {/* Social Media Link Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {settings.tiktokUrl && (
            <a
              href={settings.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-sm"
              id="social-link-tiktok"
            >
              <TikTokIcon />
              <span>TikTok</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          )}

          {settings.instagramUrl && (
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-600 text-white text-xs font-semibold hover:bg-pink-700 transition-colors shadow-sm"
              id="social-link-instagram"
            >
              <InstagramIcon />
              <span>Instagram</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          )}

          {settings.youtubeUrl && (
            <a
              href={settings.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors shadow-sm"
              id="social-link-youtube"
            >
              <YouTubeIcon />
              <span>YouTube</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          )}

          {settings.facebookUrl && (
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 transition-colors shadow-sm"
              id="social-link-facebook"
            >
              <FacebookIcon />
              <span>Facebook</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          )}

          <button
            onClick={onOpenShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors border border-stone-200"
            id="btn-open-share-hero"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Storefront</span>
          </button>
        </div>

        {/* Bio Link Permanent Notice Banner */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Official Amazon Recommendations • Updated Live</span>
        </div>
      </div>
    </section>
  );
};
