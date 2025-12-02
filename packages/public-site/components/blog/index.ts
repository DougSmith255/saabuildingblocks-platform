/**
 * Blog Components Barrel Export
 *
 * Central export for all blog template components
 * SAA-enhanced components for blog functionality
 */

export { BlogPostCard, type BlogPostCardProps } from './BlogPostCard';
export { CategoryBadge, type CategoryBadgeProps } from './CategoryBadge';
export { BlogHeader, type BlogHeaderProps } from './BlogHeader';
export { BlogContent, type BlogContentProps } from './BlogContent';
export { RelatedPosts, type RelatedPostsProps } from './RelatedPosts';
export { Breadcrumbs, type BreadcrumbsProps } from './Breadcrumbs';
export { ShareButtons, type ShareButtonsProps } from './ShareButtons';
export { SearchBar } from './SearchBar';
export { FilterBar } from './FilterBar';
export { FilterablePostList } from './FilterablePostList';
export { CategoryChips } from './CategoryChips';
export { SortControl } from './SortControl';
export { ResultsCount } from './ResultsCount';
export { PaginationControls } from './PaginationControls';

// Blog image components
export { default as BlogFeaturedImage, FeaturedImageSkeleton, type BlogFeaturedImageProps } from './BlogFeaturedImage';
export { default as BlogContentImage, type BlogContentImageProps } from './BlogContentImage';
export { default as BlogThumbnail, type BlogThumbnailProps } from './BlogThumbnail';
export { FuturisticImageFrame, type FuturisticImageFrameProps } from './FuturisticImageFrame';

// Blog post page components
export { BlogPostHero, type BlogPostHeroProps } from './BlogPostHero';
export { ThemeSwitch, type ThemeSwitchProps } from './ThemeSwitch';
export { BlogPostTemplate, type BlogPostTemplateProps } from './BlogPostTemplate';
