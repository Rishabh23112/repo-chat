import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronRight, File, Folder, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import { getFileIcon } from '../utils/fileIcons';

const FileNode = ({ node, depth, onFileClick, currentPath = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isFolder = node.type === 'folder';
    const filePath = currentPath ? `${currentPath}/${node.name}` : node.name;

    const handleClick = () => {
        if (isFolder) {
            setIsOpen(!isOpen);
        } else {
            onFileClick(filePath);
        }
    };

    // Get file icon and color for files
    const { icon: FileIcon, color: fileColor } = !isFolder
        ? getFileIcon(node.name)
        : { icon: File, color: 'text-slate-400' };

    return (
        <div>
            <motion.div
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.1 }}
                className={`
                    flex items-center py-1 px-2 cursor-pointer text-sm select-none
                    group relative border-l-2 border-transparent
                    ${!isFolder ? 'hover:border-accent-primary' : ''}
                `}
                style={{ paddingLeft: `${depth * 12 + 12}px` }}
                onClick={handleClick}
            >
                {/* Indent Guide Lines (VS Code style) */}
                {depth > 0 && (
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-800/50" style={{ left: `${depth * 12 + 6}px` }}></div>
                )}

                {/* Chevron for folders */}
                <span className="mr-1.5 flex-shrink-0 text-slate-500 group-hover:text-slate-300 transition-colors">
                    {isFolder ? (
                        isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    ) : (
                        <span className="w-[14px] inline-block" />
                    )}
                </span>

                {/* Icon */}
                <span className={`mr-2 flex-shrink-0 ${isFolder ? 'text-accent-primary' : fileColor}`}>
                    {isFolder ? (
                        isOpen ? <FolderOpen size={16} /> : <Folder size={16} />
                    ) : (
                        <FileIcon size={16} />
                    )}
                </span>

                {/* Name */}
                <span className={`truncate font-mono text-[13px] tracking-tight ${isFolder ? 'text-slate-200 font-medium' : 'text-slate-400 group-hover:text-slate-200'} transition-colors`}>
                    {node.name}
                </span>
            </motion.div>

            {/* Children with animation */}
            <AnimatePresence initial={false}>
                {isOpen && node.children && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        {node.children.map((child, index) => (
                            <FileNode
                                key={index}
                                node={child}
                                depth={depth + 1}
                                onFileClick={onFileClick}
                                currentPath={filePath}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FileExplorer = ({ data, onFileClick }) => {
    if (!data) {
        return (
            <div className="p-8 text-slate-500 text-sm text-center italic">
                No files loaded
            </div>
        );
    }

    return (
        <div className="font-mono py-2">
            {data.map((node, index) => (
                <FileNode key={index} node={node} depth={0} onFileClick={onFileClick} />
            ))}
        </div>
    );
};

export default FileExplorer;
