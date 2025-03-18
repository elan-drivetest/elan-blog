import type { Metadata } from "next";
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { type PostData, getPostData, getSortedPostsData } from '@/app/lib/posts';
import { Breadcrumb } from '@/app/components/ui/Breadcrumb';
import { ShareButtons } from '@/app/components/ui/ShareButtons';
import Sidebar from '@/app/components/wrappers/Sidebar';
import { Calendar } from 'lucide-react';
import { RecommendedPosts } from "@/app/components/ui/RecommendedPosts";
import { TableOfContentsSidebar } from "@/app/components/wrappers/TableOfContentsSidebar";
import ScrollProgressBar from "@/app/components/ui/ScrollProgressBar";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const postData = await getPostData(params.id);
    return {
      title: `${postData.title} - Elan`,
      description: postData.description,
      openGraph: {
        images: [
          {
            url: postData.ogImage,
            alt: postData.title,
          },
        ],
        title: postData.title,
        description: postData.description,
      },
    };
  } catch (error) {
    return {
      title: 'Article Not Found - Elan',
      description: 'The requested article could not be found.',
    };
  }
}

export default async function Post({ params }: { params: { id: string } }) {
  try {
    const [postData, allPosts] = await Promise.all([
      getPostData(params.id),
      getSortedPostsData()
    ]);

    // If no post data is found, redirect to not-found
    if (!postData) {
      notFound();
    }
    
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).replace(',', '');
    };

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": postData.title,
      "description": postData.description,
      "image": postData.ogImage,
      "datePublished": postData.date,
      "author": {
        "@type": "Organization",
        "name": "Elan DriveTest",
        "url": "https://elandrivetestrental.ca"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Elan DriveTest",
        "logo": {
          "@type": "ImageObject",
          "url": "https://blog.elandrivetestrental.ca/icon_logo.svg"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://blog.elandrivetestrental.ca/posts/${params.id}`
      },
      "keywords": [
        ...postData.categories,
        ...postData.topics,
        "driving test", 
        "Canada driving"
      ]
    };

    return (
      <>
        <JsonLd data={structuredData} />
        <ScrollProgressBar />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-14 gap-6 relative">
            {/* Left Sidebar - Table of Contents */}
            <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
              <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-6rem)]">
                <TableOfContentsSidebar contentId="post-content" />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 xl:col-span-9">
              <article className="max-w-3xl mx-auto mb-12">
                <Breadcrumb 
                  categories={postData.categories} 
                  topics={postData.topics}
                />

                <h1 className="text-5xl font-bold leading-tight mb-4">
                  {postData.title}
                </h1>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-green-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <time>{formatDate(postData.date)}</time>
                  </div>
                  <ShareButtons url={`/posts/${postData.id}`} />
                </div>

                {postData.ogImage && (
                  <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
                    <Image
                      src={postData.ogImage}
                      alt={postData.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                <div 
                  id="post-content"
                  className="prose max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
                />
                
                {/* Ad */}
                <div className="my-10 overflow-hidden rounded-xl border border-green-100 bg-gradient-to-r from-green-50 to-gray-50">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-2/3 p-6 md:p-8">
                      <div className="mb-2 inline-flex items-center rounded-full bg-green-100 px-3 py-1">
                        <span className="text-sm font-medium text-green-800">Exclusive Offer</span>
                      </div>
                      <h3 className="mb-3 text-2xl font-bold text-gray-900">Pass Your Road Test with Confidence</h3>
                      <p className="mb-4 text-gray-600">Book your road test <b>car</b> and <b>instructor</b> package with Elan. Professional vehicles, experienced instructors, and free lesson perks available.</p>
                      <div className="flex flex-wrap gap-3 mt-6">
                        <Link target="_blank" href="https://www.elandrivetestrental.ca">
                          <span className="inline-flex items-center justify-center rounded-lg bg-green-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                            Book Now
                          </span>
                        </Link>
                        <Link target="_blank" href="https://www.facebook.com/profile.php?id=61573941594288" className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                          Learn More
                        </Link>
                      </div>
                    </div>
                    <div className="hidden md:block w-1/3 p-6">
                      <div className="relative h-48 w-full flex items-center justify-center">
                        <Image
                          src="/icon_logo.svg"
                          alt="Road Test Car"
                          height={192}
                          width={192}
                          objectFit="cover"
                          objectPosition="center"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-500/5 border-t border-green-100 py-3 px-8">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
                      <p>98% pass rate with our instructor packages</p>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <svg className="h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L6 8.4V11h2v2H6v2h2v3.6L12 22l4-3.6V16h2v-2h-2v-2h2V9h-2V5.4z" />
                          </svg>
                          <span>Free perks for 50km+</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>Licensed instructors</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <ShareButtons url={`/posts/${postData.id}`} />
                </div>
              </article>

              <div className="max-w-3xl mx-auto">
                <RecommendedPosts 
                  posts={allPosts}
                  currentPostId={params.id}
                />
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-6rem)]">
                <Sidebar currentPostId={params.id} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    notFound();
  }
}