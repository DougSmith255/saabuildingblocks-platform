/**
 * Default settings for new agent pages
 *
 * Applied when a user's agent page is created (via invitation accept,
 * GHL webhook, or manual creation). These provide a populated starting
 * point so agents see a functional link page immediately.
 */

export const AGENT_PAGE_DEFAULTS = {
  phone: '(555) 000-0000',
  show_phone: false,
  phone_text_only: false,
  activated: false,

  // Social links — placeholder values agents will customize
  facebook_url: 'Example',
  instagram_url: 'Example',
  twitter_url: null,
  youtube_url: 'Example',
  tiktok_url: null,
  linkedin_url: 'Example',

  // Custom social links (max 2)
  custom_social_links: [
    { id: 'custom-social-1', url: 'Example', icon: 'Camera' },
  ],

  // Custom link buttons
  custom_links: [],

  // Link page appearance settings
  links_settings: {
    bio: 'This is an example premium SAA custom link page',
    font: 'synonym',
    iconStyle: 'light',
    accentColor: '#ffd900',
    backgroundColor: '#747474',
    showCallButton: true,
    showTextButton: true,
    showColorPhoto: false,
  },
} as const;
