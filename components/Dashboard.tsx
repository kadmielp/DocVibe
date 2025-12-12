import React from 'react';
import { Project, Language } from '../types';
import { Button } from './Button';

interface DashboardProps {
  projects: Project[];
  onNewProject: () => void;
  onSelectProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  isDark: boolean;
  language: Language;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  projects, 
  onNewProject, 
  onSelectProject,
  onDeleteProject,
  isDark,
  language
}) => {
  
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const draftProjects = projects.filter(p => p.status === 'draft').length;
  
  // Calculate completion percentage
  const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  const t = (key: string) => {
      const texts: Record<string, Record<Language, string>> = {
          'good_morning': { en: 'Good morning', 'pt-br': 'Bom dia', es: 'Buenos días' },
          'good_afternoon': { en: 'Good afternoon', 'pt-br': 'Boa tarde', es: 'Buenas tardes' },
          'good_evening': { en: 'Good evening', 'pt-br': 'Boa noite', es: 'Buenas noches' },
          'creator': { en: 'Creator', 'pt-br': 'Criador', es: 'Creador' },
          'subtitle': { en: 'Here is an overview of your documentation workspace.', 'pt-br': 'Aqui está uma visão geral do seu espaço de documentação.', es: 'Aquí tienes una descripción general de tu espacio de documentación.' },
          'create_project': { en: 'Create New Project', 'pt-br': 'Criar Novo Projeto', es: 'Crear Nuevo Proyecto' },
          'total_projects': { en: 'Total Projects', 'pt-br': 'Total de Projetos', es: 'Proyectos Totales' },
          'completion': { en: 'Completion Rate', 'pt-br': 'Taxa de Conclusão', es: 'Tasa de Finalización' },
          'ready': { en: 'Ready', 'pt-br': 'Prontos', es: 'Listos' },
          'drafts': { en: 'Drafts', 'pt-br': 'Rascunhos', es: 'Borradores' },
          'create_first': { en: 'Create your first project', 'pt-br': 'Crie seu primeiro projeto', es: 'Crea tu primer proyecto' },
          'empty_desc': { en: 'Generate comprehensive documentation in minutes.', 'pt-br': 'Gere documentação abrangente em minutos.', es: 'Genera documentación completa en minutos.' },
      };
      return texts[key]?.[language] || texts[key]?.['en'];
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('good_morning');
    if (hour < 18) return t('good_afternoon');
    return t('good_evening');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">{getGreeting()}, {t('creator')}.</h1>
          <p className="text-subtle mt-1 text-lg">{t('subtitle')}</p>
        </div>
        <Button onClick={onNewProject} className="w-full md:w-auto px-6 py-3 shadow-xl shadow-primary/20">
          <span className="mr-2">+</span> {t('create_project')}
        </Button>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total Projects */}
        <div className="bg-surface border border-border/50 rounded-2xl p-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
           </div>
           <h3 className="text-xs font-bold text-subtle uppercase tracking-widest mb-1">{t('total_projects')}</h3>
           <div className="text-5xl font-bold text-foreground mt-2 tracking-tight">{totalProjects}</div>
        </div>

        {/* Card 2: Completion Rate */}
        <div className="bg-surface border border-border/50 rounded-2xl p-6 flex flex-col justify-between">
           <h3 className="text-xs font-bold text-subtle uppercase tracking-widest mb-1">{t('completion')}</h3>
           <div className="mt-4">
             <div className="flex justify-between items-end mb-2">
                <span className="text-4xl font-bold text-foreground tracking-tight">{completionRate}%</span>
                <span className="text-sm text-subtle mb-1">{completedProjects} / {totalProjects}</span>
             </div>
             <div className="h-2 w-full bg-surface-highlight rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out" style={{ width: `${completionRate}%` }}></div>
             </div>
           </div>
        </div>

        {/* Card 3: Status Breakdown */}
        <div className="bg-surface border border-border/50 rounded-2xl p-6 flex items-center justify-around">
           <div className="text-center">
              <span className="text-xs font-bold text-success uppercase tracking-wider block mb-1">{t('ready')}</span>
              <div className="text-3xl font-bold text-foreground">{completedProjects}</div>
           </div>
           <div className="h-10 w-px bg-border"></div>
           <div className="text-center">
              <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider block mb-1">{t('drafts')}</span>
              <div className="text-3xl font-bold text-foreground">{draftProjects}</div>
           </div>
        </div>

      </div>

      {/* Project Grid */}
      <div className="pt-4">
         {projects.length === 0 ? (
            <div className="bg-surface border border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-surface-highlight rounded-full flex items-center justify-center mb-4 text-subtle">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
               </div>
               <h3 className="text-lg font-bold text-foreground">{t('create_first')}</h3>
               <p className="text-subtle mt-2 max-w-sm text-sm">{t('empty_desc')}</p>
               <Button onClick={onNewProject} variant="outline" className="mt-6">
                  {t('create_project')}
               </Button>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {projects.slice().reverse().map(project => (
                  <div 
                     key={project.id}
                     onClick={() => onSelectProject(project.id)}
                     className="group bg-surface border border-border/50 hover:border-primary/30 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 flex flex-col h-full relative overflow-hidden"
                  >
                     {/* Gradient Glow Effect on Hover */}
                     <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500"></div>

                     <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="w-10 h-10 rounded-lg bg-surface-highlight flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${project.status === 'completed' ? 'bg-success/10 text-success' : 'bg-yellow-500/10 text-yellow-500'}`}>
                            {project.status === 'completed' ? t('ready') : t('drafts')}
                        </span>
                     </div>
                     
                     <h4 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors relative z-10">{project.name}</h4>
                     <p className="text-sm text-subtle line-clamp-2 mb-6 flex-1 relative z-10">{project.description}</p>
                     
                     <div className="flex justify-between items-center text-xs text-subtle pt-4 border-t border-border/40 relative z-10">
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                          className="hover:text-error hover:bg-error/10 p-1.5 rounded-md transition-colors"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                           </svg>
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
    </div>
  );
};