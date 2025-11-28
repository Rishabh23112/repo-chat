import {
    Archive,
    Braces,
    Code,
    Database,
    FileCode2,
    FileImage,
    FileText,
    FileType,
    Film,
    Image,
    Settings
} from 'lucide-react';

/**
 * Get the appropriate icon and color for a file based on its extension
 * @param {string} filename - The name of the file
 * @returns {object} - Object containing the icon component and color class
 */
export const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();

    const iconMap = {
        // Programming Languages
        'py': { icon: FileCode2, color: 'text-blue-400' },
        'js': { icon: FileCode2, color: 'text-yellow-400' },
        'jsx': { icon: FileCode2, color: 'text-cyan-400' },
        'ts': { icon: FileCode2, color: 'text-blue-500' },
        'tsx': { icon: FileCode2, color: 'text-cyan-500' },
        'java': { icon: FileCode2, color: 'text-red-400' },
        'cpp': { icon: FileCode2, color: 'text-purple-400' },
        'c': { icon: FileCode2, color: 'text-purple-300' },
        'go': { icon: FileCode2, color: 'text-cyan-400' },
        'rs': { icon: FileCode2, color: 'text-orange-500' },
        'rb': { icon: FileCode2, color: 'text-red-500' },
        'php': { icon: FileCode2, color: 'text-indigo-400' },

        // Data & Config
        'json': { icon: Braces, color: 'text-yellow-500' },
        'yaml': { icon: FileText, color: 'text-purple-400' },
        'yml': { icon: FileText, color: 'text-purple-400' },
        'toml': { icon: FileText, color: 'text-orange-400' },
        'xml': { icon: Code, color: 'text-green-500' },
        'sql': { icon: Database, color: 'text-blue-500' },

        // Web
        'html': { icon: Code, color: 'text-orange-500' },
        'css': { icon: FileType, color: 'text-blue-400' },
        'scss': { icon: FileType, color: 'text-pink-400' },
        'sass': { icon: FileType, color: 'text-pink-500' },
        'less': { icon: FileType, color: 'text-blue-600' },

        // Documentation
        'md': { icon: FileText, color: 'text-slate-300' },
        'txt': { icon: FileText, color: 'text-gray-400' },
        'pdf': { icon: FileText, color: 'text-red-500' },
        'doc': { icon: FileText, color: 'text-blue-600' },
        'docx': { icon: FileText, color: 'text-blue-600' },

        // Images
        'png': { icon: FileImage, color: 'text-green-400' },
        'jpg': { icon: FileImage, color: 'text-green-400' },
        'jpeg': { icon: FileImage, color: 'text-green-400' },
        'gif': { icon: FileImage, color: 'text-green-400' },
        'svg': { icon: Image, color: 'text-purple-400' },
        'webp': { icon: FileImage, color: 'text-green-400' },

        // Media
        'mp4': { icon: Film, color: 'text-purple-500' },
        'mov': { icon: Film, color: 'text-purple-500' },
        'avi': { icon: Film, color: 'text-purple-500' },

        // Archives
        'zip': { icon: Archive, color: 'text-yellow-600' },
        'tar': { icon: Archive, color: 'text-yellow-600' },
        'gz': { icon: Archive, color: 'text-yellow-600' },
        'rar': { icon: Archive, color: 'text-yellow-600' },
        '7z': { icon: Archive, color: 'text-yellow-600' },

        // Config files
        'env': { icon: Settings, color: 'text-gray-500' },
        'gitignore': { icon: Settings, color: 'text-orange-400' },
        'npmrc': { icon: Settings, color: 'text-red-500' },
        'dockerignore': { icon: Settings, color: 'text-blue-400' },
    };

    // Special case for dotfiles
    if (filename.startsWith('.') && !extension) {
        return { icon: Settings, color: 'text-gray-500' };
    }

    // Return icon or default
    return iconMap[extension] || { icon: FileText, color: 'text-gray-400' };
};

/**
 * Get language identifier for syntax highlighting based on file extension
 * @param {string} filename - The name of the file
 * @returns {string} - Language identifier for syntax highlighter
 */
export const getLanguageFromFilename = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();

    const languageMap = {
        'py': 'python',
        'js': 'javascript',
        'jsx': 'jsx',
        'ts': 'typescript',
        'tsx': 'tsx',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'go': 'go',
        'rs': 'rust',
        'rb': 'ruby',
        'php': 'php',
        'json': 'json',
        'yaml': 'yaml',
        'yml': 'yaml',
        'toml': 'toml',
        'xml': 'xml',
        'html': 'html',
        'css': 'css',
        'scss': 'scss',
        'sass': 'sass',
        'md': 'markdown',
        'sql': 'sql',
        'sh': 'bash',
        'bash': 'bash',
        'dockerfile': 'dockerfile',
    };

    return languageMap[extension] || 'text';
};
