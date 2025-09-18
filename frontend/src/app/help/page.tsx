'use client';

import { useState, useEffect } from 'react';
import { contentApi } from '@/lib/api/client';
import Link from 'next/link';

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    email: string;
  };
  publishedAt: string;
  updatedAt: string;
  views: number;
  helpful: number;
  notHelpful: number;
  status: 'draft' | 'published' | 'archived';
}

interface HelpCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  articleCount: number;
}

export default function HelpCenterPage() {
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchHelpData();
  }, []);

  const fetchHelpData = async () => {
    try {
      setLoading(true);
      const [articlesResponse, categoriesResponse] = await Promise.all([
        contentApi.getHelpArticles({
          status: 'published',
          limit: 50,
          sort: 'views',
          order: 'desc'
        }),
        contentApi.getHelpCategories()
      ]);
      
      setArticles(articlesResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch help articles');
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularArticles = articles
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading help center...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Help Center</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchHelpData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to your questions and learn how to get the most out of Autopilot.Monster
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-400 text-xl">🔍</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedCategory === 'all' ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedCategory('all')}
            >
              <div className="text-3xl mb-3">📚</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All Articles</h3>
              <p className="text-gray-600 text-sm">{articles.length} articles</p>
            </div>
            
            {categories.map((category) => (
              <div
                key={category.id}
                className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-lg ${
                  selectedCategory === category.name ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.articleCount} articles</p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        {selectedCategory === 'all' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/help/${article.id}`}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{article.category}</span>
                    <span>{article.views} views</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Articles List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedCategory === 'all' ? 'All Articles' : `${selectedCategory} Articles`}
          </h2>
          
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No help articles available at the moment'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/help/${article.id}`}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow block"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {article.category}
                        </span>
                        <span>{article.views} views</span>
                        <span>{article.helpful} helpful</span>
                        <span>Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="ml-4 text-gray-400">
                      <span className="text-2xl">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h3>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/community"
              className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Join Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
