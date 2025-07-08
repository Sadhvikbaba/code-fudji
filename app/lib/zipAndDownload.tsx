import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileSystemItem[];
  size?: number;
  lastModified?: number;
  content?: string;
}

const addToZip = (zip: JSZip, item: FileSystemItem, currentPath = '') => {
  const fullPath = currentPath ? `${currentPath}/${item.name}` : item.name;

  if (item.type === 'file') {
    zip.file(fullPath, item.content || '');
  } else if (item.type === 'directory' && item.children) {
    const folder = zip.folder(fullPath);
    if (folder) {
      item.children.forEach(child => addToZip(folder, child, fullPath));
    }
  }
};

export const useDownloadZip = () => {
  const fileTree: FileSystemItem[] = useSelector((state: RootState) => state.file.fileTree);

  const downloadZip = () => {
    if (!fileTree || fileTree.length === 0) {
      return;
    }
    const zip = new JSZip();
    fileTree.forEach(item => addToZip(zip, item));
    zip.generateAsync({ type: 'blob' }).then(blob => {
      saveAs(blob, 'Code-Fudji-project.zip');
    });
  };

  return downloadZip;
};
