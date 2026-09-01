import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { Product } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  product,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = product ? product.amazonUrl : currentUrl;
  const shareTitle = product
    ? `Check out ${product.name} on Amazon`
    : 'TikTok Creator Amazon Recommendations';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      onShowToast('Link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('Failed to copy link', 'error');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
        onClose();
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
      onClick={onClose}
      id="share-modal-overlay"
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-100 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        id="share-modal-card"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              {product ? 'Share Product' : 'Share Storefront'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-stone-600 mb-4">
          {product
            ? `Share direct Amazon product link for "${product.name}".`
            : 'Copy this link to place into your TikTok bio, Instagram link in bio, or share with friends.'}
        </p>

        {/* Copy URL Input Box */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200 mb-5">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent text-xs text-stone-800 font-mono px-2 outline-hidden truncate"
            id="input-share-url"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shrink-0"
            id="btn-copy-share-url"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-colors shadow-xs"
              id="btn-native-share"
            >
              Share via Device Options
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
