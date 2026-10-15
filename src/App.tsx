import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MarketProvider } from './context/MarketContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ClosedTrade } from './types';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { LearningCenterPage } from './pages/LearningCenterPage';
import { MarketAnalysisPage } from './pages/MarketAnalysisPage';
import { PracticeSimulatorPage } from './pages/PracticeSimulatorPage';
import { TradeJournalPage } from './pages/TradeJournalPage';
import { NovaAiPage } from './pages/NovaAiPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { RewardsPage } from './pages/RewardsPage';
import { CommunityPage } from './pages/CommunityPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';
import { HelpFaqPage, SafetyDisclaimerPage, TermsPage, PrivacyPage } from './pages/LegalPages';

function AppContent() {
  const { user, isGuest, continueAsGuest } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Cross-page state transfers
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [initialTradeForJournal, setInitialTradeForJournal] = useState<ClosedTrade | null>(null);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    navigate('learning');
  };

  const handleOpenJournalWithTrade = (trade: ClosedTrade) => {
    setInitialTradeForJournal(trade);
    navigate('journal');
  };

  // If on landing or auth pages without logging in
  const isAuthOrLanding = currentRoute === 'landing' || currentRoute === 'login' || currentRoute === 'signup';

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        currentRoute={currentRoute}
        navigate={navigate}
      />

      {/* Main Layout Area */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        {!isAuthOrLanding && (
          <Sidebar
            currentRoute={currentRoute}
            navigate={navigate}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Content Viewport */}
        <main className={`flex-1 ${!isAuthOrLanding ? 'lg:pl-64' : ''} p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full`}>
          {currentRoute === 'landing' && (
            <LandingPage
              navigate={navigate}
              onExploreAsGuest={() => {
                continueAsGuest();
                navigate('dashboard');
              }}
            />
          )}

          {currentRoute === 'login' && <AuthPage initialMode="login" navigate={navigate} />}
          {currentRoute === 'signup' && <AuthPage initialMode="signup" navigate={navigate} />}

          {currentRoute === 'dashboard' && (
            <DashboardPage navigate={navigate} onSelectCourse={handleSelectCourse} />
          )}

          {currentRoute === 'learning' && (
            <LearningCenterPage
              selectedCourseId={selectedCourseId}
              onClearSelectedCourse={() => setSelectedCourseId(null)}
              navigate={navigate}
            />
          )}

          {currentRoute === 'market' && <MarketAnalysisPage navigate={navigate} />}

          {currentRoute === 'practice' && (
            <PracticeSimulatorPage
              navigate={navigate}
              onOpenJournalWithTrade={handleOpenJournalWithTrade}
            />
          )}

          {currentRoute === 'journal' && (
            <TradeJournalPage
              initialTradeForModal={initialTradeForJournal}
              onClearInitialTrade={() => setInitialTradeForJournal(null)}
              navigate={navigate}
            />
          )}

          {currentRoute === 'nova-ai' && <NovaAiPage />}

          {currentRoute === 'challenges' && <ChallengesPage navigate={navigate} />}

          {currentRoute === 'analytics' && <AnalyticsPage />}

          {currentRoute === 'leaderboard' && <LeaderboardPage />}

          {currentRoute === 'rewards' && <RewardsPage />}

          {currentRoute === 'community' && <CommunityPage />}

          {currentRoute === 'profile' && <ProfilePage />}

          {currentRoute === 'settings' && <SettingsPage />}

          {currentRoute === 'admin' && <AdminPage />}

          {currentRoute === 'faq' && <HelpFaqPage />}
          {currentRoute === 'disclaimer' && <SafetyDisclaimerPage />}
          {currentRoute === 'terms' && <TermsPage />}
          {currentRoute === 'privacy' && <PrivacyPage />}
        </main>
      </div>

      {/* Global Clean Footer */}
      <footer className="border-t border-slate-800/80 bg-[#06080E] py-6 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">DecroTrade</span>
            <span>&bull;</span>
            <span>Learn the Market. Master the Strategy.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <button onClick={() => navigate('faq')} className="hover:text-white">Help & FAQ</button>
            <button onClick={() => navigate('disclaimer')} className="hover:text-white">Safety Disclaimer</button>
            <button onClick={() => navigate('terms')} className="hover:text-white">Terms of Service</button>
            <button onClick={() => navigate('privacy')} className="hover:text-white">Privacy Policy</button>
          </div>

          <div className="text-[11px] text-slate-500">
            Simulated Practice Platform &bull; Zero Real-Money Transactions
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MarketProvider>
        <AppContent />
      </MarketProvider>
    </AuthProvider>
  );
}
