import React, { useState, useRef, useEffect } from 'react'
import { Entity } from '../contexts/NERContext'
import { Trash2, Tag } from 'lucide-react'

interface TextAnnotatorProps {
  text: string
  entities: Entity[]
  entityTypes: string[]
  onEntitiesChange: (entities: Entity[]) => void
}

const TextAnnotator: React.FC<TextAnnotatorProps> = ({
  text,
  entities,
  entityTypes,
  onEntitiesChange
}) => {
  const [selectedText, setSelectedText] = useState('')
  const [selectedEntityType, setSelectedEntityType] = useState('')
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState(0)
  const [selectionEnd, setSelectionEnd] = useState(0)
  const textRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't interfere with text selection - let the browser handle it naturally
    setIsSelecting(true)
  }

  const handleMouseUp = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString()
      const range = selection.getRangeAt(0)
      
      if (textRef.current && textRef.current.contains(range.commonAncestorContainer)) {
        // Find the position of the selected text in the original text
        // This handles cases where there might be multiple occurrences
        const start = text.indexOf(selectedText)
        if (start !== -1) {
          const end = start + selectedText.length
          
          setSelectedText(selectedText)
          setSelectionStart(start)
          setSelectionEnd(end)
          setIsSelecting(false)
        }
      }
    }
  }

  const handleAddEntity = () => {
    console.log('handleAddEntity called with:', {
      selectedText,
      selectedEntityType,
      selectionStart,
      selectionEnd,
      hasText: !!selectedText,
      hasType: !!selectedEntityType,
      startNotEqualEnd: selectionStart !== selectionEnd
    })
    
    if (selectedText && selectedEntityType && selectionStart !== selectionEnd) {
      console.log('Creating new entity...')
      const newEntity: Entity = {
        id: Date.now().toString(),
        text: selectedText,
        type: selectedEntityType,
        start: selectionStart,
        end: selectionEnd
      }

      // Check for overlapping entities
      const hasOverlap = entities.some(entity => 
        (selectionStart < entity.end && selectionEnd > entity.start)
      )

      if (hasOverlap) {
        alert('This selection overlaps with an existing entity. Please choose a different text span.')
        return
      }

      const updatedEntities = [...entities, newEntity].sort((a, b) => a.start - b.start)
      console.log('Calling onEntitiesChange with:', updatedEntities)
      onEntitiesChange(updatedEntities)
      
      // Clear selection
      setSelectedText('')
      setSelectedEntityType('')
      setSelectionStart(0)
      setSelectionEnd(0)
      
      // Clear text selection
      if (window.getSelection) {
        window.getSelection()?.removeAllRanges()
      }
    }
  }

  const handleRemoveEntity = (entityId: string) => {
    const updatedEntities = entities.filter(entity => entity.id !== entityId)
    onEntitiesChange(updatedEntities)
  }

  const renderAnnotatedText = () => {
    if (entities.length === 0) {
      return <span>{text}</span>
    }

    const parts: JSX.Element[] = []
    let lastIndex = 0

    // Sort entities by start position
    const sortedEntities = [...entities].sort((a, b) => a.start - b.start)

    sortedEntities.forEach((entity, index) => {
      // Add text before entity
      if (entity.start > lastIndex) {
        parts.push(
          <span key={`text-${index}`}>
            {text.slice(lastIndex, entity.start)}
          </span>
        )
      }

      // Add entity
      parts.push(
        <span
          key={entity.id}
          className="bg-blue-100 text-blue-800 px-1 rounded cursor-pointer hover:bg-blue-200 transition-colors duration-200"
          title={`${entity.type}: ${entity.text}`}
        >
          {entity.text}
        </span>
      )

      lastIndex = entity.end
    })

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key="text-end">
          {text.slice(lastIndex)}
        </span>
      )
    }

    return parts
  }

  return (
    <div className="space-y-4">
      {/* Entity Type Selector */}
      <div className="flex items-center space-x-3">
        <label className="text-sm font-medium text-gray-700">Entity Type:</label>
        <select
          value={selectedEntityType}
          onChange={(e) => setSelectedEntityType(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="">Select entity type...</option>
          {entityTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {selectedEntityType && (
          <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
            ✓ {selectedEntityType} selected
          </span>
        )}
      </div>

      {/* Text Display */}
      <div className="border border-gray-300 rounded-lg p-4 bg-white min-h-[100px]">
        <div
          ref={textRef}
          className={`text-gray-900 leading-relaxed cursor-text select-text ${
            isSelecting ? 'ring-2 ring-blue-200' : ''
          }`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onSelect={handleMouseUp}
          style={{ userSelect: 'text' }}
        >
          {renderAnnotatedText()}
        </div>
      </div>

      {/* Selection Actions */}
      {selectedText && (
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex-1">
            <span className="text-sm font-medium text-blue-900">Selected: </span>
            <span className="text-sm text-blue-800 font-mono bg-blue-100 px-2 py-1 rounded">
              "{selectedText}"
            </span>
            <span className="text-sm text-blue-600 ml-2">
              (position {selectionStart}-{selectionEnd})
            </span>
          </div>
          <button
            onClick={() => {
              console.log('Add Entity button clicked!')
              handleAddEntity()
            }}
            disabled={!selectedEntityType}
            className="btn-primary text-sm py-1 px-3"
          >
            <Tag className="h-3 w-3 mr-1" />
            Add Entity
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">How to annotate:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Select an entity type from the dropdown above</li>
          <li>Click and drag to select text in the text area</li>
          <li>Click "Add Entity" to create the annotation</li>
          <li>Remove entities by clicking the trash icon below</li>
        </ol>
        {selectedText && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-800 font-medium">Ready to annotate:</p>
            <p className="text-blue-700">"{selectedText}" as {selectedEntityType || 'unknown type'}</p>
          </div>
        )}
      </div>

      {/* Entities List */}
      {entities.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Current Entities ({entities.length})</h4>
          <div className="space-y-2">
            {entities.map((entity) => (
              <div
                key={entity.id}
                className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {entity.type}
                  </span>
                  <span className="text-sm text-gray-900 font-mono">
                    "{entity.text}"
                  </span>
                  <span className="text-xs text-gray-500">
                    ({entity.start}-{entity.end})
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveEntity(entity.id)}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                  title="Remove entity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TextAnnotator
