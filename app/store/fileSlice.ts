// store/fileSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileSystemItem[];
  size?: number;
  lastModified?: number;
  content?: string;
}

export interface OpenFile {
  item: FileSystemItem;
  content: string;
  isDirty: boolean;
  lastSaved?: number;
}

interface FileState {
  openFiles: OpenFile[];
  activeFileIndex: number;
  fileTree: FileSystemItem[];
}

const initialState: FileState = {
  openFiles: [],
  activeFileIndex: -1,
  fileTree: [],
};

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    // File Tree Management
    addFileToTree(state, action: PayloadAction<FileSystemItem>) {
      const file = action.payload;

      const insert = (items: FileSystemItem[], pathParts: string[], fullPath: string): void => {
        const currentName = pathParts[0];

        // Base case: insert the file
        if (pathParts.length === 1) {
          if (!items.find(item => item.path === fullPath)) {
            items.push(file);
          }
          return;
        }

        // Find or create the current folder
        let folder = items.find(item => item.name === currentName && item.type === 'directory');

        if (!folder) {
          folder = {
            id: Math.random().toString(36).substr(2, 9),
            name: currentName,
            type: 'directory',
            path: pathParts.slice(0, pathParts.indexOf(currentName) + 1).join('/'),
            children: [],
          };
          items.push(folder);
        }

        if (!folder.children) folder.children = [];

        insert(folder.children, pathParts.slice(1), fullPath);

        // Sort after insertion
        folder.children.sort((a, b) => {
          if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
          return a.name.localeCompare(b.name);
        });
      };

      const pathParts = file.path.split('/');
      insert(state.fileTree, pathParts, file.path);
    },

    removeFileFromTree(state, action: PayloadAction<string>) {
      const pathToRemove = action.payload;
      
      const removeFromTree = (items: FileSystemItem[]): FileSystemItem[] => {
        return items.filter(item => {
          if (item.path === pathToRemove) {
            return false;
          }
          if (item.children) {
            item.children = removeFromTree(item.children);
          }
          return true;
        });
      };

      state.fileTree = removeFromTree(state.fileTree);
    },

    updateFileInTree(state, action: PayloadAction<FileSystemItem>) {
      const updatedFile = action.payload;
      
      const updateInTree = (items: FileSystemItem[]): FileSystemItem[] => {
        return items.map(item => {
          if (item.id === updatedFile.id) {
            return updatedFile;
          }
          if (item.children) {
            item.children = updateInTree(item.children);
          }
          return item;
        });
      };

      state.fileTree = updateInTree(state.fileTree);
    },

    // Open File Management
    openFile(state, action: PayloadAction<OpenFile>) {
      const existsIndex = state.openFiles.findIndex(
        (f) => f.item.path === action.payload.item.path
      );
      
      if (existsIndex !== -1) {
        state.activeFileIndex = existsIndex;
      } else {
        state.openFiles.push(action.payload);
        state.activeFileIndex = state.openFiles.length - 1;
      }
    },

    closeFile(state, action: PayloadAction<number>) {
      const indexToClose = action.payload;
      
      if (indexToClose >= 0 && indexToClose < state.openFiles.length) {
        state.openFiles.splice(indexToClose, 1);
        
        if (state.activeFileIndex === indexToClose) {
          if (state.openFiles.length > 0) {
            state.activeFileIndex = Math.min(indexToClose, state.openFiles.length - 1);
          } else {
            state.activeFileIndex = -1;
          }
        } else if (state.activeFileIndex > indexToClose) {
          state.activeFileIndex -= 1;
        }
      }
    },

    updateFileContent(state, action: PayloadAction<{ index: number; newContent: string }>) {
      const { index, newContent } = action.payload;
      const file = state.openFiles[index];
      
      if (file) {
        file.content = newContent;
        file.isDirty = file.item.content !== newContent;
        
        // Update the file in the tree as well
        const updateInTree = (items: FileSystemItem[]): FileSystemItem[] => {
          return items.map(item => {
            if (item.path === file.item.path) {
              return { ...item, content: newContent };
            }
            if (item.children) {
              item.children = updateInTree(item.children);
            }
            return item;
          });
        };
        
        state.fileTree = updateInTree(state.fileTree);
      }
    },

    renameFile(state, action: PayloadAction<{ oldPath: string; newName: string }>) {
      const { oldPath, newName } = action.payload;
      
      // Update in open files
      state.openFiles = state.openFiles.map((openFile) => {
        if (openFile.item.path === oldPath) {
          const pathParts = oldPath.split('/');
          pathParts[pathParts.length - 1] = newName;
          const newPath = pathParts.join('/');
          
          return {
            ...openFile,
            item: {
              ...openFile.item,
              name: newName,
              path: newPath,
            },
          };
        }
        return openFile;
      });

      // Update in file tree
      const updateInTree = (items: FileSystemItem[]): FileSystemItem[] => {
        return items.map(item => {
          if (item.path === oldPath) {
            const pathParts = oldPath.split('/');
            pathParts[pathParts.length - 1] = newName;
            const newPath = pathParts.join('/');
            
            return {
              ...item,
              name: newName,
              path: newPath,
            };
          }
          if (item.children) {
            item.children = updateInTree(item.children);
          }
          return item;
        });
      };

      state.fileTree = updateInTree(state.fileTree);
    },

    deleteFile(state, action: PayloadAction<string>) {
      const pathToDelete = action.payload;
      
      // Close the file if it's open
      const openFileIndex = state.openFiles.findIndex(f => f.item.path === pathToDelete);
      if (openFileIndex !== -1) {
        state.openFiles.splice(openFileIndex, 1);
        
        if (state.activeFileIndex === openFileIndex) {
          if (state.openFiles.length > 0) {
            state.activeFileIndex = Math.min(openFileIndex, state.openFiles.length - 1);
          } else {
            state.activeFileIndex = -1;
          }
        } else if (state.activeFileIndex > openFileIndex) {
          state.activeFileIndex -= 1;
        }
      }
      
      // Remove from file tree
      const removeFromTree = (items: FileSystemItem[]): FileSystemItem[] => {
        return items.filter(item => {
          if (item.path === pathToDelete) {
            return false;
          }
          if (item.children) {
            item.children = removeFromTree(item.children);
          }
          return true;
        });
      };

      state.fileTree = removeFromTree(state.fileTree);
    },

    saveFile(state, action: PayloadAction<number>) {
      const file = state.openFiles[action.payload];
      if (file) {
        file.isDirty = false;
        file.lastSaved = Date.now();
        
        // Update the original content in the file item
        file.item.content = file.content;
        
        // Update in file tree
        const updateInTree = (items: FileSystemItem[]): FileSystemItem[] => {
          return items.map(item => {
            if (item.path === file.item.path) {
              return { ...item, content: file.content };
            }
            if (item.children) {
              item.children = updateInTree(item.children);
            }
            return item;
          });
        };
        
        state.fileTree = updateInTree(state.fileTree);
      }
    },

    setActiveFileIndex(state, action: PayloadAction<number>) {
      if (action.payload >= 0 && action.payload < state.openFiles.length) {
        state.activeFileIndex = action.payload;
      }
    },

    // LiveKit sync actions
    syncFileContent(state, action: PayloadAction<{ path: string; content: string; timestamp: number }>) {
      const { path, content, timestamp } = action.payload;
      
      // Update in open files
      const openFileIndex = state.openFiles.findIndex(f => f.item.path === path);
      if (openFileIndex !== -1) {
        const file = state.openFiles[openFileIndex];
        // Only update if the remote change is newer
        if (!file.lastSaved || timestamp > file.lastSaved) {
          file.content = content;
          file.isDirty = file.item.content !== content;
        }
      }
      
      // Update in file tree
      const updateInTree = (items: FileSystemItem[]): FileSystemItem[] => {
        return items.map(item => {
          if (item.path === path) {
            return { ...item, content };
          }
          if (item.children) {
            item.children = updateInTree(item.children);
          }
          return item;
        });
      };
      
      state.fileTree = updateInTree(state.fileTree);
    },

    resetFileState(state) {
      state.openFiles = [];
      state.activeFileIndex = -1;
      state.fileTree = [];
    },
  },
});

export const {
  addFileToTree,
  removeFileFromTree,
  updateFileInTree,
  openFile,
  closeFile,
  updateFileContent,
  renameFile,
  deleteFile,
  saveFile,
  setActiveFileIndex,
  syncFileContent,
  resetFileState,
} = fileSlice.actions;

export default fileSlice.reducer;