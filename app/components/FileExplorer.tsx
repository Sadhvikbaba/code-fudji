import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  FolderPlus,
  FilePlus,
  Trash2,
  Edit3,
  X
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { 
  addFileToTree,  
  updateFileInTree, 
  deleteFile,
  FileSystemItem 
} from '../store/fileSlice';
import { useFileOperations } from '../hooks/liveKit';
import { Room } from 'livekit-client';
import { getFileIcon } from '../lib/files';

interface FileExplorerProps {
  room: Room | null;
  onFileSelect?: (file: FileSystemItem) => void;
  onFolderOpen?: (folder: FileSystemItem) => void;
  className?: string;
}

export interface FileExplorerRef {
  addFile: (file: FileSystemItem) => void;
  createNewFile: (parentPath?: string) => void;
  createNewFolder: (parentPath?: string) => void;
}

interface CreateDialogProps {
  isOpen: boolean;
  type: 'file' | 'folder';
  onClose: () => void;
  onConfirm: (name: string) => void;
  parentPath?: string;
}

const CreateDialog: React.FC<CreateDialogProps> = ({ isOpen, type, onClose, onConfirm, parentPath }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setName('');
      setError('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (name.includes('/') || name.includes('\\')) {
      setError('Name cannot contain / or \\');
      return;
    }

    if (name.startsWith('.')) {
      setError('Name cannot start with a dot');
      return;
    }

    onConfirm(name.trim());
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 border border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">
            Create New {type === 'file' ? 'File' : 'Folder'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {parentPath && (
          <p className="text-sm text-gray-400 mb-3">
            Location: {parentPath || 'Root'}
          </p>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">
              {type === 'file' ? 'File' : 'Folder'} Name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-400"
              placeholder={type === 'file' ? 'example.txt' : 'New Folder'}
            />
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FileExplorer = forwardRef<FileExplorerRef, FileExplorerProps>(
  ({ room, onFileSelect, onFolderOpen, className = '' }, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const fileTree = useSelector((state: RootState) => state.file.fileTree);
    
    const { createFile, deleteFile: deleteFileSync, renameFile: renameFileSync } = useFileOperations(room);
    
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{x: number, y: number, item: FileSystemItem} | null>(null);
    const [editingItem, setEditingItem] = useState<string | null>(null);
    const [editingName, setEditingName] = useState<string>('');
    const [createDialog, setCreateDialog] = useState<{
      isOpen: boolean;
      type: 'file' | 'folder';
      parentPath?: string;
    }>({ isOpen: false, type: 'file' });
    
    const editInputRef = useRef<HTMLInputElement>(null);

    // Generate unique ID
    const generateId = () => Math.random().toString(36).substr(2, 9);

    // Add external file to the tree
    const addExternalFile = (file: FileSystemItem) => {
      dispatch(addFileToTree(file));
      createFile(file);
    };

    // Create new file with user input
    const createNewFile = (parentPath: string = '') => {
      setCreateDialog({
        isOpen: true,
        type: 'file',
        parentPath
      });
    };

    // Create new folder with user input
    const createNewFolder = (parentPath: string = '') => {
      setCreateDialog({
        isOpen: true,
        type: 'folder',
        parentPath
      });
    };

    // Handle create dialog confirmation
    const handleCreateConfirm = (name: string) => {
      const { type, parentPath } = createDialog;
      
      const newItem: FileSystemItem = {
        id: generateId(),
        name,
        type: type === 'file' ? 'file' : 'directory',
        path: parentPath ? `${parentPath}/${name}` : name,
        ...(type === 'file' ? {
          content: '',
          size: 0,
          lastModified: Date.now()
        } : {
          children: []
        })
      };

      dispatch(addFileToTree(newItem));
      createFile(newItem);
      
      // Expand parent folder if creating inside a folder
      if (parentPath) {
        setExpandedFolders(prev => new Set([...prev, parentPath]));
      }

      // Auto-select the new file for editing
      if (type === 'file' && onFileSelect) {
        setTimeout(() => {
          onFileSelect(newItem);
        }, 100);
      }
    };

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      addFile: addExternalFile,
      createNewFile,
      createNewFolder,
    }));

    // Delete item
    const deleteItem = (item: FileSystemItem) => {
      dispatch(deleteFile(item.path));
      deleteFileSync(item.path);
      
      if (selectedFile === item.path) {
        setSelectedFile(null);
      }
    };

    // Start renaming
    const startRename = (item: FileSystemItem) => {
      setEditingItem(item.id);
      setEditingName(item.name);
      setTimeout(() => {
        editInputRef.current?.focus();
        editInputRef.current?.select();
      }, 100);
    };

    // Finish renaming
    const finishRename = (item: FileSystemItem) => {
      if (editingName.trim() && editingName !== item.name) {
        const newPath = item.path.replace(item.name, editingName.trim());
        const updatedItem = { ...item, name: editingName.trim(), path: newPath };
        
        dispatch(updateFileInTree(updatedItem));
        renameFileSync(item.path, editingName.trim());
      }
      setEditingItem(null);
      setEditingName('');
    };

    // Cancel rename
    const cancelRename = () => {
      setEditingItem(null);
      setEditingName('');
    };

    // Toggle folder expansion
    const toggleFolder = (path: string) => {
      const newExpanded = new Set(expandedFolders);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      setExpandedFolders(newExpanded);
    };

    // Handle file selection
    const handleFileClick = (file: FileSystemItem) => {
      setSelectedFile(file.path);
      if (onFileSelect) {
        onFileSelect(file);
      }
    };

    // Handle folder click
    const handleFolderClick = (folder: FileSystemItem) => {
      toggleFolder(folder.path);
      if (onFolderOpen) {
        onFolderOpen(folder);
      }
    };

    // Handle context menu
    const handleContextMenu = (e: React.MouseEvent, item: FileSystemItem) => {
      e.preventDefault();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        item
      });
    };

    // Close context menu
    const closeContextMenu = () => {
      setContextMenu(null);
    };

    // Handle key press for editing
    const handleEditKeyPress = (e: React.KeyboardEvent, item: FileSystemItem) => {
      if (e.key === 'Enter') {
        finishRename(item);
      } else if (e.key === 'Escape') {
        cancelRename();
      }
    };

    // Sort items: directories first, then files, both alphabetically
    const sortItems = (items: FileSystemItem[]): FileSystemItem[] => {
      return [...items].sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
    };

    // Render tree item
    const renderTreeItem = (item: FileSystemItem, level: number = 0) => {
      const isExpanded = expandedFolders.has(item.path);
      const isSelected = selectedFile === item.path;
      const isEditing = editingItem === item.id;
      const paddingLeft = level * 16 + 8;

      return (
        <div key={item.id} className="select-none">
          <div
            className={`flex items-center py-1.5 px-2 cursor-pointer hover:bg-gray-700/70 transition-colors duration-150 ${
              isSelected ? 'bg-blue-600/30 border-l-2 border-blue-400' : ''
            }`}
            style={{ paddingLeft }}
            onClick={() => {
              if (item.type === 'directory') {
                handleFolderClick(item);
              } else {
                handleFileClick(item);
              }
            }}
            onContextMenu={(e) => handleContextMenu(e, item)}
          >
            {item.type === 'directory' && (
              <div className="mr-1 flex-shrink-0">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            )}
            
            <div className="mr-2 flex-shrink-0">
              {item.type === 'directory' ? (
                isExpanded ? (
                  <FolderOpen className="w-4 h-4 text-blue-400" />
                ) : (
                  <Folder className="w-4 h-4 text-blue-400" />
                )
              ) : (
                getFileIcon(item.name)
              )}
            </div>

            {isEditing ? (
              <input
                ref={editInputRef}
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => handleEditKeyPress(e, item)}
                onBlur={() => finishRename(item)}
                className="flex-1 bg-gray-800 text-white text-sm px-1 py-0.5 border border-blue-400 rounded focus:outline-none"
              />
            ) : (
              <span className="flex-1 text-sm text-gray-200 truncate">
                {item.name}
              </span>
            )}
          </div>

          {/* Render children if directory is expanded */}
          {item.type === 'directory' && isExpanded && item.children && (
            <div>
              {sortItems(item.children).map(child => renderTreeItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    };

    // Handle clicks outside context menu
    React.useEffect(() => {
      const handleClickOutside = () => {
        if (contextMenu) {
          closeContextMenu();
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }, [contextMenu]);

    return (
      <div className={`bg-[#252526] text-white h-full overflow-hidden ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <span className="text-sm font-medium text-gray-200">EXPLORER</span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => createNewFile()}
              className="p-1 hover:bg-gray-700 rounded"
              title="New File"
            >
              <FilePlus className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => createNewFolder()}
              className="p-1 hover:bg-gray-700 rounded"
              title="New Folder"
            >
              <FolderPlus className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* File Tree */}
        <div className="flex-1 overflow-y-auto">
          {fileTree.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <div className="text-4xl mb-2">📁</div>
              <p className="text-sm">No files in workspace</p>
              <p className="text-xs text-gray-600 mt-1">
                If you haven&apos;t got files in the existing room while joining, please refresh the page again.
              </p>
            </div>
          ) : (
            <div className="py-1">
              {sortItems(fileTree).map(item => renderTreeItem(item))}
            </div>
          )}
        </div>

        {/* Context Menu */}
        {contextMenu && (
          <div
            className="fixed bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50 py-1 min-w-[140px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            {contextMenu.item.type === 'directory' && (
              <>
                <button
                  onClick={() => {
                    createNewFile(contextMenu.item.path);
                    closeContextMenu();
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-700 flex items-center"
                >
                  <FilePlus className="w-4 h-4 mr-2" />
                  New File
                </button>
                <button
                  onClick={() => {
                    createNewFolder(contextMenu.item.path);
                    closeContextMenu();
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-700 flex items-center"
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  New Folder
                </button>
                <div className="border-t border-gray-600 my-1"></div>
              </>
            )}
            <button
              onClick={() => {
                startRename(contextMenu.item);
                closeContextMenu();
              }}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-700 flex items-center"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Rename
            </button>
            <button
              onClick={() => {
                deleteItem(contextMenu.item);
                closeContextMenu();
              }}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-700 text-red-400 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        )}

        {/* Create Dialog */}
        <CreateDialog
          isOpen={createDialog.isOpen}
          type={createDialog.type}
          parentPath={createDialog.parentPath}
          onClose={() => setCreateDialog({ isOpen: false, type: 'file' })}
          onConfirm={handleCreateConfirm}
        />
      </div>
    );
  }
);

FileExplorer.displayName = 'FileExplorer';

export default FileExplorer;