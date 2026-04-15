# 🎨 CSS Tokens — Quick Reference

## Colors

```css
/* Backgrounds */
--obsidian-900: #0a081e;
--obsidian-800: rgba(10, 8, 30, 0.9);
--obsidian-700: rgba(30, 20, 60, 0.95);

/* Accent */
--gold-400: #d4a017;
--gold-500: #f5c518;
--gold-gradient: linear-gradient(135deg, #f5c518, #d4a017);

/* Status */
--emerald: #2dc653;
--ruby: #e63946;

/* Text */
--text-primary: #ffffff;
--text-secondary: rgba(255,255,255,0.7);
--text-muted: rgba(255,255,255,0.5);

/* Borders */
--border-gold: rgba(212,160,23,0.3);
--border-card: rgba(255,255,255,0.08);
--border-subtle: rgba(255,255,255,0.08);

/* Glass */
--glass-bg: rgba(255,255,255,0.05);
--glass-border: rgba(255,255,255,0.08);
```

## Typography

```css
--font-display: 'system-ui', -apple-system, 'Segoe UI', sans-serif;
--font-body: inherit;
```

## Spacing (4px Grid)

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 48px;
```

## Borders & Shadows

```css
--radius-sm: 6px;
--radius-md: 12px;
--radius-lg: 20px;

--shadow-sm: 0 2px 8px rgba(0,0,0,0.1);
--shadow-md: 0 8px 32px rgba(0,0,0,0.15);
--shadow-lg: 0 16px 64px rgba(0,0,0,0.2);
--shadow-gold: 0 0 20px rgba(212,160,23,0.3);
```

## Component Classes

### Buttons
- `.btn-primary` — Gold gradient, dark text
- `.btn-secondary` — Subtle glass effect

### Cards
- `.glass-card-gold` — Gold-tinted glass
- `.glass-card` — White-tinted glass
- `.list-container` — Scrollable list

### Navigation
- `.bottom-nav` — Fixed bottom navigation
- `.nav-item` — Nav item with indicator
- `.nav-item.active` — Active nav state

### Overlays
- `.overlay` — Full-screen overlay container
- `.overlay-backdrop` — Semi-transparent background
- `.modal-sheet` — Bottom sheet modal

### Status
- `.status-dot` — Inline status indicator
- `.status-dot.online` — Green
- `.status-dot.playing` — Orange
- `.status-dot.offline` — Gray

## Usage Examples

### Use Gold for:
- Ranking positions (#1, #2, #3)
- Primary buttons
- Active navigation
- Badges & highlights
- User's own card highlight

### Use Emerald for:
- "Available" status
- Positive stats (win rate)
- Success confirmations

### Use Ruby for:
- "Offline" status
- Errors & warnings
- Negative metrics

### Use Glass Cards for:
- Stat containers
- Profile cards
- Overlay content

## Framer Motion Presets

### Overlay Animation (Bottom Sheet)
```javascript
initial={{ y: '100%' }}
animate={{ y: 0 }}
exit={{ y: '100%' }}
transition={{ type: 'spring', damping: 26, stiffness: 280 }}
```

### Card Entry
```javascript
initial={{ opacity: 0, x: -10 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.2 }}
```

### Button Tap
```javascript
whileTap={{ scale: 0.97 }}
```

### Tab Underline
```javascript
layoutId="tab-underline"
/* Uses Framer Motion layout animation */
```

## Responsive Breakpoints

```
Mobile:  < 480px (primary)
Tablet:  480px - 1024px
Desktop: > 1024px
```

## Performance Notes

- ✅ No backdrop-filter (blur removed)
- ✅ CSS Variables native overhead
- ✅ ~3.5kb total CSS
- ✅ Images: loading="lazy"
- ✅ Animations: GPU transform only

## Accessibility

- Contrast: Gold 5.2:1 ✓, White 18:1 ✓
- WCAG: AA compliant
- Focus indicators: visible on all interactive elements
- Keyboard navigation: full support
