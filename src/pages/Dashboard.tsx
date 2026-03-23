import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import OnboardingWizard from '../components/OnboardingWizard';
import { 
  Copy, 
  Check, 
  Wand2, 
  FileText, 
  Settings, 
  LogOut,
  Plus,
  Search,
  MoreVertical,
  Sparkles,
  ChevronDown,
  Bot,
  Users,
  User,
  Table,
  Layout,
  ArrowLeft,
  MessageCircle,
  Clock,
  Activity as ActivityIcon
} from 'lucide-react';

const initialWorkspaces = [
  { id: 'w1', name: 'Default' },
  { id: 'w2', name: 'Project Alpha' }
];

const initialAgents = [
  { id: 'a1', name: 'Claude Assistant', token: 'mx_agt_9f8e7d6c5b4a3' },
  { id: 'a2', name: 'Data Analyzer', token: 'mx_agt_1a2b3c4d5e6f7' },
  { id: 'a3', name: 'Research Bot', token: 'mx_agt_8x7y6z5w4v3u2' }
];

const initialUsers = [
  { id: 'u1', name: 'Human', email: 'human@example.com' },
  { id: 'u2', name: 'Alice Chen', email: 'alice@example.com' },
  { id: 'u3', name: 'Bob Smith', email: 'bob@example.com' },
  { id: 'u4', name: 'Eve Davis', email: 'eve@example.com' }
];

const initialPermissions = [
  // Workspace 1 (Default)
  { id: 'p1', workspaceId: 'w1', memberId: 'u1', memberType: 'Human', role: 'Owner' },
  { id: 'p2', workspaceId: 'w1', memberId: 'u2', memberType: 'Human', role: 'Editor' },
  { id: 'p3', workspaceId: 'w1', memberId: 'a1', memberType: 'Agent', role: 'Editor' },
  { id: 'p4', workspaceId: 'w1', memberId: 'a2', memberType: 'Agent', role: 'Viewer' },
  // Workspace 2 (Project Alpha)
  { id: 'p5', workspaceId: 'w2', memberId: 'u1', memberType: 'Human', role: 'Owner' },
  { id: 'p6', workspaceId: 'w2', memberId: 'u4', memberType: 'Human', role: 'Editor' },
  { id: 'p7', workspaceId: 'w2', memberId: 'a3', memberType: 'Agent', role: 'Admin' }
];

interface WorkspaceDoc {
  id: string;
  workspaceId: string;
  name: string;
  type: string;
  date: string;
  creatorName: string;
  creatorType: 'human' | 'agent';
}

const initialDocuments: WorkspaceDoc[] = [
  { id: 'd1', workspaceId: 'w1', name: 'Project Alpha Architecture', type: 'Markdown', date: '2 hours ago', creatorName: 'Claude Assistant', creatorType: 'agent' },
  { id: 'd2', workspaceId: 'w1', name: 'Q3 Financial Projections', type: 'Table', date: 'Yesterday', creatorName: 'Data Analyzer', creatorType: 'agent' },
  { id: 'd3', workspaceId: 'w1', name: 'User Flow Diagram', type: 'Whiteboard', date: 'Last week', creatorName: 'Human', creatorType: 'human' },
  { id: 'd6', workspaceId: 'w1', name: 'Claude & Human: Feature Discussion', type: 'Chat Log', date: '3 hours ago', creatorName: 'Claude Assistant', creatorType: 'agent' },
  { id: 'd4', workspaceId: 'w2', name: 'Competitor Analysis', type: 'Markdown', date: '1 hour ago', creatorName: 'Research Bot', creatorType: 'agent' },
  { id: 'd5', workspaceId: 'w2', name: 'Marketing Strategy', type: 'Markdown', date: '2 days ago', creatorName: 'Human', creatorType: 'human' }
];

