import { 
  Code, Database, FileText, GitBranch, Package, Settings, Terminal, File,
   Globe, Lock, Archive, Music, Video, Palette, Book, Coffee,
   Box, Wrench, Shield, Binary, Server, Cloud
} from 'lucide-react';

export const getLanguage = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    // JavaScript/TypeScript
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'mjs':
    case 'cjs':
      return 'javascript';
    case 'vue':
      return 'vue';
    case 'svelte':
      return 'svelte';
    
    // Styles
    case 'css':
    case 'scss':
    case 'sass':
    case 'less':
    case 'styl':
    case 'stylus':
      return 'css';
    
    // Web
    case 'html':
    case 'htm':
    case 'xhtml':
      return 'html';
    case 'xml':
    case 'xsl':
    case 'xslt':
      return 'xml';
    case 'svg':
      return 'xml';
    
    // Data formats
    case 'json':
    case 'jsonc':
      return 'json';
    case 'yaml':
    case 'yml':
      return 'yaml';
    case 'toml':
      return 'toml';
    case 'ini':
    case 'cfg':
    case 'conf':
      return 'ini';
    case 'csv':
      return 'csv';
    
    // Programming languages
    case 'py':
    case 'pyw':
    case 'pyc':
      return 'python';
    case 'java':
    case 'class':
      return 'java';
    case 'cpp':
    case 'cc':
    case 'cxx':
    case 'c++':
      return 'cpp';
    case 'c':
    case 'h':
    case 'hpp':
      return 'c';
    case 'cs':
      return 'csharp';
    case 'go':
      return 'go';
    case 'rs':
      return 'rust';
    case 'php':
    case 'php3':
    case 'php4':
    case 'php5':
    case 'phtml':
      return 'php';
    case 'rb':
    case 'rbw':
      return 'ruby';
    case 'kt':
    case 'kts':
      return 'kotlin';
    case 'swift':
      return 'swift';
    case 'scala':
    case 'sc':
      return 'scala';
    case 'clj':
    case 'cljs':
    case 'cljc':
      return 'clojure';
    case 'fs':
    case 'fsi':
    case 'fsx':
      return 'fsharp';
    case 'vb':
      return 'vb';
    case 'dart':
      return 'dart';
    case 'lua':
      return 'lua';
    case 'r':
      return 'r';
    case 'jl':
      return 'julia';
    case 'elm':
      return 'elm';
    case 'hs':
    case 'lhs':
      return 'haskell';
    case 'erl':
    case 'hrl':
      return 'erlang';
    case 'ex':
    case 'exs':
      return 'elixir';
    case 'nim':
      return 'nim';
    case 'cr':
      return 'crystal';
    case 'zig':
      return 'zig';
    case 'v':
      return 'v';
    case 'pas':
    case 'pp':
      return 'pascal';
    case 'pl':
    case 'pm':
      return 'perl';
    case 'tcl':
      return 'tcl';
    case 'groovy':
    case 'gvy':
      return 'groovy';
    
    // Shell/Script
    case 'sh':
    case 'bash':
    case 'zsh':
    case 'fish':
      return 'shell';
    case 'bat':
    case 'cmd':
      return 'batch';
    case 'ps1':
    case 'psm1':
      return 'powershell';
    
    // Database
    case 'sql':
    case 'mysql':
    case 'pgsql':
    case 'plsql':
      return 'sql';
    
    // Documentation
    case 'md':
    case 'markdown':
    case 'mdown':
    case 'mkdown':
      return 'markdown';
    case 'rst':
      return 'restructuredtext';
    case 'tex':
    case 'latex':
      return 'latex';
    case 'adoc':
    case 'asciidoc':
      return 'asciidoc';
    
    // Config files
    case 'dockerfile':
      return 'dockerfile';
    case 'makefile':
      return 'makefile';
    case 'cmake':
      return 'cmake';
    case 'gradle':
      return 'gradle';
    case 'sbt':
      return 'sbt';
    case 'pom':
      return 'xml';
    case 'gemfile':
      return 'ruby';
    case 'rakefile':
      return 'ruby';
    case 'podfile':
      return 'ruby';
    case 'vagrantfile':
      return 'ruby';
    case 'gulpfile':
    case 'gruntfile':
      return 'javascript';
    case 'webpack':
      return 'javascript';
    case 'rollup':
      return 'javascript';
    case 'vite':
      return 'javascript';
    
    // Other formats
    case 'log':
      return 'log';
    case 'diff':
    case 'patch':
      return 'diff';
    case 'gitignore':
    case 'gitattributes':
    case 'gitmodules':
      return 'gitignore';
    case 'editorconfig':
      return 'editorconfig';
    case 'prettierrc':
      return 'json';
    case 'eslintrc':
      return 'json';
    case 'tsconfig':
      return 'json';
    case 'jsconfig':
      return 'json';
    case 'babelrc':
      return 'json';
    
    default:
      return 'plaintext';
  }
};

