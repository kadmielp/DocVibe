import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Wizard } from './components/Wizard';
import { ProjectView } from './components/ProjectView';
import { SettingsModal } from './components/SettingsModal';
import { Project, ViewState, Language, AiModel } from './types';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>({ type: 'DASHBOARD' });
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState<Language>('pt-br');
  const [aiModel, setAiModel] = useState<AiModel>('gemini-3-pro-preview');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', short: 'EN', flag: '🇺🇸' },
    { code: 'pt-br', label: 'Português', short: 'PT', flag: '🇧🇷' },
    { code: 'es', label: 'Español', short: 'ES', flag: '🇪🇸' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  useEffect(() => {
    const savedProjects = localStorage.getItem('docugen_projects');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        console.error("Failed to parse projects", e);
      }
    }

    const savedModel = localStorage.getItem('docugen_model');
    if (savedModel && (savedModel === 'gemini-3-pro-preview' || savedModel === 'gemini-2.5-flash')) {
      setAiModel(savedModel as AiModel);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('docugen_projects', JSON.stringify(projects));
  }, [projects]);

  const handleModelChange = (model: AiModel) => {
    setAiModel(model);
    localStorage.setItem('docugen_model', model);
  };

  const handleNewProject = () => setViewState({ type: 'WIZARD' });

  const handleProjectComplete = (project: Project) => {
    setProjects(prev => [project, ...prev]);
    setViewState({ type: 'PROJECT_VIEW', projectId: project.id });
  };

  const handleSelectProject = (id: string) => setViewState({ type: 'PROJECT_VIEW', projectId: id });

  const handleDeleteProject = (id: string) => {
    if (confirm(language === 'pt-br' ? "Tem certeza que deseja excluir este projeto?" : language === 'es' ? "¿Estás seguro de que quieres eliminar este proyecto?" : "Are you sure you want to delete this project?")) {
        setProjects(prev => prev.filter(p => p.id !== id));
        if (viewState.type === 'PROJECT_VIEW' && viewState.projectId === id) {
            setViewState({ type: 'DASHBOARD' });
        }
    }
  };

  const handleDeleteAccount = () => {
      setProjects([]);
      localStorage.removeItem('docugen_projects');
      alert(language === 'pt-br' ? "Dados da conta apagados." : language === 'es' ? "Datos de la cuenta borrados." : "Account data cleared.");
      setViewState({ type: 'DASHBOARD' });
  }

  const handleImportData = (importedProjects: Project[]) => {
    if (!Array.isArray(importedProjects)) {
        alert(language === 'pt-br' ? "Formato de arquivo inválido." : language === 'es' ? "Formato de archivo inválido." : "Invalid file format.");
        return;
    }
    const isValid = importedProjects.every(p => p && typeof p.id === 'string' && typeof p.name === 'string');
    if (isValid) {
        if(confirm(language === 'pt-br' ? "Isso substituirá seus projetos atuais. Deseja continuar?" : language === 'es' ? "Esto reemplazará sus proyectos actuales. ¿Desea continuar?" : "This will replace your current projects. Do you want to continue?")) {
            setProjects(importedProjects);
            setIsSettingsOpen(false);
        }
    } else {
         alert("Invalid format");
    }
  };

  const renderContent = () => {
    switch (viewState.type) {
      case 'DASHBOARD':
        return <Dashboard projects={projects} onNewProject={handleNewProject} onSelectProject={handleSelectProject} onDeleteProject={handleDeleteProject} isDark={isDark} language={language} />;
      case 'WIZARD':
        return <Wizard onComplete={handleProjectComplete} onCancel={() => setViewState({ type: 'DASHBOARD' })} language={language} aiModel={aiModel} />;
      case 'PROJECT_VIEW':
        const project = projects.find(p => p.id === viewState.projectId);
        if (!project) return <div className="p-10 text-center">Project not found</div>;
        return <ProjectView project={project} onBack={() => setViewState({ type: 'DASHBOARD' })} language={language} />;
    }
  };

  const getNewProjectText = () => {
      if (language === 'pt-br') return 'Novo Projeto';
      if (language === 'es') return 'Nuevo Proyecto';
      return 'New Project';
  }

  return (
    <div className={`min-h-screen text-foreground transition-colors duration-300 flex flex-col font-sans selection:bg-primary/30 selection:text-foreground`}>
        {/* Glass Header */}
        <header className="h-16 border-b border-border/40 glass sticky top-0 z-40 flex items-center justify-between px-4 md:px-8">
            <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setViewState({ type: 'DASHBOARD' })}
            >
                <div className="bg-gradient-to-br from-primary to-purple-600 text-white p-1.5 rounded-xl shadow-lg shadow-primary/25 group-hover:rotate-3 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold tracking-tight text-foreground">DocVibe</span>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
                <button 
                    onClick={handleNewProject}
                    className="hidden md:flex items-center text-sm font-medium text-subtle hover:text-primary transition-colors"
                >
                    <span className="mr-2">+</span>
                    <span>{getNewProjectText()}</span>
                </button>
                
                {/* Language Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-surface/50 hover:bg-surface-highlight hover:border-border transition-all"
                    >
                        <span className="text-lg leading-none">{currentLang.flag}</span>
                        <span className="text-xs font-semibold text-foreground/80 hidden sm:inline-block">{currentLang.short}</span>
                    </button>
                    
                    {isLangMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)}></div>
                            <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-slide-up z-50 p-1">
                                {languages.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang.code as Language);
                                            setIsLangMenuOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${language === lang.code ? 'bg-primary/10 text-primary font-medium' : 'text-foreground/70 hover:bg-surface-highlight'}`}
                                    >
                                        <span className="text-lg">{lang.flag}</span>
                                        <span className="text-sm">{lang.label}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 rounded-full text-subtle hover:text-foreground hover:bg-surface-highlight transition-all"
                    aria-label="Settings"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 animate-fade-in flex flex-col">
             {renderContent()}
        </main>

        <SettingsModal 
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            isDark={isDark}
            toggleTheme={toggleTheme}
            language={language}
            projects={projects}
            onDeleteAccount={handleDeleteAccount}
            onImportData={handleImportData}
            aiModel={aiModel}
            onModelChange={handleModelChange}
        />
    </div>
  );
};

export default App;