'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Star, 
  Award,
  TrendingUp,
  Zap,
  Code,
  Lightbulb,
  ExternalLink,
  ArrowRight,
  Calendar,
  MapPin,
  Github,
  MessageSquare,
  Hash
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import styles from './Community.module.scss'

// Community stats
const communityStats = [
  { number: '50K+', label: 'Active Members', icon: Users },
  { number: '15K+', label: 'Projects Shared', icon: Code },
  { number: '200+', label: 'Weekly Discussions', icon: MessageCircle },
  { number: '95%', label: 'Satisfaction Rate', icon: Heart }
]

// Community platforms
const platforms = [
  {
    name: 'Discord Server',
    description: 'Real-time chat, voice channels, and instant support from the community',
    members: '25,000+',
    icon: MessageSquare,
    color: '#5865F2',
    href: 'https://discord.gg/autopilot-monster'
  },
  {
    name: 'GitHub Discussions',
    description: 'Technical discussions, feature requests, and open source contributions',
    members: '18,000+',
    icon: Github,
    color: '#333',
    href: 'https://github.com/autopilot-monster/discussions'
  },
  {
    name: 'Slack Workspace',
    description: 'Professional networking and enterprise automation discussions',
    members: '12,000+',
    icon: Hash,
    color: '#4A154B',
    href: 'https://autopilot-monster.slack.com'
  }
]

// Featured community projects
const featuredProjects = [
  {
    id: 'ecommerce-automation',
    title: 'E-commerce Order Automation',
    author: 'Sarah Chen',
    description: 'Complete automation workflow for processing e-commerce orders with inventory management',
    likes: 342,
    downloads: 1250,
    category: 'E-commerce',
    difficulty: 'Intermediate',
    image: '/api/placeholder/300/200'
  },
  {
    id: 'crm-integration',
    title: 'Multi-CRM Data Sync',
    author: 'Marcus Rodriguez',
    description: 'Seamlessly sync customer data across Salesforce, HubSpot, and Pipedrive',
    likes: 287,
    downloads: 890,
    category: 'CRM',
    difficulty: 'Advanced',
    image: '/api/placeholder/300/200'
  },
  {
    id: 'social-media-manager',
    title: 'AI Social Media Manager',
    author: 'Lisa Wang',
    description: 'Automated content creation and posting across multiple social platforms',
    likes: 456,
    downloads: 2100,
    category: 'Marketing',
    difficulty: 'Beginner',
    image: '/api/placeholder/300/200'
  }
]

// Upcoming events
const upcomingEvents = [
  {
    title: 'Automation Workshop: Advanced Workflows',
    date: '2025-02-15',
    time: '2:00 PM PST',
    type: 'Workshop',
    attendees: 250,
    description: 'Deep dive into complex workflow patterns and best practices'
  },
  {
    title: 'Community Showcase: February',
    date: '2025-02-22',
    time: '1:00 PM PST',
    type: 'Showcase',
    attendees: 180,
    description: 'Community members present their latest automation projects'
  },
  {
    title: 'Ask the Experts: Q&A Session',
    date: '2025-03-01',
    time: '3:00 PM PST',
    type: 'Q&A',
    attendees: 320,
    description: 'Live Q&A with Autopilot.monster founders and senior engineers'
  }
]

// Success stories
const successStories = [
  {
    name: 'David Kim',
    role: 'CTO at TechFlow',
    story: 'The Autopilot.monster community helped me reduce our deployment time by 80%. The shared workflows and expert advice were invaluable.',
    avatar: '/api/placeholder/60/60',
    company: 'TechFlow Inc.'
  },
  {
    name: 'Emma Foster',
    role: 'Operations Manager',
    story: 'Found the perfect workflow for our customer support automation. Saved us 40 hours per week and improved customer satisfaction.',
    avatar: '/api/placeholder/60/60',
    company: 'CustomerFirst'
  },
  {
    name: 'James Thompson',
    role: 'Founder',
    story: 'The community guidance helped me scale from a manual startup to fully automated operations. Game-changer for our business.',
    avatar: '/api/placeholder/60/60',
    company: 'AutoScale Solutions'
  }
]