export const getDefaultContent = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const baseName = fileName.replace(/\.[^/.]+$/, '');
  
  switch (extension) {
    case 'js':
      return `// ${fileName}\n\n// Add your JavaScript code here\nconsole.log('Hello, World!');\n`;
    
    case 'jsx':
      return `// ${fileName}\n\nimport React from 'react';\n\nconst ${baseName} = () => {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n};\n\nexport default ${baseName};\n`;
    
    case 'ts':
      return `// ${fileName}\n\n// Add your TypeScript code here\nconst greeting: string = 'Hello, World!';\nconsole.log(greeting);\n`;
    
    case 'tsx':
      return `// ${fileName}\n\nimport React from 'react';\n\ninterface Props {\n  // Define your props here\n}\n\nconst ${baseName}: React.FC<Props> = () => {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n};\n\nexport default ${baseName};\n`;
    
    case 'vue':
      return `<template>\n  <div>\n    <h1>{{ title }}</h1>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: '${baseName}',\n  data() {\n    return {\n      title: 'Hello World'\n    }\n  }\n}\n</script>\n\n<style scoped>\n/* Add your styles here */\n</style>\n`;
    
    case 'svelte':
      return `<script>\n  let name = 'World';\n</script>\n\n<main>\n  <h1>Hello {name}!</h1>\n</main>\n\n<style>\n  h1 {\n    color: #ff3e00;\n  }\n</style>\n`;
    
    case 'css':
      return `/* ${fileName} */\n\n:root {\n  --primary-color: #007bff;\n  --secondary-color: #6c757d;\n  --font-family: 'Arial', sans-serif;\n}\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 1rem;\n}\n`;
    
    case 'scss':
    case 'sass':
      return `// ${fileName}\n\n$primary-color: #007bff;\n$secondary-color: #6c757d;\n$font-family: 'Arial', sans-serif;\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 1rem;\n  \n  h1 {\n    color: $primary-color;\n    font-family: $font-family;\n  }\n}\n`;
    
    case 'html':
      return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <meta name="description" content="A simple HTML page">\n  <title>${baseName}</title>\n</head>\n<body>\n  <header>\n    <h1>Welcome to ${baseName}</h1>\n  </header>\n  <main>\n    <p>This is a simple HTML page.</p>\n  </main>\n  <footer>\n    <p>&copy; 2025 Your Name</p>\n  </footer>\n</body>\n</html>\n`;
    
    case 'json':
      return `{\n  "name": "${baseName}",\n  "version": "1.0.0",\n  "description": "A JSON file",\n  "main": "index.js",\n  "scripts": {\n    "start": "node index.js"\n  },\n  "keywords": [],\n  "author": "",\n  "license": "MIT"\n}\n`;
    
    case 'yaml':
    case 'yml':
      return `# ${fileName}\n\nname: ${baseName}\nversion: 1.0.0\ndescription: A YAML configuration file\n\nconfig:\n  debug: false\n  port: 3000\n  database:\n    host: localhost\n    port: 5432\n    name: myapp\n`;
    
    case 'md':
      return `# ${baseName}\n\nThis is a markdown file for ${baseName}.\n\n## Getting Started\n\nAdd your content here.\n\n### Features\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n### Installation\n\n\`\`\`bash\nnpm install\n\`\`\`\n\n### Usage\n\n\`\`\`bash\nnpm start\n\`\`\`\n\n## Contributing\n\nPull requests are welcome!\n`;
    
    case 'py':
      return `#!/usr/bin/env python3\n# -*- coding: utf-8 -*-\n\"\"\"\n${fileName}\n\nDescription of the module.\n\"\"\"\n\ndef main():\n    \"\"\"Main function.\"\"\"\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()\n`;
    
    case 'java':
      return `package com.example;\n\n/**\n * ${baseName} class\n * \n * @author Your Name\n * @version 1.0\n */\npublic class ${baseName} {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n`;
    
    case 'cpp':
    case 'cc':
    case 'cxx':
      return `#include <iostream>\n#include <string>\n\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n`;
    
    case 'c':
      return `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n`;
    
    case 'go':
      return `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}\n`;
    
    case 'rs':
      return `// ${fileName}\n\nfn main() {\n    println!("Hello, World!");\n}\n`;
    
    case 'php':
      return `<?php\n// ${fileName}\n\necho "Hello, World!\\n";\n\n// Add your PHP code here\n?>\n`;
    
    case 'rb':
      return `#!/usr/bin/env ruby\n# ${fileName}\n\nputs "Hello, World!"\n\n# Add your Ruby code here\n`;
    
    case 'swift':
      return `import Foundation\n\n// ${fileName}\n\nprint("Hello, World!")\n\n// Add your Swift code here\n`;
    
    case 'kt':
      return `// ${fileName}\n\nfun main() {\n    println("Hello, World!")\n}\n`;
    
    case 'dart':
      return `// ${fileName}\n\nvoid main() {\n  print('Hello, World!');\n}\n`;
    
    case 'sh':
    case 'bash':
      return `#!/bin/bash\n# ${fileName}\n\nset -e\n\necho "Hello, World!"\n\n# Add your shell commands here\n`;
    
    case 'ps1':
      return `# ${fileName}\n\nWrite-Host "Hello, World!"\n\n# Add your PowerShell commands here\n`;
    
    case 'sql':
      return `-- ${fileName}\n-- Database: ${baseName}\n\n-- Create table\nCREATE TABLE users (\n    id SERIAL PRIMARY KEY,\n    name VARCHAR(255) NOT NULL,\n    email VARCHAR(255) UNIQUE NOT NULL,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- Insert sample data\nINSERT INTO users (name, email) VALUES\n    ('John Doe', 'john@example.com'),\n    ('Jane Smith', 'jane@example.com');\n\n-- Select data\nSELECT * FROM users;\n`;
    
    case 'dockerfile':
      return `# ${fileName}\n\nFROM node:18-alpine\n\n# Set working directory\nWORKDIR /app\n\n# Copy package files\nCOPY package*.json ./\n\n# Install dependencies\nRUN npm ci --only=production\n\n# Copy application code\nCOPY . .\n\n# Expose port\nEXPOSE 3000\n\n# Start application\nCMD ["npm", "start"]\n`;
    
    case 'makefile':
      return `# ${fileName}\n\n.PHONY: all build clean install test\n\nall: build\n\nbuild:\n\t@echo "Building project..."\n\t# Add build commands here\n\nclean:\n\t@echo "Cleaning..."\n\t# Add clean commands here\n\ninstall:\n\t@echo "Installing dependencies..."\n\t# Add install commands here\n\ntest:\n\t@echo "Running tests..."\n\t# Add test commands here\n`;
    
    case 'gitignore':
      return `# ${fileName}\n\n# Dependencies\nnode_modules/\n*.log\n\n# Build outputs\ndist/\nbuild/\n*.min.js\n*.min.css\n\n# Environment files\n.env\n.env.local\n.env.production\n\n# IDE files\n.vscode/\n.idea/\n*.swp\n*.swo\n\n# OS files\n.DS_Store\nThumbs.db\n\n# Temporary files\n*.tmp\n*.temp\n`;
    
    case 'readme':
      return `# ${baseName}\n\nA brief description of your project.\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n## Installation\n\n\`\`\`bash\nnpm install\n\`\`\`\n\n## Usage\n\n\`\`\`bash\nnpm start\n\`\`\`\n\n## Contributing\n\nContributions are welcome! Please read the contributing guidelines.\n\n## License\n\nThis project is licensed under the MIT License.\n`;
    
    case 'toml':
      return `# ${fileName}\n\n[package]\nname = "${baseName}"\nversion = "1.0.0"\ndescription = "A TOML configuration file"\n\n[dependencies]\n# Add your dependencies here\n\n[config]\ndebug = false\nport = 3000\n\n[database]\nhost = "localhost"\nport = 5432\nname = "myapp"\n`;
    
    case 'ini':
    case 'cfg':
      return `; ${fileName}\n\n[general]\nname = ${baseName}\nversion = 1.0.0\ndebug = false\n\n[database]\nhost = localhost\nport = 5432\nname = myapp\n\n[server]\nport = 3000\nhost = 0.0.0.0\n`;
    
    case 'env':
      return `# ${fileName}\n# Environment variables\n\n# Database\nDB_HOST=localhost\nDB_PORT=5432\nDB_NAME=myapp\nDB_USER=user\nDB_PASSWORD=password\n\n# Server\nPORT=3000\nNODE_ENV=development\n\n# API Keys\nAPI_KEY=your-api-key-here\nSECRET_KEY=your-secret-key-here\n`;
    
    case 'log':
      return `# ${fileName}\n# Log file\n\n[${new Date().toISOString()}] INFO: Application started\n[${new Date().toISOString()}] INFO: Server listening on port 3000\n`;
    
    default:
      return `// ${fileName}\n\n// Add your content here\n`;
  }
};

