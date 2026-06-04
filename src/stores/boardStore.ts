import { defineStore } from 'pinia'

const SCHEMA_VERSION = '2'
const STORED_VERSION_KEY = 'openkanban-schema-version'
if (localStorage.getItem(STORED_VERSION_KEY) !== SCHEMA_VERSION) {
  localStorage.removeItem('openkanban-boards')
  localStorage.removeItem('openkanban-active-board')
  localStorage.removeItem('openkanban-labels')
  localStorage.setItem(STORED_VERSION_KEY, SCHEMA_VERSION)
}
import { useLocalStorage } from '@vueuse/core'
import type { Board } from '../types'

const DUMMY_BOARDS: Board[] = [
  {
    id: 'board-sprint',
    title: 'Sprint Planning Q3',
    lists: [
      {
        id: 'list-backlog',
        title: 'Backlog',
        cards: [
          {
            id: 'card-1',
            title: 'Redesign onboarding flow',
            description: 'Rethink the onboarding UX for new users. Focus on reducing drop-off at step 3.',
            labels: [
              { id: 'label-5', name: 'Design', color: 'violet' }
            ],
            priority: 'Medium',
            checklist: [
              { id: 'chk-1', text: 'User research interviews', completed: true },
              { id: 'chk-2', text: 'Wireframes in Figma', completed: false },
              { id: 'chk-3', text: 'Prototype & test', completed: false },
            ]
          },
          {
            id: 'card-2',
            title: 'Fix password reset email template',
            description: 'The reset email renders broken HTML in Outlook.',
            labels: [
              { id: 'label-1', name: 'Bug', color: 'rose' }
            ],
            priority: 'High',
            checklist: []
          },
          {
            id: 'card-3',
            title: 'Add CSV export to reports page',
            description: '',
            labels: [
              { id: 'label-2', name: 'Feature', color: 'blue' }
            ],
            priority: 'Low',
            checklist: []
          }
        ]
      },
      {
        id: 'list-todo',
        title: 'To Do',
        cards: [
          {
            id: 'card-4',
            title: 'Integrate Stripe webhooks',
            description: 'Handle subscription.created, payment.failed events.',
            labels: [
              { id: 'label-2', name: 'Feature', color: 'blue' },
              { id: 'label-4', name: 'Urgent', color: 'orange' }
            ],
            priority: 'High',
            checklist: [
              { id: 'chk-4', text: 'Read Stripe webhook docs', completed: true },
              { id: 'chk-5', text: 'Setup webhook endpoint', completed: false },
              { id: 'chk-6', text: 'Write tests', completed: false }
            ]
          },
          {
            id: 'card-5',
            title: 'Dark mode for mobile app',
            description: 'Apply the dark theme tokens to all mobile screens.',
            labels: [
              { id: 'label-5', name: 'Design', color: 'violet' },
              { id: 'label-3', name: 'Improvement', color: 'emerald' }
            ],
            priority: 'Medium',
            checklist: []
          }
        ]
      },
      {
        id: 'list-inprogress',
        title: 'In Progress',
        cards: [
          {
            id: 'card-6',
            title: 'Build Kanban drag-and-drop system',
            description: 'Using vuedraggable to support cross-list card movement and list reordering.',
            labels: [
              { id: 'label-2', name: 'Feature', color: 'blue' }
            ],
            priority: 'High',
            checklist: [
              { id: 'chk-7', text: 'Cards drag between lists', completed: true },
              { id: 'chk-8', text: 'List horizontal reorder', completed: true },
              { id: 'chk-9', text: 'Animations & ghost placeholder', completed: false }
            ]
          },
          {
            id: 'card-7',
            title: 'Optimize database query on analytics page',
            description: 'Query takes ~4s for large accounts. Add proper indexes.',
            labels: [
              { id: 'label-3', name: 'Improvement', color: 'emerald' },
              { id: 'label-1', name: 'Bug', color: 'rose' }
            ],
            priority: 'High',
            checklist: [
              { id: 'chk-10', text: 'Profile slow query', completed: true },
              { id: 'chk-11', text: 'Add composite index', completed: false }
            ]
          }
        ]
      },
      {
        id: 'list-review',
        title: 'In Review',
        cards: [
          {
            id: 'card-8',
            title: 'API rate limiting middleware',
            description: 'Implemented sliding window rate limiting. PR ready for review.',
            labels: [
              { id: 'label-3', name: 'Improvement', color: 'emerald' }
            ],
            priority: 'Medium',
            checklist: [
              { id: 'chk-12', text: 'Unit tests written', completed: true },
              { id: 'chk-13', text: 'Reviewed by lead', completed: false }
            ]
          }
        ]
      },
      {
        id: 'list-done',
        title: 'Done',
        cards: [
          {
            id: 'card-9',
            title: 'Setup CI/CD pipeline',
            description: 'GitHub Actions for automated testing and deployment.',
            labels: [
              { id: 'label-3', name: 'Improvement', color: 'emerald' }
            ],
            priority: 'Medium',
            checklist: [
              { id: 'chk-14', text: 'Configure GitHub Actions', completed: true },
              { id: 'chk-15', text: 'Deploy to staging on PR', completed: true },
              { id: 'chk-16', text: 'Deploy to production on merge', completed: true }
            ]
          },
          {
            id: 'card-10',
            title: 'Update user authentication to JWT',
            description: '',
            labels: [
              { id: 'label-4', name: 'Urgent', color: 'orange' }
            ],
            priority: 'High',
            checklist: []
          }
        ]
      }
    ]
  },
  {
    id: 'board-product',
    title: 'Product Roadmap',
    lists: [
      {
        id: 'list-ideas',
        title: 'Ideas',
        cards: [
          {
            id: 'card-11',
            title: 'AI-powered task suggestions',
            description: 'Use GPT to suggest tasks based on board context.',
            labels: [{ id: 'label-2', name: 'Feature', color: 'blue' }],
            priority: 'Low',
            checklist: []
          }
        ]
      },
      {
        id: 'list-planned',
        title: 'Planned',
        cards: [
          {
            id: 'card-12',
            title: 'Team collaboration features',
            description: 'Real-time multiplayer board editing.',
            labels: [
              { id: 'label-2', name: 'Feature', color: 'blue' },
              { id: 'label-4', name: 'Urgent', color: 'orange' }
            ],
            priority: 'High',
            checklist: [
              { id: 'chk-17', text: 'Design system architecture', completed: false },
              { id: 'chk-18', text: 'WebSocket integration', completed: false }
            ]
          }
        ]
      },
      {
        id: 'list-shipped',
        title: 'Shipped',
        cards: [
          {
            id: 'card-13',
            title: 'Local persistence with localStorage',
            description: 'Boards are now saved automatically in browser.',
            labels: [{ id: 'label-3', name: 'Improvement', color: 'emerald' }],
            priority: 'Medium',
            checklist: []
          }
        ]
      }
    ]
  }
]

