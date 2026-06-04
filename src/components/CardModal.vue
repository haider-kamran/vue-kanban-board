<template>
  <Transition name="modal-fade">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-900/40 dark:bg-black/70 backdrop-blur-sm"
      @click.self="close"
    >
      <div class="bg-white dark:bg-[#16181D] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-slate-200/60 dark:border-white/[0.08] modal-scale overflow-hidden">

        <!-- Sticky Header -->
        <div class="px-8 pt-7 pb-5 flex items-start justify-between border-b border-slate-100 dark:border-white/5 shrink-0">
          <div class="flex-1 pr-8">
            <p class="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
              in list — <span class="text-slate-600 dark:text-slate-300 font-bold">{{ listName }}</span>
            </p>
            <input
              v-model="localCard.title"
              class="text-2xl font-extrabold bg-transparent w-full text-slate-900 dark:text-white focus:outline-none focus:ring-0 p-0 leading-tight"
              @blur="save"
            />
          </div>
          <button
            @click="close"
            class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors shrink-0"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="overflow-y-auto custom-scrollbar flex-1">
          <div class="p-8 grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-8">

            <!-- ── LEFT COLUMN ── -->
            <div class="space-y-8 min-w-0">

              <!-- Active Labels on card -->
              <div v-if="localCard.labels && localCard.labels.length" class="flex flex-wrap gap-2">
                <span
                  v-for="label in localCard.labels"
                  :key="label.id"
                  class="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider"
                  :class="getLabelBadgeClass(label.color)"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="getLabelDotClass(label.color)"></span>
                  {{ label.name }}
                  <button @click="removeCardLabel(label.id)" class="ml-0.5 opacity-50 hover:opacity-100 transition-opacity">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              </div>

              <!-- Description -->
              <section>
                <h3 class="section-title">
                  <span class="section-icon bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                  </span>
                  Description
                </h3>
                <textarea
                  v-model="localCard.description"
                  class="field-input min-h-[110px] resize-none"
                  placeholder="Add a description..."
                  @blur="save"
                ></textarea>
              </section>

              <!-- Checklist -->
              <section>
                <div class="flex items-center justify-between mb-3">
                  <h3 class="section-title mb-0">
                    <span class="section-icon bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    </span>
                    Checklist
                  </h3>
                  <span class="text-xs font-bold text-slate-400">{{ checklistPercent }}%</span>
                </div>

                <div v-if="localCard.checklist?.length" class="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full mb-4 overflow-hidden">
                  <div class="h-full transition-all duration-500 rounded-full" :class="checklistPercent === 100 ? 'bg-emerald-500' : 'bg-blue-500'" :style="`width:${checklistPercent}%`"></div>
                </div>

                <div class="space-y-1 mb-4">
                  <div
                    v-for="item in localCard.checklist"
                    :key="item.id"
                    class="flex items-center gap-3 p-2 rounded-lg group hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <input
                      type="checkbox"
                      v-model="item.completed"
                      @change="save"
                      class="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500/30 bg-white dark:bg-[#1E2128] cursor-pointer"
                    />
                    <input
                      v-model="item.text"
                      @blur="save"
                      class="flex-1 bg-transparent border-none text-sm focus:ring-0 text-slate-700 dark:text-slate-300 p-0"
                      :class="{ 'line-through text-slate-400 dark:text-slate-600': item.completed }"
                      placeholder="Checklist item..."
                    />
                    <button @click="removeChecklistItem(item.id)" class="text-slate-300 dark:text-slate-700 hover:text-rose-500 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>

                <button @click="addChecklistItem" class="btn-secondary gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                  Add item
                </button>
              </section>
            </div>

            <!-- ── RIGHT SIDEBAR ── -->
            <div class="space-y-6">

              <!-- Priority -->
              <div>
                <p class="sidebar-label">Priority</p>
                <select v-model="localCard.priority" @change="save" class="field-input text-sm font-semibold appearance-none cursor-pointer">
                  <option value="Low">🔵  Low</option>
                  <option value="Medium">🟡  Medium</option>
                  <option value="High">🔴  High</option>
                </select>
              </div>

              <!-- Labels Manager -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <p class="sidebar-label mb-0">Labels</p>
                  <button @click="labelStore.addLabel()" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">+ New</button>
                </div>

                <div class="space-y-1">
                  <div
                    v-for="label in labelStore.labels"
                    :key="label.id"
                    class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/[0.03] group transition-colors"
                  >
                    <!-- Toggle checkbox -->
                    <button
                      @click="toggleCardLabel(label)"
                      class="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all"
                      :class="isLabelActive(label.id)
                        ? [getLabelBgClass(label.color), 'border-transparent']
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1E2128]'"
                    >
                      <svg v-if="isLabelActive(label.id)" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                    </button>

                    <!-- Color dot picker (small popover) -->
                    <div class="relative shrink-0">
                      <button
                        @click="activeLabelColorPicker = activeLabelColorPicker === label.id ? null : label.id"
                        class="w-4 h-4 rounded-full shadow-sm border border-white/30 dark:border-black/30"
                        :class="getLabelBgClass(label.color)"
                        :title="'Change color'"
                      ></button>
                      <!-- Color palette popover -->
                      <div
                        v-if="activeLabelColorPicker === label.id"
                        class="absolute left-5 top-0 z-30 bg-white dark:bg-[#1E2128] border border-slate-200 dark:border-white/10 rounded-xl p-2 shadow-xl grid grid-cols-5 gap-1.5 w-[130px]"
                        @click.stop
                      >
                        <button
                          v-for="c in labelStore.availableColors"
                          :key="c"
                          @click="labelStore.updateLabel(label.id, { color: c }); activeLabelColorPicker = null"
                          class="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
                          :class="[getLabelBgClass(c), label.color === c ? 'border-white dark:border-gray-800 ring-2 ring-blue-500' : 'border-transparent']"
                          :title="c"
                        ></button>
                      </div>
                    </div>

                    <!-- Label name (editable inline) -->
                    <input
                      :value="label.name"
                      @blur="e => labelStore.updateLabel(label.id, { name: (e.target as HTMLInputElement).value })"
                      @keyup.enter="e => (e.target as HTMLInputElement).blur()"
                      class="flex-1 bg-transparent border-none text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-0 p-0 min-w-0"
                    />

                    <!-- Delete label -->
                    <button
                      @click="labelStore.deleteLabel(label.id)"
                      class="text-slate-300 dark:text-slate-700 hover:text-rose-500 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Danger Zone -->
              <div class="pt-4 border-t border-slate-100 dark:border-white/5">
                <p class="sidebar-label">Actions</p>
                <button @click="deleteCard" class="w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Delete Card
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Card, Label } from '../types'
import { useBoardStore } from '../stores/boardStore'
import { useLabelStore } from '../stores/labelStore'
import { getLabelBadgeClass, getLabelBgClass, getLabelDotClass } from '../utils/labelColors'