// Get file icon based on extension
export const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const fullName = fileName.toLowerCase();
  
  // Special cases for full filenames
  if (fullName.includes('dockerfile')) {
    return <Box className="w-4 h-4 text-blue-500" />;
  }
  if (fullName.includes('makefile') || fullName.includes('cmake')) {
    return <Wrench className="w-4 h-4 text-orange-500" />;
  }
  if (fullName.includes('readme')) {
    return <Book className="w-4 h-4 text-blue-400" />;
  }
  if (fullName.includes('license')) {
    return <Shield className="w-4 h-4 text-green-400" />;
  }
  if (fullName.includes('changelog')) {
    return <FileText className="w-4 h-4 text-purple-400" />;
  }
  
  switch (extension) {
    // JavaScript/TypeScript
    case 'js':
    case 'mjs':
    case 'cjs':
      return <Code className="w-4 h-4 text-yellow-400" />;
    case 'jsx':
      return <Code className="w-4 h-4 text-blue-400" />;
    case 'ts':
      return <Code className="w-4 h-4 text-blue-500" />;
    case 'tsx':
      return <Code className="w-4 h-4 text-blue-500" />;
    case 'vue':
      return <Code className="w-4 h-4 text-green-500" />;
    case 'svelte':
      return <Code className="w-4 h-4 text-orange-500" />;
    
    // Web technologies
    case 'html':
    case 'htm':
    case 'xhtml':
      return <Globe className="w-4 h-4 text-orange-400" />;
    case 'css':
    case 'scss':
    case 'sass':
    case 'less':
    case 'styl':
      return <Palette className="w-4 h-4 text-purple-400" />;
    case 'xml':
    case 'xsl':
    case 'xslt':
      return <Code className="w-4 h-4 text-orange-400" />;
    
    // Data formats
    case 'json':
    case 'jsonc':
      return <Database className="w-4 h-4 text-yellow-400" />;
    case 'yaml':
    case 'yml':
      return <Database className="w-4 h-4 text-red-400" />;
    case 'toml':
      return <Database className="w-4 h-4 text-orange-400" />;
    case 'xml':
      return <Database className="w-4 h-4 text-green-400" />;
    case 'csv':
      return <Database className="w-4 h-4 text-green-500" />;
    case 'ini':
    case 'cfg':
    case 'conf':
      return <Settings className="w-4 h-4 text-gray-500" />;
    
    // Programming languages
    case 'py':
    case 'pyw':
    case 'pyc':
      return <Code className="w-4 h-4 text-blue-500" />;
    case 'java':
    case 'class':
      return <Coffee className="w-4 h-4 text-red-500" />;
    case 'cpp':
    case 'cc':
    case 'cxx':
    case 'c++':
      return <Code className="w-4 h-4 text-blue-600" />;
    case 'c':
    case 'h':
    case 'hpp':
      return <Code className="w-4 h-4 text-gray-600" />;
    case 'cs':
      return <Code className="w-4 h-4 text-purple-500" />;
    case 'go':
      return <Code className="w-4 h-4 text-cyan-500" />;
    case 'rs':
      return <Code className="w-4 h-4 text-orange-600" />;
    case 'php':
      return <Code className="w-4 h-4 text-purple-600" />;
    case 'rb':
      return <Code className="w-4 h-4 text-red-500" />;
    case 'swift':
      return <Code className="w-4 h-4 text-orange-500" />;
    case 'kt':
      return <Code className="w-4 h-4 text-purple-500" />;
    case 'dart':
      return <Code className="w-4 h-4 text-blue-400" />;
    case 'scala':
      return <Code className="w-4 h-4 text-red-500" />;
    case 'clj':
    case 'cljs':
      return <Code className="w-4 h-4 text-green-600" />;
    case 'fs':
    case 'fsi':
      return <Code className="w-4 h-4 text-blue-500" />;
    case 'vb':
      return <Code className="w-4 h-4 text-blue-600" />;
    case 'lua':
      return <Code className="w-4 h-4 text-blue-400" />;
    case 'r':
      return <Code className="w-4 h-4 text-blue-500" />;
    case 'jl':
      return <Code className="w-4 h-4 text-purple-500" />;
    case 'elm':
      return <Code className="w-4 h-4 text-blue-500" />;
    case 'hs':
      return <Code className="w-4 h-4 text-purple-600" />;
    case 'erl':
      return <Code className="w-4 h-4 text-red-500" />;
    case 'ex':
      return <Code className="w-4 h-4 text-purple-500" />;
    case 'nim':
      return <Code className="w-4 h-4 text-yellow-500" />;
    case 'cr':
      return <Code className="w-4 h-4 text-gray-600" />;
    case 'zig':
      return <Code className="w-4 h-4 text-orange-500" />;
    case 'v':
      return <Code className="w-4 h-4 text-blue-500" />;
    
    // Shell/Script
    case 'sh':
    case 'bash':
    case 'zsh':
    case 'fish':
      return <Terminal className="w-4 h-4 text-green-500" />;
    case 'bat':
    case 'cmd':
      return <Terminal className="w-4 h-4 text-blue-500" />;
    case 'ps1':
      return <Terminal className="w-4 h-4 text-blue-600" />;
    
    // Database
    case 'sql':
    case 'mysql':
    case 'pgsql':
      return <Database className="w-4 h-4 text-blue-500" />;
    
    // Documentation
    case 'md':
    case 'markdown':
      return <FileText className="w-4 h-4 text-gray-400" />;
    case 'rst':
      return <FileText className="w-4 h-4 text-gray-500" />;
    case 'tex':
    case 'latex':
      return <FileText className="w-4 h-4 text-red-400" />;
    case 'adoc':
      return <FileText className="w-4 h-4 text-blue-400" />;
    case 'txt':
      return <FileText className="w-4 h-4 text-gray-400" />;
    
    // Audio
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
    case 'ogg':
    case 'm4a':
      return <Music className="w-4 h-4 text-pink-400" />;
    
    // Video
    case 'mp4':
    case 'avi':
    case 'mkv':
    case 'mov':
    case 'wmv':
    case 'flv':
    case 'webm':
      return <Video className="w-4 h-4 text-red-400" />;
    
    // Archives
    case 'zip':
    case 'rar':
    case 'tar':
    case 'gz':
    case 'bz2':
    case '7z':
    case 'xz':
      return <Archive className="w-4 h-4 text-yellow-500" />;
    
    // Git
    case 'gitignore':
    case 'gitattributes':
    case 'gitmodules':
      return <GitBranch className="w-4 h-4 text-orange-500" />;
    
    // Package managers
    case 'lock':
      return <Lock className="w-4 h-4 text-yellow-500" />;
    
    // Build tools
    case 'webpack':
    case 'rollup':
    case 'vite':
    case 'gulpfile':
    case 'gruntfile':
      return <Wrench className="w-4 h-4 text-orange-500" />;
    
    // Environment
    case 'env':
      return <Settings className="w-4 h-4 text-green-500" />;
    
    // Logs
    case 'log':
      return <FileText className="w-4 h-4 text-gray-500" />;
    
    // Binary/Executable
    case 'exe':
    case 'dll':
    case 'so':
    case 'dylib':
    case 'bin':
      return <Binary className="w-4 h-4 text-red-500" />;
    
    // Fonts
    case 'ttf':
    case 'otf':
    case 'woff':
    case 'woff2':
    case 'eot':
      return <FileText className="w-4 h-4 text-purple-500" />;
    
    // Cloud/Server
    case 'dockerfile':
      return <Server className="w-4 h-4 text-blue-500" />;
    case 'terraform':
    case 'tf':
      return <Cloud className="w-4 h-4 text-purple-500" />;
    
    // Special package files
    default:
      if (fullName === 'package.json' || fullName === 'package-lock.json') {
        return <Package className="w-4 h-4 text-red-400" />;
      }
      if (fullName === 'yarn.lock' || fullName === 'pnpm-lock.yaml') {
        return <Package className="w-4 h-4 text-blue-400" />;
      }
      if (fullName === 'composer.json' || fullName === 'composer.lock') {
        return <Package className="w-4 h-4 text-orange-400" />;
      }
      if (fullName === 'gemfile' || fullName === 'gemfile.lock') {
        return <Package className="w-4 h-4 text-red-500" />;
      }
      if (fullName === 'requirements.txt' || fullName === 'pipfile') {
        return <Package className="w-4 h-4 text-blue-500" />;
      }
      if (fullName === 'cargo.toml' || fullName === 'cargo.lock') {
        return <Package className="w-4 h-4 text-orange-600" />;
      }
      if (fullName === 'go.mod' || fullName === 'go.sum') {
        return <Package className="w-4 h-4 text-cyan-500" />;
      }
      if (fullName === 'pubspec.yaml' || fullName === 'pubspec.lock') {
        return <Package className="w-4 h-4 text-blue-400" />;
      }
      if (fullName === 'build.gradle' || fullName === 'build.sbt') {
        return <Package className="w-4 h-4 text-green-500" />;
      }
      if (fullName === 'pom.xml') {
        return <Package className="w-4 h-4 text-orange-500" />;
      }
      if (fullName === 'podfile' || fullName === 'podfile.lock') {
        return <Package className="w-4 h-4 text-red-500" />;
      }
      if (fullName === 'mix.exs' || fullName === 'mix.lock') {
        return <Package className="w-4 h-4 text-purple-500" />;
      }
      if (fullName === 'stack.yaml') {
        return <Package className="w-4 h-4 text-purple-600" />;
      }
      if (fullName === 'cabal.config') {
        return <Package className="w-4 h-4 text-purple-600" />;
      }
      if (fullName === 'nimble') {
        return <Package className="w-4 h-4 text-yellow-500" />;
      }
      if (fullName === 'deno.json' || fullName === 'deno.lock') {
        return <Package className="w-4 h-4 text-black" />;
      }
      if (fullName === 'bun.lockb') {
        return <Package className="w-4 h-4 text-orange-400" />;
      }
      
      return <File className="w-4 h-4 text-gray-400" />;
  }
};

