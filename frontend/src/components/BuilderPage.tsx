import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Circle, Folder, File, Code, Image, Settings, Play } from 'lucide-react';
import StepsList from './StepsList';
import FileExplorer from './FileExplorer';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import {CodeEditor} from './CodeEditor';
import {WebsitePreview} from './WebsitePreview';
import { FileItem, StepType } from '../types';
import { useWebContainer } from '../hooks/useWebContainer';
import { FileNode as WebcontainerFileNode } from '@webcontainer/api';

interface BuilderPageProps {
  prompt: string;
  onBack: () => void;
}

export interface Step {
  id: number;
  title: string;
  description: string;
  type: StepType;
  status: 'pending' | 'in-progress' | 'completed';
  code?: string;
  path?: string;
}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  icon?: React.ReactNode;
  size?: string;
  modified?: string;
  content?: string;
}
// If you need to use WebcontainerFileNode, use that name instead of FileNode

const BuilderPage: React.FC<BuilderPageProps> = ({ prompt, onBack }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const webcontainer = useWebContainer();
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [steps, setSteps] = useState<Step[]>([
    
  ]);

  const [files, setFiles] = useState<FileNode[]>([
    // {
    //   name: 'src',
    //   type: 'folder',
    //   path: '/src',
    //   children: [
    //     {
    //       name: 'components',
    //       type: 'folder',
    //       path: '/src/components',
    //       children: [
    //         {
    //           name: 'Header.tsx',
    //           type: 'file',
    //           path: '/src/components/Header.tsx',
    //           icon: <Code className="w-4 h-4 text-blue-400" />,
    //           size: '2.1 KB',
    //           modified: '2 mins ago'
    //         },
    //         {
    //           name: 'Hero.tsx',
    //           type: 'file',
    //           path: '/src/components/Hero.tsx',
    //           icon: <Code className="w-4 h-4 text-blue-400" />,
    //           size: '3.8 KB',
    //           modified: '1 min ago'
    //         },
    //         {
    //           name: 'Gallery.tsx',
    //           type: 'file',
    //           path: '/src/components/Gallery.tsx',
    //           icon: <Code className="w-4 h-4 text-blue-400" />,
    //           size: '4.2 KB',
    //           modified: 'Just now'
    //         },
    //         {
    //           name: 'Footer.tsx',
    //           type: 'file',
    //           path: '/src/components/Footer.tsx',
    //           icon: <Code className="w-4 h-4 text-blue-400" />,
    //           size: '1.8 KB',
    //           modified: '3 mins ago'
    //         }
    //       ]
    //     },
        
    //   ]
    // },
    
  ]);

   useEffect(()=>{
     const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};
  
      const processFile = (file: FileItem, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) 
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
  
        return mountStructure[file.name];
      };
  
      // Process each top-level file/folder
      files.forEach(file => processFile(file, true));
  
      return mountStructure;
    };
  
    const mountStructure = createMountStructure(files);
  
    // Mount the structure if WebContainer is available
    console.log(mountStructure);
    webcontainer?.mount(mountStructure);
   },[files,webcontainer])

  useEffect(()=>{
     let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        let finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            // final file
            let file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    })

    if (updateHappened) {

      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
        
      }))
    }
  },[steps,files])

  async function init(){
  const response=await axios.post(`${BACKEND_URL}/template`, { prompt: prompt.trim() })

  const {prompts, uiPrompts} =response.data;

   setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));


   const stepsResponse=await axios.post(`${BACKEND_URL}/chat`, {messages:[...prompts,prompt].map((content)=>({
      role:"user",
      content
   }))})
  setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map( x => ({
    ...x,
    id: Math.random(), // Generate a random ID for each step
    status:"pending" as "pending"
  }))]);


}

useEffect(()=>{
  init();

},[]);
  // Simulate step progression

  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file);
      setActiveTab('code');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Prompt</span>
            </button>
            <div className="w-px h-6 bg-gray-600"></div>
            <h1 className="text-xl font-semibold text-white">Building Your Website</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Deploy
            </button>
          </div>
        </div>
      </header>

      {/* Prompt Display */}
      <div className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
        <div className="max-w-4xl">
          <p className="text-sm text-gray-400 mb-1">Your Prompt:</p>
          <p className="text-white text-lg">{prompt}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Steps Panel */}
        <div className="w-96 bg-gray-800/30 backdrop-blur-sm border-r border-gray-700 flex flex-col">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-2">Build Progress</h2>
            <p className="text-gray-400 text-sm">
              {steps.filter(s => s.status === 'completed').length} of {steps.length} steps completed
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <StepsList steps={steps} />
          </div>
        </div>

        {/* File Explorer */}
        <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-2">Project Files</h2>
            <p className="text-gray-400 text-sm">
              {files.reduce((count, file) => {
                const countFiles = (node: FileNode): number => {
                  let total = node.type === 'file' ? 1 : 0;
                  if (node.children) {
                    total += node.children.reduce((sum, child) => sum + countFiles(child), 0);
                  }
                  return total;
                };
                return count + countFiles(file);
              }, 0)} files generated
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <FileExplorer files={files} onFileSelect={handleFileSelect} />
          </div>
        </div>

        {/* Code/Preview Panel */}
        <div className="flex-1 bg-gray-900 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-700 bg-gray-800">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'code'
                  ? 'text-white border-b-2 border-blue-500 bg-gray-900'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Code
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'text-white border-b-2 border-blue-500 bg-gray-900'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Preview
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === 'code' ? (
              <CodeEditor file={selectedFile} />
            ) : (
              webcontainer && <WebsitePreview files={files}  webContainer={webcontainer} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;