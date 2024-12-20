import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Search } from 'lucide-react';

interface ProjectBlueprint {
  name: string;
  creationDate: string;
  workgroup: string;
  division: string;
  product: string;
  program: string;
  requester: string;
  services: {
    translation: {
      enabled: boolean;
      details: {
        sourceLanguage: string;
        targetLanguages: string[];
      };
    };
    review: {
      enabled: boolean;
      details: {
        reviewType?: string;
        reviewRounds?: number;
      };
    };
    QA: {
      enabled: boolean;
      details: {
        QAType: string;
        tools: string[];
      };
    };
  };
  sourceLocale?: string; // Added sourceLocale
  targetLocales?: string[]; // Added targetLocales
}

interface AnalysisPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBlueprint: (blueprint: ProjectBlueprint) => void;
}

const blueprints: ProjectBlueprint[] = [
  {
    name: "Sample Project",
    creationDate: "2024-12-20",
    workgroup: "Global Workgroup",
    division: "Life Sciences",
    product: "Opal Clinical",
    program: "Clinical Trials Localization",
    requester: "John Doe",
    services: {
      translation: {
        enabled: true,
        details: {
          sourceLanguage: "English",
          targetLanguages: ["German", "French", "Spanish"]
        }
      },
      review: {
        enabled: true,
        details: {
          reviewType: "Linguistic Review",
          reviewRounds: 2
        }
      },
      QA: {
        enabled: true,
        details: {
          QAType: "Automated QA",
          tools: ["Xbench", "Verifika"]
        }
      }
    }
    ,
    sourceLocale: "en", // Added sourceLocale
    targetLocales: ["de", "fr", "es"] // Added targetLocales
  },
  {
    name: "Regulatory Compliance Update",
    creationDate: "2024-11-15",
    workgroup: "EMEA Operations",
    division: "Regulatory Affairs",
    product: "Opal Vigilance",
    program: "Pharmacovigilance Reporting",
    requester: "Jane Smith",
    services: {
      translation: {
        enabled: true,
        details: {
          sourceLanguage: "German",
          targetLanguages: ["English", "Italian", "Dutch"]
        }
      },
      review: {
        enabled: false,
        details: {}
      },
      QA: {
        enabled: true,
        details: {
          QAType: "Manual QA",
          tools: ["Human Review Checklist"]
        }
      }
    },
    sourceLocale: "de", // Added sourceLocale
    targetLocales: ["en", "it", "nl"] // Added targetLocales
  },
  {
    name: "Marketing Campaign Localization",
    creationDate: "2024-10-01",
    workgroup: "Global Marketing",
    division: "Consumer Products",
    product: "Opal Creative",
    program: "Q4 Product Launch",
    requester: "Alice Johnson",
    services: {
      translation: {
        enabled: true,
        details: {
          sourceLanguage: "English",
          targetLanguages: ["French", "Spanish", "Japanese", "Korean"]
        }
      },
      review: {
        enabled: true,
        details: {
          reviewType: "Marketing Review",
          reviewRounds: 1
        }
      },
      QA: {
        enabled: true,
        details: {
          QAType: "Hybrid QA",
          tools: ["Linguistic QA", "Visual QA"]
        }
      }
    },
    sourceLocale: "en", // Added sourceLocale
    targetLocales: ["fr", "es", "ja", "ko"] // Added targetLocales
  }
];

export function AnalysisPopup({ isOpen, onClose, onSelectBlueprint }: AnalysisPopupProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlueprint, setSelectedBlueprint] = useState<ProjectBlueprint | null>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
        setSelectedBlueprint(blueprints[0]); // Set the first blueprint as the matching one
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const filteredBlueprints = useMemo(() => {
    return blueprints.filter(blueprint =>
      blueprint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blueprint.workgroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blueprint.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blueprint.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blueprint.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blueprint.requester.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  const handleSelectBlueprint = (blueprint: ProjectBlueprint) => {
    setSelectedBlueprint(blueprint);
  };

  const handleConfirmSelection = () => {
    if (selectedBlueprint) {
      onSelectBlueprint(selectedBlueprint);
    }
  };

  const renderConfirmButton = () => (
    <button
      onClick={handleConfirmSelection}
      disabled={!selectedBlueprint}
      className={`px-4 py-2 rounded transition-colors ${
        selectedBlueprint
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
    >
      Confirm Blueprint
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {isAnalyzing ? (
            <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Analyzing Files</h2>
              <p>Please wait while we find the best matching Project Blueprint...</p>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Select a Project Blueprint</h2>
                {renderConfirmButton()}
              </div>

              {selectedBlueprint && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Matching Blueprint:</h3>
                  <div className="border p-4 rounded-lg bg-blue-50">
                    <h4 className="text-md font-semibold">{selectedBlueprint.name}</h4>
                    <p><strong>Workgroup:</strong> {selectedBlueprint.workgroup}</p>
                    <p><strong>Division:</strong> {selectedBlueprint.division}</p>
                    <p><strong>Product:</strong> {selectedBlueprint.product}</p>
                    <p><strong>Program:</strong> {selectedBlueprint.program}</p>
                    <p><strong>Requester:</strong> {selectedBlueprint.requester}</p>
                    <p><strong>Source Locale:</strong> {selectedBlueprint.sourceLocale}</p>
                    <p><strong>Target Locales:</strong> {selectedBlueprint.targetLocales?.join(', ')}</p>
                  </div>
                </div>
              )}

              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Search blueprints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                {filteredBlueprints.map((blueprint, index) => (
                  <div
                    key={index}
                    className={`border p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedBlueprint === blueprint ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleSelectBlueprint(blueprint)}
                  >
                    <h3 className="text-lg font-semibold">{blueprint.name}</h3>
                    <p><strong>Workgroup:</strong> {blueprint.workgroup}</p>
                    <p><strong>Division:</strong> {blueprint.division}</p>
                    <p><strong>Product:</strong> {blueprint.product}</p>
                    <p><strong>Program:</strong> {blueprint.program}</p>
                    <p><strong>Requester:</strong> {blueprint.requester}</p>
                    <p><strong>Source Locale:</strong> {blueprint.sourceLocale}</p>
                    <p><strong>Target Locales:</strong> {blueprint.targetLocales?.join(', ')}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                {renderConfirmButton()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

