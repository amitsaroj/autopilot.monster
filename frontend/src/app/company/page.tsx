'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Target, 
  Eye, 
  Heart, 
  Award, 
  Users, 
  Globe,
  Zap,
  TrendingUp,
  Shield,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Calendar,
  MapPin,
  Linkedin,
  Twitter,
  Github,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import styles from './Company.module.scss'

// Metadata for this page - should be handled by layout or metadata API
// export const metadata = {
//   title: 'Company | Autopilot.monster - Leading AI Automation Platform',
//   description: 'Learn about Autopilot.monster - the pioneering AI automation platform empowering businesses worldwide. Discover our mission, vision, leadership team, and 50+ years of combined innovation.',
//   keywords: ['company profile', 'AI automation', 'leadership team', 'innovation', 'enterprise automation', 'business mission'],
// }

// Company timeline data
const timeline = [
  {
    year: '2019',
    title: 'Foundation & Vision',
    description: 'Founded by veteran engineers with 50+ years combined experience in AI and automation. Started with a mission to democratize AI for businesses of all sizes.',
    milestone: 'Company Founded',
    achievements: ['Seed funding secured', 'Core team assembled', 'First MVP developed']
  },
  {
    year: '2020',
    title: 'Product Development',
    description: 'Launched our first AI agent marketplace with 50+ automation tools. Focused on no-code solutions for small and medium businesses.',
    milestone: 'Platform Launch',
    achievements: ['1,000+ early adopters', '50+ AI agents available', 'n8n integration completed']
  },
  {
    year: '2021',
    title: 'Market Expansion',
    description: 'Scaled to serve enterprise clients and expanded globally. Introduced advanced workflow automation and enterprise security features.',
    milestone: 'Global Expansion',
    achievements: ['Series A funding', '10,000+ active users', '15 countries served']
  },
  {
    year: '2022',
    title: 'Enterprise Focus',
    description: 'Launched enterprise-grade features including SSO, advanced analytics, and custom integrations. Achieved SOC 2 Type II compliance.',
    milestone: 'Enterprise Ready',
    achievements: ['SOC 2 compliance', '100+ enterprise clients', '99.9% uptime achieved']
  },
  {
    year: '2023',
    title: 'AI Innovation',
    description: 'Introduced next-generation AI capabilities with GPT integration and custom model support. Launched our developer platform and APIs.',
    milestone: 'AI Revolution',
    achievements: ['500+ integrations', '50M+ API calls/month', 'Developer ecosystem launch']
  },
  {
    year: '2024',
    title: 'Industry Leadership',
    description: 'Recognized as the leading AI automation platform. Serving Fortune 500 companies and processing billions of automated tasks monthly.',
    milestone: 'Market Leader',
    achievements: ['50,000+ businesses served', '1B+ tasks automated', 'Industry awards received']
  }
]

// Leadership team data
const leadership = [
  {
    name: 'Dr. Sarah Chen',
    position: 'Chief Executive Officer & Co-Founder',
    bio: 'Former VP of AI at Google, PhD in Computer Science from Stanford. 20+ years in AI research and product development. Led teams that built foundational ML infrastructure used by billions.',
    image: '/api/placeholder/400/400',
    linkedin: 'https://linkedin.com/in/sarahchen',
    twitter: 'https://twitter.com/sarahchen',
    achievements: ['Forbes 40 Under 40', 'MIT Technology Review Innovator', '15+ AI patents']
  },
  {
    name: 'Marcus Rodriguez',
    position: 'Chief Technology Officer & Co-Founder',
    bio: 'Ex-Principal Engineer at Microsoft Azure, architected cloud systems serving 100M+ users. Expert in distributed systems, microservices, and enterprise-scale automation platforms.',
    image: '/api/placeholder/400/400',
    linkedin: 'https://linkedin.com/in/marcusrodriguez',
    github: 'https://github.com/marcusrodriguez',
    achievements: ['Microsoft MVP', 'Cloud Architecture Expert', 'Open Source Contributor']
  },
  {
    name: 'Dr. James Thompson',
    position: 'Chief AI Officer',
    bio: 'Former Research Scientist at DeepMind, PhD in Machine Learning from Oxford. Pioneered breakthrough research in autonomous agents and reinforcement learning applications.',
    image: '/api/placeholder/400/400',
    linkedin: 'https://linkedin.com/in/jamesthompson',
    achievements: ['Nature Publications', 'AI Ethics Board Member', '50+ Research Papers']
  },
  {
    name: 'Lisa Wang',
    position: 'Chief Operating Officer',
    bio: 'Former Director of Operations at Stripe, scaled operations from startup to $95B valuation. Expert in building global teams and operational excellence at scale.',
    image: '/api/placeholder/400/400',
    linkedin: 'https://linkedin.com/in/lisawang',
    achievements: ['Operations Excellence Award', 'Scaling Expert', 'Board Advisor']
  },
  {
    name: 'David Kim',
    position: 'Chief Security Officer',
    bio: 'Ex-CISO at Cloudflare, 15+ years in cybersecurity and compliance. Led security teams protecting infrastructure serving 25M+ internet properties globally.',
    image: '/api/placeholder/400/400',
    linkedin: 'https://linkedin.com/in/davidkim',
    achievements: ['Security Innovation Award', 'CISSP Certified', 'Zero-Trust Pioneer']
  },
  {
    name: 'Emma Foster',
    position: 'Chief Customer Officer',
    bio: 'Former VP Customer Success at Salesforce, built customer success programs serving 150,000+ companies. Expert in customer-centric growth and retention strategies.',
    image: '/api/placeholder/400/400',
    linkedin: 'https://linkedin.com/in/emmafoster',
    achievements: ['Customer Success Leader', 'Retention Expert', 'Growth Strategist']
  }
]