export const useBoardStore = defineStore('board', () => {
  const boards = useLocalStorage<Board[]>('openkanban-boards', DUMMY_BOARDS)
  const activeBoardId = useLocalStorage<string>('openkanban-active-board', 'board-sprint')

  const activeBoard = () => boards.value.find(b => b.id === activeBoardId.value)

  function addList(title: string) {
    const board = activeBoard()
    if (!board) return
    board.lists.push({
      id: `list-${Date.now()}`,
      title,
      cards: []
    })
  }

  function addCard(listId: string, title: string) {
    const board = activeBoard()
    if (!board) return
    const list = board.lists.find(l => l.id === listId)
    if (!list) return
    list.cards.push({
      id: `card-${Date.now()}`,
      title,
      labels: [],
      priority: 'Medium',
      checklist: []
    })
  }

  function updateCard(listId: string, cardId: string, updates: Partial<import('../types').Card>) {
    const board = activeBoard()
    if (!board) return
    const list = board.lists.find(l => l.id === listId)
    if (!list) return
    const card = list.cards.find(c => c.id === cardId)
    if (!card) return
    Object.assign(card, updates)
  }

  function deleteList(listId: string) {
    const board = activeBoard()
    if (!board) return
    board.lists = board.lists.filter(l => l.id !== listId)
  }

  function deleteCard(listId: string, cardId: string) {
    const board = activeBoard()
    if (!board) return
    const list = board.lists.find(l => l.id === listId)
    if (!list) return
    list.cards = list.cards.filter(c => c.id !== cardId)
  }

  function addBoard(title: string) {
    boards.value.push({
      id: `board-${Date.now()}`,
      title,
      lists: [
        { id: `list-${Date.now()}-1`, title: 'To Do', cards: [] },
        { id: `list-${Date.now()}-2`, title: 'In Progress', cards: [] },
        { id: `list-${Date.now()}-3`, title: 'Done', cards: [] },
      ]
    })
  }

  return {
    boards,
    activeBoardId,
    activeBoard,
    addList,
    addCard,
    updateCard,
    deleteCard,
    deleteList,
    addBoard
  }
})
