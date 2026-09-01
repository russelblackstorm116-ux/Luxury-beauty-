import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Tag,
  DollarSign,
  Image as ImageIcon,
  Loader2,
  ExternalLink,
  Layers
} from 'lucide-react';
import { Product } from '../../types';
import { validateAmazonUrl } from '../../utils/amazonValidator';
import { uploadImage, validateImageFile } from '../../services/storageService';

interface ProductFormProps {
  initialProduct?: Product | null;
  onSave: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'clicks'>) => Promise<void>;
  onCancel: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const COMMON_CATEGORIES = [
  'Tech & Gadgets',
  'Home & Kitchen',
  'Beauty & Skincare',
  'Fashion & Style',
  'Fitness & Wellness',
  'Content Creation Gear',
  'Desk Setup & Office',
  'Snacks & Drinks',
  'Books & Learning'
];

export const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  onSave,
  onCancel,
  onShowToast,
}) => {
  const [name, setName] = useState(initialProduct?.name || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [amazonUrl, setAmazonUrl] = useState(initialProduct?.amazonUrl || '');
  const [price, setPrice] = useState<string>(
    initialProduct?.price !== undefined ? String(initialProduct.price) : ''
  );
  const [category, setCategory] = useState(initialProduct?.category || '');
  const [imageUrl, setImageUrl] = useState(initialProduct?.imageUrl || '');
  const [displayOrder, setDisplayOrder] = useState<number>(
    initialProduct?.displayOrder !== undefined ? initialProduct.displayOrder : 0
  );
  const [published, setPublished] = useState<boolean>(
    initialProduct ? initialProduct.published : true
  );

  // Validation States
  const [urlTouched, setUrlTouched] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  // Real-time Amazon URL validation
  const urlValidation = validateAmazonUrl(amazonUrl);
  const isUrlValid = urlValidation.isValid;

  // Form validity check
  const isFormValid =
    name.trim().length > 0 &&
    amazonUrl.trim().length > 0 &&
    isUrlValid &&
    !isUploadingImage;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadError(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setImageUploadError(validation.error || 'Invalid image file.');
      onShowToast(validation.error || 'Invalid image file.', 'error');
      return;
    }

    setIsUploadingImage(true);
    try {
      const result = await uploadImage(file, 'products');
      setImageUrl(result.url);
      onShowToast('Product image uploaded successfully!', 'success');
    } catch (err: any) {
      console.error('Image upload failure:', err);
      setImageUploadError(err.message || 'Image upload failed. Please try again.');
      onShowToast('Image upload failed', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrlTouched(true);

    if (!name.trim()) {
      onShowToast('Please enter a product name', 'error');
      return;
    }

    if (!isUrlValid) {
      onShowToast('Please enter a valid Amazon URL.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        amazonUrl: urlValidation.cleanUrl || amazonUrl.trim(),
        imageUrl: imageUrl.trim(),
        price: price.trim() || undefined,
        category: category.trim() || undefined,
        displayOrder: Number(displayOrder) || 0,
        published: Boolean(published),
      });
    } catch (err: any) {
      console.error('Save product error:', err);
      onShowToast(err.message || 'Failed to save product.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 max-w-3xl mx-auto" id="product-form-card">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
        <div>
          <h2 className="text-xl font-bold text-stone-900">
            {initialProduct ? 'Edit Amazon Product' : 'Add New Amazon Product'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Add or update product details for your TikTok bio link showcase.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 transition-colors"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amazon URL Field with Real-Time Validation */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Amazon Product URL <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <LinkIcon className="w-4 h-4" />
            </div>
            <input
              type="url"
              required
              value={amazonUrl}
              onChange={(e) => {
                setAmazonUrl(e.target.value);
                setUrlTouched(true);
              }}
              onBlur={() => setUrlTouched(true)}
              placeholder="https://www.amazon.com/dp/B08N5WRWNW or https://amzn.to/..."
              className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm border bg-stone-50/50 focus:bg-white focus:outline-hidden transition-all ${
                urlTouched && amazonUrl.trim().length > 0
                  ? isUrlValid
                    ? 'border-emerald-400 focus:ring-2 focus:ring-emerald-200'
                    : 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                  : 'border-stone-300 focus:border-stone-500 focus:ring-2 focus:ring-stone-200'
              }`}
              id="input-amazon-url"
            />
            {amazonUrl.trim().length > 0 && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                {isUrlValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                )}
              </div>
            )}
          </div>

          {/* Validation Feedback Message */}
          {urlTouched && amazonUrl.trim().length > 0 && !isUrlValid && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1" id="amazon-url-error-msg">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{urlValidation.error || 'Please enter a valid Amazon URL.'}</span>
            </p>
          )}

          {isUrlValid && amazonUrl.trim().length > 0 && (
            <div className="mt-1.5 flex items-center justify-between text-xs text-emerald-700 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Valid Amazon Domain ({urlValidation.domain})
              </span>
              <a
                href={amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-900 underline"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
          <p className="mt-1 text-[11px] text-stone-400">
            Accepts official Amazon domains (amazon.com, amazon.co.uk, amazon.de, amzn.to, etc.) using HTTPS.
          </p>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Product Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Wireless Noise-Cancelling Headphones"
            className="w-full px-4 py-3 rounded-xl text-sm border border-stone-300 bg-stone-50/50 focus:bg-white focus:border-stone-500 focus:outline-hidden focus:ring-2 focus:ring-stone-200 transition-all"
            id="input-product-name"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Product Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Why you recommend this product, features highlighted in your TikTok video, or key benefits..."
            className="w-full px-4 py-3 rounded-xl text-sm border border-stone-300 bg-stone-50/50 focus:bg-white focus:border-stone-500 focus:outline-hidden focus:ring-2 focus:ring-stone-200 transition-all resize-y"
            id="input-product-description"
          />
        </div>

        {/* Product Image Upload Section */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Product Image
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
            {/* Image Preview */}
            <div className="sm:col-span-1 aspect-square rounded-2xl bg-stone-100 border border-stone-200 overflow-hidden relative flex items-center justify-center">
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-stone-900/80 text-white hover:bg-stone-900 shadow-sm"
                    title="Remove Image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-stone-400 p-4 text-center">
                  <ImageIcon className="w-8 h-8 stroke-1 mb-1 text-stone-300" />
                  <span className="text-xs">No image chosen</span>
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="sm:col-span-2 space-y-3">
              <div>
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-300 hover:border-stone-400 rounded-xl cursor-pointer bg-stone-50/50 hover:bg-stone-50 transition-colors">
                  <div className="flex items-center gap-2 text-stone-600 text-xs font-semibold">
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                        <span>Uploading image...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-amber-600" />
                        <span>Upload Image from Device (Max 5MB)</span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageFileChange}
                    disabled={isUploadingImage}
                    className="hidden"
                    id="input-product-file"
                  />
                </label>
              </div>

              {imageUploadError && (
                <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{imageUploadError}</span>
                </p>
              )}

              {/* Or Direct Image URL */}
              <div>
                <span className="text-[11px] text-stone-400 block mb-1">Or paste image URL directly:</span>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-stone-300 bg-stone-50/50 focus:bg-white focus:outline-hidden"
                  id="input-direct-image-url"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Price and Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Price (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="29.99 or $29.99"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-stone-300 bg-stone-50/50 focus:bg-white focus:border-stone-500 focus:outline-hidden"
                id="input-product-price"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Category (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Home & Kitchen"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-stone-300 bg-stone-50/50 focus:bg-white focus:border-stone-500 focus:outline-hidden"
                id="input-product-category"
              />
            </div>

            {/* Quick Category Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_CATEGORIES.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                    category === cat
                      ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                      : 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Display Order & Published Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
          {/* Display Order */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Display Order
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Layers className="w-4 h-4" />
              </div>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border border-stone-300 bg-white"
                id="input-product-display-order"
              />
            </div>
            <span className="text-[11px] text-stone-400 mt-1 block">
              Lower numbers appear first on the storefront.
            </span>
          </div>

          {/* Published Toggle */}
          <div className="flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Visibility Status
            </span>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
                id="checkbox-product-published"
              />
              <span className="text-sm font-semibold text-stone-800">
                {published ? 'Published (Visible on Bio Link)' : 'Draft (Hidden from Public)'}
              </span>
            </label>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-700 font-semibold text-sm hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-bold text-sm transition-all shadow-xs"
            id="btn-save-product"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{initialProduct ? 'Update Product' : 'Save Product'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
