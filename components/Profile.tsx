import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Project } from '../types';
import { Button } from './Button';

interface ProfileProps {
  projects: Project[];
  onDeleteAccount: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ projects, onDeleteAccount }) => {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    createdAt: "2023-11-15T09:00:00Z",
    lastSignIn: new Date().toISOString()
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Profile & Settings</h1>
        <p className="text-foreground/60 mt-1">Manage your account preferences and data.</p>
      </div>

      <Tabs.Root defaultValue="account" className="flex flex-col w-full">
        <Tabs.List className="shrink-0 flex border-b border-border mb-8">
          <Tabs.Trigger 
            className="px-5 py-3 text-sm font-medium text-foreground/60 hover:text-foreground border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-all outline-none" 
            value="account"
          >
            Account
          </Tabs.Trigger>
          <Tabs.Trigger 
            className="px-5 py-3 text-sm font-medium text-foreground/60 hover:text-foreground border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-all outline-none" 
            value="export"
          >
            Data Export
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="account" className="outline-none animate-fade-in">
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground/60 mb-1">Full Name</label>
                  <div className="text-foreground font-medium text-lg">{user.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/60 mb-1">Email Address</label>
                  <div className="text-foreground font-medium text-lg">{user.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/60 mb-1">Member Since</label>
                  <div className="text-foreground font-medium">{formatDate(user.createdAt)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/60 mb-1">Last Sign-in</label>
                  <div className="text-foreground font-medium">{formatDate(user.lastSignIn)}</div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-error/5 border border-error/20 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-error mb-2">Danger Zone</h2>
              <p className="text-foreground/70 text-sm mb-6">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <div className="flex items-center justify-between">
                 <div className="text-sm text-foreground/60">
                    This action will permanently delete your account and {projects.length} project{projects.length !== 1 ? 's' : ''}.
                 </div>
                 <Button variant="danger" onClick={onDeleteAccount}>Delete Account</Button>
              </div>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="export" className="outline-none animate-fade-in">
           <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Export Data</h2>
                    <p className="text-foreground/60 text-sm mt-1">
                        Download a copy of all your projects and generated documentation.
                    </p>
                  </div>
                  <Button onClick={handleExportData} variant="outline">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Export JSON
                  </Button>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                      <thead className="bg-surface-highlight">
                          <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Project Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Date Created</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Docs Size</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Status</th>
                          </tr>
                      </thead>
                      <tbody className="bg-surface divide-y divide-border">
                          {projects.length === 0 ? (
                              <tr>
                                  <td colSpan={4} className="px-6 py-8 text-center text-foreground/40 text-sm">
                                      No projects found to export.
                                  </td>
                              </tr>
                          ) : (
                              projects.map((project) => (
                                  <tr key={project.id}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{project.name}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70">{new Date(project.createdAt).toLocaleDateString()}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70">
                                          {project.documentation ? 
                                            (Object.values(project.documentation).join('').length / 1024).toFixed(1) + ' KB' 
                                            : '0 KB'}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${project.status === 'completed' ? 'bg-success/10 text-success' : 'bg-yellow-100 text-yellow-800'}`}>
                                              {project.status}
                                          </span>
                                      </td>
                                  </tr>
                              ))
                          )}
                      </tbody>
                  </table>
              </div>
           </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};
