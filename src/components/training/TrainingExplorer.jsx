import React, { useEffect, useState } from 'react';
import { 
  Folder, FolderPlus, FilePlus, FileText, Video, Github, FileArchive, Image, 
  Download, Eye, ExternalLink, Plus, Trash2, ChevronRight, Upload, Link as LinkIcon, AlertTriangle
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { getFolderContents, createFolder, deleteFolder, createStandaloneResource, deleteStandaloneResource } from '../../api/trainingApi';
import { uploadMediaFile } from '../../api/mediaApi';

export const TrainingExplorer = ({ isAdmin = false }) => {
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [contents, setContents] = useState({
    current_folder: null,
    breadcrumbs: [{ id: null, name: 'Training Materials' }],
    folders: [],
    resources: []
  });

  // Modal States
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folderSubmitting, setFolderSubmitting] = useState(false);

  const [showFileModal, setShowFileModal] = useState(false);
  const [newResource, setNewResource] = useState({
    resource_name: '',
    resource_type: 'PDF',
    resource_url: ''
  });
  const [uploading, setUploading] = useState(false);
  const [fileSubmitting, setFileSubmitting] = useState(false);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'folder'|'resource', item }
  const [deleting, setDeleting] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const loadContents = async (folderId) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await getFolderContents(folderId);
      setContents(data);
    } catch (err) {
      console.error("Failed to load folder contents:", err);
      setErrorMsg("Failed to load folder contents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContents(currentFolderId);
  }, [currentFolderId]);

  // Handle Create Folder
  const handleCreateFolderSubmit = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setFolderSubmitting(true);
    setErrorMsg('');
    try {
      await createFolder(newFolderName.trim(), currentFolderId);
      setNewFolderName('');
      setShowFolderModal(false);
      loadContents(currentFolderId);
    } catch (err) {
      console.error("Failed to create folder:", err);
      setErrorMsg("Failed to create folder.");
    } finally {
      setFolderSubmitting(false);
    }
  };

  // Handle File Upload & Add Resource
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMediaFile(file);
      setNewResource(prev => ({
        ...prev,
        resource_url: url,
        resource_name: prev.resource_name || file.name
      }));
    } catch (err) {
      console.error("Upload failed:", err);
      alert("File upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFileSubmit = async (e) => {
    e.preventDefault();
    if (!newResource.resource_name.trim() || !newResource.resource_url.trim()) {
      alert("Please provide a resource title and valid file/URL.");
      return;
    }
    setFileSubmitting(true);
    try {
      await createStandaloneResource({
        resource_name: newResource.resource_name.trim(),
        resource_type: newResource.resource_type,
        resource_url: newResource.resource_url.trim(),
        folder_id: currentFolderId
      });
      setNewResource({ resource_name: '', resource_type: 'PDF', resource_url: '' });
      setShowFileModal(false);
      loadContents(currentFolderId);
    } catch (err) {
      console.error("Failed to add resource:", err);
      alert("Failed to add resource.");
    } finally {
      setFileSubmitting(false);
    }
  };

  // Handle Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.type === 'folder') {
        await deleteFolder(deleteTarget.item.id);
      } else {
        await deleteStandaloneResource(deleteTarget.item.id);
      }
      setDeleteTarget(null);
      loadContents(currentFolderId);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete item.");
    } finally {
      setDeleting(false);
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'PDF':
      case 'DOC/DOCX':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'Video':
      case 'YouTube Link':
        return <Video className="w-5 h-5 text-red-500" />;
      case 'GitHub Repository Link':
        return <Github className="w-5 h-5 text-slate-800" />;
      case 'ZIP File':
        return <FileArchive className="w-5 h-5 text-amber-500" />;
      case 'Image':
        return <Image className="w-5 h-5 text-emerald-500" />;
      default:
        return <LinkIcon className="w-5 h-5 text-primary-600" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Breadcrumb Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center flex-wrap gap-1.5 text-sm font-sans">
          {contents.breadcrumbs.map((b, idx) => {
            const isLast = idx === contents.breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                <button
                  onClick={() => setCurrentFolderId(b.id)}
                  className={`font-semibold transition-colors flex items-center gap-1.5 ${
                    isLast 
                      ? 'text-primary-600 font-bold cursor-default' 
                      : 'text-slate-600 hover:text-slate-900 hover:underline'
                  }`}
                  disabled={isLast}
                >
                  {idx === 0 && <Folder className="w-4 h-4 text-amber-500 fill-amber-100 shrink-0" />}
                  <span>{b.name}</span>
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Admin Action Buttons (Strictly Separate: Create Folder & Add File) */}
        {isAdmin && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowFolderModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl bg-white border border-slate-300 text-slate-800 hover:border-amber-500 hover:text-amber-600 shadow-xs transition-all cursor-pointer"
            >
              <FolderPlus className="w-4 h-4 text-amber-500" />
              <span>Create Folder</span>
            </button>

            <button
              onClick={() => setShowFileModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl bg-primary-600 hover:bg-primary-700 text-slate-900 shadow-xs transition-all cursor-pointer"
            >
              <FilePlus className="w-4 h-4" />
              <span>Add File</span>
            </button>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="py-16 text-center animate-pulse opacity-40 space-y-3">
          <Folder className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 font-sans text-sm">Loading folder contents...</p>
        </div>
      ) : (
        <div className="space-y-8">

          {/* FOLDERS SECTION */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-500" />
              <span>Folders ({contents.folders.length})</span>
            </h4>

            {contents.folders.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl text-slate-400 font-sans text-xs">
                No subfolders in this directory.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {contents.folders.map(folder => (
                  <div
                    key={folder.id}
                    className="group relative flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-primary-500/50 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setCurrentFolderId(folder.id)}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-105 transition-transform">
                        <Folder className="w-5 h-5 fill-amber-500/20" />
                      </div>
                      <span className="font-headline font-bold text-sm text-slate-800 truncate group-hover:text-primary-600 transition-colors">
                        {folder.name}
                      </span>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget({ type: 'folder', item: folder });
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all shrink-0 ml-2"
                        title="Delete Folder"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FILES SECTION */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Files & Links ({contents.resources.length})</span>
            </h4>

            {contents.resources.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl text-slate-400 font-sans text-xs">
                No files or external links in this directory.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {contents.resources.map(res => {
                  const isDownloadable = ['PDF', 'PPT', 'DOC/DOCX', 'Image', 'ZIP File', 'Other', 'Video'].includes(res.resource_type);

                  return (
                    <div
                      key={res.id}
                      className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          {getResourceIcon(res.resource_type)}
                        </div>
                        <div className="flex flex-col truncate">
                          <span className="font-headline font-bold text-sm text-slate-800 truncate">
                            {res.resource_name}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {res.resource_type}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {isDownloadable ? (
                          <>
                            <a
                              href={res.resource_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 hover:bg-blue-50 rounded-full text-slate-500 hover:text-blue-600 transition-colors"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <a
                              href={res.resource_url}
                              target="_blank"
                              rel="noreferrer"
                              download={res.resource_name}
                              className="p-2 hover:bg-primary-50 rounded-full text-slate-500 hover:text-primary-600 transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </>
                        ) : (
                          <a
                            href={res.resource_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 hover:bg-blue-50 rounded-full text-slate-500 hover:text-blue-600 transition-colors"
                            title="Open Link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}

                        {isAdmin && (
                          <button
                            onClick={() => setDeleteTarget({ type: 'resource', item: res })}
                            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Delete File"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* CREATE FOLDER DIALOG */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 max-w-md w-full space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                <Folder className="w-5 h-5 fill-amber-500/20" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-slate-900">Create New Folder</h3>
                <p className="font-sans text-xs text-slate-500">Target Location: {contents.breadcrumbs.map(b => b.name).join(' / ')}</p>
              </div>
            </div>

            <form onSubmit={handleCreateFolderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Folder Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spring Boot"
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  autoFocus
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-sans focus:bg-white focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <Button type="submit" disabled={folderSubmitting || !newFolderName.trim()}>
                  {folderSubmitting ? 'Creating...' : 'Create Folder'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD FILE DIALOG */}
      {showFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 max-w-lg w-full space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-slate-900">Add File / Link</h3>
                <p className="font-sans text-xs text-slate-500">Target Location: {contents.breadcrumbs.map(b => b.name).join(' / ')}</p>
              </div>
            </div>

            <form onSubmit={handleCreateFileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Resource Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spring Security Overview"
                  value={newResource.resource_name}
                  onChange={e => setNewResource({...newResource, resource_name: e.target.value})}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-sans focus:bg-white focus:border-primary-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Resource Type
                </label>
                <select
                  value={newResource.resource_type}
                  onChange={e => setNewResource({...newResource, resource_type: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-sans focus:bg-white focus:border-primary-600 focus:outline-none"
                >
                  {['PDF', 'PPT', 'DOC/DOCX', 'ZIP File', 'Video', 'GitHub Repository Link', 'YouTube Link', 'Google Drive Link', 'External Documentation Link', 'Other'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  File Upload or External Link URL *
                </label>
                {['PDF', 'PPT', 'DOC/DOCX', 'Video', 'ZIP File', 'Other'].includes(newResource.resource_type) ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Uploaded File URL"
                      value={newResource.resource_url}
                      readOnly
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-slate-700 text-xs font-mono opacity-80"
                    />
                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-slate-900 text-sm font-bold transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>{uploading ? 'Uploading File...' : 'Choose Local File to Upload'}</span>
                      <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                  </div>
                ) : (
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newResource.resource_url}
                    onChange={e => setNewResource({...newResource, resource_url: e.target.value})}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-sans focus:bg-white focus:border-primary-600 focus:outline-none"
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFileModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <Button type="submit" disabled={fileSubmitting || uploading || !newResource.resource_name.trim() || !newResource.resource_url.trim()}>
                  {fileSubmitting ? 'Saving...' : 'Add File'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 max-w-md w-full space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-slate-900">Confirm Deletion</h3>
                <p className="font-sans text-xs text-slate-500">Deleting item from training materials</p>
              </div>
            </div>

            <p className="font-sans text-sm text-slate-700">
              Are you sure you want to delete <strong className="text-slate-900">"{deleteTarget.item.name || deleteTarget.item.resource_name}"</strong>?
              {deleteTarget.type === 'folder' && (
                <span className="block text-red-600 font-semibold mt-2 text-xs">
                  ⚠️ Warning: All subfolders and files contained inside this folder will also be permanently deleted.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
