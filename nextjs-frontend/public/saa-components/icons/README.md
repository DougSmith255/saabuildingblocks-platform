# SAA Icon Library

## Usage
This directory contains all reusable SVG icons for the SmartAgentAlliance design system.

## Current Icons Available

### Business & Success
- `bi--rocket-takeoff` - Rocket (growth, launch, innovation)
- `heroicons--trophy-16-solid` - Trophy (achievement, success)
- `heroicons--bolt-16-solid` - Lightning bolt (speed, power, energy)

### People & Teams
- `fluent--people-team-16-filled` - Team (collaboration, community)

### Communication & Social
- `footer--email` - Email (contact, communication, mail)
- `footer--webinar` - Webinar (meeting, video conference, presentation)
- `footer--youtube` - YouTube (video, social media, channel)
- `footer--linkedin` - LinkedIn (professional network, social media, business)
- `footer--calendar` - Calendar (schedule, booking, appointment)
- `footer--rocket` - Rocket (launch, growth, success - footer version)

## How to Use Icons

### In HTML:
```html
<div class="bi--rocket-takeoff" role="img" aria-label="Rocket"></div>
```

### In CSS:
All icons are 32x32px by default and use currentColor, so they inherit text color.

### Color Customization:
```css
.bi--rocket-takeoff {
    color: #FFD700; /* Changes icon color */
    width: 48px;    /* Resize if needed */
    height: 48px;
}
```

## Adding New Icons

1. Add SVG definition to `saa-icon-library.css`
2. Follow naming pattern: `provider--icon-name`
3. Use consistent 32x32px default size
4. Use currentColor for easy theming
5. Update this README with new icons

## Icon Categories to Expand

- **Business**: charts, money, growth, analytics
- **Communication**: phone, email, chat, social
- **Features**: tools, settings, security, support
- **Actions**: download, upload, share, save
- **Navigation**: arrows, home, menu, search
- **Real Estate**: house, key, location, contract