import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { Label } from '../types'

const DEFAULT_LABEL_COLORS = [
  'rose', 'orange', 'amber', 'lime', 'emerald',
  'teal', 'cyan', 'sky', 'blue', 'indigo',
  'violet', 'purple', 'pink', 'slate', 'zinc'
]

const DEFAULT_LABELS: Label[] = [
  { id: 'label-1', name: 'Bug', color: 'rose' },
  { id: 'label-2', name: 'Feature', color: 'blue' },
  { id: 'label-3', name: 'Improvement', color: 'emerald' },
  { id: 'label-4', name: 'Urgent', color: 'orange' },
  { id: 'label-5', name: 'Design', color: 'violet' },
]

export const useLabelStore = defineStore('labels', () => {
  const labels = useLocalStorage<Label[]>('openkanban-labels', DEFAULT_LABELS)
  const availableColors = DEFAULT_LABEL_COLORS

  function addLabel(): Label {
    const newLabel: Label = {
      id: `label-${Date.now()}`,
      name: 'New Label',
      color: 'slate'
    }
    labels.value.push(newLabel)
    return newLabel
  }

  function updateLabel(id: string, updates: Partial<Label>) {
    const label = labels.value.find(l => l.id === id)
    if (label) {
      Object.assign(label, updates)
    }
  }

  function deleteLabel(id: string) {
    labels.value = labels.value.filter(l => l.id !== id)
  }

  function getLabelById(id: string): Label | undefined {
    return labels.value.find(l => l.id === id)
  }

  return {
    labels,
    availableColors,
    addLabel,
    updateLabel,
    deleteLabel,
    getLabelById
  }
})
