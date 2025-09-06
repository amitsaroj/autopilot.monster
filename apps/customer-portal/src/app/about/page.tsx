'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'
import { Button } from '@/components/ui/Button/Button'
import { 
  Zap,
  Target,
  Users,
  Award,
  TrendingUp,
  Globe,
  Heart,
  Lightbulb,
  Shield,
  Rocket,
  Star,
  ArrowRight,
  Linkedin,
  Twitter,
  Github,
  Mail,
  Bot
} from 'lucide-react'
import styles from './About.module.scss'

const timeline = [
  {
    year: '2020',
    title: 'The Vision',
    description: 'Founded with a vision to democratize AI automation and make it accessible to businesses of all sizes.',
    icon: Lightbulb
  },
  {
    year: '2021',
    title: 'First AI Agent',
    description: 'Launched our first AI agent for customer support, processing over 10,000 inquiries in the first month.',
    icon: Bot
  },
  {
    year: '2022',
    title: 'Marketplace Launch',
    description: 'Opened our marketplace to third-party creators, expanding our catalog to 1,000+ automation solutions.',
    icon: Globe
  },
  {
    year: '2023',
    title: 'Global Expansion',
    description: 'Expanded to 50+ countries with localized AI agents and workflows for different markets.',
    icon: TrendingUp
  },
  {
    year: '2024',
    title: 'AI Revolution',
    description: 'Reached 5,000+ products and 100,000+ active users, becoming the leading AI automation platform.',
    icon: Rocket
  }
]

const values = [
  {
    title: 'Innovation First',
    description: 'We constantly push the boundaries of what\'s possible with AI and automation technology.',
    icon: Lightbulb,
    color: 'primary'
  },
  {
    title: 'User-Centric',
    description: 'Every decision we make is guided by how it improves the experience for our users and creators.',
    icon: Heart,
    color: 'neural'
  },
  {
    title: 'Quality & Trust',
    description: 'We maintain the highest standards of quality and security in all our products and services.',
    icon: Shield,
    color: 'cyber'
  },
  {
    title: 'Community Driven',
    description: 'Our success is built on the vibrant community of creators, developers, and businesses we serve.',
    icon: Users,
    color: 'accent'
  }
]

const team = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    bio: 'Former AI researcher at Google with 15+ years in machine learning and automation.',
    image: '/api/placeholder/300/300',
    social: {
      linkedin: 'https://linkedin.com/in/sarahchen',
      twitter: 'https://twitter.com/sarahchen',
      github: 'https://github.com/sarahchen'
    }
  },
  {
    name: 'Marcus Rodriguez',
    role: 'CTO & Co-Founder',
    bio: 'Ex-Microsoft engineer specializing in distributed systems and AI infrastructure.',
    image: '/api/placeholder/300/300',
    social: {
      linkedin: 'https://linkedin.com/in/marcusrodriguez',
      twitter: 'https://twitter.com/marcusrod',
      github: 'https://github.com/marcusrod'
    }
  },
  {
    name: 'Dr. Priya Patel',
    role: 'Head of AI Research',
    bio: 'PhD in Computer Science from Stanford, leading our AI research and development efforts.',
    image: '/api/placeholder/300/300',
    social: {
      linkedin: 'https://linkedin.com/in/priyapatel',
      twitter: 'https://twitter.com/priyapatel',
      github: 'https://github.com/priyapatel'
    }
  },
  {
    name: 'Alex Thompson',
    role: 'Head of Product',
    bio: 'Former product manager at Slack, focused on creating intuitive user experiences.',
    image: '/api/placeholder/300/300',
    social: {
      linkedin: 'https://linkedin.com/in/alexthompson',
      twitter: 'https://twitter.com/alexthompson',
      github: 'https://github.com/alexthompson'
    }
  },
  {
    name: 'Elena Volkov',
    role: 'Head of Engineering',
    bio: 'Full-stack engineer with expertise in scalable systems and developer tools.',
    image: '/api/placeholder/300/300',
    social: {
      linkedin: 'https://linkedin.com/in/elenavolkov',
      twitter: 'https://twitter.com/elenavolkov',
      github: 'https://github.com/elenavolkov'
    }
  },
  {
    name: 'David Kim',
    role: 'Head of Design',
    bio: 'Award-winning designer with a passion for creating beautiful, functional interfaces.',
    image: '/api/placeholder/300/300',
    social: {
      linkedin: 'https://linkedin.com/in/davidkim',
      twitter: 'https://twitter.com/davidkim',
      github: 'https://github.com/davidkim'
    }
  }
]

const stats = [
  { number: '5,840+', label: 'AI Products', icon: Bot },
  { number: '100,000+', label: 'Active Users', icon: Users },
  { number: '50+', label: 'Countries', icon: Globe },
  { number: '99.9%', label: 'Uptime', icon: Shield }
]

