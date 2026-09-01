import React, { useState } from 'react';
import {
  Save,
  Upload,
  User,
  Info,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { uploadImage, validateImageFile } from '../../services/storageService';

interface SettingsFormProps {
  settings: WebsiteSettings;
  onSave: (updated: Partial<WebsiteSettings>) => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({
  settings,
  onSave,
  onShowToast,
}) => {
  const [creatorName, setCreatorName] = useState(settings.creatorName || '');
  const [creatorHandle, setCreatorHandle] = useState(settings.creatorHandle || '');
  const [bio, setBio] = useState(settings.bio || '');
  const [profilePictureUrl, setProfilePictureUrl] = useState(settings.profilePictureUrl || '');
  const [mainTitle, setMainTitle] = useState(settings.mainTitle || '');
  const [mainDescription, setMainDescription] = useState(settings.mainDescription || '');
  const [tiktokUrl, setTiktokUrl] = useState(settings.tiktokUrl || '');
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl || '');
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl || '');
  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl || '');
  const [amazonDisclosureText, setAmazonDisclosureText] = useState(
    settings.amazonDisclosureText || ''
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file.');
      onShowToast(validation.error || 'Invalid image file.', 'error');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const result = await uploadImage(file, 'profile');
      setProfilePictureUrl(result.url);
      onShowToast('Profile picture uploaded successfully!', 'success');
    } catch (err: any) {
      console.error('Avatar upload failure:', err);
      setUploadError(err.message || 'Avatar upload failed.');
      onShowToast('Profile picture upload failed', 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        creatorName: creatorName.trim(),
        creatorHandle: creatorHandle.trim(),
        bio: bio.trim(),
        profilePictureUrl: profilePictureUrl.trim(),
        mainTitle: mainTitle.trim(),
        mainDescription: mainDescription.trim(),
        tiktokUrl: tiktokUrl.trim(),
        instagramUrl: instagramUrl.trim(),
        youtubeUrl: youtubeUrl.trim(),
        facebookUrl: facebookUrl.trim(),
        amazonDisclosureText: amazonDisclosureText.trim(),
      });
      onShowToast('Website settings updated successfully!', 'success');
    } catch (err: any) {
      console.error('Settings save error:', err);
      onShowToast(err.message || 'Failed to update settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 max-w-3xl mx-auto" id="admin-settings-view">
      <div className="pb-4 mb-6 border-b border-stone-100">
        <h2 className="text-xl font-bold text-stone-900">Website & Creator Settings</h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Customize your bio link presentation, social media handles, and Amazon compliance disclosure.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Upload & Preview */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
            Creator Profile Picture
          </label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-stone-100 border-2 border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
              {profilePictureUrl ? (
                <img
                  src={profilePictureUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-8 h-8 text-stone-400" />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 cursor-pointer transition-colors shadow-xs">
                {isUploadingAvatar ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo (Max 5MB)</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleAvatarFileChange}
                  disabled={isUploadingAvatar}
                  className="hidden"
                  id="input-avatar-file"
                />
              </label>

              {profilePictureUrl && (
                <button
                  type="button"
                  onClick={() => setProfilePictureUrl('')}
                  className="ml-2 text-xs text-rose-600 hover:underline"
                >
                  Remove photo
                </button>
              )}

              {uploadError && (
                <p className="text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{uploadError}</span>
                </p>
              )}

              <div>
                <input
                  type="url"
                  value={profilePictureUrl}
                  onChange={(e) => setProfilePictureUrl(e.target.value)}
                  placeholder="Or paste direct image URL"
                  className="w-full px-3 py-1.5 rounded-lg text-xs border border-stone-200 bg-stone-50"
                  id="input-avatar-url"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Creator Name & Handle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Creator Display Name
            </label>
            <input
              type="text"
              required
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="e.g. Collins Monye"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-stone-300 bg-stone-50 focus:bg-white focus:outline-hidden"
              id="input-creator-name"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Social Handle
            </label>
            <input
              type="text"
              value={creatorHandle}
              onChange={(e) => setCreatorHandle(e.target.value)}
              placeholder="e.g. @collinstok"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-stone-300 bg-stone-50 focus:bg-white focus:outline-hidden"
              id="input-creator-handle"
            />
          </div>
        </div>

        {/* Short Biography */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Short Biography
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Introduce yourself and describe the types of products you recommend on TikTok..."
            className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-stone-300 bg-stone-50 focus:bg-white focus:outline-hidden"
            id="input-creator-bio"
          />
        </div>

        {/* Social Media Links */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Social Media Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* TikTok */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                TikTok Profile URL
              </label>
              <input
                type="url"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                placeholder="https://www.tiktok.com/@username"
                className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                id="input-setting-tiktok"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/username"
                className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                id="input-setting-instagram"
              />
            </div>

            {/* YouTube */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/@username"
                className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                id="input-setting-youtube"
              />
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/username"
                className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                id="input-setting-facebook"
              />
            </div>
          </div>
        </div>

        {/* Amazon Affiliate Disclosure Section */}
        <div className="pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center justify-between">
            <span>Amazon Affiliate Disclosure Statement</span>
            <span className="text-[11px] text-amber-800 font-medium">Compliance Required</span>
          </label>
          <textarea
            rows={3}
            required
            value={amazonDisclosureText}
            onChange={(e) => setAmazonDisclosureText(e.target.value)}
            placeholder="Some links on this website may be Amazon affiliate links. We may earn a commission if you make a purchase through these links, at no additional cost to you."
            className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-stone-300 bg-stone-50 focus:bg-white focus:outline-hidden"
            id="input-setting-disclosure"
          />
          <p className="mt-1 text-[11px] text-stone-400">
            This statement appears at the bottom of the public landing page to comply with Amazon Associates Operating Agreement rules.
          </p>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving || isUploadingAvatar}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-sm transition-all shadow-xs disabled:opacity-50"
            id="btn-save-settings"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
