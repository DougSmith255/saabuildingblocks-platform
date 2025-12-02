'use client';

import { useState } from 'react';
import BlogUrlInput from '@/components/BlogUrlInput';
import PlatformSelector from '@/components/PlatformSelector';
import PostingStatus from '@/components/PostingStatus';

export default function SocialPosterPage() {
  const [blogUrl, setBlogUrl] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [postingResults, setPostingResults] = useState<Record<string, { status: 'pending' | 'posting' | 'success' | 'failed'; message?: string }>>({});

  const handleSubmit = async () => {
    if (!blogUrl || selectedPlatforms.length === 0) {
      alert('Please enter a blog URL and select at least one platform');
      return;
    }

    setIsPosting(true);

    // Initialize all platforms as pending
    const initialResults: Record<string, { status: 'pending' | 'posting' | 'success' | 'failed'; message?: string }> = {};
    selectedPlatforms.forEach(platform => {
      initialResults[platform] = { status: 'posting' };
    });
    setPostingResults(initialResults);

    try {
      // Call n8n webhook to trigger the posting workflow
      const response = await fetch('/social-poster/api/n8n/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogUrl,
          platforms: selectedPlatforms,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update results based on n8n response
        setPostingResults(data.results || {});
      } else {
        // Mark all as failed if the webhook call failed
        const failedResults: Record<string, { status: 'pending' | 'posting' | 'success' | 'failed'; message?: string }> = {};
        selectedPlatforms.forEach(platform => {
          failedResults[platform] = {
            status: 'failed',
            message: data.error || 'Failed to trigger posting workflow'
          };
        });
        setPostingResults(failedResults);
      }
    } catch (error) {
      console.error('Error posting to platforms:', error);
      const failedResults: Record<string, { status: 'pending' | 'posting' | 'success' | 'failed'; message?: string }> = {};
      selectedPlatforms.forEach(platform => {
        failedResults[platform] = {
          status: 'failed',
          message: 'Network error - could not reach n8n'
        };
      });
      setPostingResults(failedResults);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Social Poster
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Automate your blog post distribution across social media platforms
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-8">
          <BlogUrlInput
            value={blogUrl}
            onChange={setBlogUrl}
            disabled={isPosting}
          />

          <PlatformSelector
            selected={selectedPlatforms}
            onChange={setSelectedPlatforms}
            disabled={isPosting}
          />

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isPosting || !blogUrl || selectedPlatforms.length === 0}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isPosting ? 'Posting...' : 'Post to Selected Platforms'}
            </button>
          </div>

          {Object.keys(postingResults).length > 0 && (
            <PostingStatus results={postingResults} />
          )}
        </div>
      </div>
    </div>
  );
}
