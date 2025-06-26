import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';
import { FileNode } from './BuilderPage';

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
}

interface FileItemProps {
  file: FileNode;
  depth?: number;
  onFileSelect: (file: FileNode) => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, depth = 0, onFileSelect }) => {
  const [isExpanded, setIsExpanded] = useState(depth < 1); // Only expand root level by default

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (file.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(file);
    }
  };

  const paddingLeft = depth * 20 + 12;

  return (
    <div>
      <div
        className={`flex items-center space-x-2 py-2 px-3 hover:bg-gray-800/50 cursor-pointer transition-colors ${
          file.type === 'file' ? 'text-gray-300' : 'text-white'
        }`}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={handleToggle}
      >
        {/* Expand/Collapse Icon */}
        {file.type === 'folder' && (
          <div className="w-4 h-4 flex items-center justify-center">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-400" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-400" />
            )}
          </div>
        )}
        {file.type === 'file' && <div className="w-4"></div>}

        {/* File/Folder Icon */}
        <div className="w-4 h-4 flex items-center justify-center">
          {file.type === 'folder' ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-blue-400" />
            ) : (
              <Folder className="w-4 h-4 text-blue-400" />
            )
          ) : (
            file.icon || <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
          )}
        </div>

        {/* File Name */}
        <span className="text-sm font-medium truncate">{file.name}</span>

        {/* File Info */}
        {file.type === 'file' && (
          <div className="ml-auto flex items-center space-x-3 text-xs text-gray-500">
            {file.size && <span>{file.size}</span>}
            {file.modified && <span>{file.modified}</span>}
          </div>
        )}
      </div>

      {/* Children */}
      {file.type === 'folder' && isExpanded && file.children && (
        <div>
          {file.children.map((child, index) => (
            <FileItem 
              key={`${child.path}-${index}`} 
              file={child} 
              depth={depth + 1} 
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileSelect }) => {
  return (
    <div className="py-2">
      {files.map((file, index) => (
        <FileItem 
          key={`${file.path}-${index}`} 
          file={file} 
          onFileSelect={onFileSelect}
        />
      ))}
    </div>
  );
};

export default FileExplorer;