const props = defineProps<{ card: Card; listId: string }>()
const emit = defineEmits(['close'])

const boardStore = useBoardStore()
const labelStore = useLabelStore()

const localCard = ref<Card>(JSON.parse(JSON.stringify(props.card)))
const activeLabelColorPicker = ref<string | null>(null)

const listName = computed(() =>
  boardStore.activeBoard()?.lists.find(l => l.id === props.listId)?.title ?? 'Unknown'
)

const completedChecklists = computed(() =>
  localCard.value.checklist?.filter(i => i.completed).length ?? 0
)

const checklistPercent = computed(() => {
  const total = localCard.value.checklist?.length ?? 0
  return total ? Math.round((completedChecklists.value / total) * 100) : 0
})

const isLabelActive = (id: string) =>
  !!localCard.value.labels?.find(l => l.id === id)

const toggleCardLabel = (label: Label) => {
  if (!localCard.value.labels) localCard.value.labels = []
  const idx = localCard.value.labels.findIndex(l => l.id === label.id)
  if (idx === -1) {
    localCard.value.labels.push({ ...label })
  } else {
    localCard.value.labels.splice(idx, 1)
  }
  save()
}

const removeCardLabel = (id: string) => {
  localCard.value.labels = localCard.value.labels?.filter(l => l.id !== id)
  save()
}

const addChecklistItem = () => {
  if (!localCard.value.checklist) localCard.value.checklist = []
  localCard.value.checklist.push({ id: `chk-${Date.now()}`, text: '', completed: false })
  save()
}

const removeChecklistItem = (id: string) => {
  localCard.value.checklist = localCard.value.checklist?.filter(i => i.id !== id)
  save()
}

const save = () => {
  boardStore.updateCard(props.listId, localCard.value.id, JSON.parse(JSON.stringify(localCard.value)))
}

const deleteCard = () => {
  boardStore.deleteCard(props.listId, localCard.value.id)
  emit('close')
}

const close = () => emit('close')
</script>

<style scoped>
/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148,163,184,.25); border-radius: 99px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,.08); }

/* Modal animation */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .modal-scale { transition: transform .25s cubic-bezier(.34,1.56,.64,1), opacity .2s ease; }
.modal-fade-enter-from .modal-scale { opacity: 0; transform: scale(.96) translateY(8px); }
</style>

<style>
/* Shared design tokens — global so child components can use them */
.section-title { @apply text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3; }
.section-icon  { @apply w-6 h-6 rounded-lg flex items-center justify-center shrink-0; }
.sidebar-label { @apply text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 block; }
.field-input   { @apply w-full bg-slate-50 dark:bg-[#1C1E26] border border-slate-200 dark:border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all; }
.btn-secondary { @apply flex items-center text-sm font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-3 py-2 rounded-lg transition-colors; }
</style>
