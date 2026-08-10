import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cpu, Lock, Mail, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';
import { PROJECT_INFO } from '../utils/mockData';

export const LoginPage = () => {
  const [email, setEmail] = useState('ce.student@college.edu');
  const [password, setPassword] = useState('student2026');
  const [rememberMe, setRememberMe] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(email, password, rememberMe)) {
      navigate('/dashboard');
    }
  };

  const handleDemoLogin = () => {
    login('ce.student@college.edu', 'demo123', true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-bgDark flex items-center justify-center p-4 sm:p-6 bg-grid-pattern relative overflow-hidden">
      {/* Soft Glow Ambient Backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primaryCyan/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-cardDark border border-cardBorder rounded-2xl shadow-2xl p-8 relative z-10 space-y-6">
        {/* Academic Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-br from-primaryCyan to-blue-600 text-bgDark shadow-cyan-glow mb-1">
            <Cpu className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-textLight tracking-tight">
              {PROJECT_INFO.title}
            </h1>
            <p className="text-xs text-primaryCyan font-semibold font-mono mt-1">
              {PROJECT_INFO.department}
            </p>
            <p className="text-[11px] text-textDark mt-0.5">
              B.Tech Capstone Project Portal ({PROJECT_INFO.academicYear})
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-textMuted mb-1.5">
              Academic Email / Student ID
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-textDark" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-cardBorder rounded-xl text-sm text-textLight placeholder-textDark focus:outline-none focus:border-primaryCyan focus:ring-1 focus:ring-primaryCyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-textMuted mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-textDark" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-cardBorder rounded-xl text-sm text-textLight placeholder-textDark focus:outline-none focus:border-primaryCyan focus:ring-1 focus:ring-primaryCyan"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-textMuted select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-cardBorder bg-slate-900 text-primaryCyan focus:ring-primaryCyan"
              />
              Remember Me
            </label>
            <span className="text-textDark font-mono text-[10px]">Project ID: {PROJECT_INFO.projectId}</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primaryCyan text-bgDark font-bold text-sm shadow-soft-glow hover:bg-sky-400 transition-all flex items-center justify-center gap-2"
          >
            <span>Access Project Control Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Student Demo Login Button */}
        <div className="pt-4 border-t border-cardBorder/80 space-y-3">
          <button
            onClick={handleDemoLogin}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl border border-secondaryGreen/40 bg-secondaryGreen/10 text-secondaryGreen hover:bg-secondaryGreen/20 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>One-Click Academic Evaluator Login</span>
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-textDark">
            <GraduationCap className="w-3.5 h-3.5 text-warningAmber" />
            <span>Developed by Harshal & Team • Dept of CE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
