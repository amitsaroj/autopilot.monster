'use client'

import { useState } from 'react'
import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'
import { Button } from '@/components/ui/Button/Button'
import { 
  ArrowLeft, 
  Star, 
  Download, 
  Play, 
  Code, 
  Shield, 
  Users, 
  CheckCircle,
  Heart,
  Share2,
  MessageCircle,
  ThumbsUp,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  CreditCard,
  Lock
} from 'lucide-react'
import styles from './ProductDetail.module.scss'

// Mock product data
const mockProduct = {
  id: 'ai-customer-support-agent',
  title: 'AI Customer Support Agent',
  subtitle: 'Intelligent 24/7 Customer Service Automation',
  description: 'Revolutionary AI-powered customer support agent that handles inquiries, resolves issues, and provides personalized assistance around the clock. Built with advanced natural language processing and machine learning capabilities.',
  category: 'AI Agents',
  price: 299,
  originalPrice: 399,
  rating: 4.8,
  reviewCount: 1247,
  downloads: 15420,
  vendor: {
    name: 'TechFlow Solutions',
    avatar: 'TS',
    verified: true,
    rating: 4.9,
    sales: 2847
  },
  tags: ['Customer Support', 'AI', 'Automation', 'NLP', '24/7'],
  features: [
    'Natural language understanding',
    'Multi-language support',
    'Integration with 50+ platforms',
    'Customizable responses',
    'Analytics dashboard',
    'API access included'
  ],
  screenshots: [
    '/api/placeholder/800/600',
    '/api/placeholder/800/600',
    '/api/placeholder/800/600',
    '/api/placeholder/800/600'
  ],
  documentation: 'https://docs.example.com',
  support: 'https://support.example.com',
  lastUpdated: '2024-01-15',
  version: '2.1.4',
  compatibility: ['Web', 'Mobile', 'API'],
  requirements: ['Node.js 16+', 'MongoDB', 'Redis'],
  license: 'Commercial',
  size: '45.2 MB',
  reviews: [
    {
      id: 1,
      user: 'Sarah Johnson',
      avatar: 'SJ',
      rating: 5,
      date: '2024-01-10',
      comment: 'This AI agent has transformed our customer support. Response time improved by 80% and customer satisfaction is through the roof!',
      helpful: 23
    },
    {
      id: 2,
      user: 'Mike Chen',
      avatar: 'MC',
      rating: 5,
      date: '2024-01-08',
      comment: 'Easy to set up and incredibly powerful. The natural language processing is impressive and handles complex queries beautifully.',
      helpful: 18
    }
  ],
  relatedProducts: [
    {
      id: 'ai-sales-bot',
      title: 'AI Sales Assistant',
      price: 199,
      rating: 4.7
    },
    {
      id: 'workflow-automation',
      title: 'Workflow Automation Suite',
      price: 149,
      rating: 4.9
    }
  ]
}

