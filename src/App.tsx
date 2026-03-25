/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DocumentEditor from './pages/DocumentEditor';
import SkillsPage from './pages/SkillsPage';

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/document" element={<DocumentEditor />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