interface Activity {
  id: string;
  workspaceId: string;
  userId: string;
  userName: string;
  userType: 'human' | 'agent';
  action: string;
  targetName: string;
  targetType: string;
  details?: string;
  timestamp: string;
}

const initialActivities: Activity[] = [
  {
    id: 'act1',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'modified',
    targetName: 'Project Alpha Architecture',
    targetType: 'Markdown',
    details: 'Added "Database Schema" section',
    timestamp: '2026-03-19T08:30:00Z'
  },
  {
    id: 'act2',
    workspaceId: 'w1',
    userId: 'u1',
    userName: 'Human',
    userType: 'human',
    action: 'created',
    targetName: 'User Flow Diagram',
    targetType: 'Whiteboard',
    timestamp: '2026-03-18T14:20:00Z'
  },
  {
    id: 'act3',
    workspaceId: 'w1',
    userId: 'a2',
    userName: 'Data Analyzer',
    userType: 'agent',
    action: 'updated',
    targetName: 'Q3 Financial Projections',
    targetType: 'Table',
    details: 'Updated revenue forecasts for August',
    timestamp: '2026-03-17T10:15:00Z'
  },
  {
    id: 'act4',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'commented on',
    targetName: 'Project Alpha Architecture',
    targetType: 'Markdown',
    details: 'Suggested using Redis for caching',
    timestamp: '2026-03-12T16:45:00Z'
  },
  {
    id: 'act5',
    workspaceId: 'w2',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'created',
    targetName: 'Competitor Analysis',
    targetType: 'Markdown',
    timestamp: '2026-03-19T07:00:00Z'
  }
];

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('w1');
  const [agents, setAgents] = useState(initialAgents);
  const [users, setUsers] = useState(initialUsers);
  const [permissions, setPermissions] = useState(initialPermissions);
  const [documents, setDocuments] = useState(initialDocuments);
  const [activities, setActivities] = useState(initialActivities);
  const [activeTab, setActiveTab] = useState<'documents' | 'activity' | 'agents' | 'users' | 'members' | 'settings'>('documents');
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [isNewDocMenuOpen, setIsNewDocMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const location = useLocation();

  useEffect(() => {
    // Show onboarding if coming from landing page with "onboarding" flag or if it's first time
    const params = new URLSearchParams(location.search);
    if (params.get('onboarding') === 'true' || agents.length === 0) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = (agentName: string) => {
    const newToken = `mx_agt_${Math.random().toString(36).substr(2, 12)}`;
    const newAgent = {
      id: `a${Date.now()}`,
      name: agentName,
      token: newToken
    };
    
    setAgents([newAgent, ...agents]);
    
    const newPermission = {
      id: `p${Date.now()}`,
      workspaceId: activeWorkspaceId,
      memberId: newAgent.id,
      memberType: 'Agent' as const,
      role: 'Editor'
    };
    setPermissions([...permissions, newPermission]);
    setShowOnboarding(false);
    setActiveTab('agents');
  };

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);
  const workspaceDocs = documents.filter(d => d.workspaceId === activeWorkspaceId);
  const workspaceActivities = activities.filter(a => a.workspaceId === activeWorkspaceId);
  
  const workspacePermissions = permissions.filter(p => p.workspaceId === activeWorkspaceId).map(p => {
    const member = p.memberType === 'Human' 
      ? users.find(u => u.id === p.memberId) 
      : agents.find(a => a.id === p.memberId);
    return { ...p, member };
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;
    
    const newToken = `mx_agt_${Math.random().toString(36).substr(2, 12)}`;
    const newAgent = {
      id: `a${Date.now()}`,
      name: newAgentName.trim(),
      token: newToken
    };
    
    setAgents([newAgent, ...agents]);
    
    // Automatically add to current workspace as Editor
    const newPermission = {
      id: `p${Date.now()}`,
      workspaceId: activeWorkspaceId,
      memberId: newAgent.id,
      memberType: 'Agent' as const,
      role: 'Editor'
    };
    setPermissions([...permissions, newPermission]);
    setNewAgentName('');
    setIsCreatingAgent(false);
  };

  const handleQuickCreateDoc = (type: 'Markdown' | 'Table' | 'Whiteboard' | 'Chat Log') => {
    const newDoc: WorkspaceDoc = {
      id: `d${Date.now()}`,
      workspaceId: activeWorkspaceId,
      name: type === 'Chat Log' ? 'New Chat Log' : 'Untitled',
      type: type,
      date: 'Just now',
      creatorName: 'Human',
      creatorType: 'human'
    };

    setDocuments([newDoc, ...documents]);
    setIsNewDocMenuOpen(false);
    window.location.href = `/document?type=${type.toLowerCase().replace(' ', '')}`;
  };

  const generatePrompt = (token: string) => `1. Copy the installation command to Lobster
Command: Download the zip package from https://cdn.mindx.com/static/mindx-docs.zip and unzip it, help me install this skill, and then set the environment variable MINDX_TOKEN="${token}".`;

  return (
    <div className="min-h-screen bg-white text-stone-800 flex font-sans selection:bg-stone-200">
      {showOnboarding && (
        <OnboardingWizard 
          onComplete={handleOnboardingComplete} 
          onClose={() => setShowOnboarding(false)} 
        />
      )}
      {/* Sidebar */}
      <aside className="w-64 border-r border-stone-200 bg-[#F7F7F5] flex flex-col">
        <div className="h-14 flex items-center px-4">
          <Link to="/" className="flex items-center gap-2 hover:bg-stone-200/50 p-1.5 rounded-md transition-colors w-full">
            <div className="w-6 h-6 rounded bg-stone-800 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">MindX</span>
          </Link>
        </div>
        
        <div className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          <div className="mb-4">
            <div className="px-3 py-2 flex items-center justify-between group relative">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Workspace</span>
              <button 
                onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
                className="flex items-center gap-1 hover:bg-stone-200/50 px-1.5 py-0.5 rounded transition-colors"
              >
                <span className="text-xs font-medium text-stone-600 truncate max-w-[100px]">{activeWorkspace?.name}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isWorkspaceOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-md shadow-lg overflow-hidden z-50 py-1">
                  {workspaces.map(w => (
                    <button
                      key={w.id}
                      onClick={() => {
                        setActiveWorkspaceId(w.id);
                        setIsWorkspaceOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${
                        w.id === activeWorkspaceId ? 'bg-stone-100 text-stone-900' : 'hover:bg-stone-50 text-stone-600'
                      }`}
                    >
                      <div className="w-4 h-4 rounded bg-stone-100 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-medium text-stone-50 text-stone-500">{w.name.charAt(0)}</span>
                      </div>
                      {w.name}
                    </button>
                  ))}
                  <div className="border-t border-stone-100 mt-1 pt-1">
                    <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-stone-500 hover:text-stone-800 hover:bg-stone-50 transition-colors">
                      <Plus className="w-3.5 h-3.5" /> New Workspace
                    </button>
                  </div>
                </div>
              )}
            </div>
            <NavItem 
              icon={<FileText className="w-4 h-4" />} 
              label="Documents" 
              active={activeTab === 'documents'} 
              onClick={() => { setActiveTab('documents'); setIsCreatingAgent(false); }}
            />
            <NavItem 
              icon={<ActivityIcon className="w-4 h-4" />} 
              label="Activity Feed" 
              active={activeTab === 'activity'} 
              onClick={() => { setActiveTab('activity'); setIsCreatingAgent(false); }}
            />
            <NavItem 
              icon={<Users className="w-4 h-4" />} 
              label="Access Control" 
              active={activeTab === 'members'} 
              onClick={() => { setActiveTab('members'); setIsCreatingAgent(false); }}
            />
            <NavItem 
              icon={<Settings className="w-4 h-4" />} 
              label="Settings" 
              active={activeTab === 'settings'}
              onClick={() => { setActiveTab('settings'); setIsCreatingAgent(false); }}
            />
          </div>

          <div>
            <div className="px-3 py-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Global</div>
            <NavItem 
              icon={<Bot className="w-4 h-4" />} 
              label="Agent Accounts" 
              active={activeTab === 'agents'} 
              onClick={() => { setActiveTab('agents'); setIsCreatingAgent(false); }}
            />
            <NavItem 
              icon={<User className="w-4 h-4" />} 
              label="Human Accounts" 
              active={activeTab === 'users'} 
              onClick={() => { setActiveTab('users'); setIsCreatingAgent(false); }}
            />
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-stone-200/50 cursor-pointer transition-colors">
            <div className="w-6 h-6 rounded bg-stone-200 flex items-center justify-center text-stone-600 text-xs font-medium">
              H
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Human Account</p>
            </div>
            <LogOut className="w-4 h-4 text-stone-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-8 border-b border-stone-200">
          <h1 className="text-lg font-medium">
            {activeTab === 'documents' && 'Documents'}
            {activeTab === 'activity' && 'Activity Feed'}
            {activeTab === 'agents' && 'Agent Accounts'}
            {activeTab === 'users' && 'Human Accounts'}
            {activeTab === 'members' && 'Access Control'}
            {activeTab === 'settings' && 'Settings'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-1.5 bg-stone-50 border border-stone-200 rounded-md text-sm focus:outline-none focus:border-stone-300 focus:bg-white transition-colors w-64"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => {
                  if (activeTab === 'agents') setIsCreatingAgent(true);
                  if (activeTab === 'documents') setIsNewDocMenuOpen(!isNewDocMenuOpen);
                  if (activeTab === 'members') {
                    // Logic to add a member from global list
                    const availableUser = users.find(u => !permissions.some(p => p.workspaceId === activeWorkspaceId && p.memberId === u.id));
                    if (availableUser) {
                      setPermissions([...permissions, {
                        id: `p${Date.now()}`,
                        workspaceId: activeWorkspaceId,
                        memberId: availableUser.id,
                        memberType: 'Human',
                        role: 'Viewer'
                      }]);
                    }
                  }
                  if (activeTab === 'users') {
                    const newId = `u${Date.now()}`;
                    setUsers([...users, { id: newId, name: 'New Human', email: 'new@example.com' }]);
                  }
                }}
                className="flex items-center gap-1.5 bg-stone-900 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                <Plus className="w-4 h-4" /> 
                {activeTab === 'documents' && 'New'}
                {activeTab === 'agents' && 'New Agent'}
                {activeTab === 'members' && 'Add Member'}
                {activeTab === 'users' && 'New Human'}
              </button>

              {activeTab === 'documents' && isNewDocMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsNewDocMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                    <button 
                      onClick={() => handleQuickCreateDoc('Markdown')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-stone-400" />
                      <span>Document</span>
                    </button>
                    <button 
                      onClick={() => handleQuickCreateDoc('Table')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <Table className="w-4 h-4 text-stone-400" />
                      <span>Table</span>
                    </button>
                    <button 
                      onClick={() => handleQuickCreateDoc('Whiteboard')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <Layout className="w-4 h-4 text-stone-400" />
                      <span>Whiteboard</span>
                    </button>
                    <button 
                      onClick={() => handleQuickCreateDoc('Chat Log')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-stone-400" />
                      <span>Chat Log</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {activeTab === 'documents' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="border border-stone-200/80 rounded-xl overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone-50/50 text-stone-500 border-b border-stone-200/80">
                      <tr>
                        <th className="px-6 py-3 font-medium">Name</th>
                        <th className="px-6 py-3 font-medium">Owner</th>
                        <th className="px-6 py-3 font-medium">Last Modified</th>
                        <th className="px-6 py-3 font-medium text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {workspaceDocs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-stone-500">
                            <FileText className="w-8 h-8 mx-auto mb-3 text-stone-300" />
                            <p>No documents in this workspace</p>
                          </td>
                        </tr>
                      ) : (
                        workspaceDocs.map(doc => (
                          <DocRow 
                            key={doc.id}
                            name={doc.name} 
                            type={doc.type} 
                            date={doc.date} 
                            creatorName={doc.creatorName}
                            creatorType={doc.creatorType}
                          />
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'activity' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ActivityFeed activities={workspaceActivities} />
              </motion.div>
            )}

            {activeTab === 'agents' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {isCreatingAgent ? (
                  <div className="max-w-2xl mx-auto">
                    <button 
                      onClick={() => setIsCreatingAgent(false)} 
                      className="flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-6 transition-colors text-sm font-medium"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to Agents
                    </button>
                    <div className="bg-white border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-8">
                      <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200/60 flex items-center justify-center text-stone-700 shadow-sm mb-6">
                        <Bot className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl font-semibold text-stone-900 mb-2 tracking-tight">Create New Agent</h2>
                      <p className="text-sm text-stone-500 mb-8">Generate a new agent token to integrate your AI assistant with the system.</p>
                      <form onSubmit={handleCreateAgent} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-2">Agent Name</label>
                          <input 
                            type="text" 
                            value={newAgentName} 
                            onChange={e => setNewAgentName(e.target.value)} 
                            className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200/80 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all" 
                            placeholder="e.g. Data Analyzer Bot" 
                            autoFocus 
                          />
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                          <button 
                            type="button" 
                            onClick={() => setIsCreatingAgent(false)} 
                            className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            disabled={!newAgentName.trim()} 
                            className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                          >
                            Create Agent
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : agents.length === 0 ? (
                  <div className="text-center py-12 border border-stone-200 border-dashed rounded-lg">
                    <Bot className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                    <h3 className="text-sm font-medium mb-1">No Agents Found</h3>
                    <p className="text-stone-500 text-sm mb-4">Create an agent account to generate a token and start collaborating.</p>
                    <button 
                      onClick={() => setIsCreatingAgent(true)}
                      className="bg-stone-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-stone-800 transition-colors"
                    >
                      Create Agent
                    </button>
                  </div>
                ) : (
                  agents.map(agent => (
                    <div key={agent.id} className="p-6 rounded-xl border border-stone-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-stone-50 border border-stone-200/60 flex items-center justify-center text-stone-700 shadow-sm">
                            <Bot className="w-5 h-5" />
                          </div>
                          <div>
                            <h2 className="text-base font-semibold text-stone-900 tracking-tight">{agent.name}</h2>
                            <p className="text-xs text-stone-500 font-medium">Global Agent Account</p>
                          </div>
                        </div>
                        <button className="p-1.5 rounded-md hover:bg-stone-100 text-stone-400 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Token Card */}
                        <div>
                          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Agent Token</h3>
                          <div className="relative">
                            <div className="bg-stone-50/80 border border-stone-200/60 rounded-lg p-3.5 text-sm font-medium text-stone-700 break-all pr-12 tracking-wide">
                              {agent.token}
                            </div>
                            <button 
                              onClick={() => copyToClipboard(agent.token, `token-${agent.id}`)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-white hover:shadow-sm text-stone-500 transition-all"
                            >
                              {copiedStates[`token-${agent.id}`] ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Prompt Card */}
                        <div>
                          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Wand2 className="w-3.5 h-3.5" /> Integration Prompt
                          </h3>
                          <div className="relative group">
                            <div className="bg-stone-50/80 border border-stone-200/60 rounded-lg p-3.5 text-sm text-stone-600 whitespace-pre-wrap h-28 overflow-y-auto leading-relaxed">
                              {generatePrompt(agent.token)}
                            </div>
                            <button 
                              onClick={() => copyToClipboard(generatePrompt(agent.token), `prompt-${agent.id}`)}
                              className="absolute right-2 top-2 p-1.5 rounded-md bg-white border border-stone-200/60 hover:bg-stone-50 text-stone-500 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                            >
                              {copiedStates[`prompt-${agent.id}`] ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="border border-stone-200/80 rounded-xl overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone-50/50 text-stone-500 border-b border-stone-200/80">
                      <tr>
                        <th className="px-6 py-3 font-medium">Human</th>
                        <th className="px-6 py-3 font-medium">Email</th>
                        <th className="px-6 py-3 font-medium text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {users.map(user => (
                        <tr key={user.id} className="hover:bg-stone-50 transition-colors group">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-medium text-xs">
                                {user.name.charAt(0)}
                              </div>
                              <span className="font-medium text-stone-800">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-stone-500">{user.email}</td>
                          <td className="px-6 py-3 text-right">
                            <button className="p-1 rounded hover:bg-stone-200 text-stone-400 opacity-0 group-hover:opacity-100 transition-all">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'members' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="border border-stone-200/80 rounded-xl overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone-50/50 text-stone-500 border-b border-stone-200/80">
                      <tr>
                        <th className="px-6 py-3 font-medium">Member</th>
                        <th className="px-6 py-3 font-medium">Type</th>
                        <th className="px-6 py-3 font-medium">Role</th>
                        <th className="px-6 py-3 font-medium text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {workspacePermissions.map(perm => (
                        <tr key={perm.id} className="hover:bg-stone-50 transition-colors group">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-stone-600 font-medium text-xs ${perm.memberType === 'Agent' ? 'bg-stone-100 border border-stone-200/60' : 'bg-stone-100'}`}>
                                {perm.memberType === 'Agent' ? <Bot className="w-4 h-4" /> : perm.member?.name.charAt(0)}
                              </div>
                              <div>
                                <span className="font-medium text-stone-800 block">{perm.member?.name}</span>
                                <span className="text-xs text-stone-400">{perm.memberType === 'Agent' ? 'Agent Account' : (perm.member as any)?.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${perm.memberType === 'Agent' ? 'bg-stone-50 text-stone-500 border border-stone-200/50' : 'text-stone-400'}`}>
                              {perm.memberType}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <select 
                              value={perm.role}
                              onChange={(e) => {
                                const newRole = e.target.value;
                                setPermissions(prev => prev.map(p => p.id === perm.id ? { ...p, role: newRole } : p));
                              }}
                              className="bg-transparent border-none text-xs font-medium focus:ring-0 cursor-pointer hover:text-stone-900 transition-colors"
                            >
                              <option value="Viewer">Viewer</option>
                              <option value="Editor">Editor</option>
                              <option value="Admin">Admin</option>
                              <option value="Owner" disabled>Owner</option>
                            </select>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <button className="p-1 rounded hover:bg-stone-200 text-stone-400 opacity-0 group-hover:opacity-100 transition-all">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl"
              >
                <div className="bg-white border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-8 space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-stone-900 mb-2 tracking-tight">Workspace Settings</h2>
                    <p className="text-sm text-stone-500">Manage your workspace configuration and preferences.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-stone-700">Workspace Name</label>
                    <input 
                      type="text" 
                      defaultValue={activeWorkspace?.name}
                      className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200/80 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all"
                    />
                  </div>

                  <div className="pt-6 border-t border-stone-100">
                    <h3 className="text-sm font-semibold text-stone-900 mb-4">Danger Zone</h3>
                    <button className="px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
                      Delete Workspace
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-white text-stone-900 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-stone-200/50' 
          : 'text-stone-600 hover:bg-stone-200/40 hover:text-stone-900 border border-transparent'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

interface DocRowProps {
  key?: string | number;
  name: string;
  type: string;
  date: string;
  creatorName: string;
  creatorType: 'human' | 'agent';
}

function DocRow({ name, type, date, creatorName, creatorType }: DocRowProps) {
  const getDocIcon = () => {
    switch (type.toLowerCase()) {
      case 'table':
        return <Table className="w-4 h-4 text-stone-400" />;
      case 'whiteboard':
        return <Layout className="w-4 h-4 text-stone-400" />;
      case 'chat log':
        return <MessageCircle className="w-4 h-4 text-stone-400" />;
      case 'markdown':
      default:
        return <FileText className="w-4 h-4 text-stone-400" />;
    }
  };

  return (
    <tr className="hover:bg-stone-50 transition-colors group cursor-pointer" onClick={() => window.location.href = `/document?type=${type.toLowerCase().replace(' ', '')}`}>
      <td className="px-6 py-3">
        <div className="flex items-center gap-3">
          {getDocIcon()}
          <span className="font-medium text-stone-800">{name}</span>
        </div>
      </td>
      <td className="px-6 py-3">
        <div className="flex items-center gap-2 text-stone-500">
          {creatorType === 'agent' ? (
            <div className="w-5 h-5 rounded bg-stone-100 flex items-center justify-center text-stone-500" title="Agent">
              <Bot className="w-3 h-3" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded bg-stone-100 flex items-center justify-center text-stone-500" title="Human">
              <User className="w-3 h-3" />
            </div>
          )}
          <span className="text-sm">{creatorName}</span>
        </div>
      </td>
      <td className="px-6 py-3 text-stone-500 text-sm">{date}</td>
      <td className="px-6 py-3 text-right">
        <button className="p-1 rounded hover:bg-stone-200 text-stone-400 opacity-0 group-hover:opacity-100 transition-all" onClick={(e) => e.stopPropagation()}>
          <MoreVertical className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}

interface ActivityFeedProps {
  activities: Activity[];
}

function ActivityFeed({ activities }: ActivityFeedProps) {
  const groupActivitiesByWeek = (activities: Activity[]) => {
    const groups: Record<string, Activity[]> = {};
    const sorted = [...activities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    sorted.forEach(activity => {
      const date = new Date(activity.timestamp);
      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      let key = '';
      if (diffInDays < 7) {
        key = 'This Week';
      } else if (diffInDays < 14) {
        key = 'Last Week';
      } else {
        const month = date.toLocaleString('default', { month: 'long' });
        key = `${month} ${date.getFullYear()}`;
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(activity);
    });
    return groups;
  };

  const grouped = groupActivitiesByWeek(activities);

  return (
    <div className="space-y-8 pb-12">
      {Object.entries(grouped).map(([week, weekActivities]) => (
        <div key={week} className="space-y-4">
          <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-2">{week}</h3>
          <div className="space-y-1">
            {weekActivities.map(activity => (
              <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-50 transition-all group border border-transparent hover:border-stone-200/60 hover:shadow-sm">
                <div className="mt-0.5">
                  {activity.userType === 'agent' ? (
                    <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 border border-stone-200 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 border border-stone-200 shadow-sm">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-stone-600 leading-relaxed">
                    <span className="font-bold text-stone-900">{activity.userName}</span>
                    {' '}{activity.action}{' '}
                    <span className="font-medium text-stone-900">{activity.targetName}</span>
                    {activity.details && (
                      <span className="text-stone-400 italic"> — {activity.details}</span>
                    )}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <p className="text-[10px] text-stone-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <span className="text-[10px] text-stone-300">•</span>
                    <p className="text-[10px] text-stone-400 font-medium">
                      {new Date(activity.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {activities.length === 0 && (
        <div className="py-20 text-center">
          <ActivityIcon className="w-12 h-12 text-stone-200 mx-auto mb-4" />
          <p className="text-stone-400 text-sm">No recent activity in this workspace</p>
        </div>
      )}
    </div>
  );
}
