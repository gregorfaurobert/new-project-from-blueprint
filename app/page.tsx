'use client'

import { useState, useCallback, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Search, FileText, Book, FileQuestion, FileCode, Check, ArrowRight, Trash2 } from 'lucide-react'
import { AnalysisPopup } from '../components/AnalysisPopup'
import { CheckAndFinalizeForm } from '../components/CheckAndFinalizeForm'

type FileData = {
  file: File;
  path: string;
  type: 'work' | 'reference' | 'glossary' | 'instructions';
  selected: boolean;
}

type FileType = FileData['type']

// Add custom type for File with optional path property
interface FileWithPath extends Omit<File, 'webkitRelativePath'> {
  path?: string;
  webkitRelativePath: string;
}

type ProjectBlueprint = {
  name: string;
  creationDate: string;
  workgroup: string;
  division: string;
  product: string;
  program: string;
  requester: string;
  sourceLocale: string;
  targetLocales: string[];
  services: {
    translation: {
      enabled: boolean;
    };
    review: {
      enabled: boolean;
      details?: {
        reviewType?: string;
        reviewRounds?: number;
      };
    };
    QA: {
      enabled: boolean;
      details?: {
        QAType: string;
        tools: string[];
      };
    };
  };
}

const fileTypeMap: Record<string, FileType> = {
  'reference': 'reference',
  'references': 'reference',
  'ref': 'reference',
  'refs': 'reference',
  'instruction': 'instructions',
  'instructions': 'instructions',
  'guide': 'instructions',
  'tutorial': 'instructions',
  'glossary': 'glossary',
  'term': 'glossary',
  'terms': 'glossary',
  'definitions': 'glossary',
}

function determineFileType(fileName: string): FileType {
  const lowerFileName = fileName.toLowerCase()
  for (const [keyword, type] of Object.entries(fileTypeMap)) {
    if (lowerFileName.includes(keyword)) {
      return type
    }
  }
  return 'work' // default type
}

export default function TranslationPortal() {
  const [files, setFiles] = useState<FileData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAnalysisPopupOpen, setIsAnalysisPopupOpen] = useState(false)
  const [selectedBlueprint, setSelectedBlueprint] = useState<ProjectBlueprint | null>(null)
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyze' | 'finalize'>('upload')

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const newFiles = acceptedFiles.map(file => {
      const relativePath = file.path || file.webkitRelativePath || file.name;
      return {
        file,
        path: relativePath,
        type: determineFileType(relativePath),
        selected: false
      }
    })
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleTypeChange = (index: number, newType: FileType) => {
    setFiles(prev => prev.map((file, i) => 
      i === index ? { ...file, type: newType } : file
    ))
  }

  const handleCheckboxChange = (index: number) => {
    setFiles(prev => prev.map((file, i) => 
      i === index ? { ...file, selected: !file.selected } : file
    ))
  }

  const filteredFiles = useMemo(() => {
    return files.filter(fileData => 
      fileData.path.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [files, searchTerm])

  const selectedFiles = useMemo(() => {
    return files.filter(file => file.selected)
  }, [files])

  const handleBulkTypeChange = (newType: FileType) => {
    setFiles(prev => prev.map(file => 
      file.selected ? { ...file, type: newType } : file
    ))
  }

  const handleDone = () => {
    setFiles(prev => prev.map(file => ({ ...file, selected: false })))
  }

  const handleNext = () => {
    setIsAnalysisPopupOpen(true)
    setCurrentStep('analyze')
  }

  const handleDeleteSelected = () => {
    setFiles(prev => prev.filter(file => !file.selected))
  }

  const handleSelectBlueprint = (blueprint: ProjectBlueprint) => {
    setSelectedBlueprint(blueprint)
    setIsAnalysisPopupOpen(false)
    setCurrentStep('finalize')
  }

  const handleBack = () => {
    setCurrentStep('analyze')
    setIsAnalysisPopupOpen(true)
  }

  const handleSubmitProject = () => {
    // Here you would typically submit the project data to your backend
    console.log('Submitting project:', { files, selectedBlueprint })
    // Reset the form or navigate to a confirmation page
    setFiles([])
    setSelectedBlueprint(null)
    setCurrentStep('upload')
  }

  const typeButtons: { type: FileType; label: string; icon: React.ReactNode }[] = [
    { type: 'work', label: 'Work', icon: <FileText className="w-4 h-4 mr-2" /> },
    { type: 'reference', label: 'Reference', icon: <Book className="w-4 h-4 mr-2" /> },
    { type: 'glossary', label: 'Glossary', icon: <FileQuestion className="w-4 h-4 mr-2" /> },
    { type: 'instructions', label: 'Instructions', icon: <FileCode className="w-4 h-4 mr-2" /> },
  ]

  if (currentStep === 'finalize' && selectedBlueprint) {
    return (
      <CheckAndFinalizeForm
        files={files}
        selectedBlueprint={selectedBlueprint}
        onSubmit={handleSubmitProject}
        onBack={handleBack}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Translation Request Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Drop your files here to start the translation process
          </p>
        </div>
        <div
          {...getRootProps()}
          className={`mt-8 space-y-6 flex flex-col items-center justify-center border-2 border-dashed rounded-md p-12 text-center cursor-pointer transition duration-300 ease-in-out ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className={`w-12 h-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className="text-lg font-medium text-gray-900">
            {isDragActive ? 'Drop the files here...' : 'Drag & drop files here, or click to select files'}
          </p>
        </div>
        {files.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Uploaded files:</h3>
              <button
                onClick={handleNext}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
                <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
              </button>
            </div>
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={handleDeleteSelected}
                disabled={selectedFiles.length === 0}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                  selectedFiles.length > 0
                    ? 'text-white bg-red-600 hover:bg-red-700'
                    : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
              {typeButtons.map(({ type, label, icon }) => (
                <button
                  key={type}
                  onClick={() => handleBulkTypeChange(type)}
                  disabled={selectedFiles.length === 0}
                  className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    selectedFiles.length > 0
                      ? 'text-white bg-blue-600 hover:bg-blue-700'
                      : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
              <button
                onClick={handleDone}
                disabled={selectedFiles.length === 0}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  selectedFiles.length > 0
                    ? 'text-white bg-green-600 hover:bg-green-700'
                    : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4 mr-2" />
                Done
              </button>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFiles.map((fileData, index) => (
                    <tr key={fileData.path}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={fileData.selected}
                          onChange={() => handleCheckboxChange(index)}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{fileData.path}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{(fileData.file.size / 1024).toFixed(2)} KB</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={fileData.type}
                          onChange={(e) => handleTypeChange(index, e.target.value as FileType)}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="work">Work</option>
                          <option value="reference">Reference</option>
                          <option value="glossary">Glossary</option>
                          <option value="instructions">Instructions</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleNext}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
                <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      <AnalysisPopup
        isOpen={isAnalysisPopupOpen}
        onClose={() => setIsAnalysisPopupOpen(false)}
        // @ts-expect-error - prototype: ignoring type mismatch for ProjectBlueprint
        onSelectBlueprint={handleSelectBlueprint}
      />
    </div>
  )
}