export default function CommunityPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const platformsRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const eventsRef = useRef<HTMLDivElement>(null)
  const storiesRef = useRef<HTMLDivElement>(null)
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const platformsInView = useInView(platformsRef, { once: true, amount: 0.2 })
  const projectsInView = useInView(projectsRef, { once: true, amount: 0.2 })
  const eventsInView = useInView(eventsRef, { once: true, amount: 0.2 })
  const storiesInView = useInView(storiesRef, { once: true, amount: 0.2 })

  return (
    <div className={styles.communityPage}>
      {/* Hero Section */}
      <section className={styles.hero} ref={heroRef}>
        <div className="container">
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 60 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
          >
            <div className={styles.badge}>
              <Users size={16} />
              <span>Join the Movement</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Community of
              <span className={styles.gradient}> Automation Experts</span>
            </h1>
            
            <p className={styles.heroDescription}>
              Connect with 50,000+ developers, entrepreneurs, and automation enthusiasts. 
              Share knowledge, discover new workflows, and build the future of business 
              automation together with like-minded innovators.
            </p>
            
            <div className={styles.heroStats}>
              {communityStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className={styles.stat}
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <stat.icon className={styles.statIcon} />
                  <div className={styles.statNumber}>{stat.number}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
            
            <div className={styles.heroActions}>
              <Button size="lg" variant="primary">
                Join Community
                <ArrowRight size={20} />
              </Button>
              <Button size="lg" variant="outline">
                Explore Projects
                <Code size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className={styles.platforms} ref={platformsRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={platformsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Connect on Your Platform</h2>
            <p>Join the conversation wherever you&apos;re most comfortable</p>
          </motion.div>

          <div className={styles.platformsGrid}>
            {platforms.map((platform, index) => (
              <motion.a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.platformCard}
                initial={{ opacity: 0, y: 40 }}
                animate={platformsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className={styles.platformIcon} style={{ backgroundColor: platform.color }}>
                  <platform.icon size={32} />
                </div>
                <h3>{platform.name}</h3>
                <p>{platform.description}</p>
                <div className={styles.platformMembers}>
                  <Users size={16} />
                  {platform.members} members
                </div>
                <Button variant="outline" size="sm" className={styles.platformCta}>
                  Join Now
                  <ExternalLink size={16} />
                </Button>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className={styles.projects} ref={projectsRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={projectsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Featured Community Projects</h2>
            <p>Discover and contribute to amazing automation workflows</p>
          </motion.div>

          <div className={styles.projectsGrid}>
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className={styles.projectCard}
                initial={{ opacity: 0, y: 40 }}
                animate={projectsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={styles.projectImage}>
                  <img src={project.image} alt={project.title} />
                  <div className={styles.projectCategory}>{project.category}</div>
                </div>
                
                <div className={styles.projectContent}>
                  <h3>{project.title}</h3>
                  <p className={styles.projectAuthor}>by {project.author}</p>
                  <p className={styles.projectDescription}>{project.description}</p>
                  
                  <div className={styles.projectStats}>
                    <div className={styles.projectStat}>
                      <Heart size={14} />
                      {project.likes}
                    </div>
                    <div className={styles.projectStat}>
                      <TrendingUp size={14} />
                      {project.downloads}
                    </div>
                    <div className={styles.projectDifficulty}>
                      {project.difficulty}
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className={styles.projectCta}>
                    View Project
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className={styles.events} ref={eventsRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={eventsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Upcoming Events</h2>
            <p>Join live workshops, Q&A sessions, and community showcases</p>
          </motion.div>

          <div className={styles.eventsList}>
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.title}
                className={styles.eventCard}
                initial={{ opacity: 0, y: 40 }}
                animate={eventsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={styles.eventDate}>
                  <Calendar size={20} />
                  <div>
                    <div className={styles.eventDay}>
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className={styles.eventTime}>{event.time}</div>
                  </div>
                </div>
                
                <div className={styles.eventInfo}>
                  <div className={styles.eventType}>{event.type}</div>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div className={styles.eventAttendees}>
                    <Users size={16} />
                    {event.attendees} attending
                  </div>
                </div>
                
                <Button variant="primary" size="sm">
                  Register
                  <ArrowRight size={16} />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className={styles.stories} ref={storiesRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={storiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Success Stories</h2>
            <p>How our community members are transforming their businesses</p>
          </motion.div>

          <div className={styles.storiesGrid}>
            {successStories.map((story, index) => (
              <motion.div
                key={story.name}
                className={styles.storyCard}
                initial={{ opacity: 0, y: 40 }}
                animate={storiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={styles.storyQuote}>
                  &ldquo;{story.story}&rdquo;
                </div>
                
                <div className={styles.storyAuthor}>
                  <img src={story.avatar} alt={story.name} />
                  <div>
                    <div className={styles.storyName}>{story.name}</div>
                    <div className={styles.storyRole}>{story.role}</div>
                    <div className={styles.storyCompany}>{story.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <motion.div
            className={styles.ctaContent}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={storiesInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2>Ready to Join Our Community?</h2>
            <p>
              Be part of the largest automation community in the world. Share your projects, 
              learn from experts, and accelerate your automation journey with 50,000+ like-minded professionals.
            </p>
            <div className={styles.ctaActions}>
              <Button size="lg" variant="primary">
                Join Discord Community
                        <MessageSquare size={20} />
              </Button>
              <Button size="lg" variant="outline">
                Explore GitHub
                <Github size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
