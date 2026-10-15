import React, { useState, useEffect } from 'react';
import { CommunityPost } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Flag,
  Plus,
  Send,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const { user, token, refreshUser } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // New Post Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<any>('Strategy Analysis');
  const [symbolTag, setSymbolTag] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/community/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          category,
          symbolTag: symbolTag ? symbolTag.toUpperCase() : undefined
        })
      });

      if (res.ok) {
        setShowCreateModal(false);
        setTitle('');
        setContent('');
        setSymbolTag('');
        setFeedback('Post published to the community feed (+20 XP)!');
        await fetchPosts();
        await refreshUser();
        setTimeout(() => setFeedback(null), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleLike = async (postId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchPosts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async (postId: string) => {
    const commentText = commentInputs[postId];
    if (!token || !commentText?.trim()) return;

    try {
      const res = await fetch(`/api/community/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentText.trim() })
      });
      if (res.ok) {
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
        await fetchPosts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReport = async (postId: string) => {
    if (!window.confirm('Report this post to DecroTrade moderators for review?')) return;
    try {
      await fetch(`/api/community/posts/${postId}/report`, {
        method: 'POST'
      });
      setFeedback('Post reported. Thank you for keeping DecroTrade professional and safe.');
      await fetchPosts();
      setTimeout(() => setFeedback(null), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredPosts = posts.filter(
    (p) => filterCategory === 'All' || p.category === filterCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-violet-400" />
            Community Learning & Strategy Exchange
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Share technical observations, discuss course concepts, and dissect market setups with fellow students.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-violet-500 transition"
        >
          <Plus className="h-4 w-4" />
          <span>New Discussion Post</span>
        </button>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-950/60 p-3 text-xs text-emerald-300 border border-emerald-800/60">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        {['All', 'Strategy Analysis', 'Learning Notes', 'Risk Management', 'Market Discussion', 'Question'].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`rounded-lg px-3 py-1.5 font-medium transition ${
                filterCategory === cat
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-[#0B0F19] p-12 text-center text-xs text-slate-500">
            No community posts in this category yet. Be the first to start a discussion!
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isLiked = user && post.likedBy.includes(user.id);
            const isExpanded = expandedPostId === post.id;

            return (
              <div
                key={post.id}
                className="rounded-xl border border-slate-800 bg-[#0B0F19] p-5 shadow space-y-3"
              >
                {/* Author & Category Header */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-950 text-violet-300 font-bold text-xs border border-violet-800/40">
                      {post.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-white block">{post.authorName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {post.symbolTag && (
                      <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-300">
                        ${post.symbolTag}
                      </span>
                    )}
                    <span className="rounded bg-violet-950 px-2 py-0.5 text-[10px] font-semibold text-violet-300 border border-violet-800/40">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">{post.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{post.content}</p>
                </div>

                {/* Actions & Comment toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1.5 transition ${
                        isLiked ? 'text-violet-400 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <ThumbsUp className={`h-3.5 w-3.5 ${isLiked ? 'fill-violet-400' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white transition"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{post.commentCount} Comments</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleReport(post.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Report post"
                  >
                    <Flag className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Comments Section */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-800/60 space-y-3">
                    <div className="space-y-2">
                      {post.comments.length === 0 ? (
                        <div className="text-[11px] text-slate-500 py-1">No comments yet.</div>
                      ) : (
                        post.comments.map((comm) => (
                          <div
                            key={comm.id}
                            className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800/80 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-white">{comm.userName}</span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {new Date(comm.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-slate-300 text-[11px]">{comm.content}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add comment input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        placeholder="Add a constructive educational comment..."
                        className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-violet-500"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* New Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0B0F19] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">New Community Discussion Post</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Post Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Observations on Bearish Divergence in Bitcoin"
                  className="w-full rounded bg-slate-900 border border-slate-800 p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Topic Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded bg-slate-900 border border-slate-800 p-2 text-white"
                  >
                    <option value="Strategy Analysis">Strategy Analysis</option>
                    <option value="Learning Notes">Learning Notes</option>
                    <option value="Risk Management">Risk Management</option>
                    <option value="Market Discussion">Market Discussion</option>
                    <option value="Question">Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Symbol Tag (Optional)</label>
                  <input
                    type="text"
                    value={symbolTag}
                    onChange={(e) => setSymbolTag(e.target.value)}
                    placeholder="e.g. AAPL, BTC/USD"
                    className="w-full rounded bg-slate-900 border border-slate-800 p-2 font-mono text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Discussion Content</label>
                <textarea
                  required
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your technical thesis, questions, or risk management observations..."
                  className="w-full rounded bg-slate-900 border border-slate-800 p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-violet-600 px-5 py-2 font-bold text-white hover:bg-violet-500"
                >
                  Publish Post (+20 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
