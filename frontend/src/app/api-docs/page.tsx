'use client'

import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Code, 
  BookOpen, 
  Key, 
  Globe, 
  Zap,
  Copy,
  Check,
  Terminal,
  Database,
  Shield,
  Clock,
  Users,
  ArrowRight,
  ChevronRight,
  Play,
  Download,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import styles from './ApiDocs.module.scss'

// Metadata for this page - should be handled by layout or metadata API
// export const metadata = {
//   title: 'API Documentation | Autopilot.monster - Developer Resources',
//   description: 'Comprehensive API documentation for Autopilot.monster. Get started with our RESTful APIs, webhooks, and SDKs. Includes authentication guides, code examples, and best practices.',
//   keywords: ['API documentation', 'REST API', 'developer guide', 'webhooks', 'SDKs', 'authentication'],
// }

// API endpoints data
const apiEndpoints = [
  {
    method: 'GET',
    endpoint: '/api/v1/agents',
    description: 'Retrieve a list of available AI agents',
    params: [
      { name: 'category', type: 'string', required: false, description: 'Filter by agent category' },
      { name: 'limit', type: 'integer', required: false, description: 'Number of results (default: 20, max: 100)' },
      { name: 'offset', type: 'integer', required: false, description: 'Number of results to skip' }
    ],
    response: {
      agents: [
        {
          id: 'agent_1234567890',
          name: 'Content Generator Pro',
          category: 'content',
          price: 29.99,
          downloads: 15420
        }
      ]
    }
  },
  {
    method: 'POST',
    endpoint: '/api/v1/agents/deploy',
    description: 'Deploy an AI agent to your infrastructure',
    params: [
      { name: 'agent_id', type: 'string', required: true, description: 'Unique identifier of the agent' },
      { name: 'environment', type: 'string', required: false, description: 'Deployment environment (staging, production)' },
      { name: 'config', type: 'object', required: false, description: 'Custom configuration parameters' }
    ],
    response: {
      deployment_id: 'dep_9876543210',
      status: 'deploying',
      estimated_time: '2-3 minutes'
    }
  },
  {
    method: 'GET',
    endpoint: '/api/v1/workflows',
    description: 'List available n8n workflows',
    params: [
      { name: 'category', type: 'string', required: false, description: 'Filter by workflow category' },
      { name: 'complexity', type: 'string', required: false, description: 'Filter by complexity level' }
    ],
    response: {
      workflows: [
        {
          id: 'workflow_abc123',
          name: 'Customer Support Automation',
          category: 'support',
          complexity: 'intermediate'
        }
      ]
    }
  }
]

// Code examples
const codeExamples = {
  curl: `# Authentication
curl -X GET "https://api.autopilot.monster/v1/agents" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"

# Deploy an agent
curl -X POST "https://api.autopilot.monster/v1/agents/deploy" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "agent_1234567890",
    "environment": "production",
    "config": {
      "auto_scaling": true,
      "max_instances": 10
    }
  }'`,
  
  nodejs: `// Node.js with axios
const axios = require('axios');

const autopilot = axios.create({
  baseURL: 'https://api.autopilot.monster/v1',
  headers: {
    'Authorization': \`Bearer \${process.env.AUTOPILOT_API_KEY}\`,
    'Content-Type': 'application/json'
  }
});

// Get available agents
async function getAgents() {
  try {
    const response = await autopilot.get('/agents', {
      params: {
        category: 'content',
        limit: 10
      }
    });
    return response.data.agents;
  } catch (error) {
    console.error('Error fetching agents:', error.response.data);
  }
}

// Deploy an agent
async function deployAgent(agentId, config = {}) {
  try {
    const response = await autopilot.post('/agents/deploy', {
      agent_id: agentId,
      environment: 'production',
      config
    });
    return response.data;
  } catch (error) {
    console.error('Deployment failed:', error.response.data);
  }
}`,

  python: `# Python with requests
import requests
import os

class AutopilotAPI:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv('AUTOPILOT_API_KEY')
        self.base_url = 'https://api.autopilot.monster/v1'
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
    
    def get_agents(self, category=None, limit=20):
        """Retrieve available AI agents"""
        params = {'limit': limit}
        if category:
            params['category'] = category
            
        response = requests.get(
            f'{self.base_url}/agents',
            headers=self.headers,
            params=params
        )
        response.raise_for_status()
        return response.json()['agents']
    
    def deploy_agent(self, agent_id, environment='production', config=None):
        """Deploy an AI agent"""
        payload = {
            'agent_id': agent_id,
            'environment': environment
        }
        if config:
            payload['config'] = config
            
        response = requests.post(
            f'{self.base_url}/agents/deploy',
            headers=self.headers,
            json=payload
        )
        response.raise_for_status()
        return response.json()

# Usage example
api = AutopilotAPI()
agents = api.get_agents(category='content', limit=5)
deployment = api.deploy_agent('agent_1234567890', config={
    'auto_scaling': True,
    'max_instances': 10
})`
}

