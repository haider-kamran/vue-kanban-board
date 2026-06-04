<template>
  <div class="w-[320px] shrink-0 flex flex-col bg-slate-100/50 dark:bg-[#14161B]/80 rounded-2xl border border-slate-200/80 dark:border-white/5 max-h-full transition-colors relative" v-click-outside="closeMenu">
    
    <!-- List Header -->
    <div class="p-4 pb-3 flex items-center justify-between list-drag-handle cursor-grab active:cursor-grabbing group">
      <!-- Editable title or static title -->
      <div class="flex items-center gap-2.5 flex-1 min-w-0">
        <input
          v-if="isRenaming"
          v-model="renameValue"
          ref="renameInput"
          @blur="submitRename"
          @keyup.enter="submitRename"
          @keyup.esc="cancelRename"
          @click.stop
          class="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight bg-white dark:bg-[#1E2128] border border-blue-500/50 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-full min-w-0 cursor-text"
        />
        <template v-else>
          <h2 class="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight truncate">{{ list.title }}</h2>
          <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-white/10 px-2 py-0.5 rounded-md shadow-sm border border-slate-200 dark:border-transparent shrink-0">{{ list.cards.length }}</span>
        </template>
      </div>

      <!-- Three-dot menu button -->
      <div class="relative shrink-0 ml-2">
        <button
          @click.stop="toggleMenu"
          class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white dark:hover:bg-white/10"
          :class="{ 'opacity-100': isMenuOpen }"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <Transition name="dropdown">
          <div
            v-if="isMenuOpen"
            class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#1E2128] rounded-xl border border-slate-200 dark:border-white/10 shadow-xl z-50 overflow-hidden py-1"
            @click.stop
          >
            <button
              @click="startRename"
              class="menu-item"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Rename list
            </button>
            <button
              @click="startAddingCard"
              class="menu-item"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              Add a card
            </button>
            <div class="border-t border-slate-100 dark:border-white/5 my-1"></div>
            <button
              @click="deleteList"
              class="menu-item text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Delete list
            </button>
          </div>
        </Transition>
      </div>
    </div>
    
    <!-- Cards Area -->
    <div class="flex-1 overflow-y-auto p-3 pt-1 custom-scrollbar">
      <draggable 
        v-model="list.cards" 
        group="cards" 
        item-key="id"
        class="min-h-[150px] space-y-3 flex flex-col h-full"
        ghost-class="card-ghost"
        drag-class="card-drag"
        :animation="250"
      >
        <template #item="{ element: card }">
          <KanbanCard :card="card" :list-id="list.id" />
        </template>
      </draggable>
    </div>

    <!-- Add Card Footer -->
    <div class="p-3 pt-2 border-t border-slate-200/50 dark:border-white/[0.02]">
      <div v-if="isAddingCard" class="bg-white dark:bg-[#1E2128] rounded-xl p-3 shadow-sm border border-slate-200 dark:border-white/10">
        <textarea 
          v-model="newCardTitle" 
          ref="newCardInput"
          @keyup.enter.prevent="submitNewCard"
          @keyup.esc="cancelNewCard"
          placeholder="What needs to be done?" 
          class="w-full bg-transparent border-none text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-0 resize-none placeholder-slate-400 mb-3 p-0"
          rows="2"
        ></textarea>
        <div class="flex items-center gap-2">
          <button @click="submitNewCard" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-sm transition-colors">Add</button>
          <button @click="cancelNewCard" class="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
      
      <button v-else @click="startAddingCard" class="w-full text-left px-3 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5 rounded-xl transition-all flex items-center gap-2 group">
        <span class="w-5 h-5 rounded-md bg-slate-200 dark:bg-white/10 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        </span>
        Create a card
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import draggable from 'vuedraggable'
import type { List } from '../types'
import KanbanCard from './KanbanCard.vue'
import { useBoardStore } from '../stores/boardStore'

const props = defineProps<{ list: List }>()

const store = useBoardStore()

// ── Add card state ──
const isAddingCard = ref(false)
const newCardTitle = ref('')
const newCardInput = ref<HTMLTextAreaElement | null>(null)

watch(isAddingCard, (val) => {
  if (val) nextTick(() => newCardInput.value?.focus())
})

const startAddingCard = () => {
  closeMenu()
  isAddingCard.value = true
}

const submitNewCard = () => {
  if (newCardTitle.value.trim()) {
    store.addCard(props.list.id, newCardTitle.value.trim())
    newCardTitle.value = ''
    newCardInput.value?.focus()
  } else {
    isAddingCard.value = false
  }
}

const cancelNewCard = () => {
  isAddingCard.value = false
  newCardTitle.value = ''
}

// ── Three-dot menu state ──
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

// ── Rename list ──
const isRenaming = ref(false)
const renameValue = ref('')
const renameInput = ref<HTMLInputElement | null>(null)

const startRename = () => {
  closeMenu()
  renameValue.value = props.list.title
  isRenaming.value = true
  nextTick(() => {
    renameInput.value?.focus()
    renameInput.value?.select()
  })
}

const submitRename = () => {
  const trimmed = renameValue.value.trim()
  if (trimmed) {
    props.list.title = trimmed
  }
  isRenaming.value = false
}

const cancelRename = () => {
  isRenaming.value = false
}

// ── Delete list ──
const deleteList = () => {
  closeMenu()
  store.deleteList(props.list.id)
}

// ── Click-outside directive ──
const vClickOutside = {
  mounted(el: HTMLElement, binding: { value: () => void }) {
    el._clickOutsideHandler = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        binding.value()
      }
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el._clickOutsideHandler)
  }
}
</script>

<style>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,.3); border-radius: 20px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,.1); }

.card-ghost { opacity: 0.4; transform: scale(0.98); }
.card-drag { opacity: 1 !important; transform: rotate(2deg) scale(1.02); cursor: grabbing !important; box-shadow: 0 25px 50px -12px rgba(0,0,0,.25); }

/* Dropdown transition */
.dropdown-enter-active { transition: all .15s cubic-bezier(0,.55,.45,1); }
.dropdown-leave-active { transition: all .1s ease-in; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: scale(0.95) translateY(-4px); }

/* Menu item shared style */
.menu-item {
  @apply w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left;
}
</style>
