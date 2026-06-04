<template>
  <div class="h-screen w-full flex flex-col overflow-hidden" :class="isDark ? 'dark' : ''">
    <div class="h-full flex flex-col bg-slate-50 dark:bg-[#0D0F14] transition-colors duration-300">

      <!-- ── Premium Header ── -->
      <header class="h-[56px] shrink-0 border-b border-slate-200 dark:border-white/[0.06] bg-white/80 dark:bg-[#13151B]/80 backdrop-blur-xl flex items-center justify-between px-5 z-20">
        <!-- Left: Brand + Board selector -->
        <div class="flex items-center gap-4">
          <!-- Logo mark -->
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <span class="font-extrabold text-[15px] text-slate-900 dark:text-white tracking-tight">OpenKanban</span>
          </div>

          <div class="h-4 w-px bg-slate-200 dark:bg-white/10"></div>

          <!-- Board dropdown -->
          <div class="flex items-center gap-1.5 cursor-pointer group">
            <select
              v-model="store.activeBoardId"
              class="appearance-none bg-transparent text-[14px] font-semibold text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors pr-5"
            >
              <option v-for="b in store.boards" :key="b.id" :value="b.id" class="dark:bg-[#1C1E26]">{{ b.title }}</option>
            </select>
            <svg class="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors -ml-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-2">
          <!-- Dark mode toggle -->
          <button
            @click="toggleDark()"
            class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
          >
            <svg v-if="isDark" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- User avatar -->
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow ring-2 ring-white dark:ring-[#13151B]">
            JD
          </div>
        </div>
      </header>

      <!-- ── Board canvas ── -->
      <main class="flex-1 overflow-auto board-surface">
        <div class="flex items-start gap-5 p-6 h-full w-max" v-if="board">
          <draggable
            v-model="board.lists"
            group="lists"
            item-key="id"
            class="flex items-start gap-5 h-full"
            handle=".list-drag-handle"
            ghost-class="list-ghost"
            :animation="200"
          >
            <template #item="{ element: list }">
              <KanbanList :list="list" />
            </template>
          </draggable>

          <!-- Add list -->
          <div class="shrink-0 w-[300px]">
            <div
              v-if="!isAddingList"
              @click="isAddingList = true"
              class="flex items-center gap-2.5 px-4 py-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all group"
            >
              <span class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              </span>
              <span class="text-sm font-semibold">Add another list</span>
            </div>

            <div v-else class="bg-white dark:bg-[#1C1E26] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl p-4">
              <input
                v-model="newListTitle"
                ref="newListInput"
                @keyup.enter="submitNewList"
                @keyup.esc="cancelNewList"
                type="text"
                placeholder="List title..."
                class="w-full bg-slate-50 dark:bg-[#16181D] border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 mb-3 placeholder-slate-400"
              />
              <div class="flex gap-2">
                <button @click="submitNewList" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-xl shadow-sm shadow-blue-500/20 transition-colors">
                  Add list
                </button>
                <button @click="cancelNewList" class="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue'
import { useBoardStore } from '../stores/boardStore'
import { useDark, useToggle } from '@vueuse/core'
import draggable from 'vuedraggable'
import KanbanList from '../components/KanbanList.vue'

const store = useBoardStore()
const board = computed(() => store.activeBoard())

const isDark = useDark()
const toggleDark = useToggle(isDark)

const isAddingList = ref(false)
const newListTitle = ref('')
const newListInput = ref<HTMLInputElement | null>(null)

watch(isAddingList, (val) => {
  if (val) nextTick(() => newListInput.value?.focus())
})

const submitNewList = () => {
  if (newListTitle.value.trim()) {
    store.addList(newListTitle.value.trim())
    newListTitle.value = ''
    isAddingList.value = false
  }
}

const cancelNewList = () => {
  isAddingList.value = false
  newListTitle.value = ''
}
</script>

<style>
.board-surface {
  background-color: #F8FAFC;
  background-image: radial-gradient(circle, #CBD5E1 1px, transparent 1px);
  background-size: 24px 24px;
}
.dark .board-surface {
  background-color: #0D0F14;
  background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 24px 24px;
}
.list-ghost {
  opacity: 0.35;
  transform: scale(0.97);
}
</style>
