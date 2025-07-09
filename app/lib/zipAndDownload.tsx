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
    console.log(fullPath,item.content);
    
  } else if (item.type === 'directory' && item.children) {
    const folder = zip.folder(fullPath);
    if (folder) {
      item.children.forEach(child => addToZip(folder, child, fullPath));
    }
  }
};

export const useDownloadZip = () => {
  const fileTree: FileSystemItem[] = useSelector((state: RootState) => state.file.fileTree);
  const chatMessages = useSelector((state: RootState) => state.chat.messages);

  const generateChatText = () => {
    return chatMessages.map(msg => {
      const owner = msg.isOwn ? 'You' : msg.user;
      return `[${msg.timestamp}] ${owner}: ${msg.message}`;
    }).join('\n');
  };

  const generateChatHTML = () => {
    const getInitials = (name) => {
      return name.split(' ').map(word => word[0]).join('').toUpperCase();
    };

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Code Fudji - Chat History</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #252526;
              color: #ffffff;
              line-height: 1.6;
              overflow-x: hidden;
            }
            
            .container {
              max-width: 1200px;
              margin: 0 auto;
              min-height: 100vh;
              background: #252526;
            }
            
            .header {
              padding: 24px;
              border-bottom: 1px solid #374151;
              background: rgba(37, 37, 38, 0.95);
              backdrop-filter: blur(10px);
              position: sticky;
              top: 0;
              z-index: 100;
            }
            
            .header-content {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            
            .logo {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: linear-gradient(135deg, #007FFF 0%, #2a52be 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 18px;
            }
            
            .header-text h1 {
              font-size: 24px;
              font-weight: 700;
              background: linear-gradient(135deg, #007FFF 0%, #2a52be 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            
            .header-text p {
              color: #9ca3af;
              font-size: 14px;
              margin-top: 4px;
            }
            
            .chat-container {
              padding: 24px;
              max-height: calc(100vh - 120px);
              overflow-y: auto;
            }
            
            .message {
              display: flex;
              margin-bottom: 24px;
              gap: 12px;
            }
            
            .message.own {
              flex-direction: row-reverse;
            }
            
            .avatar {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: linear-gradient(135deg, #007FFF 0%, #2a52be 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 600;
              font-size: 12px;
              flex-shrink: 0;
            }
            
            .message-content {
              max-width: 70%;
              min-width: 200px;
            }
            
            .message-bubble {
              padding: 12px 16px;
              border-radius: 18px;
              position: relative;
              backdrop-filter: blur(10px);
            }
            
            .message.own .message-bubble {
              background: linear-gradient(135deg, #007FFF 0%, #2a52be 100%);
              color: white;
            }
            
            .message:not(.own) .message-bubble {
              background: rgba(55, 65, 81, 0.6);
              border: 1px solid #374151;
              color: #ffffff;
            }
            
            .message-header {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 4px;
            }
            
            .username {
              font-weight: 600;
              font-size: 13px;
            }
            
            .message.own .username {
              color: rgba(255, 255, 255, 0.9);
            }
            
            .message:not(.own) .username {
              color: #d1d5db;
            }
            
            .timestamp {
              font-size: 11px;
              opacity: 0.7;
            }
            
            .message-text {
              font-size: 14px;
              line-height: 1.5;
              word-wrap: break-word;
              white-space: pre-wrap;
            }
            
            .message.own .message-text {
              color: white;
            }
            
            .message:not(.own) .message-text {
              color: #ffffff;
            }
            
            .empty-state {
              text-align: center;
              padding: 60px 20px;
              color: #9ca3af;
            }
            
            .empty-state-icon {
              font-size: 48px;
              margin-bottom: 16px;
            }
            
            /* Scrollbar styling */
            ::-webkit-scrollbar {
              width: 8px;
            }
            
            ::-webkit-scrollbar-track {
              background: #1f2937;
            }
            
            ::-webkit-scrollbar-thumb {
              background: #374151;
              border-radius: 4px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
              background: #4b5563;
            }
            
            /* Responsive design */
            @media (max-width: 768px) {
              .header {
                padding: 16px;
              }
              
              .chat-container {
                padding: 16px;
              }
              
              .message-content {
                max-width: 85%;
                min-width: 150px;
              }
              
              .header-text h1 {
                font-size: 20px;
              }
            }
            
            /* Animation for smooth loading */
            .message {
              animation: fadeIn 0.3s ease-in-out;
            }
            
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="header-content">
                <div class="logo">🚀</div>
                <div class="header-text">
                  <h1>Code Fudji</h1>
                  <p>Chat History Export</p>
                </div>
              </div>
            </div>
            
            <div class="chat-container">
              ${chatMessages.length === 0 ? `
                <div class="empty-state">
                  <div class="empty-state-icon">💬</div>
                  <h3>No messages yet</h3>
                  <p>Start a conversation to see messages here</p>
                </div>
              ` : chatMessages.map(msg => `
                <div class="message ${msg.isOwn ? 'own' : ''}">
                  <div class="avatar">
                    ${getInitials(msg.isOwn ? 'You' : msg.user)}
                  </div>
                  <div class="message-content">
                    <div class="message-bubble">
                      <div class="message-header">
                        <span class="username">${msg.isOwn ? 'You' : msg.user}</span>
                        <span class="timestamp">${msg.timestamp}</span>
                      </div>
                      <div class="message-text">${msg.message}</div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </body>
      </html>
    `;
};

  const downloadZip = () => {
    if (!fileTree || fileTree.length === 0) {
      return;
    }

    const zip = new JSZip();

    // Add file structure
    fileTree.forEach(item => addToZip(zip, item));

    // ✅ Add chat.txt and chat.html at root
    const chatText = generateChatText();
    const chatHTML = generateChatHTML();

    zip.file('chat.txt', chatText);
    zip.file('chat.html', chatHTML);

    zip.generateAsync({ type: 'blob' }).then(blob => {
      saveAs(blob, 'Code-Fudji-project.zip');
    });
  };

  return downloadZip;
};
