import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  Mail,
  Send,
  Upload,
  FolderPlus,
  Trash2,
  ExternalLink,
  Search,
  RefreshCw,
  LogOut,
  AlertCircle,
  CheckCircle2,
  File,
  FileText,
  Image as ImageIcon,
  Folder,
  X
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  signInWithGoogleWorkspace,
  logoutWorkspace,
  initAuth,
  getCachedAccessToken,
  setCachedAccessToken
} from '../lib/firebase';
import {
  fetchDriveFiles,
  uploadFileToDrive,
  createDriveFolder,
  deleteDriveFile,
  fetchGmailMessages,
  sendGmailEmail,
  DriveFileItem,
  GmailMessageItem
} from '../lib/workspace';

interface WorkspaceHubProps {
  initialTab?: 'drive' | 'gmail';
  onClose?: () => void;
}

export const WorkspaceHub: React.FC<WorkspaceHubProps> = ({ initialTab = 'drive', onClose }) => {
  const [activeTab, setActiveTab] = useState<'drive' | 'gmail'>(initialTab);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getCachedAccessToken());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Drive state
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [driveSearch, setDriveSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);

  // Gmail state
  const [gmailMessages, setGmailMessages] = useState<GmailMessageItem[]>([]);
  const [gmailSearch, setGmailSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageItem | null>(null);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [showSendConfirmation, setShowSendConfirmation] = useState(false);

  // Initialize auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (authedUser, accessToken) => {
        setUser(authedUser);
        setToken(accessToken);
      },
      () => {
        // User logged out or no token
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch data when token is available or tab changes
  useEffect(() => {
    if (token) {
      if (activeTab === 'drive') {
        loadDriveFiles();
      } else {
        loadGmailMessages();
      }
    }
  }, [token, activeTab]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await signInWithGoogleWorkspace();
      setUser(res.user);
      setToken(res.accessToken);
      setSuccessMsg('Successfully connected Google Workspace!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Failed to authenticate with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await logoutWorkspace();
      setUser(null);
      setToken(null);
      setDriveFiles([]);
      setGmailMessages([]);
    } catch (err: any) {
      setErrorMsg('Failed to sign out.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google Drive Handlers
  const loadDriveFiles = async (query?: string) => {
    if (!token) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const files = await fetchDriveFiles(token, query !== undefined ? query : driveSearch);
      setDriveFiles(files);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error loading Google Drive files.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setIsUploading(true);
    setErrorMsg(null);
    try {
      await uploadFileToDrive(token, file);
      setSuccessMsg(`File "${file.name}" uploaded to Google Drive.`);
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadDriveFiles();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to upload file to Google Drive.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !token) return;
    setIsLoading(true);
    try {
      await createDriveFolder(token, newFolderName.trim());
      setSuccessMsg(`Folder "${newFolderName}" created in Google Drive.`);
      setTimeout(() => setSuccessMsg(null), 4000);
      setNewFolderName('');
      setShowNewFolderModal(false);
      await loadDriveFiles();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to create folder.');
    } finally {
      setIsLoading(false);
    }
  };

  // Destructive Drive file deletion with MANDATORY confirmation
  const handleConfirmDeleteDriveFile = async () => {
    if (!fileToDelete || !token) return;
    setIsLoading(true);
    try {
      await deleteDriveFile(token, fileToDelete.id);
      setSuccessMsg(`Deleted "${fileToDelete.name}" from Google Drive.`);
      setTimeout(() => setSuccessMsg(null), 4000);
      setFileToDelete(null);
      await loadDriveFiles();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to delete file from Google Drive.');
    } finally {
      setIsLoading(false);
    }
  };

  // Gmail Handlers
  const loadGmailMessages = async (query?: string) => {
    if (!token) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const messages = await fetchGmailMessages(token, 20, query !== undefined ? query : gmailSearch);
      setGmailMessages(messages);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error loading Gmail messages.');
    } finally {
      setIsLoading(false);
    }
  };

  // Send Email with MANDATORY confirmation
  const handleExecuteSendEmail = async () => {
    if (!token) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await sendGmailEmail(token, {
        to: composeTo,
        subject: composeSubject,
        bodyText: composeBody,
      });
      setSuccessMsg(`Email successfully sent to ${composeTo}!`);
      setTimeout(() => setSuccessMsg(null), 4000);
      setShowSendConfirmation(false);
      setShowComposeModal(false);
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
      await loadGmailMessages();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to send email via Gmail.');
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('folder')) return <Folder className="w-5 h-5 text-amber-500" />;
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-rose-500" />;
    if (mimeType.includes('image')) return <ImageIcon className="w-5 h-5 text-emerald-500" />;
    if (mimeType.includes('document') || mimeType.includes('word')) return <FileText className="w-5 h-5 text-blue-500" />;
    return <File className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div id="workspace-hub-container" className="bg-white rounded-2xl border border-[#123F32]/10 shadow-sm overflow-hidden flex flex-col">
      {/* Top Header */}
      <div className="bg-[#123F32] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            {activeTab === 'drive' ? <HardDrive className="w-5 h-5 text-emerald-300" /> : <Mail className="w-5 h-5 text-emerald-300" />}
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Google Workspace Hub</h2>
            <p className="text-xs text-emerald-100/70">Connected to Google Drive & Gmail API</p>
          </div>
        </div>

        {/* User / Sign-In Status */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3 bg-black/20 px-3 py-1.5 rounded-full border border-white/10">
              {user.photoURL && (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full" />
              )}
              <span className="text-xs font-medium text-white/90">{user.email}</span>
              <button
                id="btn-workspace-signout"
                onClick={handleSignOut}
                className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                title="Disconnect Google Account"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="btn-google-workspace-signin"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 bg-white text-neutral-800 hover:bg-neutral-50 px-4 py-2 rounded-lg text-xs font-medium shadow-sm transition-all border border-neutral-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{isLoading ? 'Connecting...' : 'Sign in with Google'}</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 pt-3">
        <button
          id="tab-drive"
          onClick={() => setActiveTab('drive')}
          className={`flex items-center space-x-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'drive'
              ? 'border-[#123F32] text-[#123F32] bg-white rounded-t-lg'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Google Drive</span>
          {driveFiles.length > 0 && (
            <span className="ml-1.5 px-2 py-0.5 text-xs bg-emerald-100 text-[#123F32] rounded-full font-semibold">
              {driveFiles.length}
            </span>
          )}
        </button>

        <button
          id="tab-gmail"
          onClick={() => setActiveTab('gmail')}
          className={`flex items-center space-x-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'gmail'
              ? 'border-[#123F32] text-[#123F32] bg-white rounded-t-lg'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Gmail</span>
          {gmailMessages.length > 0 && (
            <span className="ml-1.5 px-2 py-0.5 text-xs bg-emerald-100 text-[#123F32] rounded-full font-semibold">
              {gmailMessages.length}
            </span>
          )}
        </button>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-red-700 text-xs">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-800 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Body */}
      <div className="p-6 flex-1 min-h-[380px]">
        {!token ? (
          <div className="flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#123F32]/10 flex items-center justify-center mb-4">
              <HardDrive className="w-8 h-8 text-[#123F32]" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900 mb-1">
              Connect Google Drive & Gmail
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed mb-6">
              Review and sign in with your Google account to access files, store candidate resumes, read inquiries, and send communication directly from SMARTEURA with permission.
            </p>
            <button
              id="btn-hub-auth-prompt"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="inline-flex items-center space-x-2.5 bg-[#123F32] hover:bg-[#0E3228] text-white px-6 py-3 rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>
        ) : activeTab === 'drive' ? (
          /* GOOGLE DRIVE PANEL */
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="drive-search-input"
                  type="text"
                  placeholder="Search files in Google Drive..."
                  value={driveSearch}
                  onChange={(e) => setDriveSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadDriveFiles()}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:border-[#123F32] focus:ring-1 focus:ring-[#123F32] outline-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  id="btn-refresh-drive"
                  onClick={() => loadDriveFiles()}
                  disabled={isLoading}
                  className="p-2 text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  id="btn-create-folder"
                  onClick={() => setShowNewFolderModal(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium border border-neutral-200 hover:border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors text-neutral-700"
                >
                  <FolderPlus className="w-4 h-4 text-amber-600" />
                  <span>New Folder</span>
                </button>

                <label className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-[#123F32] text-white hover:bg-[#0E3228] transition-colors cursor-pointer shadow-sm">
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Files List */}
            {isLoading && driveFiles.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#123F32]" />
                Loading Google Drive files...
              </div>
            ) : driveFiles.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-neutral-200 rounded-xl">
                <HardDrive className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs text-neutral-500">No files found matching criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-neutral-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Name</th>
                      <th className="py-3 px-4 font-semibold">Type</th>
                      <th className="py-3 px-4 font-semibold">Modified</th>
                      <th className="py-3 px-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {driveFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-3 px-4 font-medium text-neutral-800 flex items-center space-x-2.5">
                          {getFileIcon(file.mimeType)}
                          <span className="truncate max-w-xs">{file.name}</span>
                        </td>
                        <td className="py-3 px-4 text-neutral-500 truncate max-w-[140px]">
                          {file.mimeType.split('.').pop()?.replace('vnd.google-apps.', '') || 'File'}
                        </td>
                        <td className="py-3 px-4 text-neutral-500">
                          {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-emerald-700 hover:text-emerald-900 p-1.5 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Open in Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            id={`btn-delete-file-${file.id}`}
                            onClick={() => setFileToDelete(file)}
                            className="inline-flex items-center text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* GMAIL PANEL */
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="gmail-search-input"
                  type="text"
                  placeholder="Search messages in Gmail..."
                  value={gmailSearch}
                  onChange={(e) => setGmailSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadGmailMessages()}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:border-[#123F32] focus:ring-1 focus:ring-[#123F32] outline-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  id="btn-refresh-gmail"
                  onClick={() => loadGmailMessages()}
                  disabled={isLoading}
                  className="p-2 text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  id="btn-open-compose"
                  onClick={() => setShowComposeModal(true)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#123F32] text-white hover:bg-[#0E3228] transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Compose Email</span>
                </button>
              </div>
            </div>

            {/* Messages List & Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Message List */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden max-h-[420px] overflow-y-auto">
                {isLoading && gmailMessages.length === 0 ? (
                  <div className="py-12 text-center text-xs text-neutral-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#123F32]" />
                    Loading Gmail messages...
                  </div>
                ) : gmailMessages.length === 0 ? (
                  <div className="py-12 text-center text-xs text-neutral-500">
                    <Mail className="w-6 h-6 text-neutral-300 mx-auto mb-2" />
                    No emails found.
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {gmailMessages.map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => setSelectedMessage(msg)}
                        className={`p-3 cursor-pointer transition-colors text-xs ${
                          selectedMessage?.id === msg.id ? 'bg-emerald-50/70 border-l-4 border-[#123F32]' : 'hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-neutral-900 truncate max-w-[180px]">
                            {msg.from?.replace(/<.*>/, '').trim() || 'Unknown'}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            {msg.date ? new Date(msg.date).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <div className="font-medium text-neutral-800 truncate mb-1">{msg.subject}</div>
                        <p className="text-neutral-500 line-clamp-1 text-[11px]">{msg.snippet}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Detail Viewer */}
              <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/50 flex flex-col justify-between max-h-[420px] overflow-y-auto">
                {selectedMessage ? (
                  <div className="space-y-3 text-xs">
                    <div className="border-b border-neutral-200 pb-3">
                      <h4 className="text-sm font-semibold text-neutral-900 mb-1">
                        {selectedMessage.subject}
                      </h4>
                      <p className="text-neutral-600">
                        <strong className="text-neutral-800">From:</strong> {selectedMessage.from}
                      </p>
                      {selectedMessage.to && (
                        <p className="text-neutral-600">
                          <strong className="text-neutral-800">To:</strong> {selectedMessage.to}
                        </p>
                      )}
                      <p className="text-[11px] text-neutral-400 mt-1">{selectedMessage.date}</p>
                    </div>

                    <div className="text-neutral-700 whitespace-pre-wrap leading-relaxed">
                      {selectedMessage.snippet}
                    </div>

                    <div className="pt-4 border-t border-neutral-200 flex justify-end">
                      <button
                        onClick={() => {
                          setComposeTo(selectedMessage.from?.match(/<([^>]+)>/)?.[1] || selectedMessage.from || '');
                          setComposeSubject(`Re: ${selectedMessage.subject}`);
                          setShowComposeModal(true);
                        }}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#123F32] text-white rounded-lg text-xs font-medium hover:bg-[#0E3228]"
                      >
                        <Send className="w-3 h-3" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 text-neutral-400 text-xs">
                    <Mail className="w-8 h-8 text-neutral-300 mb-2" />
                    <span>Select an email from the list to preview details</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MANDATORY CONFIRMATION DIALOG: DELETE DRIVE FILE */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200 space-y-4">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Confirm File Deletion</h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Are you sure you want to permanently delete{' '}
                <strong className="text-neutral-800">"{fileToDelete.name}"</strong> from your Google Drive? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                id="btn-cancel-delete"
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-delete"
                onClick={handleConfirmDeleteDriveFile}
                disabled={isLoading}
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-sm"
              >
                {isLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE FOLDER MODAL */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-neutral-900 flex items-center space-x-2">
                <FolderPlus className="w-4 h-4 text-[#123F32]" />
                <span>Create New Drive Folder</span>
              </h3>
              <button onClick={() => setShowNewFolderModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Folder name (e.g. CVs, Documents)"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:border-[#123F32] outline-none"
              autoFocus
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim() || isLoading}
                className="px-4 py-2 text-xs font-semibold bg-[#123F32] text-white hover:bg-[#0E3228] rounded-xl transition-colors"
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPOSE EMAIL MODAL */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-neutral-900 flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#123F32]" />
                <span>Compose Message</span>
              </h3>
              <button onClick={() => setShowComposeModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">To</label>
                <input
                  id="compose-to"
                  type="email"
                  placeholder="recipient@example.com"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:border-[#123F32] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">Subject</label>
                <input
                  id="compose-subject"
                  type="text"
                  placeholder="Subject"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:border-[#123F32] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">Message</label>
                <textarea
                  id="compose-body"
                  rows={5}
                  placeholder="Write your email here..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:border-[#123F32] outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowComposeModal(false)}
                className="px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                id="btn-preview-send"
                onClick={() => setShowSendConfirmation(true)}
                disabled={!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()}
                className="px-4 py-2 text-xs font-semibold bg-[#123F32] text-white hover:bg-[#0E3228] rounded-xl transition-colors disabled:opacity-50"
              >
                Continue to Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY CONFIRMATION DIALOG: SEND EMAIL */}
      {showSendConfirmation && (
        <div className="fixed inset-0 z-55 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200 space-y-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#123F32] flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Confirm Sending Email</h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Are you sure you want to send this email to <strong className="text-neutral-900">{composeTo}</strong> with subject <strong className="text-neutral-900">"{composeSubject}"</strong> on behalf of your Gmail account?
              </p>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                id="btn-cancel-send"
                onClick={() => setShowSendConfirmation(false)}
                className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl"
              >
                Back to Edit
              </button>
              <button
                id="btn-confirm-send"
                onClick={handleExecuteSendEmail}
                disabled={isLoading}
                className="px-4 py-2 text-xs font-semibold bg-[#123F32] hover:bg-[#0E3228] text-white rounded-xl transition-colors shadow-sm"
              >
                {isLoading ? 'Sending...' : 'Confirm & Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