export default function ProductDetailPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const handlePurchase = () => {
    console.log('Purchase initiated')
  }

  const handleAddToCart = () => {
    console.log('Added to cart')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${styles.star} ${i < Math.floor(rating) ? styles.filled : ''}`}
        size={16}
      />
    ))
  }

  return (
    <div className={styles.productDetailPage}>
      <Navigation />
      
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbContent}>
          <a href="/marketplace" className={styles.breadcrumbLink}>
            <ArrowLeft size={16} />
            Back to Marketplace
          </a>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{mockProduct.title}</span>
        </div>
      </div>

      {/* Product Header */}
      <div className={styles.productHeader}>
        <div className={styles.productHeaderContent}>
          <div className={styles.productInfo}>
            <div className={styles.category}>{mockProduct.category}</div>
            <h1 className={styles.title}>{mockProduct.title}</h1>
            <p className={styles.subtitle}>{mockProduct.subtitle}</p>
            
            <div className={styles.rating}>
              <div className={styles.stars}>
                {renderStars(mockProduct.rating)}
              </div>
              <span className={styles.ratingText}>
                {mockProduct.rating} ({mockProduct.reviewCount} reviews)
              </span>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <Download size={16} />
                <span>{mockProduct.downloads.toLocaleString()} downloads</span>
              </div>
              <div className={styles.stat}>
                <Users size={16} />
                <span>{mockProduct.vendor.sales} sales</span>
              </div>
            </div>
          </div>

          <div className={styles.productActions}>
            <div className={styles.priceSection}>
              <div className={styles.price}>
                {formatPrice(mockProduct.price)}
                {mockProduct.originalPrice > mockProduct.price && (
                  <span className={styles.originalPrice}>
                    {formatPrice(mockProduct.originalPrice)}
                  </span>
                )}
              </div>
              <div className={styles.priceNote}>One-time purchase</div>
            </div>

            <div className={styles.actionButtons}>
              <Button
                variant="primary"
                size="lg"
                onClick={handlePurchase}
                className={styles.purchaseButton}
              >
                <CreditCard size={20} />
                Purchase Now
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                onClick={handleAddToCart}
                className={styles.cartButton}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </Button>
            </div>

            <div className={styles.quickActions}>
              <button
                className={`${styles.quickAction} ${isFavorited ? styles.favorited : ''}`}
                onClick={() => setIsFavorited(!isFavorited)}
              >
                <Heart size={20} />
                {isFavorited ? 'Favorited' : 'Add to Favorites'}
              </button>
              
              <button className={styles.quickAction}>
                <Share2 size={20} />
                Share
              </button>
            </div>

            <div className={styles.security}>
              <Lock size={16} />
              <span>Secure payment • 30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Gallery */}
      <div className={styles.productGallery}>
        <div className={styles.galleryContent}>
          <div className={styles.mainImage}>
            <div className={styles.imagePlaceholder}>
              <Play size={48} />
              <span>Product Demo</span>
            </div>
          </div>
          
          <div className={styles.thumbnailGrid}>
            {mockProduct.screenshots.map((screenshot, index) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <div className={styles.thumbnailPlaceholder}>
                  <Code size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className={styles.productDetails}>
        <div className={styles.detailsContent}>
          <div className={styles.mainContent}>
            {/* Tabs */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'features' ? styles.active : ''}`}
                onClick={() => setActiveTab('features')}
              >
                Features
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'reviews' ? styles.active : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({mockProduct.reviewCount})
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'support' ? styles.active : ''}`}
                onClick={() => setActiveTab('support')}
              >
                Support
              </button>
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              {activeTab === 'overview' && (
                <div className={styles.overview}>
                  <div className={styles.description}>
                    <h3>Description</h3>
                    <p className={showFullDescription ? styles.fullDescription : styles.shortDescription}>
                      {mockProduct.description}
                    </p>
                    {!showFullDescription && (
                      <button
                        className={styles.readMore}
                        onClick={() => setShowFullDescription(true)}
                      >
                        Read More <ChevronDown size={16} />
                      </button>
                    )}
                    {showFullDescription && (
                      <button
                        className={styles.readLess}
                        onClick={() => setShowFullDescription(false)}
                      >
                        Read Less <ChevronUp size={16} />
                      </button>
                    )}
                  </div>

                  <div className={styles.tags}>
                    <h4>Tags</h4>
                    <div className={styles.tagList}>
                      {mockProduct.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.productInfo}>
                    <h4>Product Information</h4>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Version</span>
                        <span className={styles.infoValue}>{mockProduct.version}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Last Updated</span>
                        <span className={styles.infoValue}>{mockProduct.lastUpdated}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>License</span>
                        <span className={styles.infoValue}>{mockProduct.license}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Size</span>
                        <span className={styles.infoValue}>{mockProduct.size}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className={styles.features}>
                  <h3>Key Features</h3>
                  <div className={styles.featuresList}>
                    {mockProduct.features.map((feature, index) => (
                      <div key={index} className={styles.feature}>
                        <CheckCircle size={20} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.compatibility}>
                    <h4>Compatibility</h4>
                    <div className={styles.compatibilityList}>
                      {mockProduct.compatibility.map((item, index) => (
                        <span key={index} className={styles.compatibilityItem}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.requirements}>
                    <h4>System Requirements</h4>
                    <div className={styles.requirementsList}>
                      {mockProduct.requirements.map((req, index) => (
                        <div key={index} className={styles.requirement}>
                          <Code size={16} />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className={styles.reviews}>
                  <div className={styles.reviewsHeader}>
                    <h3>Customer Reviews</h3>
                    <div className={styles.reviewsSummary}>
                      <div className={styles.averageRating}>
                        <span className={styles.ratingNumber}>{mockProduct.rating}</span>
                        <div className={styles.ratingStars}>
                          {renderStars(mockProduct.rating)}
                        </div>
                        <span className={styles.ratingCount}>
                          Based on {mockProduct.reviewCount} reviews
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.reviewsList}>
                    {mockProduct.reviews.map((review) => (
                      <div key={review.id} className={styles.review}>
                        <div className={styles.reviewHeader}>
                          <div className={styles.reviewer}>
                            <div className={styles.reviewerAvatar}>
                              {review.avatar}
                            </div>
                            <div className={styles.reviewerInfo}>
                              <div className={styles.reviewerName}>{review.user}</div>
                              <div className={styles.reviewDate}>{review.date}</div>
                            </div>
                          </div>
                          <div className={styles.reviewRating}>
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <div className={styles.reviewComment}>
                          {review.comment}
                        </div>
                        <div className={styles.reviewActions}>
                          <button className={styles.reviewAction}>
                            <ThumbsUp size={16} />
                            Helpful ({review.helpful})
                          </button>
                          <button className={styles.reviewAction}>
                            <MessageCircle size={16} />
                            Reply
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'support' && (
                <div className={styles.support}>
                  <h3>Support & Resources</h3>
                  
                  <div className={styles.supportOptions}>
                    <div className={styles.supportOption}>
                      <div className={styles.supportIcon}>
                        <ExternalLink size={24} />
                      </div>
                      <div className={styles.supportContent}>
                        <h4>Documentation</h4>
                        <p>Comprehensive guides and API documentation</p>
                        <a href={mockProduct.documentation} className={styles.supportLink}>
                          View Documentation
                        </a>
                      </div>
                    </div>

                    <div className={styles.supportOption}>
                      <div className={styles.supportIcon}>
                        <MessageCircle size={24} />
                      </div>
                      <div className={styles.supportContent}>
                        <h4>Support Center</h4>
                        <p>Get help from our support team</p>
                        <a href={mockProduct.support} className={styles.supportLink}>
                          Contact Support
                        </a>
                      </div>
                    </div>

                    <div className={styles.supportOption}>
                      <div className={styles.supportIcon}>
                        <Users size={24} />
                      </div>
                      <div className={styles.supportContent}>
                        <h4>Community</h4>
                        <p>Join our community for tips and discussions</p>
                        <a href="#" className={styles.supportLink}>
                          Join Community
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.vendorCard}>
              <div className={styles.vendorHeader}>
                <div className={styles.vendorAvatar}>
                  {mockProduct.vendor.avatar}
                </div>
                <div className={styles.vendorInfo}>
                  <div className={styles.vendorName}>
                    {mockProduct.vendor.name}
                    {mockProduct.vendor.verified && (
                      <Shield size={16} className={styles.verified} />
                    )}
                  </div>
                  <div className={styles.vendorRating}>
                    {renderStars(mockProduct.vendor.rating)}
                    <span>{mockProduct.vendor.rating}</span>
                  </div>
                </div>
              </div>
              <div className={styles.vendorStats}>
                <div className={styles.vendorStat}>
                  <span className={styles.statLabel}>Products</span>
                  <span className={styles.statValue}>47</span>
                </div>
                <div className={styles.vendorStat}>
                  <span className={styles.statLabel}>Sales</span>
                  <span className={styles.statValue}>{mockProduct.vendor.sales}</span>
                </div>
              </div>
              <Button variant="secondary" size="md" className={styles.vendorButton}>
                View Profile
              </Button>
            </div>

            <div className={styles.relatedProducts}>
              <h4>Related Products</h4>
              <div className={styles.relatedList}>
                {mockProduct.relatedProducts.map((product) => (
                  <div key={product.id} className={styles.relatedItem}>
                    <div className={styles.relatedImage}>
                      <div className={styles.relatedImagePlaceholder}>
                        <Code size={20} />
                      </div>
                    </div>
                    <div className={styles.relatedInfo}>
                      <div className={styles.relatedTitle}>{product.title}</div>
                      <div className={styles.relatedRating}>
                        {renderStars(product.rating)}
                        <span>{product.rating}</span>
                      </div>
                      <div className={styles.relatedPrice}>
                        {formatPrice(product.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
