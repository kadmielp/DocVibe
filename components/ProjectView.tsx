import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Project, Documentation, Language } from '../types';
import { Button } from './Button';

interface ProjectViewProps {
  project: Project;
  onBack: () => void;
  language: Language;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ project, onBack, language }) => {
  const [activeTab, setActiveTab] = useState<keyof Documentation>('prd');
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const t = (key: string) => {
      const texts: Record<string, Record<Language, string>> = {
          'prd': { en: 'Product Requirements', 'pt-br': 'Requisitos do Produto', es: 'Requisitos del Producto' },
          'techStack': { en: 'Tech Stack', 'pt-br': 'Tech Stack', es: 'Stack Tecnológico' },
          'projectStructure': { en: 'Project Structure', 'pt-br': 'Estrutura do Projeto', es: 'Estructura del Proyecto' },
          'schemaDesign': { en: 'Schema Design', 'pt-br': 'Design do Schema', es: 'Diseño de Esquema' },
          'userFlow': { en: 'User Flow', 'pt-br': 'Fluxo do Usuário', es: 'Flujo de Usuario' },
          'stylingGuidelines': { en: 'Styling', 'pt-br': 'Estilo', es: 'Estilo' },
          'back': { en: 'Back', 'pt-br': 'Voltar', es: 'Volver' },
          'download': { en: 'Download', 'pt-br': 'Baixar', es: 'Descargar' },
          'download_all': { en: 'Download All', 'pt-br': 'Baixar Tudo', es: 'Descargar Todo' },
          'created': { en: 'Created', 'pt-br': 'Criado em', es: 'Creado el' },
          'copy': { en: 'Copy', 'pt-br': 'Copiar', es: 'Copiar' },
          'copied': { en: 'Copied!', 'pt-br': 'Copiado!', es: '¡Copiado!' },
      };
      return texts[key]?.[language] || texts[key]?.['en'];
  };

  const tabs: { key: keyof Documentation; label: string }[] = [
    { key: 'prd', label: t('prd') },
    { key: 'techStack', label: t('techStack') },
    { key: 'projectStructure', label: t('projectStructure') },
    { key: 'schemaDesign', label: t('schemaDesign') },
    { key: 'userFlow', label: t('userFlow') },
    { key: 'stylingGuidelines', label: t('stylingGuidelines') },
  ];

  const handleDownload = (key: keyof Documentation | 'all') => {
    if (!project.documentation) return;

    if (key === 'all') {
      let fullContent = `# ${project.name} - Full Documentation\n\n`;
      tabs.forEach(tab => {
        fullContent += `\n---\n\n## ${tab.label}\n\n${project.documentation![tab.key]}\n`;
      });
      const blob = new Blob([fullContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.replace(/\s+/g, '_')}_Full_Docs.md`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const content = project.documentation[key];
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.replace(/\s+/g, '_')}_${key}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setIsDownloadOpen(false);
  };

  const handleCopy = () => {
      if (!project.documentation) return;
      const content = project.documentation[activeTab];
      navigator.clipboard.writeText(content).then(() => {
          setCopyStatus('copied');
          setTimeout(() => setCopyStatus('idle'), 2000);
      });
  };

  if (!project.documentation) {
    return <div className="text-error flex items-center justify-center h-full">Error loading documentation.</div>;
  }

  const activeTabLabel = tabs.find(t => t.key === activeTab)?.label;

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col animate-fade-in w-full bg-surface border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex flex-col w-full md:w-auto">
          <h1 className="text-xl font-bold tracking-tight text-foreground truncate flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            {project.name}
          </h1>
          <p className="text-xs text-subtle mt-1 font-mono uppercase tracking-wide opacity-70">{project.id.slice(0, 8)} • {new Date(project.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
            <Button variant="ghost" onClick={onBack} className="text-xs px-3 py-1.5 h-8">
               <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
               {t('back')}
            </Button>
            
            <div className="flex items-center gap-2">
                <Button 
                    onClick={handleCopy} 
                    variant="outline"
                    className={`text-xs px-3 py-1.5 h-8 ${copyStatus === 'copied' ? 'bg-success/10 text-success border-success/20' : ''}`}
                >
                    {copyStatus === 'copied' ? t('copied') : t('copy')}
                </Button>

                <div className="relative">
                <Button onClick={() => setIsDownloadOpen(!isDownloadOpen)} variant="secondary" className="text-xs px-3 py-1.5 h-8">
                    {t('download')}
                    <svg className={`w-3 h-3 ml-2 transition-transform ${isDownloadOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </Button>
                
                {isDownloadOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-up">
                    <button 
                        onClick={() => handleDownload('all')}
                        className="w-full text-left px-4 py-3 text-xs font-medium hover:bg-surface-highlight flex items-center border-b border-border/50 transition-colors"
                    >
                        <svg className="w-3.5 h-3.5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        {t('download_all')}
                    </button>
                    {tabs.map(tab => (
                        <button 
                        key={tab.key}
                        onClick={() => handleDownload(tab.key)}
                        className="w-full text-left px-4 py-2 text-xs text-subtle hover:text-foreground hover:bg-surface-highlight transition-colors"
                        >
                        {tab.label}
                        </button>
                    ))}
                    </div>
                )}
                </div>
            </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 bg-surface-highlight/30 border-b lg:border-b-0 lg:border-r border-border flex flex-col flex-shrink-0 z-10">
            <div className="p-2 lg:p-4 overflow-x-auto lg:overflow-visible">
                <nav className="flex lg:flex-col space-x-1 lg:space-x-0 lg:space-y-1 min-w-max px-2 lg:px-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center justify-between ${
                                activeTab === tab.key
                                ? 'bg-surface text-foreground shadow-sm ring-1 ring-border'
                                : 'text-subtle hover:text-foreground hover:bg-surface-highlight/50'
                            }`}
                        >
                            {tab.label}
                            {activeTab === tab.key && <div className="w-1.5 h-1.5 rounded-full bg-primary lg:ml-2"></div>}
                        </button>
                    ))}
                </nav>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-surface overflow-y-auto custom-scrollbar p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                <div className="markdown-content animate-fade-in">
                    <ReactMarkdown
                        components={{
                            a: ({node, ...props}) => (
                                <a 
                                    {...props} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-primary hover:underline underline-offset-4 decoration-primary/30"
                                />
                            ),
                            script: () => null,
                            iframe: () => null,
                        }}
                    >
                        {project.documentation[activeTab]}
                    </ReactMarkdown>
                </div>
                {/* Footer of content for spacing */}
                <div className="h-20"></div>
            </div>
        </div>
      </div>
    </div>
  );
};