'use client'

import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Heart,
  Coffee,
  Wifi,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Award,
  ArrowRight,
  Send,
  User,
  Mail,
  FileText,
  Upload,
  CheckCircle,
  Building
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import styles from './Careers.module.scss'

// Metadata for this page - should be handled by layout or metadata API
// export const metadata = {
//   title: 'Careers | Autopilot.monster - Join Our AI Revolution',
//   description: 'Join the team building the future of AI automation. Explore exciting career opportunities at Autopilot.monster with competitive benefits, remote work options, and cutting-edge technology.',
//   keywords: ['careers', 'jobs', 'AI careers', 'remote work', 'software engineering', 'automation careers'],
// }

// Job openings data
const jobOpenings = [
  {
    id: 'senior-fullstack-engineer',
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'Remote / San Francisco',
    type: 'Full-time',
    salary: '$140k - $180k',
    experience: '5+ years',
    description: 'Lead the development of our next-generation AI automation platform. Work with React, Node.js, Python, and cutting-edge AI technologies.',
    requirements: [
      'Expert knowledge of React, TypeScript, and Node.js',
      'Experience with AI/ML platforms and APIs',
      'Strong background in distributed systems',
      'Previous experience with automation platforms preferred',
      'Excellent communication and leadership skills'
    ],
    benefits: ['Equity package', 'Health insurance', 'Remote-first', 'Learning budget']
  },
  {
    id: 'ai-research-scientist',
    title: 'AI Research Scientist',
    department: 'Research',
    location: 'Remote / London',
    type: 'Full-time',
    salary: '$160k - $220k',
    experience: '7+ years',
    description: 'Pioneer breakthrough AI research in autonomous agents and workflow automation. PhD in ML/AI with publications in top-tier conferences.',
    requirements: [
      'PhD in Machine Learning, AI, or related field',
      'Published research in NLP, RL, or autonomous agents',
      'Experience with PyTorch, TensorFlow, and MLOps',
      'Track record of productizing research',
      'Passion for solving real-world automation challenges'
    ],
    benefits: ['Research budget', 'Conference travel', 'Publication bonuses', 'Sabbatical program']
  },
  {
    id: 'product-designer',
    title: 'Senior Product Designer',
    department: 'Design',
    location: 'Remote / New York',
    type: 'Full-time',
    salary: '$120k - $160k',
    experience: '4+ years',
    description: 'Shape the user experience of AI automation tools used by millions. Create intuitive interfaces for complex enterprise workflows.',
    requirements: [
      'Strong portfolio of B2B product design',
      'Experience with design systems and component libraries',
      'Proficiency in Figma, Sketch, and prototyping tools',
      'Understanding of developer workflows and tools',
      'Experience with user research and testing'
    ],
    benefits: ['Design conference budget', 'Latest design tools', 'Flexible hours', 'Wellness stipend']
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Remote / Berlin',
    type: 'Full-time',
    salary: '$130k - $170k',
    experience: '5+ years',
    description: 'Build and maintain the infrastructure powering millions of AI automations. Work with Kubernetes, AWS, and cutting-edge deployment technologies.',
    requirements: [
      'Expert knowledge of Kubernetes and container orchestration',
      'Deep experience with AWS/GCP cloud platforms',
      'Infrastructure as Code (Terraform, CloudFormation)',
      'CI/CD pipeline design and optimization',
      'Security best practices and compliance experience'
    ],
    benefits: ['Cloud certification budget', 'Home office setup', 'Flexible PTO', 'Stock options']
  },
  {
    id: 'customer-success-manager',
    title: 'Enterprise Customer Success Manager',
    department: 'Customer Success',
    location: 'Remote / Austin',
    type: 'Full-time',
    salary: '$90k - $120k',
    experience: '3+ years',
    description: 'Drive success for our enterprise customers, ensuring they achieve maximum value from our AI automation platform.',
    requirements: [
      'Experience with enterprise B2B customer success',
      'Technical background with ability to understand APIs',
      'Track record of driving customer expansion',
      'Excellent communication and presentation skills',
      'Experience with automation or workflow tools'
    ],
    benefits: ['Commission structure', 'Customer conference travel', 'Professional development', 'Team retreats']
  },
  {
    id: 'content-marketing-manager',
    title: 'Senior Content Marketing Manager',
    department: 'Marketing',
    location: 'Remote / Toronto',
    type: 'Full-time',
    salary: '$80k - $110k',
    experience: '4+ years',
    description: 'Create compelling content that educates developers and businesses about AI automation. Lead our thought leadership and SEO strategy.',
    requirements: [
      'Strong technical writing and content strategy experience',
      'Understanding of developer and enterprise audiences',
      'SEO expertise and content distribution experience',
      'Experience with automation, AI, or B2B SaaS',
      'Portfolio of successful content campaigns'
    ],
    benefits: ['Content tool budget', 'Speaking opportunities', 'Flexible schedule', 'Growth opportunities']
  }
]

