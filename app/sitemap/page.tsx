// app/sitemap/page.tsx
import { getSortedPostsData, getAllCategories, getAllTopics } from '@/app/lib/posts';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sitemap - Elan DriveTest Blog',
  description: 'Complete index of all content on Elan DriveTest Blog including articles, categories, and topics.',
  keywords: ['sitemap', 'elan', 'drive test', 'blog index'],
  robots: {
    index: true,
    follow: true,
  }
};

export default async function SitemapPage() {
  // Fetch all data
  const [posts, categories, topics] = await Promise.all([
    getSortedPostsData(),
    getAllCategories(),
    getAllTopics()
  ]);

  // Group posts by year and month
  const groupedPosts = posts.reduce((acc, post) => {
    const date = new Date(post.date);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    
    if (!acc[year]) {
      acc[year] = {};
    }
    
    if (!acc[year][month]) {
      acc[year][month] = [];
    }
    
    acc[year][month].push(post);
    return acc;
  }, {} as Record<number, Record<string, typeof posts>>);

  // Sort years and months in descending order
  const sortedYears = Object.keys(groupedPosts)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sitemap</h1>
      <p className="text-gray-600 mb-8">
        A complete index of all content on Elan DriveTest Blog.
      </p>

      <div className="space-y-12">
        {/* Main Pages Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">Main Pages</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <li>
              <Link 
                href="/" 
                className="text-green-600 hover:text-green-800 hover:underline"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/categories" 
                className="text-green-600 hover:text-green-800 hover:underline"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link 
                href="/topics" 
                className="text-green-600 hover:text-green-800 hover:underline"
              >
                Topics
              </Link>
            </li>
            <li>
              <Link 
                href="/search" 
                className="text-green-600 hover:text-green-800 hover:underline"
              >
                Search
              </Link>
            </li>
            <li>
              <Link 
                href="/privacy" 
                className="text-green-600 hover:text-green-800 hover:underline"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link 
                href="/terms" 
                className="text-green-600 hover:text-green-800 hover:underline"
              >
                Terms of Use
              </Link>
            </li>
          </ul>
        </section>

        {/* Categories Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">Categories</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <li key={category}>
                <Link 
                  href={`/categories/${encodeURIComponent(category.toLowerCase())}`}
                  className="text-green-600 hover:text-green-800 hover:underline"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Topics Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">Topics</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map(topic => (
              <li key={topic}>
                <Link 
                  href={`/topics/${encodeURIComponent(topic.toLowerCase())}`}
                  className="text-green-600 hover:text-green-800 hover:underline"
                >
                  {topic}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Posts Section Grouped by Year and Month */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">All Articles</h2>
          
          {sortedYears.map(year => (
            <div key={year} className="mb-8">
              <h3 className="text-xl font-semibold mb-3">{year}</h3>
              
              {Object.keys(groupedPosts[year])
                .sort((a, b) => {
                  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                              'July', 'August', 'September', 'October', 'November', 'December'];
                  return months.indexOf(b) - months.indexOf(a);
                })
                .map(month => (
                  <div key={`${year}-${month}`} className="mb-6">
                    <h4 className="text-lg font-medium mb-2 text-gray-700">{month}</h4>
                    <ul className="space-y-2 pl-4">
                      {groupedPosts[year][month].map(post => (
                        <li key={post.id} className="group">
                          <Link 
                            href={`/posts/${post.id}`}
                            className="text-green-600 hover:text-green-800 hover:underline"
                          >
                            {post.title}
                          </Link>
                          <span className="text-sm text-gray-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {new Date(post.date).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}