export default function AboutPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <>
      <Navigation />
      <main className={styles.aboutPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className="container">
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className={styles.badge}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Zap size={16} />
                <span>Empowering the Future of Automation</span>
              </motion.div>

              <h1 className={styles.heroTitle}>
                Building the <span className={styles.gradientText}>Future</span> of AI Automation
              </h1>
              
              <p className={styles.heroDescription}>
                We&apos;re on a mission to democratize AI automation and make intelligent agents 
                accessible to businesses worldwide. Our platform connects creators, developers, 
                and businesses in a thriving ecosystem of innovation.
              </p>

              <div className={styles.heroStats}>
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className={styles.stat}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  >
                    <div className={styles.statIcon}>
                      <stat.icon size={24} />
                    </div>
                    <div className={styles.statNumber}>{stat.number}</div>
                    <div className={styles.statLabel}>{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className={styles.mission} ref={ref}>
          <div className="container">
            <motion.div
              className={styles.missionContent}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8 }}
            >
              <div className={styles.missionText}>
                <h2 className={styles.sectionTitle}>Our Mission</h2>
                <p className={styles.missionDescription}>
                  To accelerate the adoption of AI automation by providing a comprehensive platform 
                  where creators can build, share, and monetize intelligent agents and workflows. 
                  We believe that automation should be accessible to everyone, regardless of technical expertise.
                </p>
                <div className={styles.missionPoints}>
                  <div className={styles.missionPoint}>
                    <Target size={20} />
                    <span>Democratize AI automation for businesses of all sizes</span>
                  </div>
                  <div className={styles.missionPoint}>
                    <Users size={20} />
                    <span>Foster a global community of creators and innovators</span>
                  </div>
                  <div className={styles.missionPoint}>
                    <Award size={20} />
                    <span>Maintain the highest standards of quality and security</span>
                  </div>
                </div>
              </div>
              <div className={styles.missionVisual}>
                <div className={styles.visualPlaceholder}>
                  <Rocket size={80} />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className={styles.values}>
          <div className="container">
            <motion.div
              className={styles.sectionHeader}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={styles.sectionTitle}>Our Values</h2>
              <p className={styles.sectionDescription}>
                The principles that guide everything we do and shape our culture.
              </p>
            </motion.div>

            <motion.div
              className={styles.valuesGrid}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className={`${styles.valueCard} ${styles[value.color]}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -8 }}
                >
                  <div className={styles.valueIcon}>
                    <value.icon size={32} />
                  </div>
                  <h3 className={styles.valueTitle}>{value.title}</h3>
                  <p className={styles.valueDescription}>{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className={styles.timeline}>
          <div className="container">
            <motion.div
              className={styles.sectionHeader}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={styles.sectionTitle}>Our Journey</h2>
              <p className={styles.sectionDescription}>
                From a small startup to the world&apos;s leading AI automation platform.
              </p>
            </motion.div>

            <motion.div
              className={styles.timelineContainer}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  className={styles.timelineItem}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <div className={styles.timelineYear}>{item.year}</div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineIcon}>
                      <item.icon size={24} />
                    </div>
                    <h3 className={styles.timelineTitle}>{item.title}</h3>
                    <p className={styles.timelineDescription}>{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className={styles.team}>
          <div className="container">
            <motion.div
              className={styles.sectionHeader}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={styles.sectionTitle}>Meet Our Team</h2>
              <p className={styles.sectionDescription}>
                The brilliant minds behind Autopilot.monster, working together to shape the future of automation.
              </p>
            </motion.div>

            <motion.div
              className={styles.teamGrid}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  className={styles.teamCard}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -8 }}
                >
                  <div className={styles.memberImage}>
                    <div className={styles.imagePlaceholder}>
                      <Users size={40} />
                    </div>
                  </div>
                  <div className={styles.memberInfo}>
                    <h3 className={styles.memberName}>{member.name}</h3>
                    <div className={styles.memberRole}>{member.role}</div>
                    <p className={styles.memberBio}>{member.bio}</p>
                    <div className={styles.memberSocial}>
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin size={18} />
                      </a>
                      <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter size={18} />
                      </a>
                      <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                        <Github size={18} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <div className="container">
            <motion.div
              className={styles.ctaContent}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className={styles.ctaTitle}>Join Our Mission</h2>
              <p className={styles.ctaDescription}>
                Ready to be part of the automation revolution? Whether you&apos;re a creator, 
                developer, or business owner, there&apos;s a place for you in our community.
              </p>
              <div className={styles.ctaButtons}>
                <Button variant="primary" size="lg">
                  Start Building
                  <ArrowRight size={20} />
                </Button>
                <Button variant="ghost" size="lg">
                  Join Community
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}