// Company benefits
const benefits = [
  {
    icon: Heart,
    title: 'Health & Wellness',
    items: ['Premium health insurance', 'Mental health support', 'Fitness stipend', 'Annual health checkups']
  },
  {
    icon: Globe,
    title: 'Remote-First Culture',
    items: ['Work from anywhere', 'Home office setup budget', 'Co-working space allowance', 'Annual team retreats']
  },
  {
    icon: TrendingUp,
    title: 'Growth & Learning',
    items: ['$3,000 learning budget', 'Conference attendance', 'Internal training programs', 'Mentorship opportunities']
  },
  {
    icon: DollarSign,
    title: 'Financial Benefits',
    items: ['Competitive equity package', 'Performance bonuses', '401(k) matching', 'Stock option program']
  },
  {
    icon: Clock,
    title: 'Work-Life Balance',
    items: ['Flexible working hours', 'Unlimited PTO policy', '4-day work week options', 'Sabbatical program']
  },
  {
    icon: Users,
    title: 'Team & Culture',
    items: ['Diverse & inclusive team', 'Regular team events', 'Open communication', 'Innovation time (20%)']
  }
]

// Company perks
const perks = [
  { icon: Coffee, text: 'Premium coffee & snacks' },
  { icon: Wifi, text: 'High-speed internet stipend' },
  { icon: Shield, text: 'Comprehensive insurance' },
  { icon: Award, text: 'Performance recognition' },
  { icon: Building, text: 'Office space in major cities' },
  { icon: Zap, text: 'Latest tech equipment' }
]

