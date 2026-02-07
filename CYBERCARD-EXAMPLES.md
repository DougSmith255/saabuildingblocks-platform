# CyberCard Redesign Examples

10 variations that blend GenericCard simplicity with subtle flare. All maintain the dark gradient background but add unique accent elements.

---

## Example 1: Subtle Corner Accents
```tsx
<div
  className="relative rounded-2xl p-6 overflow-hidden"
  style={{
    background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
  }}
>
  {/* Corner accent - top left */}
  <div className="absolute top-0 left-0 w-12 h-12">
    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400/50 to-transparent" />
    <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-cyan-400/50 to-transparent" />
  </div>
  {/* Corner accent - bottom right */}
  <div className="absolute bottom-0 right-0 w-12 h-12">
    <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-cyan-400/50 to-transparent" />
    <div className="absolute bottom-0 right-0 h-full w-[2px] bg-gradient-to-t from-cyan-400/50 to-transparent" />
  </div>
  {children}
</div>
```

---

## Example 2: Frosted Glass Inner Panel
```tsx
<div
  className="relative rounded-2xl p-6 overflow-hidden"
  style={{
    background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
    border: '1px solid rgba(255,255,255,0.08)',
  }}
>
  {/* Frosted glass inner panel */}
  <div
    className="absolute inset-3 rounded-xl pointer-events-none"
    style={{
      background: 'rgba(255,255,255,0.02)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.04)',
    }}
  />
  <div className="relative z-10">{children}</div>
</div>
```

---

## Example 3: Glowing Border on Hover
```tsx
<div
  className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-500"
  style={{
    background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
    border: '1px solid rgba(255,255,255,0.08)',
  }}
>
  {/* Animated border glow on hover */}
  <div
    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
    style={{
      background: 'transparent',
      boxShadow: 'inset 0 0 0 1px rgba(0,191,255,0.3), 0 0 20px rgba(0,191,255,0.1)',
    }}
  />
  {children}
</div>
```

---

## Example 4: Diagonal Stripe Accent
```tsx
<div
  className="relative rounded-2xl p-6 overflow-hidden"
  style={{
    background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
    border: '1px solid rgba(255,255,255,0.08)',
  }}
>
  {/* Diagonal stripe in corner */}
  <div
    className="absolute -top-10 -right-10 w-32 h-32 pointer-events-none"
    style={{
      background: 'linear-gradient(135deg, transparent 45%, rgba(0,191,255,0.08) 45%, rgba(0,191,255,0.08) 55%, transparent 55%)',
    }}
  />
  {children}
</div>
```

---

## Example 5: Top Highlight Bar
```tsx
<div
  className="relative rounded-2xl p-6 overflow-hidden"
  style={{
    background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
    border: '1px solid rgba(255,255,255,0.08)',
  }}
>
  {/* Glowing top bar */}
  <div
    className="absolute top-0 left-6 right-6 h-[2px]"
    style={{
      background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.5), transparent)',
      boxShadow: '0 0 10px rgba(255,215,0,0.3)',
    }}
  />
  {children}
</div>
```

---

## Example 6: Subtle Grid Pattern
```tsx
<div
  className="relative rounded-2xl p-6 overflow-hidden"
  style={{
    background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
    border: '1px solid rgba(255,255,255,0.08)',
  }}
>
  {/* Grid pattern overlay */}
  <div
    className="absolute inset-0 pointer-events-none opacity-[0.03]"
    style={{
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
      `,
      backgroundSize: '24px 24px',
    }}
  />
  {children}
</div>
```

---

## Example 7: Radial Glow Background
```tsx
<div
  className="relative rounded-2xl p-6 overflow-hidden"
  style={{
    background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
    border: '1px solid rgba(255,255,255,0.08)',
  }}
>
  {/* Radial glow at center */}
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,191,255,0.06) 0%, transparent 70%)',
    }}
  />
  {children}
</div>
```

---

## Example 8: Double Border Effect
```tsx
<div
  className="relative rounded-2xl p-6"
  style={{
    background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
    border: '1px solid rgba(255,255,255,0.08)',
  }}
>
  {/* Inner border */}
  <div
    className="absolute inset-2 rounded-xl pointer-events-none"
    style={{
      border: '1px solid rgba(255,255,255,0.03)',
    }}
  />
  {children}
</div>
```

---

## Example 9: Shimmer Line Animation
```tsx
<div
  className="relative rounded-2xl p-6 overflow-hidden"
  style={{
    background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
    border: '1px solid rgba(255,255,255,0.08)',
  }}
>
  {/* Shimmer line that moves across top */}
  <div
    className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden pointer-events-none"
  >
    <div
      className="w-1/3 h-full"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        animation: 'shimmer 3s ease-in-out infinite',
      }}
    />
  </div>
  {children}
</div>

// Add to styles:
// @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }
```

---

## Example 10: Gradient Border (Pseudo-element)
```tsx
<div className="relative rounded-2xl p-[1px] overflow-hidden">
  {/* Gradient border wrapper */}
  <div
    className="absolute inset-0 rounded-2xl"
    style={{
      background: 'linear-gradient(135deg, rgba(0,191,255,0.3), rgba(160,80,255,0.2), rgba(255,215,0,0.2))',
    }}
  />
  {/* Inner content */}
  <div
    className="relative rounded-2xl p-6"
    style={{
      background: 'linear-gradient(180deg, rgba(20,25,35,0.98), rgba(10,15,25,0.99))',
    }}
  >
    {children}
  </div>
</div>
```

---

## Recommended Combination

For a balanced "GenericCard with flare" approach, combine:
- **Example 2** (Frosted glass inner) for depth
- **Example 5** (Top highlight bar) for accent
- **Example 3** (Hover glow) for interactivity

This gives visual interest without overwhelming the content.
