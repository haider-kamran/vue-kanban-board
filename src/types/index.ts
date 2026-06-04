export type Priority = 'Low' | 'Medium' | 'High'

export interface Label {
  id: string
  name: string
  color: string // color name e.g. 'rose', 'blue', 'emerald'
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface Card {
  id: string
  title: string
  description?: string
  labels: Label[]
  priority: Priority
  dueDate?: string
  checklist: ChecklistItem[]
}

export interface List {
  id: string
  title: string
  cards: Card[]
}

export interface Board {
  id: string
  title: string
  lists: List[]
}