// Company values
const values = [
  {
    icon: Lightbulb,
    title: 'Innovation First',
    description: 'We push the boundaries of what&apos;s possible with AI and automation, constantly exploring new frontiers to solve complex business challenges.',
    color: '#FFD700'
  },
  {
    icon: Users,
    title: 'Customer Obsession',
    description: 'Every decision starts with our customers. We build solutions that genuinely solve real problems and deliver measurable business value.',
    color: '#4ECDC4'
  },
  {
    icon: Shield,
    title: 'Trust & Security',
    description: 'Security and privacy are foundational to everything we build. We earn trust through transparency, compliance, and unwavering data protection.',
    color: '#45B7D1'
  },
  {
    icon: Heart,
    title: 'Inclusive Excellence',
    description: 'We foster a culture where diverse perspectives drive innovation. Everyone contributes to our mission of democratizing AI automation.',
    color: '#FF6B6B'
  },
  {
    icon: TrendingUp,
    title: 'Sustainable Growth',
    description: 'We build for the long term, creating sustainable value for customers, employees, and stakeholders while being responsible stewards of technology.',
    color: '#96CEB4'
  },
  {
    icon: Globe,
    title: 'Global Impact',
    description: 'Our platform empowers businesses worldwide to achieve more through automation, creating economic opportunities and driving positive change.',
    color: '#FECA57'
  }
]

// Company stats
const companyStats = [
  { number: '50,000+', label: 'Businesses Served', icon: Users },
  { number: '1B+', label: 'Tasks Automated', icon: Zap },
  { number: '99.9%', label: 'Platform Uptime', icon: Shield },
  { number: '500+', label: 'Integrations', icon: Globe },
  { number: '50M+', label: 'API Calls/Month', icon: TrendingUp },
  { number: '15', label: 'Countries', icon: MapPin }
]

