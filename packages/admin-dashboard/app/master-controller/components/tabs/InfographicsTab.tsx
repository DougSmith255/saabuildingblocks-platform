'use client';

import { useState, useMemo } from 'react';
import { Image, ExternalLink, ChevronDown, ChevronUp, Copy, Check, Paintbrush } from 'lucide-react';

type Status = 'defined' | 'generated' | 'uploaded' | 'placed';
type LayoutType = 'numbered-list' | 'checklist' | 'comparison-table' | 'bar-chart' | 'stats-chart' | 'revenue-share' | 'brokerage-comparison';
type Category = 'content' | 'brokerage-comparison';

interface InfographicEntry {
  id: string;
  type: LayoutType;
  title: string;
  status: Status;
  category: Category;
  blogPostId: string | null;
  blogPostTitle: string | null;
  blogPostUri: string | null;
  cloudflareId: string | null;
}

// --- CONTENT INFOGRAPHICS (from /tmp/infographic-generator/) --- All 61 placed as of 2026-03-09
const CONTENT_INFOGRAPHICS: InfographicEntry[] = [
  // NUMBERED LIST (25)
  { id: 'infographic-stock-award-types', type: 'numbered-list', title: '7 eXp Stock Award Types', status: 'placed', category: 'content', blogPostId: '3704', blogPostTitle: 'How eXp Realty Stock Awards for Agents Are Structured', blogPostUri: 'about-exp-realty/stock-awards', cloudflareId: 'saa-infographic-stock-award-types' },
  { id: 'infographic-agent-side-hustles', type: 'numbered-list', title: '11 Agent Side Hustles', status: 'placed', category: 'content', blogPostId: '3697', blogPostTitle: 'Real Estate Agent Side Hustles: Best in 2025', blogPostUri: 'blog/agent-career-info/side-hustles', cloudflareId: 'saa-infographic-agent-side-hustles' },
  { id: 'infographic-free-leads', type: 'numbered-list', title: '15 Free Lead Gen Strategies', status: 'placed', category: 'content', blogPostId: '3864', blogPostTitle: 'Free Leads for Realtors in 2025: 15 Strategies for Success', blogPostUri: 'blog/marketing-mastery/free-leads', cloudflareId: 'saa-infographic-free-leads' },
  { id: 'infographic-google-ads-steps', type: 'numbered-list', title: '10-Step Google Ads Guide', status: 'placed', category: 'content', blogPostId: '3702', blogPostTitle: 'Win Big with Google Ads for Real Estate Agents: 2025 Guide', blogPostUri: 'blog/marketing-mastery/google-ads', cloudflareId: 'saa-infographic-google-ads-steps' },
  { id: 'infographic-homebuyer-questions', type: 'numbered-list', title: '10 Questions Homebuyers Ask', status: 'placed', category: 'content', blogPostId: '3764', blogPostTitle: '10 Realtor Questions to Expect from Homebuyers', blogPostUri: 'blog/winning-clients/homebuyer-questions', cloudflareId: 'saa-infographic-homebuyer-questions' },
  { id: 'infographic-license-now-what', type: 'numbered-list', title: '7 Steps After Getting Your License', status: 'placed', category: 'content', blogPostId: '3703', blogPostTitle: 'I Got My Real Estate License, Now What? 7 Steps to Success', blogPostUri: 'blog/agent-career-info/new-agent-steps', cloudflareId: 'saa-infographic-license-now-what' },
  { id: 'infographic-marketing-mistakes', type: 'numbered-list', title: '10 Marketing Mistakes to Fix', status: 'placed', category: 'content', blogPostId: '3824', blogPostTitle: '10 Real Estate Agent Marketing Mistakes You Need to Fix', blogPostUri: 'blog/marketing-mastery/marketing-mistakes', cloudflareId: 'saa-infographic-marketing-mistakes' },
  { id: 'infographic-recession-proof', type: 'numbered-list', title: '16 Steps to Recession-Proof', status: 'placed', category: 'content', blogPostId: '3861', blogPostTitle: 'Recession-Proof Job as a Realtor in Just 16 Steps', blogPostUri: 'blog/agent-career-info/recession', cloudflareId: 'saa-infographic-recession-proof' },
  { id: 'infographic-buyer-agent-problems', type: 'numbered-list', title: '9 Buyer Agent Problems from NAR', status: 'placed', category: 'content', blogPostId: '3766', blogPostTitle: '9 Buyer Agent Problems from New NAR Changes', blogPostUri: 'blog/industry-trends/buyer-agent-problems', cloudflareId: 'saa-infographic-buyer-agent-problems' },
  { id: 'infographic-chatgpt-uses', type: 'numbered-list', title: '11 Ways Realtors Use ChatGPT', status: 'placed', category: 'content', blogPostId: '3865', blogPostTitle: 'Unlock ChatGPT for Realtors: 11 Key Uses in 2025', blogPostUri: 'blog/agent-career-info/chatgpt-uses', cloudflareId: 'saa-infographic-chatgpt-uses' },
  { id: 'infographic-nar-court-findings', type: 'numbered-list', title: '10 Key NAR Court Findings', status: 'placed', category: 'content', blogPostId: '3847', blogPostTitle: 'Alarming Court Cases on Buyer Agent Commissions: 10 Key Findings', blogPostUri: 'blog/industry-trends/nar-court-cases', cloudflareId: 'saa-infographic-nar-court-findings' },
  { id: 'infographic-get-listings', type: 'numbered-list', title: '15 Ways to Get Listings', status: 'placed', category: 'content', blogPostId: '3909', blogPostTitle: '15 Proven Ways to Get Listings as a Real Estate Agent (& Keep Them Coming)', blogPostUri: 'blog/winning-clients/get-listings', cloudflareId: 'saa-infographic-get-listings' },
  { id: 'infographic-negotiation-cheatsheet', type: 'numbered-list', title: 'Negotiation Cheat Sheet', status: 'placed', category: 'content', blogPostId: '3906', blogPostTitle: 'Mastering Real Estate Negotiations: Unlock Your Power', blogPostUri: 'blog/winning-clients/negotiate', cloudflareId: 'saa-infographic-negotiation-cheatsheet' },
  { id: 'infographic-brokerage-transition', type: 'numbered-list', title: 'Brokerage Transition Steps', status: 'placed', category: 'content', blogPostId: '3696', blogPostTitle: 'How to leave a Real Estate Brokerage for Greener Pastures', blogPostUri: 'blog/agent-career-info/change-brokerage', cloudflareId: 'saa-infographic-brokerage-transition' },
  { id: 'infographic-content-repurposing', type: 'numbered-list', title: 'Content Repurposing Wheel', status: 'placed', category: 'content', blogPostId: '3907', blogPostTitle: 'Agents, Repurpose Content for BIG Results', blogPostUri: 'blog/marketing-mastery/repurpose-content', cloudflareId: 'saa-infographic-content-repurposing' },
  { id: 'infographic-exp-commission-pipeline', type: 'numbered-list', title: 'eXp Commission Pipeline', status: 'placed', category: 'content', blogPostId: '3715', blogPostTitle: 'How the eXp Commission Split for Agents Is Structured', blogPostUri: 'about-exp-realty/commission', cloudflareId: 'saa-infographic-exp-commission-pipeline' },
  { id: 'infographic-exp-fee-waterfall', type: 'numbered-list', title: 'eXp Fee Waterfall', status: 'placed', category: 'content', blogPostId: '3714', blogPostTitle: 'eXp Realty Fees Explained for Real Estate Agents', blogPostUri: 'about-exp-realty/fees', cloudflareId: 'saa-infographic-exp-fee-waterfall' },
  { id: 'infographic-landing-page-framework', type: 'numbered-list', title: 'Lead Gen Landing Page', status: 'placed', category: 'content', blogPostId: '3675', blogPostTitle: 'Lead Generation for Real Estate Agents: Ultimate Shortcut to More Clients', blogPostUri: 'exp-realty-sponsor/landing-pages', cloudflareId: 'saa-infographic-landing-page-framework' },
  { id: 'infographic-mentorship-pathways', type: 'numbered-list', title: 'eXp Mentorship Pathways', status: 'placed', category: 'content', blogPostId: '3670', blogPostTitle: 'What Is the eXp Mentor Program?', blogPostUri: 'about-exp-realty/mentor-program', cloudflareId: 'saa-infographic-mentorship-pathways' },
  { id: 'infographic-nar-changes-timeline', type: 'numbered-list', title: 'NAR Settlement Changes', status: 'placed', category: 'content', blogPostId: '3765', blogPostTitle: 'The Impact of NAR Changes on Real Estate Agent Fees in 2025', blogPostUri: 'blog/industry-trends/nar-agent-fees', cloudflareId: 'saa-infographic-nar-changes-timeline' },
  { id: 'infographic-onboarding-roadmap', type: 'numbered-list', title: '6-Step Onboarding Roadmap', status: 'placed', category: 'content', blogPostId: '3912', blogPostTitle: 'How the eXp Onboarding Process Is Structured', blogPostUri: 'about-exp-realty/onboarding', cloudflareId: 'saa-infographic-onboarding-roadmap' },
  { id: 'infographic-revenue-share-tiers', type: 'numbered-list', title: 'Revenue Share 2.0 Tiers', status: 'placed', category: 'content', blogPostId: '3876', blogPostTitle: 'How Revenue Share 2.0 Changes the Structure', blogPostUri: 'exp-realty-sponsor/revenue-share-2-0', cloudflareId: 'saa-infographic-revenue-share-tiers' },
  { id: 'infographic-sponsor-types', type: 'numbered-list', title: '3 Types of eXp Sponsors', status: 'placed', category: 'content', blogPostId: '3887', blogPostTitle: 'How the eXp Realty Sponsor Program Is Structured', blogPostUri: 'exp-realty-sponsor/program-basics', cloudflareId: 'saa-infographic-sponsor-types' },
  { id: 'infographic-wealth-pillars', type: 'numbered-list', title: '3 Wealth-Building Pillars', status: 'placed', category: 'content', blogPostId: '3832', blogPostTitle: 'How Wealth Building for Realtors Works at eXp Realty', blogPostUri: 'exp-realty-sponsor/wealth-building-realtors', cloudflareId: 'saa-infographic-wealth-pillars' },
  { id: 'infographic-blog-ideas', type: 'numbered-list', title: '22 Blog Ideas for Agents', status: 'placed', category: 'content', blogPostId: '3692', blogPostTitle: '22 Awesome Real Estate Blog Ideas: Get More Clients', blogPostUri: 'blog/marketing-mastery/blog-ideas', cloudflareId: 'saa-infographic-blog-ideas' },
  // CHECKLIST (11)
  { id: 'infographic-headshot-guide', type: 'checklist', title: "Agent Headshot Do's & Don'ts", status: 'placed', category: 'content', blogPostId: '3707', blogPostTitle: 'The Essential Guide to Real Estate Agent Headshots: Tips & Examples', blogPostUri: 'blog/marketing-mastery/headshots', cloudflareId: 'saa-infographic-headshot-guide' },
  { id: 'infographic-domain-dos-donts', type: 'checklist', title: "Domain Name Do's & Don'ts", status: 'placed', category: 'content', blogPostId: '3913', blogPostTitle: 'Realtor Domain Strategy: Standout Domain Names for Real Estate Agents', blogPostUri: 'blog/marketing-mastery/domains', cloudflareId: 'saa-infographic-domain-dos-donts' },
  { id: 'infographic-listing-checklist', type: 'checklist', title: 'Listing Appointment Checklist', status: 'placed', category: 'content', blogPostId: '3644', blogPostTitle: 'Your Ultimate Listing Appointment Checklist: Win More Listings', blogPostUri: 'blog/winning-clients/listing-checklist', cloudflareId: 'saa-infographic-listing-checklist' },
  { id: 'infographic-open-house-checklist', type: 'checklist', title: 'Open House Checklist', status: 'placed', category: 'content', blogPostId: '3688', blogPostTitle: 'Open House Checklist for Agents: The Secret to 2x More Offers', blogPostUri: 'blog/marketing-mastery/open-house-checklist', cloudflareId: 'saa-infographic-open-house-checklist' },
  { id: 'infographic-final-walkthrough', type: 'checklist', title: 'Final Walkthrough Checklist', status: 'placed', category: 'content', blogPostId: '3655', blogPostTitle: 'Final Walk Through Before Closing: What Agents Need to Know', blogPostUri: 'blog/winning-clients/walk-through', cloudflareId: 'saa-infographic-final-walkthrough' },
  { id: 'infographic-sponsor-provides', type: 'checklist', title: "What Sponsors Provide vs Don't", status: 'placed', category: 'content', blogPostId: '8548', blogPostTitle: 'What Do eXp Sponsors Provide and Not Provide?', blogPostUri: 'exp-realty-sponsor/what-they-provide', cloudflareId: 'saa-infographic-sponsor-provides' },
  { id: 'infographic-sponsor-questions', type: 'checklist', title: 'Sponsor Interview Questions', status: 'placed', category: 'content', blogPostId: '8539', blogPostTitle: 'Questions to Ask an eXp Sponsor Before You Choose', blogPostUri: 'exp-realty-sponsor/questions-to-ask', cloudflareId: 'saa-infographic-sponsor-questions' },
  { id: 'infographic-sponsor-red-flags', type: 'checklist', title: 'eXp Sponsor Red Flags', status: 'placed', category: 'content', blogPostId: '8526', blogPostTitle: 'What Are Red Flags When Choosing an eXp Sponsor?', blogPostUri: 'exp-realty-sponsor/red-flags', cloudflareId: 'saa-infographic-sponsor-red-flags' },
  { id: 'infographic-interview-questions', type: 'checklist', title: '17 Brokerage Interview Questions', status: 'placed', category: 'content', blogPostId: '3810', blogPostTitle: 'Top 17 Brokerage Interview Questions to Ask Before Choosing', blogPostUri: 'blog/agent-career-info/interview-questions', cloudflareId: 'saa-infographic-interview-questions' },
  { id: 'infographic-client-gifts', type: 'checklist', title: 'Client Gift Guide for Agents', status: 'placed', category: 'content', blogPostId: '3687', blogPostTitle: '15+ Great Ideas for Gifts to Wow Your Clients!', blogPostUri: 'blog/winning-clients/client-gifts', cloudflareId: 'saa-infographic-client-gifts' },
  { id: 'infographic-agent-books', type: 'checklist', title: '15 Must-Read Agent Books', status: 'placed', category: 'content', blogPostId: '3921', blogPostTitle: 'Best Real Estate Agent Books -15 Must-Reads for Serious Agents', blogPostUri: 'blog/fun-for-agents/books', cloudflareId: 'saa-infographic-agent-books' },
  // COMPARISON TABLE (17)
  { id: 'infographic-brokerage-commissions', type: 'comparison-table', title: 'Brokerage Commission Splits', status: 'placed', category: 'content', blogPostId: '3683', blogPostTitle: 'Best Real Estate Companies to Work For By Commission Splits in 2025', blogPostUri: 'blog/brokerage-comparison/commissions', cloudflareId: 'saa-infographic-brokerage-commissions' },
  { id: 'infographic-brokerage-fees', type: 'comparison-table', title: 'Brokerage Fees Compared', status: 'placed', category: 'content', blogPostId: '3669', blogPostTitle: 'What the eXp Realty $85 Agent Brokerage Fee Covers', blogPostUri: 'about-exp-realty/brokerage-fee', cloudflareId: 'saa-infographic-brokerage-fees' },
  { id: 'infographic-hidden-brokerage-fees', type: 'comparison-table', title: 'Hidden Brokerage Fees', status: 'placed', category: 'content', blogPostId: '3836', blogPostTitle: 'Hidden Real Estate Brokerage Agents Fees Explained', blogPostUri: 'exp-realty-sponsor/hidden-fees', cloudflareId: 'saa-infographic-hidden-brokerage-fees' },
  { id: 'infographic-hidden-costs-top-producers', type: 'comparison-table', title: 'Hidden Costs for Top Producers', status: 'placed', category: 'content', blogPostId: '3834', blogPostTitle: 'Hidden Brokerage Costs for Top Producing Realtors', blogPostUri: 'exp-realty-sponsor/hidden-costs', cloudflareId: 'saa-infographic-hidden-costs-top-producers' },
  { id: 'infographic-exp-vs-traditional', type: 'comparison-table', title: 'eXp vs Traditional Brokerages', status: 'placed', category: 'content', blogPostId: '3901', blogPostTitle: 'Comparing eXp Realty and Traditional Brokerages for Agents', blogPostUri: 'about-exp-realty/vs-traditional', cloudflareId: 'saa-infographic-exp-vs-traditional' },
  { id: 'infographic-revenue-share-showdown', type: 'comparison-table', title: 'Revenue Share Showdown', status: 'placed', category: 'content', blogPostId: '3877', blogPostTitle: 'How eXp Realty Revenue Share Is Structured for Agents', blogPostUri: 'exp-realty-sponsor/how-revenue-share-works', cloudflareId: 'saa-infographic-revenue-share-showdown' },
  { id: 'infographic-split-vs-net-income', type: 'comparison-table', title: 'Split vs Net Income', status: 'placed', category: 'content', blogPostId: '3835', blogPostTitle: 'Commission Split Versus Net Income for Realtors', blogPostUri: 'exp-realty-sponsor/commission-split-vs-net-income', cloudflareId: 'saa-infographic-split-vs-net-income' },
  { id: 'infographic-sponsor-team-vs-production', type: 'comparison-table', title: 'Sponsor Team vs Production Team', status: 'placed', category: 'content', blogPostId: '3882', blogPostTitle: 'Difference between an eXp Sponsor and a Real Estate Team', blogPostUri: 'exp-realty-sponsor/sponsor-vs-team', cloudflareId: 'saa-infographic-sponsor-team-vs-production' },
  { id: 'infographic-sponsor-vs-cosponsor', type: 'comparison-table', title: 'Sponsor vs Co-Sponsor', status: 'placed', category: 'content', blogPostId: '3888', blogPostTitle: 'What Is an eXp Sponsor and Co-Sponsor?', blogPostUri: 'exp-realty-sponsor/sponsor-cosponsor', cloudflareId: 'saa-infographic-sponsor-vs-cosponsor' },
  { id: 'infographic-team-commission-math', type: 'comparison-table', title: 'Team Commission Math', status: 'placed', category: 'content', blogPostId: '8050', blogPostTitle: 'How eXp Realty Teams for Agents Are Structured', blogPostUri: 'about-exp-realty/teams', cloudflareId: 'saa-infographic-team-commission-math' },
  { id: 'infographic-team-types-matrix', type: 'comparison-table', title: 'eXp Team Types Matrix', status: 'placed', category: 'content', blogPostId: '3651', blogPostTitle: 'Your Ultimate Guide to eXp Realty Teams: Structure, Splits, and Team Perks', blogPostUri: 'about-exp-realty/exp-realty-teams', cloudflareId: 'saa-infographic-team-types-matrix' },
  { id: 'infographic-top-brokerages', type: 'comparison-table', title: 'Top Brokerages by Profitability', status: 'placed', category: 'content', blogPostId: '3816', blogPostTitle: "Top Real Estate Companies: Who's Really Got Your Back?", blogPostUri: 'blog/brokerage-comparison/profits', cloudflareId: 'saa-infographic-top-brokerages' },
  { id: 'infographic-re-schools-scorecard', type: 'comparison-table', title: 'Top Real Estate Schools', status: 'placed', category: 'content', blogPostId: '3814', blogPostTitle: 'The Top 5 Real Estate Schools Online in 2025', blogPostUri: 'blog/real-estate-schools/schools', cloudflareId: 'saa-infographic-re-schools-scorecard' },
  { id: 'infographic-100-commission-vs-exp', type: 'comparison-table', title: '100% Commission vs eXp', status: 'placed', category: 'content', blogPostId: '3667', blogPostTitle: 'Comparing 100 Percent Commission and eXp Realty', blogPostUri: 'about-exp-realty/100-percent', cloudflareId: 'saa-infographic-100-commission-vs-exp' },
  { id: 'infographic-100-percent-commission', type: 'comparison-table', title: '100% Commission: The Truth', status: 'placed', category: 'content', blogPostId: '3742', blogPostTitle: 'What Does Over 100% Commission Payout Really Mean for Realtors?', blogPostUri: 'exp-realty-sponsor/over-100-percent-commission', cloudflareId: 'saa-infographic-100-percent-commission' },
  { id: 'infographic-exp-team-types-2026', type: 'comparison-table', title: 'eXp Team Types 2026', status: 'placed', category: 'content', blogPostId: '8618', blogPostTitle: 'eXp Realty Teams 2026 Structure Explained', blogPostUri: 'about-exp-realty/teams-2026-structure', cloudflareId: 'saa-infographic-exp-team-types-2026' },
  { id: 'comparison-exp-kw', type: 'comparison-table', title: 'eXp vs KW', status: 'placed', category: 'content', blogPostId: '3826', blogPostTitle: 'eXp Realty vs Keller Williams: Which Brokerage is Best for Realtors?', blogPostUri: 'blog/brokerage-comparison/exp-kw', cloudflareId: 'saa-comparison-exp-kw' },
  // BAR CHART (5)
  { id: 'infographic-new-agent-expenses', type: 'bar-chart', title: 'New Agent Expense Budget', status: 'placed', category: 'content', blogPostId: '3923', blogPostTitle: 'Real Estate Agent Expenses New Agents Should Expect in 2025', blogPostUri: 'blog/agent-career-info/expenses', cloudflareId: 'saa-infographic-new-agent-expenses' },
  { id: 'infographic-social-platforms', type: 'bar-chart', title: 'Top Social Platforms for Agents', status: 'placed', category: 'content', blogPostId: '3678', blogPostTitle: 'Real Estate Social Network: Top 10 Platforms to Build Your Presence', blogPostUri: 'blog/marketing-mastery/social-network', cloudflareId: 'saa-infographic-social-platforms' },
  { id: 'infographic-top-cities-agents', type: 'bar-chart', title: 'Best Cities for Real Estate Agents', status: 'placed', category: 'content', blogPostId: '3691', blogPostTitle: 'Best Places to be a Real Estate Agent: Opportunity Galore', blogPostUri: 'blog/agent-career-info/best-places', cloudflareId: 'saa-infographic-top-cities-agents' },
  { id: 'infographic-agent-hours', type: 'bar-chart', title: 'Real Estate Agent Hours', status: 'placed', category: 'content', blogPostId: '3677', blogPostTitle: 'The Truth About Real Estate Agent Hours: Flexibility or 24/7 Grind?', blogPostUri: 'blog/agent-career-info/hours', cloudflareId: 'saa-infographic-agent-hours' },
  { id: 'infographic-30-hour-week', type: 'bar-chart', title: 'The 30-Hour Week', status: 'placed', category: 'content', blogPostId: '3738', blogPostTitle: 'How to Structure a 30 Hour Realtor Work Week Plan', blogPostUri: 'exp-realty-sponsor/30-hour-week', cloudflareId: 'saa-infographic-30-hour-week' },
  // STATS CHART (2)
  { id: 'infographic-off-market-stats', type: 'stats-chart', title: 'Off-Market vs MLS Sales', status: 'placed', category: 'content', blogPostId: '3646', blogPostTitle: 'Compass, Zillow, eXp Realty Clash with Off Market Listings', blogPostUri: 'blog/industry-trends/exclusive-listings', cloudflareId: 'saa-infographic-off-market-stats' },
  { id: 'infographic-exp-healthcare', type: 'stats-chart', title: 'eXp Healthcare Options', status: 'placed', category: 'content', blogPostId: '3841', blogPostTitle: 'How eXp Healthcare Coverage Is Structured for Agents', blogPostUri: 'about-exp-realty/healthcare', cloudflareId: 'saa-infographic-exp-healthcare' },
  // REVENUE SHARE (1)
  { id: 'revenue-share-breakdown-v2', type: 'revenue-share', title: 'eXp Revenue Share', status: 'placed', category: 'content', blogPostId: '3879', blogPostTitle: 'Complete Guide to eXp Realty Revenue Share for Agents', blogPostUri: 'exp-realty-sponsor/revenue-share', cloudflareId: 'saa-revenue-share-breakdown-v2' },
];

