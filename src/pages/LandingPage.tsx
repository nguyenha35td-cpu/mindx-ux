import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Database, 
  Users, 
  RefreshCw, 
  ArrowRight, 
  Bot, 
  Sparkles, 
  Terminal,
  Zap,
  Code,
  Cpu,
  Briefcase,
  Layers
} from 'lucide-react';
import AuthModal from '../components/AuthModal';

const INTEGRATIONS = [
  { name: 'Claude', icon: <Bot className="w-4 h-4" />, color: 'bg-stone-100' },
  { name: 'Antigravity', icon: <Zap className="w-4 h-4" />, color: 'bg-stone-100' },
  { name: 'Codex', icon: <Code className="w-4 h-4" />, color: 'bg-stone-100' },
  { name: 'OpenClaw', icon: <Cpu className="w-4 h-4" />, color: 'bg-stone-100' },
  { name: 'Workbuddy', icon: <Briefcase className="w-4 h-4" />, color: 'bg-stone-100' },
];

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const handleAuth = (email: string) => {
    setShowAuth(false);
    navigate('/dashboard?onboarding=true');
  };

  return (
    <div className="min-h-screen bg-white text-stone-800 font-sans selection:bg-stone-200">
      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={handleAuth} />}

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-stone-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">MindX</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#workflow" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors hidden md:block">
              How it Works
            </a>
            <button 
              onClick={() => setShowAuth(true)}
              className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setShowAuth(true)}
              className="text-sm font-medium bg-stone-900 text-white px-4 py-2 rounded-md hover:bg-stone-800 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
          >
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mr-2">Integrations</span>
            {INTEGRATIONS.map((item) => (
              <div 
                key={item.name}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200/60 shadow-sm hover:shadow-md hover:border-stone-300 transition-all cursor-default group"
              >
                <div className={`w-6 h-6 rounded-full ${item.color} flex items-center justify-center text-stone-600 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <span className="text-xs font-semibold text-stone-700">{item.name}</span>
              </div>
            ))}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-stone-900"
          >
            The Workspace for <br className="hidden md:block" />
            <span className="text-stone-400">
              Humans and AI Agents
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Give your AI agents the power to create, read, edit, and collaborate on documents. 
            A unified workspace for Markdown, Office, Tables, and Whiteboards.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => setShowAuth(true)}
              className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-md font-medium hover:bg-stone-800 transition-colors"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#workflow"
              className="flex items-center gap-2 bg-white text-stone-800 px-6 py-3 rounded-md font-medium hover:bg-stone-50 transition-colors border border-stone-200"
            >
              See How It Works
            </a>
          </motion.div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-24 bg-stone-50 border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold tracking-tight mb-4 text-stone-900">How MindX Works</h2>
            <p className="text-stone-500">Four simple steps to give your agents superpowers.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Users className="w-5 h-5" />,
                title: "1. Register",
                desc: "Create your MindX account and access your default workspace."
              },
              {
                icon: <Bot className="w-5 h-5" />,
                title: "2. Create Agent",
                desc: "Add an agent account to your workspace to generate a unique token."
              },
              {
                icon: <Terminal className="w-5 h-5" />,
                title: "3. Prompt Agent",
                desc: "Send the generated Skill + Token prompt to your AI."
              },
              {
                icon: <Sparkles className="w-5 h-5" />,
                title: "4. Superpowers",
                desc: "Your agent can now read, write, and manage documents in the workspace."
              }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative p-6 rounded-xl bg-white border border-stone-200 shadow-sm"
              >
                <div className="w-10 h-10 rounded bg-stone-100 flex items-center justify-center text-stone-600 mb-4">
                  {step.icon}
                </div>
                <h3 className="text-lg font-medium mb-2 text-stone-900">{step.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition / Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold tracking-tight mb-4 text-stone-900">Core Capabilities</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              MindX provides the infrastructure your agents need to interact with the real world of documents and data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<FileText className="w-5 h-5 text-stone-600" />}
              title="Create, Read, Edit"
              desc="Full support for Markdown, Office documents, multi-dimensional tables, and whiteboard drawings."
            />
            <FeatureCard 
              icon={<Database className="w-5 h-5 text-stone-600" />}
              title="Isolated Workspaces"
              desc="Create multiple workspaces to keep different projects and agents completely isolated from one another."
            />
            <FeatureCard 
              icon={<Bot className="w-5 h-5 text-stone-600" />}
              title="Agent Accounts"
              desc="Provision dedicated accounts and tokens for each of your agents to securely access specific workspaces."
            />
            <FeatureCard 
              icon={<Users className="w-5 h-5 text-stone-600" />}
              title="Human-Agent Collaboration"
              desc="A collaborative UI where humans and agents can work together, including text selection and commenting."
            />
            <FeatureCard 
              icon={<RefreshCw className="w-5 h-5 text-stone-600" />}
              title="Format Conversion"
              desc="Seamlessly convert between various document formats (e.g., Markdown to PDF, CSV to Table)."
            />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-stone-200 py-8 px-6 bg-stone-50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-stone-800 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-medium text-stone-900">MindX</span>
          </div>
          <p className="text-stone-500 text-sm">© 2026 MindX Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-xl bg-white border border-stone-200 hover:shadow-sm transition-shadow">
      <div className="w-10 h-10 rounded bg-stone-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2 text-stone-900">{title}</h3>
      <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
