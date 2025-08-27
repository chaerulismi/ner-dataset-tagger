import { Entity, NERSample, NERDataset } from '../contexts/NERContext'

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const validateEntity = (entity: Omit<Entity, 'id'>, text: string): string | null => {
  if (!entity.text.trim()) {
    return 'Entity text cannot be empty'
  }
  
  if (entity.start < 0 || entity.end > text.length) {
    return 'Entity position is out of bounds'
  }
  
  if (entity.start >= entity.end) {
    return 'Entity start position must be before end position'
  }
  
  if (!entity.type.trim()) {
    return 'Entity type must be selected'
  }
  
  return null
}

export const checkEntityOverlap = (entities: Entity[], newEntity: Omit<Entity, 'id'>): boolean => {
  return entities.some(entity => 
    (newEntity.start < entity.end && newEntity.end > entity.start)
  )
}

export const sortEntitiesByPosition = (entities: Entity[]): Entity[] => {
  return [...entities].sort((a, b) => a.start - b.start)
}

export const exportToHuggingFaceFormat = (dataset: NERDataset): any[] => {
  return dataset.samples.map(sample => ({
    text: sample.text,
    entities: sample.entities.map(entity => ({
      start: entity.start,
      end: entity.end,
      label: entity.type
    }))
  }))
}

export const exportToCoNLLFormat = (dataset: NERDataset): string => {
  let output = ''
  
  dataset.samples.forEach((sample, sampleIndex) => {
    if (sampleIndex > 0) output += '\n'
    
    const words = sample.text.split(/\s+/)
    const entityMap = new Map<number, string>()
    
    // Map character positions to word positions
    sample.entities.forEach(entity => {
      const wordStart = sample.text.substring(0, entity.start).split(/\s+/).length - 1
      const wordEnd = sample.text.substring(0, entity.end).split(/\s+/).length - 1
      
      for (let i = wordStart; i <= wordEnd; i++) {
        if (i === wordStart) {
          entityMap.set(i, `B-${entity.type}`)
        } else {
          entityMap.set(i, `I-${entity.type}`)
        }
      }
    })
    
    words.forEach((word, wordIndex) => {
      const tag = entityMap.get(wordIndex) || 'O'
      output += `${word} ${tag}\n`
    })
  })
  
  return output
}

export const calculateDatasetStats = (dataset: NERDataset) => {
  const totalSamples = dataset.samples.length
  const totalEntities = dataset.samples.reduce((sum, sample) => sum + sample.entities.length, 0)
  
  const entityTypeCounts = dataset.samples.reduce((counts, sample) => {
    sample.entities.forEach(entity => {
      counts[entity.type] = (counts[entity.type] || 0) + 1
    })
    return counts
  }, {} as Record<string, number>)
  
  const averageEntitiesPerSample = totalSamples > 0 ? totalEntities / totalSamples : 0
  
  return {
    totalSamples,
    totalEntities,
    entityTypeCounts,
    averageEntitiesPerSample
  }
}
