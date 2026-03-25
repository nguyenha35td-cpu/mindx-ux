import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Share2, 
  Bot, 
  Clock, 
  CheckCircle2,
  Sparkles,
  RefreshCw,
  MoreHorizontal,
  Quote,
  Check,
  X,
  Reply,
  Send,
  History,
  Link2,
  ChevronDown,
  Download,
  Copy,
  FileText,
  Eye,
  Users,
  Calendar,
  ChevronRight,
  FilePlus2,
  Tag,
  Shield,
  Plus
} from 'lucide-react';

interface Paragraph {
  id: string;
  text: string;
  author: string;
  authorType: 'human' | 'agent';
}

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  senderType: 'human' | 'agent';
  time: string;
}

interface VersionHistory {
  id: string;
  author: string;
  authorType: 'human' | 'agent';
  timestamp: string;
  date: string;
  changes: string;
  paragraphs: Paragraph[];
}

interface AgentPermission {
  agentId: string;
  agentName: string;
  permission: 'read' | 'edit';
}

export default function DocumentEditor() {
  const navigate = useNavigate();
  const currentUserName = 'You';
  const externalCollaboratorName = 'Maya Chen';
  const [isChatLog, setIsChatLog] = useState(false);
  
  // Sidebar states
  const [showCommentsSidebar, setShowCommentsSidebar] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  // Modal states
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [labelModalOpen, setLabelModalOpen] = useState(false);
  const [agentPermissionModalOpen, setAgentPermissionModalOpen] = useState(false);
  const [duplicateName, setDuplicateName] = useState('');
  const [documentLabels, setDocumentLabels] = useState<string[]>(['Project Alpha', 'PRD']);
  const [tagInput, setTagInput] = useState('');
  const [usedTags] = useState<string[]>(['PRD', 'Data', 'Design', 'Research', 'Marketing', 'Meeting Notes', 'Finance']);
  const [agentPermissions, setAgentPermissions] = useState<AgentPermission[]>([
    { agentId: 'agent1', agentName: 'Claude Assistant', permission: 'edit' },
    { agentId: 'agent2', agentName: 'Research Bot', permission: 'read' }
  ]);
  
  // Share settings
  const [sharePermission, setSharePermission] = useState<'private' | 'view'>('private');
  const [allowDownload, setAllowDownload] = useState(false);
  const [allowCopy, setAllowCopy] = useState(false);
  const [allowDuplicate, setAllowDuplicate] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Version history
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [versionFilterDate, setVersionFilterDate] = useState<string>('all');
  const [versionFilterAuthor, setVersionFilterAuthor] = useState<string>('all');
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'm1', sender: externalCollaboratorName, senderType: 'human', text: 'Hey Claude, can you help me draft the architecture for Project Alpha?', time: '10:00 AM' },
    { id: 'm2', sender: 'Claude 3.5 Sonnet', senderType: 'agent', text: 'Of course! I\'d be happy to help. What are the main requirements for the system?', time: '10:01 AM' },
    { id: 'm3', sender: externalCollaboratorName, senderType: 'human', text: 'It needs to be a microservices-based system with an Auth Service, Data Service, and Notification Service.', time: '10:05 AM' },
    { id: 'm4', sender: 'Claude 3.5 Sonnet', senderType: 'agent', text: 'Got it. For the Auth Service, I recommend using OAuth 2.0. The Data Service should probably use PostgreSQL for relational data.', time: '10:07 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Simple check to simulate different document types
    const params = new URLSearchParams(window.location.search);
    if (params.get('type') === 'chatlog') {
      setIsChatLog(true);
    }
  }, []);

  const [paragraphs, setParagraphs] = useState<Paragraph[]>([
    {
      id: 'p1',
      text: '## Project Alpha Architecture',
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p2',
      text: 'This document outlines the core architecture for Project Alpha.',
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p3',
      text: '### 1. Overview',
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p4',
      text: 'The system is composed of three main microservices:\n- **Auth Service**: Handles user authentication and authorization.\n- **Data Service**: Manages the core business data and database interactions.\n- **Notification Service**: Sends emails and push notifications.',
      author: 'Claude 3.5 Sonnet',
      authorType: 'agent'
    },
    {
      id: 'p5',
      text: '### 2. Database Schema',
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p6',
      text: 'We will use PostgreSQL for the primary database. We will use Redis for caching to improve performance. The schema is designed to be highly normalized to ensure data integrity.',
      author: 'Claude 3.5 Sonnet',
      authorType: 'agent'
    },
    {
      id: 'p7',
      text: '### 3. Deployment',
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p8',
      text: 'The application will be containerized using Docker and deployed to a Kubernetes cluster. Maya also wants staging approval checkpoints called out before the release section.',
      author: externalCollaboratorName,
      authorType: 'human'
    }
  ]);

  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Claude 3.5 Sonnet',
      authorType: 'agent' as const,
      text: 'I suggest we use Redis for caching to improve the performance of the Data Service.',
      time: '10 mins ago',
      resolved: false,
      highlight: 'Data Service',
      type: 'modify'
    },
    {
      id: 2,
      author: externalCollaboratorName,
      authorType: 'human' as const,
      text: 'Please also mention the staging approval step before deployment so our review flow is clear.',
      time: '5 mins ago',
      resolved: true,
      highlight: '### 3. Deployment',
      type: 'comment'
    }
  ]);

  const [versionHistory, setVersionHistory] = useState<VersionHistory[]>([
    {
      id: 'v1',
      author: 'Claude 3.5 Sonnet',
      authorType: 'agent',
      timestamp: '2 mins ago',
      date: 'Today',
      changes: 'Updated deployment section with staging approval',
      paragraphs: [...paragraphs]
    },
    {
      id: 'v2',
      author: externalCollaboratorName,
      authorType: 'human',
      timestamp: '15 mins ago',
      date: 'Today',
      changes: 'Added deployment requirements',
      paragraphs: paragraphs.slice(0, -1)
    },
    {
      id: 'v3',
      author: 'Claude 3.5 Sonnet',
      authorType: 'agent',
      timestamp: '1 hour ago',
      date: 'Today',
      changes: 'Expanded database schema section',
      paragraphs: paragraphs.slice(0, 6)
    },
    {
      id: 'v4',
      author: currentUserName,
      authorType: 'human',
      timestamp: '2 hours ago',
      date: 'Today',
      changes: 'Initial architecture draft',
      paragraphs: paragraphs.slice(0, 3)
    }
  ]);

  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [selectionMenu, setSelectionMenu] = useState<{ x: number, y: number, text: string } | null>(null);
  const commentRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const editorRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      sender: currentUserName,
      senderType: 'human',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, newMsg]);
    setNewMessage('');
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setSelectionMenu(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    setSelectionMenu({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      text: selection.toString()
    });
  };

  const addNewComment = (type: 'comment' | 'modify' = 'comment') => {
    if (!selectionMenu) return;
    
    const newComment = {
      id: Date.now(),
      author: currentUserName,
      authorType: 'human' as const,
      text: '',
      time: 'Just now',
      resolved: false,
      highlight: selectionMenu.text,
      type: type
    };
    
    setComments([newComment, ...comments]);
    setActiveCommentId(newComment.id);
    setSelectionMenu(null);
    
    // Clear selection
    window.getSelection()?.removeAllRanges();
  };
  useEffect(() => {
    if (activeCommentId) {
      const card = commentRefs.current.get(activeCommentId);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      const timer = setTimeout(() => {
        setActiveCommentId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeCommentId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showShareMenu && !(e.target as Element).closest('.share-menu-container')) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShareMenu]);

  const highlightText = (text: string) => {
    let result: (string | React.ReactNode)[] = [text];
    
    comments.forEach(comment => {
      if (comment.resolved) return;
      
      const newResult: (string | React.ReactNode)[] = [];
      result.forEach(part => {
        if (typeof part === 'string') {
          // Case-insensitive match or exact match? Let's stick to exact for now but ensure it exists
          const segments = part.split(comment.highlight);
          segments.forEach((segment, i) => {
            newResult.push(segment);
            if (i < segments.length - 1) {
              newResult.push(
                <span 
                  key={`${comment.id}-${i}`}
                  className={`comment-highlight ${activeCommentId === comment.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCommentId(comment.id);
                  }}
                >
                  {comment.highlight}
                </span>
              );
            }
          });
        } else {
          newResult.push(part);
        }
      });
      result = newResult;
    });
    
    return result;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRestoreVersion = (versionId: string) => {
    const version = versionHistory.find(v => v.id === versionId);
    if (version) {
      setParagraphs([...version.paragraphs]);
      setShowVersionHistory(false);
      setSelectedVersion(null);
    }
  };

  const displayedParagraphs = selectedVersion 
    ? versionHistory.find(v => v.id === selectedVersion)?.paragraphs || paragraphs
    : paragraphs;

  const filteredVersions = versionHistory.filter(v => {
    if (versionFilterAuthor !== 'all' && v.author !== versionFilterAuthor) return false;
    if (versionFilterDate !== 'all' && v.date !== versionFilterDate) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white text-stone-800 flex flex-col font-sans selection:bg-stone-200">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-md hover:bg-stone-100 text-stone-500 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-stone-100 text-stone-600 text-xs font-medium border border-stone-200">
              {isChatLog ? 'Chat Log' : 'Markdown'}
            </span>
            <h1 className="text-sm font-medium text-stone-900">
              {isChatLog ? 'Claude & Maya: Feature Discussion' : 'Project Alpha Architecture'}
            </h1>
          </div>
        </div>
        
          <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-stone-500 mr-4">
            <Clock className="w-3 h-3" />
            Last edited 2 mins ago by Claude
          </div>
          
          <div className="flex -space-x-2 mr-4">
            <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-[10px] text-stone-600 border border-white z-10" title="Claude 3.5 Sonnet">
              <Bot className="w-3 h-3" />
            </div>
            <div
              className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-[10px] text-stone-700 border border-white z-20"
              title={isChatLog ? externalCollaboratorName : currentUserName}
            >
              {(isChatLog ? externalCollaboratorName : currentUserName).charAt(0)}
            </div>
          </div>

          {/* Share Button with Dropdown */}
          <div className="relative share-menu-container">
            <button 
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-stone-100 text-sm font-medium text-stone-600 transition-colors"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
            
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-stone-200 p-4 z-50"
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-stone-700 mb-2 block">权限设置</label>
                    <select
                      value={sharePermission}
                      onChange={(e) => setSharePermission(e.target.value as 'private' | 'view')}
                      className="w-full px-3 py-2 border border-stone-200 rounded-md text-sm focus:outline-none focus:border-stone-400"
                    >
                      <option value="private">仅我自己</option>
                      <option value="view">所有人可查看</option>
                    </select>
                  </div>
                  
                  <div>
                    <button
                      onClick={handleCopyLink}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800 transition-colors"
                    >
                      {copiedLink ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                      {copiedLink ? '已复制' : '复制链接'}
                    </button>
                  </div>
                  
                  <div className="pt-3 border-t border-stone-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-stone-700">高级设置</span>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowDownload}
                          onChange={(e) => setAllowDownload(e.target.checked)}
                          className="rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                        />
                        <span className="text-sm text-stone-600">允许下载</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowCopy}
                          onChange={(e) => setAllowCopy(e.target.checked)}
                          className="rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                        />
                        <span className="text-sm text-stone-600">允许复制</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowDuplicate}
                          onChange={(e) => setAllowDuplicate(e.target.checked)}
                          className="rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                        />
                        <span className="text-sm text-stone-600">允许创建副本</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Version History Button */}
          <button 
            onClick={() => {
              setShowVersionHistory(!showVersionHistory);
              setShowCommentsSidebar(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-stone-100 text-sm font-medium text-stone-600 transition-colors"
          >
            <History className="w-4 h-4" /> 版本历史
          </button>
          
          {/* More Menu Button */}
          <div className="relative">
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-1.5 rounded-md hover:bg-stone-100 text-stone-500 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {showMoreMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMoreMenu(false)} />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1"
                >
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setDuplicateName('副本-Project Alpha Architecture');
                      setDuplicateModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <FilePlus2 className="w-4 h-4 text-stone-400" />
                    创建副本
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setLabelModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <Tag className="w-4 h-4 text-stone-400" />
                    设置标签
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setAgentPermissionModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-stone-400" />
                    Agent权限设置
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Editor & Sidebar */}
      <div className="flex-1 flex overflow-hidden relative" onMouseUp={handleMouseUp}>
        {/* Floating Selection Menu */}
        {selectionMenu && !isChatLog && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            style={{ 
              position: 'fixed', 
              left: selectionMenu.x, 
              top: selectionMenu.y, 
              transform: 'translate(-50%, -100%)',
              zIndex: 50
            }}
            className="flex items-center gap-1 bg-stone-900 text-white p-1 rounded-lg shadow-xl border border-stone-700"
          >
            <button 
              onClick={() => addNewComment('comment')}
              className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-stone-800 rounded-md text-xs font-medium transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Comment
            </button>
            <div className="w-px h-4 bg-stone-700 mx-1" />
            <button 
              onClick={() => addNewComment('modify')}
              className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-stone-800 rounded-md text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Modify
            </button>
            <div className="w-px h-4 bg-stone-700 mx-1" />
            <button className="p-1.5 hover:bg-stone-800 rounded-md transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </motion.div>
        )}

        {/* Main Editor */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 bg-white" ref={editorRef}>
          <div className="max-w-3xl mx-auto space-y-6">
            {isChatLog ? (
              <div className="space-y-8">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.senderType === 'human' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                        msg.senderType === 'agent' 
                          ? 'bg-stone-50 text-stone-500 border-stone-200' 
                          : 'bg-stone-100 text-stone-700 border-stone-300'
                      }`}>
                        {msg.senderType === 'agent' ? <Bot className="w-3 h-3" /> : msg.sender.charAt(0)}
                      </div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{msg.sender}</span>
                      <span className="text-[10px] text-stone-300">{msg.time}</span>
                    </div>
                    <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm border ${
                      msg.senderType === 'human' 
                        ? 'bg-stone-900 text-white border-stone-800 rounded-tr-none' 
                        : 'bg-stone-50 text-stone-800 border-stone-200 rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-12 border-t border-stone-100">
                  <div className="relative">
                    <textarea 
                      placeholder="Type a message to continue the conversation..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 pr-14 text-sm focus:outline-none focus:border-stone-400 focus:bg-white transition-all shadow-sm resize-none h-32"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="absolute right-4 bottom-4 p-2.5 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/10"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              displayedParagraphs.map((p) => (
                <div key={p.id} className="group relative pl-10">
                  {/* Author Indicator */}
                  <div className="absolute left-0 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border shadow-sm ${
                      p.authorType === 'agent' 
                        ? 'bg-stone-50 text-stone-500 border-stone-200' 
                        : 'bg-stone-100 text-stone-700 border-stone-300'
                    }`} title={`Written by ${p.author}`}>
                      {p.authorType === 'agent' ? <Bot className="w-3 h-3" /> : p.author.charAt(0)}
                    </div>
                  </div>
                  
                  <div 
                    className="w-full bg-transparent border-none focus:outline-none text-stone-800 font-sans text-lg leading-relaxed whitespace-pre-wrap"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => {
                      const newText = e.currentTarget.innerText;
                      setParagraphs(prev => prev.map(item => item.id === p.id ? { ...item, text: newText } : item));
                    }}
                  >
                    {highlightText(p.text)}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {/* Comments Sidebar */}
        {!isChatLog && showCommentsSidebar && (
          <aside className="w-80 border-l border-stone-200 bg-stone-50 flex flex-col">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-white">
            <h2 className="text-sm font-medium flex items-center gap-2 text-stone-900">
              <MessageSquare className="w-4 h-4 text-stone-500" />
              Comments
            </h2>
            <span className="bg-stone-100 text-xs px-2 py-0.5 rounded-full text-stone-600 font-medium">
              {comments.length}
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {comments.map((comment) => (
              <motion.div 
                key={comment.id}
                ref={(el) => {
                  if (el) commentRefs.current.set(comment.id, el);
                  else commentRefs.current.delete(comment.id);
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setActiveCommentId(comment.id)}
                className={`p-4 rounded-xl border bg-white shadow-sm cursor-pointer transition-all comment-card ${
                  activeCommentId === comment.id 
                    ? 'active border-stone-400 ring-2 ring-stone-900/5' 
                    : 'border-stone-200'
                } ${
                  comment.resolved 
                    ? 'opacity-60' 
                    : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                      comment.type === 'modify' 
                        ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                        : 'bg-stone-100 text-stone-600 border border-stone-200'
                    }`}>
                      {comment.type === 'modify' ? 'Suggestion' : 'Comment'}
                    </span>
                    <span className="text-[10px] text-stone-400">•</span>
                    <span className="text-[10px] text-stone-500">{comment.time}</span>
                  </div>
                  {comment.resolved && (
                    <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Resolved
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {comment.authorType === 'human' ? (
                    <div className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center text-[10px] text-stone-700">
                      {comment.author.charAt(0)}
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center text-[10px] text-stone-600">
                      <Bot className="w-3 h-3" />
                    </div>
                  )}
                  <span className="text-xs font-medium text-stone-900">{comment.author}</span>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-start gap-2 mb-2 p-2 bg-stone-50 rounded-lg border-l-2 border-stone-300">
                    <div className="mt-0.5">
                      <Quote className="w-3 h-3 text-stone-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-stone-600 italic line-clamp-2">
                        "{comment.highlight}"
                      </span>
                    </div>
                  </div>
                  {activeCommentId === comment.id && !comment.text ? (
                    <div className="px-1">
                      <textarea
                        autoFocus
                        placeholder="Write a comment..."
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm focus:outline-none focus:border-stone-300 transition-colors resize-none"
                        rows={3}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            const val = (e.target as HTMLTextAreaElement).value;
                            if (val.trim()) {
                              setComments(prev => prev.map(c => c.id === comment.id ? { ...c, text: val } : c));
                            }
                          }
                        }}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button 
                          onClick={() => setComments(prev => prev.filter(c => c.id !== comment.id))}
                          className="px-2 py-1 text-[10px] font-medium text-stone-500 hover:text-stone-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={(e) => {
                            const textarea = e.currentTarget.parentElement?.previousElementSibling as HTMLTextAreaElement;
                            if (textarea.value.trim()) {
                              setComments(prev => prev.map(c => c.id === comment.id ? { ...c, text: textarea.value } : c));
                            }
                          }}
                          className="px-2 py-1 bg-stone-900 text-white text-[10px] font-medium rounded hover:bg-stone-800 transition-colors"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-stone-700 leading-relaxed px-1">
                      {comment.text || (
                        <span className="text-stone-400 italic">Add your comment...</span>
                      )}
                    </p>
                  )}
                </div>
                
                {!comment.resolved && (
                  <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-stone-100">
                    {comment.type === 'modify' ? (
                      <>
                        <div className="flex items-center gap-2">
                          <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-xs font-medium text-emerald-700 transition-colors border border-emerald-200">
                            <Check className="w-3 h-3" /> Accept
                          </button>
                          <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-rose-50 hover:bg-rose-100 text-xs font-medium text-rose-700 transition-colors border border-rose-200">
                            <X className="w-3 h-3" /> Reject
                          </button>
                        </div>
                        <button className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-600 transition-colors border border-stone-200">
                          <Reply className="w-3 h-3" /> Reply
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-600 transition-colors border border-stone-200">
                          <Reply className="w-3 h-3" /> Reply
                        </button>
                        <button className="flex items-center justify-center gap-1 flex-1 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-xs font-medium text-white transition-colors">
                          <CheckCircle2 className="w-3 h-3" /> Resolve
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="p-4 border-t border-stone-200 bg-white">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Add a comment..." 
                className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:border-stone-300 focus:bg-white transition-colors text-stone-800 placeholder:text-stone-400"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded bg-stone-900 text-white hover:bg-stone-800 transition-colors">
                <Sparkles className="w-3 h-3" />
              </button>
            </div>
          </div>
        </aside>
        )}

        {/* Version History Sidebar */}
        {!isChatLog && showVersionHistory && (
          <aside className="w-80 border-l border-stone-200 bg-stone-50 flex flex-col">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-white">
              <h2 className="text-sm font-medium flex items-center gap-2 text-stone-900">
                <History className="w-4 h-4 text-stone-500" />
                版本历史
              </h2>
              <button
                onClick={() => {
                  setShowVersionHistory(false);
                  setSelectedVersion(null);
                }}
                className="p-1 rounded hover:bg-stone-100 text-stone-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-stone-200 bg-white space-y-3">
              <div>
                <label className="text-xs font-medium text-stone-600 mb-1.5 block">按日期筛选</label>
                <select
                  value={versionFilterDate}
                  onChange={(e) => setVersionFilterDate(e.target.value)}
                  className="w-full px-2 py-1.5 border border-stone-200 rounded text-xs focus:outline-none focus:border-stone-400"
                >
                  <option value="all">全部</option>
                  <option value="Today">今天</option>
                  <option value="Yesterday">昨天</option>
                  <option value="This Week">本周</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-600 mb-1.5 block">按协作人筛选</label>
                <select
                  value={versionFilterAuthor}
                  onChange={(e) => setVersionFilterAuthor(e.target.value)}
                  className="w-full px-2 py-1.5 border border-stone-200 rounded text-xs focus:outline-none focus:border-stone-400"
                >
                  <option value="all">全部</option>
                  <option value={currentUserName}>{currentUserName}</option>
                  <option value={externalCollaboratorName}>{externalCollaboratorName}</option>
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                </select>
              </div>
            </div>

            {/* Version List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredVersions.map((version) => (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg border bg-white cursor-pointer transition-all ${
                    selectedVersion === version.id
                      ? 'border-stone-400 ring-2 ring-stone-900/5'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                  onClick={() => setSelectedVersion(version.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {version.authorType === 'agent' ? (
                        <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center">
                          <Bot className="w-3 h-3 text-stone-600" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-[10px] text-stone-700">
                          {version.author.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-medium text-stone-900">{version.author}</div>
                        <div className="text-[10px] text-stone-500">{version.timestamp}</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-stone-600 mb-3">{version.changes}</p>
                  
                  {selectedVersion === version.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestoreVersion(version.id);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-md text-xs font-medium hover:bg-stone-800 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      还原到此版本
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* Duplicate Modal */}
      {duplicateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDuplicateModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-lg font-semibold mb-4">创建副本</h2>
            <input
              type="text"
              value={duplicateName}
              onChange={(e) => setDuplicateName(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400 mb-4"
              placeholder="副本名称"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDuplicateModalOpen(false)}
                className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (duplicateName.trim()) {
                    alert(`已创建副本：${duplicateName}`);
                    // Here you would actually create the duplicate in the backend
                  }
                  setDuplicateModalOpen(false);
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                确认
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Label Modal */}
      {labelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setLabelModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-lg font-semibold mb-4">设置标签</h2>
            
            {/* Current labels */}
            <div className="mb-4">
              <p className="text-xs font-medium text-stone-600 mb-2">已有标签</p>
              <div className="flex flex-wrap gap-2">
                {documentLabels.map((label, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 text-stone-700 rounded-md text-xs"
                  >
                    {label}
                    <button
                      onClick={() => setDocumentLabels(prev => prev.filter((_, i) => i !== idx))}
                      className="hover:text-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Input for new label */}
            <div className="mb-4">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tagInput.trim() && !documentLabels.includes(tagInput.trim())) {
                    setDocumentLabels(prev => [...prev, tagInput.trim()]);
                    setTagInput('');
                  }
                }}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400 text-sm"
                placeholder="输入标签后按回车添加"
              />
            </div>

            {/* Historical tags */}
            <div className="mb-4">
              <p className="text-xs font-medium text-stone-600 mb-2">历史标签</p>
              <div className="flex flex-wrap gap-2">
                {usedTags
                  .filter(tag => !documentLabels.includes(tag))
                  .map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => setDocumentLabels(prev => [...prev, tag])}
                      className="px-2.5 py-1 bg-white border border-stone-200 text-stone-600 rounded-md text-xs hover:bg-stone-50 hover:border-stone-300 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setLabelModalOpen(false)}
                className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setLabelModalOpen(false);
                  alert(`标签已更新：${documentLabels.join(', ')}`);
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                确认
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Agent Permission Modal */}
      {agentPermissionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setAgentPermissionModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-lg font-semibold mb-4">Agent权限设置</h2>
            
            {/* Agent list with permissions */}
            <div className="space-y-3 mb-4">
              {agentPermissions.map((agent) => (
                <div key={agent.agentId} className="flex items-center justify-between p-3 border border-stone-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-stone-900">{agent.agentName}</span>
                  </div>
                  <select
                    value={agent.permission}
                    onChange={(e) => {
                      const newPermission = e.target.value as 'read' | 'edit';
                      setAgentPermissions(prev => 
                        prev.map(a => a.agentId === agent.agentId ? { ...a, permission: newPermission } : a)
                      );
                    }}
                    className="px-3 py-1.5 border border-stone-200 rounded-md text-sm focus:outline-none focus:border-stone-400"
                  >
                    <option value="read">仅读取</option>
                    <option value="edit">可编辑</option>
                  </select>
                </div>
              ))}
            </div>

            {/* Add Agent button */}
            <button
              onClick={() => {
                const newAgentId = `agent${agentPermissions.length + 1}`;
                const newAgentName = prompt('输入Agent名称：');
                if (newAgentName?.trim()) {
                  setAgentPermissions(prev => [...prev, { 
                    agentId: newAgentId, 
                    agentName: newAgentName.trim(), 
                    permission: 'read' 
                  }]);
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-stone-300 text-stone-600 rounded-lg text-sm font-medium hover:border-stone-400 hover:text-stone-900 transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加Agent
            </button>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setAgentPermissionModalOpen(false)}
                className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setAgentPermissionModalOpen(false);
                  alert('Agent权限已更新');
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                确认
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
