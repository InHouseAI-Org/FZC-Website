# Image Fallback System - Quick Reference Guide

## 🚀 Quick Start

### For Product Cards
```tsx
import { ProductImageWithFallback } from '@/app/components/ProductImageWithFallback';

<ProductImageWithFallback
  src={product.image}
  alt={product.name}
  productName={product.name}
  variant="card"
  className="w-full h-64 object-cover"
/>
```

### For Product Detail Gallery
```tsx
import { ProductImageGalleryWithFallback } from '@/app/components/ProductImageGalleryWithFallback';

<ProductImageGalleryWithFallback
  images={product.images || [product.image]}
  productName={product.name}
/>
```

---

## 🎨 What You Get

### Products WITH Images
- ✅ Normal image display
- ✅ Loading animation
- ✅ Error handling

### Products WITHOUT Images
- ✅ Beautiful color-coded placeholder
- ✅ Product initials (e.g., "PE5")
- ✅ Package icon
- ✅ "No Image Available" label

---

## 📦 Components Created

| Component | Purpose |
|-----------|---------|
| `ProductPlaceholder.tsx` | Generates placeholder images |
| `ProductImageWithFallback.tsx` | Single image with fallback |
| `ProductImageGalleryWithFallback.tsx` | Image gallery with fallback |

---

## 🎯 Variants

| Variant | Use Case | Icon Size |
|---------|----------|-----------|
| `card` | Product cards | 64px |
| `gallery` | Gallery thumbs | 80px |
| `detail` | Large images | 96px |

---

## 🌈 Color Schemes

Products get one of 8 color gradients:
- Blue, Purple, Green, Orange, Teal, Indigo, Rose, Cyan
- **Same product = same color** (consistent)
- Based on product name hash

---

## ✅ Features

- [x] Auto fallback for missing images
- [x] Auto fallback for broken images
- [x] Loading states
- [x] Color-coded by product
- [x] Product initials display
- [x] Auto-rotate in gallery (3s interval)
- [x] Thumbnail navigation
- [x] Mobile optimized
- [x] TypeScript support
- [x] Next.js Image optimization

---

## 🔧 Common Usage

### Product Card (Grid)
```tsx
<div className="h-64">
  <ProductImageWithFallback
    src={product.images?.[0] || product.image}
    alt={product.name}
    productName={product.name}
    variant="card"
  />
</div>
```

### Product Detail
```tsx
<ProductImageGalleryWithFallback
  images={product.images || product.gallery || [product.image]}
  productName={product.name}
/>
```

### Custom Styling
```tsx
<ProductImageWithFallback
  src={product.image}
  alt={product.name}
  productName={product.name}
  variant="card"
  className="rounded-lg shadow-lg"
  width={800}
  height={600}
/>
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Placeholder not showing | Check `productName` is provided |
| Wrong colors | Ensure consistent product name |
| Images not loading | Check path starts with `/` |
| Gallery not rotating | Need 2+ valid images |

---

## 📊 Image States Handled

✅ `null` → Placeholder
✅ `undefined` → Placeholder
✅ `""` (empty) → Placeholder
✅ `"undefined"` → Placeholder
✅ `"null"` → Placeholder
✅ 404 error → Placeholder
✅ Load error → Placeholder
✅ Valid image → Normal display

---

## 💡 Pro Tips

1. **Always provide productName** - Required for placeholder
2. **Use arrays for galleries** - Even with single image
3. **Consistent naming** - Product names should be stable
4. **Alt text** - Always provide meaningful alt text
5. **Variant selection** - Choose appropriate size variant

---

## 📝 Examples

### Example 1: No Image
```json
{
  "name": "PE 504",
  "image": null
}
```
**Result:** Blue/Purple/Green placeholder with "PE5"

### Example 2: Multiple Images
```json
{
  "name": "Ultra FE 1002",
  "images": ["/img1.png", "/img2.png", "/img3.png"]
}
```
**Result:** Auto-rotating gallery with 3 images

### Example 3: Mixed Valid/Invalid
```json
{
  "name": "HY 105",
  "images": ["/valid.png", null, "undefined", "/valid2.png"]
}
```
**Result:** Gallery with 2 valid images

---

## 🚀 Where It's Used

- ✅ Product Category Landing (`ProductCategoryLanding.tsx`)
- ✅ Product Detail Page (`ProductDetail.tsx`)
- ✅ Product Cards (all grid views)
- ✅ Product Galleries (detail pages)

---

## ⚡ Performance

- **Placeholder:** ~2KB (instant load)
- **No network requests** for placeholders
- **Zero CLS** (layout shift)
- **Optimized images** via Next.js

---

## 🎉 That's It!

Your products will always look professional, whether they have images or not!

For full documentation, see `PRODUCT_IMAGE_FALLBACK_DOCUMENTATION.md`