// SDK downloads
const sdks = [
  { name: 'Node.js SDK', version: '2.1.4', downloads: '125K+', icon: '📦', installCmd: 'npm install @autopilot/sdk' },
  { name: 'Python SDK', version: '1.8.2', downloads: '89K+', icon: '🐍', installCmd: 'pip install autopilot-sdk' },
  { name: 'Go SDK', version: '1.3.1', downloads: '45K+', icon: '🔷', installCmd: 'go get github.com/autopilot/go-sdk' },
  { name: 'PHP SDK', version: '1.2.0', downloads: '32K+', icon: '🐘', installCmd: 'composer require autopilot/sdk' }
]

export default function ApiDocsPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const quickstartRef = useRef<HTMLDivElement>(null)
  const endpointsRef = useRef<HTMLDivElement>(null)
  const sdksRef = useRef<HTMLDivElement>(null)
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const quickstartInView = useInView(quickstartRef, { once: true, amount: 0.2 })
  const endpointsInView = useInView(endpointsRef, { once: true, amount: 0.2 })
  const sdksInView = useInView(sdksRef, { once: true, amount: 0.2 })
  
  const [activeTab, setActiveTab] = useState('curl')
  const [copiedCode, setCopiedCode] = useState('')

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(type)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  return (
    <div className={styles.apiDocsPage}>
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
              <Code size={16} />
              <span>Developer-First Platform</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              API Documentation
              <span className={styles.gradient}> & Developer Resources</span>
            </h1>
            
            <p className={styles.heroDescription}>
              Build powerful automation solutions with our comprehensive RESTful APIs. 
              Deploy AI agents, manage workflows, and integrate seamlessly with enterprise-grade 
              infrastructure. Get started in minutes with our detailed guides and SDKs.
            </p>
            
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>99.9%</div>
                <div className={styles.statLabel}>API Uptime</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>50ms</div>
                <div className={styles.statLabel}>Avg Response</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>500M+</div>
                <div className={styles.statLabel}>API Calls/Month</div>
              </div>
            </div>
            
            <div className={styles.heroActions}>
              <Button size="lg" variant="primary">
                Get API Key
                <Key size={20} />
              </Button>
              <Button size="lg" variant="outline">
                <Play size={18} />
                Interactive Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Start */}
      <section className={styles.quickstart} ref={quickstartRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={quickstartInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Quick Start Guide</h2>
            <p>Get up and running with the Autopilot.monster API in under 5 minutes</p>
          </motion.div>

          <div className={styles.quickstartGrid}>
            <motion.div
              className={styles.quickstartSteps}
              initial={{ opacity: 0, x: -40 }}
              animate={quickstartInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h3>Get Your API Key</h3>
                  <p>Sign up for a free account and generate your API key from the dashboard.</p>
                  <Button variant="outline" size="sm">
                    Generate Key
                    <Key size={16} />
                  </Button>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h3>Install SDK (Optional)</h3>
                  <p>Choose from our official SDKs or use standard HTTP requests.</p>
                  <Button variant="outline" size="sm">
                    View SDKs
                    <Download size={16} />
                  </Button>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h3>Make Your First Request</h3>
                  <p>Test the API with a simple request to list available agents.</p>
                  <Button variant="outline" size="sm">
                    Try Now
                    <Terminal size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              className={styles.codeExample}
              initial={{ opacity: 0, x: 40 }}
              animate={quickstartInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className={styles.codeHeader}>
                <div className={styles.codeTabs}>
                  {Object.keys(codeExamples).map((lang) => (
                    <button
                      key={lang}
                      className={`${styles.codeTab} ${activeTab === lang ? styles.active : ''}`}
                      onClick={() => setActiveTab(lang)}
                    >
                      {lang === 'curl' ? 'cURL' : lang === 'nodejs' ? 'Node.js' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(codeExamples[activeTab as keyof typeof codeExamples], activeTab)}
                >
                  {copiedCode === activeTab ? <Check size={16} /> : <Copy size={16} />}
                </Button>
              </div>
              <div className={styles.codeContent}>
                <pre><code>{codeExamples[activeTab as keyof typeof codeExamples]}</code></pre>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className={styles.endpoints} ref={endpointsRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={endpointsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>API Endpoints</h2>
            <p>Comprehensive reference for all available endpoints</p>
          </motion.div>

          <div className={styles.endpointsList}>
            {apiEndpoints.map((endpoint, index) => (
              <motion.div
                key={`${endpoint.method}-${endpoint.endpoint}`}
                className={styles.endpointCard}
                initial={{ opacity: 0, y: 40 }}
                animate={endpointsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={styles.endpointHeader}>
                  <div className={styles.methodBadge} data-method={endpoint.method.toLowerCase()}>
                    {endpoint.method}
                  </div>
                  <code className={styles.endpointPath}>{endpoint.endpoint}</code>
                </div>
                
                <p className={styles.endpointDescription}>{endpoint.description}</p>
                
                <div className={styles.endpointDetails}>
                  <div className={styles.endpointParams}>
                    <h4>Parameters</h4>
                    {endpoint.params.map((param) => (
                      <div key={param.name} className={styles.param}>
                        <div className={styles.paramHeader}>
                          <code className={styles.paramName}>{param.name}</code>
                          <span className={styles.paramType}>{param.type}</span>
                          {param.required && <span className={styles.required}>required</span>}
                        </div>
                        <p className={styles.paramDescription}>{param.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className={styles.endpointResponse}>
                    <h4>Response Example</h4>
                    <div className={styles.responseCode}>
                      <pre><code>{JSON.stringify(endpoint.response, null, 2)}</code></pre>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SDKs Section */}
      <section className={styles.sdks} ref={sdksRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={sdksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Official SDKs</h2>
            <p>Use our official libraries to integrate faster in your preferred language</p>
          </motion.div>

          <div className={styles.sdksGrid}>
            {sdks.map((sdk, index) => (
              <motion.div
                key={sdk.name}
                className={styles.sdkCard}
                initial={{ opacity: 0, y: 40 }}
                animate={sdksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={styles.sdkIcon}>{sdk.icon}</div>
                <div className={styles.sdkInfo}>
                  <h3>{sdk.name}</h3>
                  <div className={styles.sdkMeta}>
                    <span>v{sdk.version}</span>
                    <span>{sdk.downloads} downloads</span>
                  </div>
                </div>
                <div className={styles.sdkInstall}>
                  <code>{sdk.installCmd}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(sdk.installCmd, sdk.name)}
                  >
                    {copiedCode === sdk.name ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
                <div className={styles.sdkActions}>
                  <Button variant="outline" size="sm">
                    Documentation
                    <ExternalLink size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className={styles.resources}>
        <div className="container">
          <motion.div
            className={styles.resourcesContent}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={sdksInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2>Additional Resources</h2>
            <div className={styles.resourcesGrid}>
              <div className={styles.resourceCard}>
                <BookOpen className={styles.resourceIcon} />
                <h3>Tutorials</h3>
                <p>Step-by-step guides for common integration patterns</p>
                <Button variant="outline" size="sm">
                  Browse Tutorials
                  <ChevronRight size={16} />
                </Button>
              </div>
              
              <div className={styles.resourceCard}>
                <Users className={styles.resourceIcon} />
                <h3>Community</h3>
                <p>Join thousands of developers building with our APIs</p>
                <Button variant="outline" size="sm">
                  Join Community
                  <ChevronRight size={16} />
                </Button>
              </div>
              
              <div className={styles.resourceCard}>
                <Shield className={styles.resourceIcon} />
                <h3>Support</h3>
                <p>Get help from our expert developer support team</p>
                <Button variant="outline" size="sm">
                  Contact Support
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
