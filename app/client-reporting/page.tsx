'use client';

import { useState, useEffect } from 'react';
import { getSortedPostsData, getPostKeywords } from '@/app/lib/posts';
import type { PostData } from '@/app/lib/posts';

interface EnhancedPostData extends PostData {
  fetchedKeywords?: string[];
}

export default function ClientReporting() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<EnhancedPostData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all posts
        const allPosts = await getSortedPostsData();
        
        // Log the first post to see its structure
        if (allPosts.length > 0) {
          console.log('Sample post structure:', JSON.stringify(allPosts[0], null, 2));
        }

        // For each post, manually add the keywords to ensure they're available
        const postsWithKeywords = await Promise.all(
          allPosts.map(async (post) => {
            // Skip fetching if keywords already exist
            if (post.keywords && Array.isArray(post.keywords) && post.keywords.length > 0) {
              console.log(`Post ${post.id} already has keywords:`, post.keywords);
              return post;
            }
            
            // Otherwise fetch keywords directly from the markdown file
            const keywords = await getPostKeywords(post.id);
            console.log(`Fetched keywords for ${post.id}:`, keywords);
            
            // Return enhanced post with keywords
            return {
              ...post,
              fetchedKeywords: keywords
            };
          })
        );

        setPosts(postsWithKeywords);
        
        // Extract unique years and months from posts
        const years = new Set<string>();
        const months = new Set<string>();
        
        allPosts.forEach(post => {
          const date = new Date(post.date);
          years.add(date.getFullYear().toString());
          
          // Get month name
          const monthName = date.toLocaleString('default', { month: 'long' });
          months.add(monthName);
        });
        
        setAvailableYears(Array.from(years).sort().reverse());
        setAvailableMonths(Array.from(months).sort((a, b) => {
          const monthOrder = ["January", "February", "March", "April", "May", "June", 
                            "July", "August", "September", "October", "November", "December"];
          return monthOrder.indexOf(a) - monthOrder.indexOf(b);
        }));
        
        // Set defaults to current month and year
        const currentDate = new Date();
        setSelectedYear(currentDate.getFullYear().toString());
        setSelectedMonth(currentDate.toLocaleString('default', { month: 'long' }));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password protection - in a real app, use proper authentication
    if (password === 'elan2025dev') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleDownload = async () => {
    if (!selectedMonth || !selectedYear) {
      alert('Please select both month and year');
      return;
    }

    try {
      // Filter posts by selected month and year
      const filteredPosts = posts.filter(post => {
        const postDate = new Date(post.date);
        const postMonthName = postDate.toLocaleString('default', { month: 'long' });
        const postYear = postDate.getFullYear().toString();
        
        return postMonthName === selectedMonth && postYear === selectedYear;
      });

      if (filteredPosts.length === 0) {
        alert('No posts found for the selected month and year');
        return;
      }

      // Import libraries dynamically
      const XLSX = await import('xlsx');
      // For file-saver, we need to handle the default export differently
      const FileSaver = await import('file-saver');
      const saveAs = FileSaver.default || FileSaver;

      // Prepare data for Excel
      const excelData = filteredPosts.map(post => {
        // Get keywords from either original post.keywords or our fetched keywords
        const keywordsArray = post.keywords && Array.isArray(post.keywords) && post.keywords.length > 0 
          ? post.keywords 
          : (post.fetchedKeywords || []);
        
        console.log(`Processing post "${post.title}" for Excel:`, {
          hasOriginalKeywords: post.keywords && Array.isArray(post.keywords),
          originalKeywords: post.keywords,
          hasFetchedKeywords: !!post.fetchedKeywords,
          fetchedKeywords: post.fetchedKeywords,
          finalKeywords: keywordsArray
        });

        return {
          'Title': post.title,
          'Date': post.date,
          'Description': post.description,
          'OG Image': post.ogImage,
          'Keywords': keywordsArray.join(', '),
          'Categories': (post.categories || []).join(', '),
          'Topics': (post.topics || []).join(', '),
          'Blog Live Link': `https://blog.elanroadtestrental.ca/posts/${post.id}`
        };
      });

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Column widths
      const wscols = [
        { wch: 40 }, // Title
        { wch: 15 }, // Date
        { wch: 50 }, // Description
        { wch: 30 }, // OG Image
        { wch: 50 }, // Keywords
        { wch: 30 }, // Categories
        { wch: 30 }, // Topics
        { wch: 60 }  // Blog Live Link
      ];
      
      worksheet['!cols'] = wscols;

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `${selectedMonth} ${selectedYear}`);

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Save file using the correct saveAs function
      saveAs(data, `Elan_Blog_Report_${selectedMonth}_${selectedYear}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel file:', error);
      alert('Error generating Excel file. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Developer Access Only</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Client Reporting Dashboard</h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Generate reports of blog posts published by month. Select a month and year to download an Excel spreadsheet with post details.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <select
                  id="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Month</option>
                  {availableMonths.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Year</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleDownload}
              className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center"
              disabled={!selectedMonth || !selectedYear}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              Download Report
            </button>
          </div>
          
          {/* Preview Section */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Post Summary</h2>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-semibold">
                {posts.filter(post => {
                  if (!selectedMonth || !selectedYear) return false;
                  const postDate = new Date(post.date);
                  const postMonthName = postDate.toLocaleString('default', { month: 'long' });
                  const postYear = postDate.getFullYear().toString();
                  
                  return postMonthName === selectedMonth && postYear === selectedYear;
                }).length} posts in {selectedMonth} {selectedYear}
              </p>
            </div>
            
            {/* Post list preview */}
            <div className="mt-4">
              {selectedMonth && selectedYear && (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts
                        .filter(post => {
                          const postDate = new Date(post.date);
                          const postMonthName = postDate.toLocaleString('default', { month: 'long' });
                          const postYear = postDate.getFullYear().toString();
                          
                          return postMonthName === selectedMonth && postYear === selectedYear;
                        })
                        .map((post, index) => (
                          <tr key={post.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{post.title}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{post.date}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {post.categories.join(', ')}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}