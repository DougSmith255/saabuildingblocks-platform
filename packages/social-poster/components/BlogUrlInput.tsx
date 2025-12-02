'use client';

interface BlogUrlInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function BlogUrlInput({ value, onChange, disabled }: BlogUrlInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="blog-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Blog Post URL
      </label>
      <input
        id="blog-url"
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="https://smartagentalliance.com/your-blog-post/"
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
      />
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Enter the full URL of your WordPress blog post from smartagentalliance.com
      </p>
    </div>
  );
}