// --- BROKERAGE COMPARISON CHARTS (from generate-comparison-image.mjs, all uploaded to Cloudflare Images) ---
const BROKERAGE_COMPARISONS: InfographicEntry[] = [
  // eXp Realty vs
  { id: 'comparison-exp-agency', type: 'brokerage-comparison', title: 'eXp Realty vs The Agency', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-exp-agency' },
  { id: 'comparison-exp-bh', type: 'brokerage-comparison', title: 'eXp Realty vs Berkshire Hathaway', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-exp-bh' },
  { id: 'comparison-exp-bhg', type: 'brokerage-comparison', title: 'eXp Realty vs Better Homes & Gardens', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-exp-bhg' },
  { id: 'comparison-exp-c21', type: 'brokerage-comparison', title: 'eXp Realty vs Century 21', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-exp-c21' },
  { id: 'comparison-exp-cb', type: 'brokerage-comparison', title: 'eXp Realty vs Coldwell Banker', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-exp-cb' },
  { id: 'comparison-exp-compass', type: 'brokerage-comparison', title: 'eXp Realty vs Compass', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-exp-compass' },
  { id: 'comparison-exp-corcoran', type: 'brokerage-comparison', title: 'eXp Realty vs Corcoran', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-exp-corcoran' },
  { id: 'comparison-exp-elliman', type: 'brokerage-comparison', title: 'eXp Realty vs Douglas Elliman', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-exp-elliman' },
  { id: 'comparison-exp-fathom', type: 'brokerage-comparison', title: 'eXp Realty vs Fathom Realty', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-exp-fathom' },
  { id: 'comparison-exp-kw-chart', type: 'brokerage-comparison', title: 'eXp Realty vs Keller Williams', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-exp-kw' },
  { id: 'comparison-exp-lpt', type: 'brokerage-comparison', title: 'eXp Realty vs LPT Realty', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-exp-lpt' },
  { id: 'comparison-exp-real', type: 'brokerage-comparison', title: 'eXp Realty vs Real Brokerage', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-exp-real' },
  { id: 'comparison-exp-redfin', type: 'brokerage-comparison', title: 'eXp Realty vs Redfin', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-exp-redfin' },
  { id: 'comparison-exp-remax', type: 'brokerage-comparison', title: 'eXp Realty vs RE/MAX', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-exp-remax' },
  { id: 'comparison-exp-sothebys', type: 'brokerage-comparison', title: "eXp Realty vs Sotheby's", status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-exp-sothebys' },
  // Fathom Realty vs
  { id: 'comparison-fathom-agency', type: 'brokerage-comparison', title: 'Fathom Realty vs The Agency', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-fathom-agency' },
  { id: 'comparison-fathom-bh', type: 'brokerage-comparison', title: 'Fathom Realty vs Berkshire Hathaway', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-fathom-bh' },
  { id: 'comparison-fathom-bhg', type: 'brokerage-comparison', title: 'Fathom Realty vs Better Homes & Gardens', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-fathom-bhg' },
  { id: 'comparison-fathom-c21', type: 'brokerage-comparison', title: 'Fathom Realty vs Century 21', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-fathom-c21' },
  { id: 'comparison-fathom-cb', type: 'brokerage-comparison', title: 'Fathom Realty vs Coldwell Banker', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-fathom-cb' },
  { id: 'comparison-fathom-compass', type: 'brokerage-comparison', title: 'Fathom Realty vs Compass', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-fathom-compass' },
  { id: 'comparison-fathom-corcoran', type: 'brokerage-comparison', title: 'Fathom Realty vs Corcoran', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-fathom-corcoran' },
  { id: 'comparison-fathom-elliman', type: 'brokerage-comparison', title: 'Fathom Realty vs Douglas Elliman', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-fathom-elliman' },
  { id: 'comparison-fathom-kw', type: 'brokerage-comparison', title: 'Fathom Realty vs Keller Williams', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-fathom-kw' },
  { id: 'comparison-fathom-redfin', type: 'brokerage-comparison', title: 'Fathom Realty vs Redfin', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-fathom-redfin' },
  { id: 'comparison-fathom-remax', type: 'brokerage-comparison', title: 'Fathom Realty vs RE/MAX', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-fathom-remax' },
  { id: 'comparison-fathom-sothebys', type: 'brokerage-comparison', title: "Fathom Realty vs Sotheby's", status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-fathom-sothebys' },
  // LPT Realty vs
  { id: 'comparison-lpt-agency', type: 'brokerage-comparison', title: 'LPT Realty vs The Agency', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-lpt-agency' },
  { id: 'comparison-lpt-bh', type: 'brokerage-comparison', title: 'LPT Realty vs Berkshire Hathaway', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-lpt-bh' },
  { id: 'comparison-lpt-bhhs', type: 'brokerage-comparison', title: 'LPT Realty vs Better Homes & Gardens', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-lpt-bhhs' },
  { id: 'comparison-lpt-c21', type: 'brokerage-comparison', title: 'LPT Realty vs Century 21', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-lpt-c21' },
  { id: 'comparison-lpt-cb', type: 'brokerage-comparison', title: 'LPT Realty vs Coldwell Banker', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-lpt-cb' },
  { id: 'comparison-lpt-compass', type: 'brokerage-comparison', title: 'LPT Realty vs Compass', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-lpt-compass' },
  { id: 'comparison-lpt-corcoran', type: 'brokerage-comparison', title: 'LPT Realty vs Corcoran', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-lpt-corcoran' },
  { id: 'comparison-lpt-elliman', type: 'brokerage-comparison', title: 'LPT Realty vs Douglas Elliman', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-lpt-elliman' },
  { id: 'comparison-lpt-fathom', type: 'brokerage-comparison', title: 'LPT Realty vs Fathom Realty', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-lpt-fathom' },
  { id: 'comparison-lpt-redfin', type: 'brokerage-comparison', title: 'LPT Realty vs Redfin', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-lpt-redfin' },
  { id: 'comparison-lpt-remax', type: 'brokerage-comparison', title: 'LPT Realty vs RE/MAX', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-lpt-remax' },
  { id: 'comparison-lpt-sothebys', type: 'brokerage-comparison', title: "LPT Realty vs Sotheby's", status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-lpt-sothebys' },
  // Real Brokerage vs
  { id: 'comparison-real-agency', type: 'brokerage-comparison', title: 'Real Brokerage vs The Agency', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-real-agency' },
  { id: 'comparison-real-bh', type: 'brokerage-comparison', title: 'Real Brokerage vs Berkshire Hathaway', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-real-bh' },
  { id: 'comparison-real-bhg', type: 'brokerage-comparison', title: 'Real Brokerage vs Better Homes & Gardens', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-real-bhg' },
  { id: 'comparison-real-cb', type: 'brokerage-comparison', title: 'Real Brokerage vs Coldwell Banker', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-real-cb' },
  { id: 'comparison-real-compass', type: 'brokerage-comparison', title: 'Real Brokerage vs Compass', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-real-compass' },
  { id: 'comparison-real-corcoran', type: 'brokerage-comparison', title: 'Real Brokerage vs Corcoran', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-real-corcoran' },
  { id: 'comparison-real-elliman', type: 'brokerage-comparison', title: 'Real Brokerage vs Douglas Elliman', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-real-elliman' },
  { id: 'comparison-real-fathom', type: 'brokerage-comparison', title: 'Real Brokerage vs Fathom Realty', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-real-fathom' },
  { id: 'comparison-real-kw', type: 'brokerage-comparison', title: 'Real Brokerage vs Keller Williams', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-real-kw' },
  { id: 'comparison-real-lpt', type: 'brokerage-comparison', title: 'Real Brokerage vs LPT Realty', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-real-lpt' },
  { id: 'comparison-real-redfin', type: 'brokerage-comparison', title: 'Real Brokerage vs Redfin', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-real-redfin' },
  { id: 'comparison-real-sothebys', type: 'brokerage-comparison', title: "Real Brokerage vs Sotheby's", status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-real-sothebys' },
  // Other cross-brokerage
  { id: 'comparison-bh-kw', type: 'brokerage-comparison', title: 'Berkshire Hathaway vs Keller Williams', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-bh-kw' },
  { id: 'comparison-c21-cb', type: 'brokerage-comparison', title: 'Century 21 vs Coldwell Banker', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-c21-cb' },
  { id: 'comparison-c21-kw', type: 'brokerage-comparison', title: 'Century 21 vs Keller Williams', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-c21-kw' },
  { id: 'comparison-cb-compass', type: 'brokerage-comparison', title: 'Coldwell Banker vs Compass', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-cb-compass' },
  { id: 'comparison-cb-kw', type: 'brokerage-comparison', title: 'Coldwell Banker vs Keller Williams', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-cb-kw' },
  { id: 'comparison-compass-agency', type: 'brokerage-comparison', title: 'Compass vs The Agency', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-compass-agency' },
  { id: 'comparison-compass-corcoran', type: 'brokerage-comparison', title: 'Compass vs Corcoran', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-compass-corcoran' },
  { id: 'comparison-compass-kw', type: 'brokerage-comparison', title: 'Compass vs Keller Williams', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-compass-kw' },
  { id: 'comparison-compass-redfin', type: 'brokerage-comparison', title: 'Compass vs Redfin', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-compass-redfin' },
  { id: 'comparison-compass-sothebys', type: 'brokerage-comparison', title: "Compass vs Sotheby's", status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-compass-sothebys' },
  { id: 'comparison-kw-redfin', type: 'brokerage-comparison', title: 'Keller Williams vs Redfin', status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-kw-redfin' },
  { id: 'comparison-sothebys-bh', type: 'brokerage-comparison', title: "Sotheby's vs Berkshire Hathaway", status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-sothebys-bh' },
  { id: 'comparison-sothebys-cb', type: 'brokerage-comparison', title: "Sotheby's vs Coldwell Banker", status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-sothebys-cb' },
  { id: 'comparison-sothebys-kw', type: 'brokerage-comparison', title: "Sotheby's vs Keller Williams", status: 'placed', category: 'brokerage-comparison', blogPostId: null, blogPostTitle: null, blogPostUri: null, cloudflareId: 'comparison-sothebys-kw' },
];

const ALL_INFOGRAPHICS = [...CONTENT_INFOGRAPHICS, ...BROKERAGE_COMPARISONS];

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  defined: { label: 'Defined', color: '#888', bg: 'rgba(136,136,136,0.08)', border: 'rgba(136,136,136,0.3)' },
  generated: { label: 'Generated', color: '#ffd700', bg: 'rgba(255,215,0,0.08)', border: 'rgba(255,215,0,0.3)' },
  uploaded: { label: 'Uploaded', color: '#00bfff', bg: 'rgba(0,191,255,0.08)', border: 'rgba(0,191,255,0.3)' },
  placed: { label: 'Placed', color: '#00ff88', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.3)' },
};

const TYPE_LABELS: Record<LayoutType, string> = {
  'numbered-list': 'Numbered List',
  'checklist': 'Checklist',
  'comparison-table': 'Comparison Table',
  'bar-chart': 'Bar Chart',
  'stats-chart': 'Stats Chart',
  'revenue-share': 'Revenue Share',
  'brokerage-comparison': 'Brokerage Chart',
};

function StatusBadge({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        border: `1px solid ${config.border}`,
        borderRadius: '4px',
        color: config.color,
        background: config.bg,
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}
    >
      {config.label}
    </span>
  );
}

const WORKFLOW_STEPS = [
  { step: 1, title: 'Analyze Blog Post', desc: 'Read the target blog, identify data-rich sections suitable for visualization' },
  { step: 2, title: 'Create Infographic Data', desc: 'Add entry to the appropriate data file (data-numbered.mjs, data-checklist.mjs, etc.)' },
  { step: 3, title: 'Generate PNG + WebP', desc: 'Run: node generate.mjs infographic-slug (outputs both PNG and WebP)' },
  { step: 4, title: 'Upload to Cloudflare Images', desc: 'Upload the .webp file via Cloudflare Images API with saa-infographic- prefix' },
  { step: 5, title: 'Verify Size Variants', desc: 'Confirm /mobile (640w), /tablet (1024w), /desktop (2000w) variants all return 200' },
  { step: 6, title: 'Place in Blog Post', desc: 'Add responsive <img> with srcset to WordPress post content at optimal location' },
  { step: 7, title: 'Update Registry & Tab', desc: 'Update infographic-registry.json and this tab with cloudflareId, blogPostId, blogPostUri, and status. blogPostUri comes from the blog JSON customUri field (NOT WordPress custom_uri). Top-level categories (about-exp-realty, exp-realty-sponsor) use the URI directly. All others need a blog/ prefix (e.g. blog/agent-career-info/side-hustles).' },
  { step: 8, title: 'Rebuild & Deploy', desc: 'Regenerate blog posts JSON, commit, push to trigger Cloudflare Pages deploy. Build and reload admin dashboard for tab updates.' },
];

export function InfographicsTab() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');
  const [filterType, setFilterType] = useState<LayoutType | 'all'>('all');
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeList = useMemo(() => {
    if (activeCategory === 'content') return CONTENT_INFOGRAPHICS;
    if (activeCategory === 'brokerage-comparison') return BROKERAGE_COMPARISONS;
    return ALL_INFOGRAPHICS;
  }, [activeCategory]);

  const filtered = useMemo(() => {
    return activeList.filter(ig => {
      if (filterStatus !== 'all' && ig.status !== filterStatus) return false;
      if (filterType !== 'all' && ig.type !== filterType) return false;
      return true;
    });
  }, [activeList, filterStatus, filterType]);

  const counts = useMemo(() => {
    const byStatus: Record<Status, number> = { defined: 0, generated: 0, uploaded: 0, placed: 0 };
    const byType: Record<string, number> = {};
    let withBlog = 0;
    for (const ig of ALL_INFOGRAPHICS) {
      byStatus[ig.status]++;
      byType[ig.type] = (byType[ig.type] || 0) + 1;
      if (ig.blogPostId) withBlog++;
    }
    return {
      byStatus,
      byType,
      total: ALL_INFOGRAPHICS.length,
      content: CONTENT_INFOGRAPHICS.length,
      comparisons: BROKERAGE_COMPARISONS.length,
      withBlog,
    };
  }, []);

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#ffd700] flex items-center gap-2 mb-2">
          <Image className="w-6 h-6" />
          Infographics
        </h2>
        <p className="text-sm text-[#dcdbd5]">
          {counts.total} total infographics ({counts.content} content + {counts.comparisons} brokerage comparisons) - {counts.withBlog} mapped to blog posts
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2">
        {([
          { id: 'all' as const, label: 'All', count: counts.total },
          { id: 'content' as const, label: 'Content Infographics', count: counts.content },
          { id: 'brokerage-comparison' as const, label: 'Brokerage Comparisons', count: counts.comparisons },
        ]).map(cat => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setFilterType('all'); setFilterStatus('all'); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeCategory === cat.id
                ? 'bg-[rgba(255,215,0,0.15)] text-[#ffd700] border border-[rgba(255,215,0,0.4)]'
                : 'text-[#b0afa8] border border-[#2a2a2a] hover:text-[#e5e4dd] hover:border-[#404040]'
            }`}
          >
            {cat.label} <span className="ml-1 opacity-60">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        {(Object.entries(counts.byStatus) as [Status, number][]).map(([status, count]) => {
          const config = STATUS_CONFIG[status];
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(filterStatus === status ? 'all' : status)}
              className="text-left rounded-lg p-4 transition-all"
              style={{
                background: filterStatus === status ? config.bg : '#1a1a1a',
                border: `1px solid ${filterStatus === status ? config.border : '#2a2a2a'}`,
              }}
            >
              <div className="text-2xl font-bold" style={{ color: config.color }}>{count}</div>
              <div className="text-xs text-[#b0afa8] uppercase tracking-wider">{config.label}</div>
            </button>
          );
        })}
      </div>

      {/* Workflow Reference (Collapsible) */}
      <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a]">
        <button
          onClick={() => setShowWorkflow(!showWorkflow)}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <div className="flex items-center gap-2">
            <Paintbrush className="w-4 h-4 text-[#ffd700]" />
            <span className="text-[#e5e4dd] font-bold">Infographic Workflow (8 Steps)</span>
          </div>
          {showWorkflow ? <ChevronUp className="w-4 h-4 text-[#888]" /> : <ChevronDown className="w-4 h-4 text-[#888]" />}
        </button>
        {showWorkflow && (
          <div className="px-4 pb-4 space-y-3">
            {WORKFLOW_STEPS.map(ws => (
              <div key={ws.step} className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#ffd700] text-[#0d0d0d] flex items-center justify-center text-sm font-bold">
                  {ws.step}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#e5e4dd]">{ws.title}</div>
                  <div className="text-xs text-[#b0afa8]">{ws.desc}</div>
                </div>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t border-[#2a2a2a] text-xs text-[#888]">
              Full documentation: /tmp/infographic-generator/INFOGRAPHIC-WORKFLOW.md
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <span className="text-xs text-[#888] uppercase tracking-wider">Filter:</span>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value as LayoutType | 'all')}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded px-3 py-1.5 text-sm text-[#dcdbd5] focus:border-[#ffd700] outline-none"
        >
          <option value="all">All Types ({activeList.length})</option>
          {Object.entries(TYPE_LABELS)
            .filter(([key]) => activeList.some(ig => ig.type === key))
            .map(([key, label]) => (
              <option key={key} value={key}>{label} ({activeList.filter(ig => ig.type === key).length})</option>
            ))}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as Status | 'all')}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded px-3 py-1.5 text-sm text-[#dcdbd5] focus:border-[#ffd700] outline-none"
        >
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_CONFIG)
            .filter(([key]) => activeList.some(ig => ig.status === key))
            .map(([key, config]) => (
              <option key={key} value={key}>{config.label} ({activeList.filter(ig => ig.status === key).length})</option>
            ))}
        </select>
        <span className="text-xs text-[#888] ml-auto">{filtered.length} showing</span>
      </div>

      {/* Infographic List */}
      <div className="rounded-lg border border-[#2a2a2a] overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_140px_120px_1fr] gap-2 px-4 py-2.5 bg-[rgba(128,128,0,0.15)] text-xs text-[#ffd700] uppercase tracking-wider font-bold">
          <div>Infographic</div>
          <div>Type</div>
          <div>Status</div>
          <div>{activeCategory === 'brokerage-comparison' ? 'Cloudflare ID' : 'Blog Post'}</div>
        </div>

        {/* Table Rows */}
        {filtered.map((ig, i) => (
          <div
            key={ig.id}
            className="grid grid-cols-[1fr_140px_120px_1fr] gap-2 px-4 py-3 items-center"
            style={{
              background: i % 2 === 0 ? '#141414' : '#1a1a1a',
              borderBottom: '1px solid #2a2a2a',
            }}
          >
            {/* Name */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm text-[#e5e4dd] font-semibold truncate">{ig.title}</span>
              <button
                onClick={() => handleCopy(ig.cloudflareId || ig.id, ig.id)}
                className="flex-shrink-0 text-[#555] hover:text-[#ffd700] transition-colors"
                title={`Copy: ${ig.cloudflareId || ig.id}`}
              >
                {copiedId === ig.id ? <Check className="w-3 h-3 text-[#00ff88]" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            {/* Type */}
            <div className="text-xs text-[#888]">{TYPE_LABELS[ig.type]}</div>

            {/* Status */}
            <div><StatusBadge status={ig.status} /></div>

            {/* Blog or Cloudflare ID */}
            <div className="min-w-0">
              {ig.category === 'brokerage-comparison' && ig.cloudflareId ? (
                <span className="text-xs text-[#00bfff] font-mono truncate block">{ig.cloudflareId}</span>
              ) : ig.blogPostUri ? (
                <a
                  href={`https://smartagentalliance.com/${ig.blogPostUri}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 min-w-0 hover:opacity-80 transition-opacity"
                >
                  <ExternalLink className="w-3 h-3 text-[#00ff88] flex-shrink-0" />
                  <span className="text-xs text-[#00ff88] truncate underline underline-offset-2" title={ig.blogPostTitle || ''}>
                    {ig.blogPostTitle}
                  </span>
                </a>
              ) : (
                <span className="text-xs text-[#555]">Not assigned</span>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-[#555]">
            No infographics match the current filters
          </div>
        )}
      </div>

      {/* Quick Reference */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4">
          <h3 className="text-sm font-bold text-[#e5e4dd] mb-2">Content Infographic Generator</h3>
          <code className="text-xs text-[#ffd700] bg-[#0d0d0d] px-2 py-1 rounded block">/tmp/infographic-generator/</code>
          <div className="mt-2 text-xs text-[#888] space-y-1">
            <div>generate.mjs - Main script (outputs PNG + WebP)</div>
            <div>data-*.mjs - Infographic data definitions</div>
            <div>infographic-registry.json - Status tracking</div>
            <div>INFOGRAPHIC-WORKFLOW.md - Full instructions</div>
          </div>
        </div>
        <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4">
          <h3 className="text-sm font-bold text-[#e5e4dd] mb-2">Brokerage Comparison Generator</h3>
          <code className="text-xs text-[#ffd700] bg-[#0d0d0d] px-2 py-1 rounded block">packages/public-site/scripts/</code>
          <div className="mt-2 text-xs text-[#888] space-y-1">
            <div>generate-comparison-image.mjs - Puppeteer generator</div>
            <div>upload-comparison-images.mjs - Batch uploader</div>
            <div>brokerage-data.json - Commission/fee source data</div>
            <div>comparison-images-mapping.json - Cloudflare IDs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
