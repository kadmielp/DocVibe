import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Language, Project, AiModel } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  language: Language;
  projects: Project[];
  onDeleteAccount: () => void;
  onImportData: (data: Project[]) => void;
  aiModel: AiModel;
  onModelChange: (model: AiModel) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isDark,
  toggleTheme,
  language,
  projects,
  onDeleteAccount,
  onImportData,
  aiModel,
  onModelChange
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'account'>('general');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const t = (key: string) => {
    const texts: Record<string, Record<Language, string>> = {
        'settings': { en: 'Settings', 'pt-br': 'Configurações', es: 'Configuración' },
        'general': { en: 'General', 'pt-br': 'Geral', es: 'General' },
        'account': { en: 'Account', 'pt-br': 'Conta', es: 'Cuenta' },
        'appearance': { en: 'Appearance', 'pt-br': 'Aparência', es: 'Apariencia' },
        'dark_mode': { en: 'Dark Mode', 'pt-br': 'Modo Escuro', es: 'Modo Oscuro' },
        'light_mode': { en: 'Light Mode', 'pt-br': 'Modo Claro', es: 'Modo Claro' },
        'adjust_appearance': { en: 'Adjust the appearance of the application', 'pt-br': 'Ajuste a aparência da aplicação', es: 'Ajusta la apariencia de la aplicación' },
        'language': { en: 'Language', 'pt-br': 'Idioma', es: 'Idioma' },
        'data_management': { en: 'Data Management', 'pt-br': 'Gerenciamento de Dados', es: 'Gestión de Datos' },
        'export_data': { en: 'Export Data', 'pt-br': 'Exportar Dados', es: 'Exportar Datos' },
        'import_data': { en: 'Import Data', 'pt-br': 'Importar Dados', es: 'Importar Datos' },
        'download_json': { en: 'Download JSON', 'pt-br': 'Baixar JSON', es: 'Descargar JSON' },
        'upload_json': { en: 'Upload JSON', 'pt-br': 'Carregar JSON', es: 'Subir JSON' },
        'download_copy': { en: 'Download a complete copy of your projects and settings.', 'pt-br': 'Baixe uma cópia completa de seus projetos e configurações.', es: 'Descarga una copia completa de tus proyectos y configuraciones.' },
        'import_desc': { en: 'Restore your projects from a previously exported JSON file.', 'pt-br': 'Restaure seus projetos de um arquivo JSON exportado anteriormente.', es: 'Restaura tus proyectos desde un archivo JSON exportado previamente.' },
        'danger_zone': { en: 'Danger Zone', 'pt-br': 'Zona de Perigo', es: 'Zona de Peligro' },
        'delete_account': { en: 'Delete Account', 'pt-br': 'Excluir Conta', es: 'Eliminar Cuenta' },
        'perm_remove': { en: 'Permanently remove all data and projects.', 'pt-br': 'Remova permanentemente todos os dados e projetos.', es: 'Elimina permanentemente todos los datos y proyectos.' },
        'delete': { en: 'Delete', 'pt-br': 'Excluir', es: 'Eliminar' },
        'confirm_delete': { en: 'This will permanently delete your account. Are you sure?', 'pt-br': 'Isso excluirá permanentemente sua conta. Tem certeza?', es: 'Esto eliminará permanentemente tu cuenta. ¿Estás seguro?' },
        'ai_config': { en: 'AI Model', 'pt-br': 'Modelo de IA', es: 'Modelo de IA' },
        'model_help': { en: 'Select the Gemini model used for generation.', 'pt-br': 'Selecione o modelo Gemini usado para geração.', es: 'Seleccione el modelo Gemini utilizado para la generación.' },
        'pro_desc': { en: 'Best for complex reasoning & detailed docs', 'pt-br': 'Melhor para raciocínio complexo e docs detalhados', es: 'Mejor para razonamiento complejo y documentos detallados' },
        'flash_desc': { en: 'Faster and lightweight', 'pt-br': 'Mais rápido e leve', es: 'Más rápido y ligero' },
        'recommended': { en: 'Recommended', 'pt-br': 'Recomendado', es: 'Recomendado' }
    };
    return texts[key]?.[language] || texts[key]?.['en'];
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "docugen_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Security: Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
         alert("File is too large. Maximum size is 5MB.");
         if (event.target) event.target.value = '';
         return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          onImportData(json);
        } catch (error) {
          console.error("Error parsing JSON", error);
          alert(language === 'pt-br' ? "Erro ao ler o arquivo JSON." : "Error parsing JSON file.");
        }
      };
      reader.readAsText(file);
    }
    // Reset input
    if (event.target) {
        event.target.value = '';
    }
  };

  const ModelOption = ({ model, label, desc, isRecommended = false }: { model: AiModel, label: string, desc: string, isRecommended?: boolean }) => (
    <div 
        onClick={() => onModelChange(model)}
        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
            aiModel === model 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-surface-highlight'
        }`}
    >
        {isRecommended && (
            <span className="absolute -top-2.5 right-4 px-2 py-0.5 bg-primary text-white text-[10px] font-bold uppercase rounded-full tracking-wider">
                {t('recommended')}
            </span>
        )}
        <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${aiModel === model ? 'border-primary' : 'border-foreground/30'}`}>
                {aiModel === model && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </div>
            <div>
                <div className={`font-semibold ${aiModel === model ? 'text-primary' : 'text-foreground'}`}>{label}</div>
                <div className="text-xs text-foreground/50">{desc}</div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-2xl border border-border flex flex-col max-h-[90vh] overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-bold text-foreground">{t('settings')}</h2>
          <button onClick={onClose} className="text-foreground/50 hover:text-foreground">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Layout */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar / Tabs */}
          <div className="w-full md:w-48 bg-surface-highlight/30 border-b md:border-b-0 md:border-r border-border p-2 md:p-4 flex-shrink-0">
            <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('general')}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'general' ? 'bg-primary/10 text-primary' : 'text-foreground/70 hover:bg-surface-highlight hover:text-foreground'
                }`}
              >
                {t('general')}
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'account' ? 'bg-primary/10 text-primary' : 'text-foreground/70 hover:bg-surface-highlight hover:text-foreground'
                }`}
              >
                {t('account')}
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto">
            {activeTab === 'general' && (
              <div className="space-y-8">
                {/* AI Configuration */}
                <div>
                   <h3 className="text-lg font-semibold text-foreground mb-4">{t('ai_config')}</h3>
                   <div className="grid grid-cols-1 gap-4">
                       <ModelOption 
                          model="gemini-3-pro-preview" 
                          label="Gemini 3.0 Pro" 
                          desc={t('pro_desc')} 
                          isRecommended={true}
                       />
                       <ModelOption 
                          model="gemini-2.5-flash" 
                          label="Gemini 2.5 Flash" 
                          desc={t('flash_desc')} 
                       />
                   </div>
                   <p className="text-xs text-foreground/50 mt-2 ml-1">{t('model_help')}</p>
                </div>

                <div className="h-px bg-border w-full"></div>

                {/* Theme Section */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">{t('appearance')}</h3>
                  <div className="flex items-center justify-between p-4 bg-surface border border-border rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-yellow-500/10 text-yellow-600'}`}>
                        {isDark ? (
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        ) : (
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{isDark ? t('dark_mode') : t('light_mode')}</div>
                        <div className="text-xs text-foreground/50">{t('adjust_appearance')}</div>
                      </div>
                    </div>
                    <button 
                        onClick={toggleTheme}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isDark ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">{t('data_management')}</h3>
                    
                    {/* Export Section */}
                    <div className="bg-surface border border-border rounded-xl p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                             <span className="font-medium text-foreground">{t('export_data')}</span>
                             <Button variant="outline" onClick={handleExportData} className="text-xs">
                                {t('download_json')}
                             </Button>
                        </div>
                        <p className="text-sm text-foreground/50">{t('download_copy')}</p>
                    </div>

                    {/* Import Section */}
                    <div className="bg-surface border border-border rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                             <span className="font-medium text-foreground">{t('import_data')}</span>
                             <input 
                                type="file" 
                                accept=".json" 
                                ref={fileInputRef} 
                                className="hidden" 
                                onChange={handleFileChange} 
                             />
                             <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="text-xs">
                                {t('upload_json')}
                             </Button>
                        </div>
                        <p className="text-sm text-foreground/50">{t('import_desc')}</p>
                    </div>
                </div>

                <div className="pt-4 border-t border-border">
                     <h3 className="text-lg font-semibold text-error mb-4">{t('danger_zone')}</h3>
                     <div className="bg-error/5 border border-error/20 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-medium text-error">{t('delete_account')}</div>
                                <div className="text-xs text-error/70 mt-1">{t('perm_remove')}</div>
                            </div>
                            <Button variant="danger" onClick={() => {
                                if(confirm(t('confirm_delete'))) {
                                    onDeleteAccount();
                                    onClose();
                                }
                            }}>{t('delete')}</Button>
                        </div>
                     </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};