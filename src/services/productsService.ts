import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Product } from '../types';
import { validateAmazonUrl } from '../utils/amazonValidator';

const PRODUCTS_COLLECTION = 'products';

/**
 * Subscribes to published products for public visitors in real-time.
 */
export function subscribePublishedProducts(
  onData: (products: Product[]) => void,
  onError: (error: Error) => void
) {
  const collectionRef = collection(db, PRODUCTS_COLLECTION);
  // Order by displayOrder ascending, then createdAt descending
  const q = query(
    collectionRef,
    where('published', '==', true)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          name: data.name || '',
          description: data.description || '',
          imageUrl: data.imageUrl || '',
          videoUrl: data.videoUrl || '',
          amazonUrl: data.amazonUrl || '',
          price: data.price,
          category: data.category || '',
          published: data.published === true,
          displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 0,
          createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
          updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : Date.now(),
          clicks: data.clicks || 0,
        });
      });

      // Sort in memory by displayOrder (ascending) then createdAt (descending)
      items.sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder;
        }
        return (b.createdAt || 0) - (a.createdAt || 0);
      });

      onData(items);
    },
    (err) => {
      console.error('Error fetching published products:', err);
      onError(err);
    }
  );
}

/**
 * Subscribes to all products (published + unpublished) for the admin dashboard in real-time.
 */
export function subscribeAllProducts(
  onData: (products: Product[]) => void,
  onError: (error: Error) => void
) {
  const collectionRef = collection(db, PRODUCTS_COLLECTION);

  return onSnapshot(
    collectionRef,
    (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          name: data.name || '',
          description: data.description || '',
          imageUrl: data.imageUrl || '',
          videoUrl: data.videoUrl || '',
          amazonUrl: data.amazonUrl || '',
          price: data.price,
          category: data.category || '',
          published: data.published === true,
          displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 0,
          createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
          updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : Date.now(),
          clicks: data.clicks || 0,
        });
      });

      // Sort by displayOrder ascending, then createdAt descending
      items.sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder;
        }
        return (b.createdAt || 0) - (a.createdAt || 0);
      });

      onData(items);
    },
    (err) => {
      console.error('Error fetching admin products:', err);
      onError(err);
    }
  );
}

/**
 * Adds a new product to Cloud Firestore after strict Amazon URL validation.
 */
export async function addProduct(
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'clicks'>
): Promise<string> {
  // Strict backend-level validation for Amazon URL
  const validation = validateAmazonUrl(productData.amazonUrl);
  if (!validation.isValid) {
    throw new Error('Please enter a valid Amazon URL.');
  }

  if (!productData.name || !productData.name.trim()) {
    throw new Error('Product name is required.');
  }

  const cleanData = {
    name: productData.name.trim(),
    description: (productData.description || '').trim(),
    imageUrl: (productData.imageUrl || '').trim(),
    videoUrl: (productData.videoUrl || '').trim(),
    amazonUrl: validation.cleanUrl || productData.amazonUrl.trim(),
    price: productData.price ? String(productData.price).trim() : '',
    category: (productData.category || '').trim(),
    published: Boolean(productData.published),
    displayOrder: Number(productData.displayOrder) || 0,
    clicks: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), cleanData);
  return docRef.id;
}

/**
 * Updates an existing product with strict URL validation.
 */
export async function updateProduct(
  id: string,
  productData: Partial<Omit<Product, 'id' | 'createdAt'>>
): Promise<void> {
  if (productData.amazonUrl !== undefined) {
    const validation = validateAmazonUrl(productData.amazonUrl);
    if (!validation.isValid) {
      throw new Error('Please enter a valid Amazon URL.');
    }
    productData.amazonUrl = validation.cleanUrl || productData.amazonUrl.trim();
  }

  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(docRef, {
    ...productData,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Deletes a product by ID.
 */
export async function deleteProduct(id: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Toggles the published state of a product.
 */
export async function toggleProductPublish(id: string, currentPublished: boolean): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(docRef, {
    published: !currentPublished,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Increments product click telemetry when a visitor clicks "View on Amazon".
 */
export async function trackProductClick(id: string): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
      clicks: increment(1)
    });
  } catch (err) {
    // Non-blocking telemetry
    console.debug('Click tracking notice:', err);
  }
}
