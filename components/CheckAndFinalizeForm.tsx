import React, { useState } from 'react';
import { FileText, Book, FileQuestion, FileCode, Edit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface FileData {
  file: File;
  path: string;
  type: 'work' | 'reference' | 'glossary' | 'instructions';
  selected: boolean;
}

interface ProjectBlueprint {
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
  referenceId?: string;
}

interface CheckAndFinalizeFormProps {
  files: FileData[];
  selectedBlueprint: ProjectBlueprint;
  onSubmit: () => void;
  onBack: () => void;
  onSaveChanges?: (updatedBlueprint: ProjectBlueprint) => void;
}

export function CheckAndFinalizeForm({ 
  files, 
  selectedBlueprint, 
  onSubmit, 
  onBack, 
  onSaveChanges = () => {} 
}: CheckAndFinalizeFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableBlueprint, setEditableBlueprint] = useState<ProjectBlueprint>({ ...selectedBlueprint });

  const filesByCategory = {
    work: files.filter(file => file.type === 'work'),
    reference: files.filter(file => file.type === 'reference'),
    glossary: files.filter(file => file.type === 'glossary'),
    instructions: files.filter(file => file.type === 'instructions'),
  };

  const getIcon = (type: FileData['type']) => {
    switch (type) {
      case 'work':
        return <FileText className="w-5 h-5 mr-2" />;
      case 'reference':
        return <Book className="w-5 h-5 mr-2" />;
      case 'glossary':
        return <FileQuestion className="w-5 h-5 mr-2" />;
      case 'instructions':
        return <FileCode className="w-5 h-5 mr-2" />;
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Save changes
      if (typeof onSaveChanges === 'function') {
        onSaveChanges(editableBlueprint);
      } else {
        console.warn('onSaveChanges is not a function');
        // Optionally, you can add a fallback behavior here
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Check and Finalize</h2>
        <div className="space-x-4">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            onClick={toggleEdit}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            <Edit className="w-4 h-4 inline-block mr-2" />
            {isEditing ? 'Save' : 'Edit'}
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Create Project
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Blueprint details</h3>
        <div className="grid grid-cols-2 gap-4">
          {isEditing ? (
            <Input
              value={editableBlueprint.referenceId || ''}
              onChange={(e) => setEditableBlueprint({ ...editableBlueprint, referenceId: e.target.value })}
              placeholder="Reference ID"
            />
          ) : (
            <div><strong>Reference ID:</strong> {editableBlueprint.referenceId || 'N/A'}</div>
          )}
          <div><strong>Creation Date:</strong> {editableBlueprint.creationDate}</div>
          {isEditing ? (
            <>
              <Select
                value={editableBlueprint.workgroup}
                onValueChange={(value) => setEditableBlueprint({ ...editableBlueprint, workgroup: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select workgroup" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workgroup1">Workgroup 1</SelectItem>
                  <SelectItem value="workgroup2">Workgroup 2</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={editableBlueprint.division}
                onValueChange={(value) => setEditableBlueprint({ ...editableBlueprint, division: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="division1">Division 1</SelectItem>
                  <SelectItem value="division2">Division 2</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={editableBlueprint.product}
                onValueChange={(value) => setEditableBlueprint({ ...editableBlueprint, product: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product1">Product 1</SelectItem>
                  <SelectItem value="product2">Product 2</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={editableBlueprint.program}
                onValueChange={(value) => setEditableBlueprint({ ...editableBlueprint, program: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="program1">Program 1</SelectItem>
                  <SelectItem value="program2">Program 2</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={editableBlueprint.requester}
                onValueChange={(value) => setEditableBlueprint({ ...editableBlueprint, requester: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select requester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="requester1">Requester 1</SelectItem>
                  <SelectItem value="requester2">Requester 2</SelectItem>
                </SelectContent>
              </Select>
            </>
          ) : (
            <>
              <div><strong>Workgroup:</strong> {editableBlueprint.workgroup}</div>
              <div><strong>Division:</strong> {editableBlueprint.division}</div>
              <div><strong>Product:</strong> {editableBlueprint.product}</div>
              <div><strong>Program:</strong> {editableBlueprint.program}</div>
              <div><strong>Requester:</strong> {editableBlueprint.requester}</div>
            </>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Locale Pairs</h3>
        <div className="grid grid-cols-2 gap-4">
          {isEditing ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source Locale</label>
                <Select
                  value={editableBlueprint.sourceLocale}
                  onValueChange={(value) => setEditableBlueprint({ ...editableBlueprint, sourceLocale: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source locale" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Locales</label>
                <div className="relative">
                  <select
                    multiple
                    value={editableBlueprint.targetLocales}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                      setEditableBlueprint({ ...editableBlueprint, targetLocales: selectedOptions });
                    }}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                  </select>
                </div>
                <p className="mt-2 text-sm text-gray-500">Hold Ctrl (Cmd on Mac) to select multiple locales</p>
              </div>
            </>
          ) : (
            <>
              <div><strong>Source Locale:</strong> {editableBlueprint.sourceLocale}</div>
              <div><strong>Target Locales:</strong> {editableBlueprint.targetLocales.join(', ')}</div>
            </>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Services</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Translation:</strong> {editableBlueprint.services.translation.enabled ? 'Enabled' : 'Disabled'}
          </div>
          <div>
            <strong>Review:</strong> {editableBlueprint.services.review.enabled ? 'Enabled' : 'Disabled'}
            {editableBlueprint.services.review.enabled && editableBlueprint.services.review.details && (
              <ul className="list-disc list-inside ml-4">
                <li>Type: {editableBlueprint.services.review.details.reviewType || 'Not specified'}</li>
                <li>Rounds: {editableBlueprint.services.review.details.reviewRounds || 'Not specified'}</li>
              </ul>
            )}
          </div>
          <div>
            <strong>QA:</strong> {editableBlueprint.services.QA.enabled ? 'Enabled' : 'Disabled'}
            {editableBlueprint.services.QA.enabled && editableBlueprint.services.QA.details && (
              <ul className="list-disc list-inside ml-4">
                <li>Type: {editableBlueprint.services.QA.details.QAType || 'Not specified'}</li>
                <li>Tools: {editableBlueprint.services.QA.details.tools?.join(', ') || 'None specified'}</li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Files by Category</h3>
        {Object.entries(filesByCategory).map(([category, categoryFiles]) => (
          <div key={category} className="mb-6">
            <h4 className="text-lg font-semibold mb-2 capitalize">{category} Files</h4>
            {categoryFiles.length > 0 ? (
              <ul className="space-y-2">
                {categoryFiles.map((file, index) => (
                  <li key={index} className="flex items-center">
                    {getIcon(file.type)}
                    <span className="text-sm">{file.path}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No files in this category</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Create Project
        </button>
      </div>
    </div>
  );
}