export default function CareersPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)
  const jobsRef = useRef<HTMLDivElement>(null)
  const applicationRef = useRef<HTMLDivElement>(null)
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const benefitsInView = useInView(benefitsRef, { once: true, amount: 0.2 })
  const jobsInView = useInView(jobsRef, { once: true, amount: 0.2 })
  const applicationInView = useInView(applicationRef, { once: true, amount: 0.2 })
  
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [applicationForm, setApplicationForm] = useState<{
    name: string
    email: string
    resume: File | null
    coverLetter: string
    portfolio: string
  }>({
    name: '',
    email: '',
    resume: null,
    coverLetter: '',
    portfolio: ''
  })

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle application submission
    console.log('Application submitted:', applicationForm)
  }

  return (
    <div className={styles.careersPage}>
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
              <Briefcase size={16} />
              <span>We&apos;re Hiring!</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Join the AI Revolution.
              <span className={styles.gradient}> Shape the Future.</span>
            </h1>
            
            <p className={styles.heroDescription}>
              Be part of a mission-driven team building the world&apos;s most powerful AI automation platform. 
              Work alongside industry veterans, solve complex challenges, and impact millions of businesses worldwide. 
              Your next career breakthrough starts here.
            </p>
            
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>50+</div>
                <div className={styles.statLabel}>Team Members</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>15</div>
                <div className={styles.statLabel}>Countries</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>4.9/5</div>
                <div className={styles.statLabel}>Employee Rating</div>
              </div>
            </div>
            
            <div className={styles.heroActions}>
              <Button size="lg" variant="primary">
                View Open Positions
                <ArrowRight size={20} />
              </Button>
              <Button size="lg" variant="outline">
                Learn About Culture
                <Users size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits} ref={benefitsRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Why Join Autopilot.monster?</h2>
            <p>We believe in taking care of our team so they can do their best work</p>
          </motion.div>

          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className={styles.benefitCard}
                initial={{ opacity: 0, y: 40 }}
                animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={styles.benefitIcon}>
                  <benefit.icon size={32} />
                </div>
                <h3>{benefit.title}</h3>
                <ul className={styles.benefitList}>
                  {benefit.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <CheckCircle size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            className={styles.perks}
            initial={{ opacity: 0, y: 40 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3>Additional Perks</h3>
            <div className={styles.perksList}>
              {perks.map((perk, index) => (
                <div key={index} className={styles.perk}>
                  <perk.icon size={20} />
                  <span>{perk.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Job Openings */}
      <section className={styles.jobs} ref={jobsRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={jobsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Open Positions</h2>
            <p>Find your perfect role and join our growing team</p>
          </motion.div>

          <div className={styles.jobsList}>
            {jobOpenings.map((job, index) => (
              <motion.div
                key={job.id}
                className={`${styles.jobCard} ${selectedJob === job.id ? styles.expanded : ''}`}
                initial={{ opacity: 0, y: 40 }}
                animate={jobsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={styles.jobHeader} onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}>
                  <div className={styles.jobBasic}>
                    <h3>{job.title}</h3>
                    <div className={styles.jobMeta}>
                      <span className={styles.department}>{job.department}</span>
                      <span className={styles.location}>
                        <MapPin size={16} />
                        {job.location}
                      </span>
                      <span className={styles.type}>
                        <Clock size={16} />
                        {job.type}
                      </span>
                      <span className={styles.salary}>
                        <DollarSign size={16} />
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {selectedJob === job.id ? 'Close' : 'View Details'}
                  </Button>
                </div>

                {selectedJob === job.id && (
                  <motion.div
                    className={styles.jobDetails}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.jobDescription}>
                      <h4>About the Role</h4>
                      <p>{job.description}</p>
                    </div>

                    <div className={styles.jobRequirements}>
                      <h4>Requirements</h4>
                      <ul>
                        {job.requirements.map((req, reqIndex) => (
                          <li key={reqIndex}>
                            <CheckCircle size={16} />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={styles.jobBenefits}>
                      <h4>Key Benefits</h4>
                      <div className={styles.benefitTags}>
                        {job.benefits.map((benefit, benIndex) => (
                          <span key={benIndex} className={styles.benefitTag}>
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={styles.jobActions}>
                      <Button size="lg" variant="primary">
                        Apply Now
                        <Send size={18} />
                      </Button>
                      <Button size="lg" variant="outline">
                        Save Job
                        <Heart size={18} />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className={styles.application} ref={applicationRef}>
        <div className="container">
          <motion.div
            className={styles.applicationContent}
            initial={{ opacity: 0, y: 40 }}
            animate={applicationInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.applicationText}>
              <h2>Don&apos;t See Your Perfect Role?</h2>
              <p>
                We&apos;re always looking for exceptional talent. Send us your information and we&apos;ll 
                reach out when we have opportunities that match your skills and interests.
              </p>
            </div>

            <form className={styles.applicationForm} onSubmit={handleApplicationSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Full Name</label>
                  <div className={styles.inputWrapper}>
                    <User size={20} />
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={applicationForm.name}
                      onChange={(e) => setApplicationForm({...applicationForm, name: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email Address</label>
                  <div className={styles.inputWrapper}>
                    <Mail size={20} />
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={applicationForm.email}
                      onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="portfolio">Portfolio/LinkedIn URL</label>
                  <div className={styles.inputWrapper}>
                    <Globe size={20} />
                    <input
                      id="portfolio"
                      type="url"
                      placeholder="https://yourportfolio.com"
                      value={applicationForm.portfolio}
                      onChange={(e) => setApplicationForm({...applicationForm, portfolio: e.target.value})}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="resume">Resume/CV</label>
                  <div className={styles.fileUpload}>
                    <Upload size={20} />
                    <span>Click to upload or drag and drop</span>
                    <input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setApplicationForm({...applicationForm, resume: e.target.files?.[0] || null})}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="coverLetter">Tell us about yourself</label>
                  <div className={styles.textareaWrapper}>
                    <FileText size={20} />
                    <textarea
                      id="coverLetter"
                      placeholder="What excites you about AI automation? What would you bring to our team?"
                      rows={4}
                      value={applicationForm.coverLetter}
                      onChange={(e) => setApplicationForm({...applicationForm, coverLetter: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" variant="primary" className={styles.submitButton}>
                Submit Application
                <Send size={20} />
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