export default function CompanyPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const leadershipRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const missionInView = useInView(missionRef, { once: true, amount: 0.3 })
  const timelineInView = useInView(timelineRef, { once: true, amount: 0.2 })
  const leadershipInView = useInView(leadershipRef, { once: true, amount: 0.2 })
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.2 })
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 })

  return (
    <div className={styles.companyPage}>
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
              <Award size={16} />
              <span>Leading AI Automation Platform</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Building the Future of
              <span className={styles.gradient}> Business Automation</span>
            </h1>
            
            <p className={styles.heroDescription}>
              Founded by industry veterans with 50+ years combined experience, Autopilot.monster 
              empowers businesses worldwide to achieve more through intelligent automation. 
              We&apos;re democratizing AI to create a world where every business can operate at the speed of innovation.
            </p>
            
            <div className={styles.heroActions}>
              <Button size="lg" variant="primary">
                Join Our Mission
                <ArrowRight size={20} />
              </Button>
              <Button size="lg" variant="outline">
                Meet the Team
                <Users size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Company Stats */}
      <section className={styles.stats} ref={statsRef}>
        <div className="container">
          <motion.div
            className={styles.statsGrid}
            initial={{ opacity: 0, y: 40 }}
            animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            {companyStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className={styles.statCard}
                initial={{ opacity: 0, y: 40 }}
                animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <stat.icon className={styles.statIcon} />
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={styles.mission} ref={missionRef}>
        <div className="container">
          <div className={styles.missionGrid}>
            <motion.div
              className={styles.missionCard}
              initial={{ opacity: 0, x: -40 }}
              animate={missionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.missionIcon}>
                <Target size={32} />
              </div>
              <h3>Our Mission</h3>
              <p>
                To democratize artificial intelligence and automation, empowering businesses of all sizes 
                to achieve operational excellence, drive innovation, and create meaningful impact in their industries. 
                We believe every business deserves access to enterprise-grade AI tools without the complexity.
              </p>
              <div className={styles.missionPoints}>
                <div className={styles.point}>
                  <CheckCircle size={16} />
                  <span>Accessible AI for everyone</span>
                </div>
                <div className={styles.point}>
                  <CheckCircle size={16} />
                  <span>No-code automation solutions</span>
                </div>
                <div className={styles.point}>
                  <CheckCircle size={16} />
                  <span>Enterprise-grade security</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className={styles.missionCard}
              initial={{ opacity: 0, x: 40 }}
              animate={missionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={styles.missionIcon}>
                <Eye size={32} />
              </div>
              <h3>Our Vision</h3>
              <p>
                A world where intelligent automation liberates human potential, enabling businesses to focus on 
                creativity, strategy, and innovation while AI handles repetitive tasks. We envision a future where 
                every organization operates with the efficiency of tech giants, regardless of their size or industry.
              </p>
              <div className={styles.missionPoints}>
                <div className={styles.point}>
                  <CheckCircle size={16} />
                  <span>Global automation adoption</span>
                </div>
                <div className={styles.point}>
                  <CheckCircle size={16} />
                  <span>Human-AI collaboration</span>
                </div>
                <div className={styles.point}>
                  <CheckCircle size={16} />
                  <span>Sustainable business growth</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className={styles.timeline} ref={timelineRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={timelineInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Our Journey</h2>
            <p>From startup to industry leader - the milestones that shaped our success</p>
          </motion.div>

          <div className={styles.timelineContainer}>
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                className={styles.timelineItem}
                initial={{ opacity: 0, y: 40 }}
                animate={timelineInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className={styles.timelineYear}>{item.year}</div>
                <div className={styles.timelineContent}>
                  <h3>{item.title}</h3>
                  <div className={styles.timelineMilestone}>{item.milestone}</div>
                  <p>{item.description}</p>
                  <div className={styles.achievements}>
                    {item.achievements.map((achievement, achIndex) => (
                      <div key={achIndex} className={styles.achievement}>
                        <CheckCircle size={16} />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className={styles.leadership} ref={leadershipRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={leadershipInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Leadership Team</h2>
            <p>Visionary leaders with decades of experience building world-class technology</p>
          </motion.div>

          <div className={styles.leadershipGrid}>
            {leadership.map((leader, index) => (
              <motion.div
                key={leader.name}
                className={styles.leaderCard}
                initial={{ opacity: 0, y: 40 }}
                animate={leadershipInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className={styles.leaderImage}>
                  <img src={leader.image} alt={leader.name} />
                </div>
                <div className={styles.leaderInfo}>
                  <h3>{leader.name}</h3>
                  <p className={styles.leaderPosition}>{leader.position}</p>
                  <p className={styles.leaderBio}>{leader.bio}</p>
                  <div className={styles.leaderAchievements}>
                    {leader.achievements.map((achievement, achIndex) => (
                      <span key={achIndex} className={styles.achievementTag}>
                        {achievement}
                      </span>
                    ))}
                  </div>
                  <div className={styles.leaderSocial}>
                    {leader.linkedin && (
                      <a href={leader.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin size={18} />
                      </a>
                    )}
                    {leader.twitter && (
                      <a href={leader.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter size={18} />
                      </a>
                    )}
                    {leader.github && (
                      <a href={leader.github} target="_blank" rel="noopener noreferrer">
                        <Github size={18} />
                      </a>
                    )}
                    <a href={`mailto:${leader.name.toLowerCase().replace(' ', '.')}@autopilot.monster`}>
                      <Mail size={18} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className={styles.values} ref={valuesRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Our Values</h2>
            <p>The principles that guide everything we do</p>
          </motion.div>

          <div className={styles.valuesGrid}>
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className={styles.valueCard}
                initial={{ opacity: 0, y: 40 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={styles.valueIcon} style={{ backgroundColor: value.color }}>
                  <value.icon size={24} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
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
            animate={valuesInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2>Ready to Join Our Mission?</h2>
            <p>
              We&apos;re always looking for passionate individuals who want to shape the future of automation. 
              Whether you&apos;re a developer, designer, or business professional, there&apos;s a place for you at Autopilot.monster.
            </p>
            <div className={styles.ctaActions}>
              <Button size="lg" variant="primary">
                View Open Positions
                <ArrowRight size={20} />
              </Button>
              <Button size="lg" variant="outline">
                Contact Us
                <Mail size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
