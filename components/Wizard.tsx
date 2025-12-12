import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { generateProjectQuestions, generateProjectDocumentation, generateSingleAnswer } from '../services/geminiService';
import { Project, Language, AiModel } from '../types';

interface WizardProps {
  onComplete: (project: Project) => void;
  onCancel: () => void;
  language: Language;
  aiModel: AiModel;
}

export const Wizard: React.FC<WizardProps> = ({ onComplete, onCancel, language, aiModel }) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [idea, setIdea] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [generatingAnswerFor, setGeneratingAnswerFor] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('docugen_wizard_state');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.step && (data.idea || data.questions?.length > 0)) {
                setStep(data.step);
                setIdea(data.idea || '');
                setProjectName(data.projectName || '');
                setQuestions(data.questions || []);
                setAnswers(data.answers || {});
            }
        } catch (e) {
            console.error("Failed to restore wizard session", e);
        }
    }
  }, []);

  useEffect(() => {
    if (idea || questions.length > 0) {
        const state = { step, idea, projectName, questions, answers };
        localStorage.setItem('docugen_wizard_state', JSON.stringify(state));
    }
  }, [step, idea, projectName, questions, answers]);

  const clearSession = () => {
      localStorage.removeItem('docugen_wizard_state');
  };

  const handleCancel = () => {
      if (confirm(getText('confirm_cancel'))) {
        clearSession();
        onCancel();
      }
  };

  const handleIdeaSubmit = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const generatedQuestions = await generateProjectQuestions(idea, language, aiModel);
      setQuestions(generatedQuestions);
      setStep(2);
    } catch (err) {
      setError("Failed to generate questions. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const handleGenerateSingle = async (index: number, question: string) => {
      setGeneratingAnswerFor(index);
      try {
          const aiAnswer = await generateSingleAnswer(idea, question, language, aiModel);
          handleAnswerChange(index, aiAnswer);
      } catch (err) {
          console.error("Failed to generate answer", err);
      } finally {
          setGeneratingAnswerFor(null);
      }
  }

  const handleQAComplete = () => {
    setStep(3);
  };

  const handleFinalize = async () => {
    if (!projectName.trim()) {
        setError("Please enter a project name.");
        return;
    }
    setLoading(true);
    setError(null);
    try {
        const qaPairs = questions.map((q, i) => ({
            question: q,
            answer: answers[i] || "Not specified"
        }));
        const docs = await generateProjectDocumentation(idea, projectName, qaPairs, language, aiModel);
        const newProject: Project = {
            id: crypto.randomUUID(),
            name: projectName,
            description: idea,
            createdAt: new Date().toISOString(),
            status: 'completed',
            questions: questions,
            answers: answers,
            documentation: docs,
            language: language
        };
        clearSession();
        onComplete(newProject);
    } catch (err) {
        setError("Failed to generate documentation. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const getText = (key: string) => {
      const texts: Record<string, Record<Language, string>> = {
          'what_building': { en: 'What are you building?', 'pt-br': 'O que você vai construir?', es: '¿Qué vas a construir?' },
          'describe': { en: 'Describe your project idea in detail.', 'pt-br': 'Descreva sua ideia em detalhes.', es: 'Describe tu idea en detalle.' },
          'placeholder': { en: 'e.g. A real-time collaborative whiteboard...', 'pt-br': 'ex: Um quadro branco colaborativo...', es: 'ej: Una pizarra colaborativa...' },
          'cancel': { en: 'Cancel', 'pt-br': 'Cancelar', es: 'Cancelar' },
          'confirm_cancel': { en: 'Are you sure? Your progress will be lost.', 'pt-br': 'Tem certeza? Seu progresso será perdido.', es: '¿Estás seguro? Tu progreso se perderá.' },
          'next': { en: 'Next Step', 'pt-br': 'Próximo', es: 'Siguiente' },
          'deep_dive': { en: 'Technical Deep Dive', 'pt-br': 'Aprofundamento Técnico', es: 'Profundización Técnica' },
          'ai_clarify': { en: 'The AI needs to clarify these technical points.', 'pt-br': 'A IA precisa esclarecer estes pontos técnicos.', es: 'La IA necesita aclarar estos puntos técnicos.' },
          'back': { en: 'Back', 'pt-br': 'Voltar', es: 'Atrás' },
          'autofill': { en: 'Auto-fill All', 'pt-br': 'Preencher Tudo', es: 'Autocompletar Todo' },
          'answer_ai': { en: 'Ask AI', 'pt-br': 'Perguntar à IA', es: 'Preguntar a IA' },
          'almost_ready': { en: 'Almost Ready!', 'pt-br': 'Quase pronto!', es: '¡Casi listo!' },
          'name_project': { en: 'Project Name', 'pt-br': 'Nome do Projeto', es: 'Nombre del Proyecto' },
          'generate': { en: 'Generate Docs', 'pt-br': 'Gerar Docs', es: 'Generar Docs' },
          'step_1': { en: 'Concept', 'pt-br': 'Conceito', es: 'Concepto' },
          'step_2': { en: 'Details', 'pt-br': 'Detalhes', es: 'Detalles' },
          'step_3': { en: 'Finalize', 'pt-br': 'Finalizar', es: 'Finalizar' },
      };
      return texts[key]?.[language] || texts[key]?.['en'];
  }

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* Sleek Progress Header */}
      <div className="mb-10 pt-4">
        <div className="flex justify-between items-center mb-2">
            {[1, 2, 3].map((s) => (
                <div key={s} className={`text-xs font-bold uppercase tracking-widest ${step === s ? 'text-primary' : step > s ? 'text-success' : 'text-subtle'}`}>
                    {s === 1 ? getText('step_1') : s === 2 ? getText('step_2') : getText('step_3')}
                </div>
            ))}
        </div>
        <div className="h-1 w-full bg-surface-highlight rounded-full overflow-hidden">
             <div 
                className="h-full bg-primary transition-all duration-500 ease-out" 
                style={{ width: `${((step - 1) / 2) * 100}%` }}
             ></div>
        </div>
      </div>

      <div className="bg-surface p-6 md:p-10 rounded-2xl border border-border/50 shadow-2xl flex-1 flex flex-col relative overflow-hidden">
        {/* Decorative ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error rounded-xl text-sm flex items-center animate-fade-in">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {error}
            </div>
        )}

        {step === 1 && (
            <div className="animate-slide-up flex flex-col h-full relative z-10">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">{getText('what_building')}</h2>
                    <p className="text-subtle text-lg">{getText('describe')}</p>
                </div>
                <div className="relative flex-1 min-h-[200px]">
                    <textarea 
                        className="w-full h-full p-6 bg-surface-highlight/30 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none text-foreground placeholder-subtle/50 text-lg leading-relaxed transition-all font-light"
                        placeholder={getText('placeholder')}
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="mt-8 flex justify-between items-center">
                    <Button variant="ghost" onClick={handleCancel}>{getText('cancel')}</Button>
                    <Button onClick={handleIdeaSubmit} isLoading={loading} disabled={!idea.trim()} className="px-8 shadow-lg shadow-primary/20">
                        {getText('next')}
                    </Button>
                </div>
            </div>
        )}

        {step === 2 && (
            <div className="animate-slide-up flex flex-col h-full relative z-10">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">{getText('deep_dive')}</h2>
                    <p className="text-subtle">{getText('ai_clarify')}</p>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    {questions.map((q, idx) => (
                        <div key={idx} className="group bg-surface hover:bg-surface-highlight/50 p-5 rounded-xl border border-border transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
                            <div className="flex justify-between items-start mb-3 gap-4">
                                <label className="text-sm font-medium text-foreground leading-snug">
                                    <span className="text-primary mr-2 font-mono text-xs">0{idx + 1}</span>
                                    {q}
                                </label>
                                <button 
                                    onClick={() => handleGenerateSingle(idx, q)}
                                    disabled={generatingAnswerFor === idx}
                                    className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider text-primary hover:text-white hover:bg-primary border border-primary/20 px-2 py-1 rounded transition-colors flex items-center gap-1"
                                >
                                    {generatingAnswerFor === idx ? (
                                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                                    ) : (
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                    )}
                                    {getText('answer_ai')}
                                </button>
                            </div>
                            <input 
                                className="w-full bg-transparent border-b border-border focus:border-primary outline-none text-foreground py-2 transition-colors placeholder-subtle/40 text-sm"
                                placeholder="Your answer..."
                                value={answers[idx] || ''}
                                onChange={(e) => handleAnswerChange(idx, e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-between items-center pt-4 border-t border-border/50">
                    <Button variant="ghost" onClick={() => setStep(1)}>{getText('back')}</Button>
                    <div className="flex gap-3">
                         <Button variant="outline" onClick={() => {
                             const newAnswers = {...answers};
                             questions.forEach((_, i) => { if (!newAnswers[i]) newAnswers[i] = "Standard best practices implementation"; });
                             setAnswers(newAnswers);
                         }}>
                             {getText('autofill')}
                         </Button>
                        <Button onClick={handleQAComplete}>{getText('next')}</Button>
                    </div>
                </div>
            </div>
        )}

        {step === 3 && (
            <div className="animate-slide-up text-center max-w-lg mx-auto py-10 flex flex-col h-full justify-center relative z-10">
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                        <div className="h-20 w-20 bg-surface border border-border rounded-2xl flex items-center justify-center text-primary relative z-10 shadow-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">{getText('almost_ready')}</h2>
                <p className="text-subtle mb-10 text-lg">
                    {language === 'pt-br' ? 'Dê um nome ao seu projeto.' : language === 'es' ? 'Nombra tu proyecto.' : 'Give your project a name.'}
                </p>
                
                <div className="text-left mb-10">
                    <label className="block text-xs font-bold uppercase tracking-widest text-subtle mb-2 ml-1">{getText('name_project')}</label>
                    <input 
                        type="text" 
                        className="w-full p-4 bg-surface-highlight/30 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground text-xl font-medium transition-all placeholder-subtle/30"
                        placeholder="My Awesome App"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="flex justify-between w-full items-center">
                    <Button variant="ghost" onClick={() => setStep(2)}>{getText('back')}</Button>
                    <Button onClick={handleFinalize} isLoading={loading} className="px-8 py-3 shadow-xl shadow-primary/20">
                        {getText('generate')}
                    </Button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};