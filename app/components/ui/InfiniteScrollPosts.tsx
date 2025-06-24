'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from "lucide-react";
import { PostData } from '@/app/lib/posts';
import { BlogCard } from './BlogCard';

const POSTS_PER_PAGE = 6;

interface InfiniteScrollPostsProps {
  posts: PostData[];
}

export default function InfiniteScrollPosts({ posts }: InfiniteScrollPostsProps) {
  const [displayedPosts, setDisplayedPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Initialize with first batch of posts
  useEffect(() => {
    if (posts.length > 0) {
      const initialPosts = posts.slice(0, POSTS_PER_PAGE);
      setDisplayedPosts(initialPosts);
      setCurrentIndex(POSTS_PER_PAGE);
      setHasMore(posts.length > POSTS_PER_PAGE);
    }
  }, [posts]);

  // Function to load more posts
  const loadMorePosts = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const nextIndex = currentIndex + POSTS_PER_PAGE;
      const newPosts = posts.slice(currentIndex, nextIndex);
      
      setDisplayedPosts(prevPosts => [...prevPosts, ...newPosts]);
      setCurrentIndex(nextIndex);
      setHasMore(nextIndex < posts.length);
      setLoading(false);
    }, 500);
  }, [posts, currentIndex, loading, hasMore]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // Load more when user is 200px from bottom
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      loadMorePosts();
    }
  }, [loading, hasMore, loadMorePosts]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Handle empty posts
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No posts available at the moment.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedPosts.map((post, index) => (
          <BlogCard
            key={`${post.id}-${index}`}
            title={post.title}
            date={post.date}
            image={post.ogImage || '/images/default-blog.jpg'}
            slug={post.id}
            preview={post.description}
          />
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center mt-8">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin text-green-500 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">Loading more posts...</p>
          </div>
        </div>
      )}

      {/* No more posts indicator */}
      {!hasMore && displayedPosts.length > 0 && displayedPosts.length < posts.length && (
        <div className="text-center mt-8 py-4">
          <p className="text-gray-500">You've reached the end! No more posts to load.</p>
        </div>
      )}

      {/* Load more button as fallback */}
      {hasMore && !loading && (
        <div className="text-center mt-8">
          <button
            onClick={loadMorePosts}
            className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            Load More Posts
          </button>
        </div>
      )}
    </>
  );
}