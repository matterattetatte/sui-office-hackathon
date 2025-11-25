<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UmoEditor } from '@umoteam/editor'
import Swal from 'sweetalert2'
import { getFileFromWalrus, uploadToWalrus } from '@/utils/walrusClient'

const route = useRoute()
const router = useRouter()

const umo = ref<any>(null)
const options = {
  onSave: async (content: { html: string }) => {
    Swal.fire({
      title: 'Success!',
      text: 'Document saved',
      icon: 'success',
      confirmButtonText: 'Cool'
    })
    await saveToWalrus(content.html)
  },
}

const walrusBlobId = ref<string>('')
const reading = ref(false)
const saving = ref(false)

const FALLBACK_HTML = `
  <h1>Welcome to your document</h1>
  <p>Start typing...</p>
`

async function saveToWalrus(content: string) {
  if (saving.value || !content.trim()) return
  saving.value = true

  try {
    const { newlyCreated: { blobObject: { blobId } } } = await uploadToWalrus('temp.html', 'text/html', content)

    walrusBlobId.value = blobId
    await router.replace({ query: { ...route.query, id: blobId } })
  } catch (e: any) {
    alert('Save failed: ' + e.message)
    console.error(e)
  } finally {
    saving.value = false
  }
}

// === Fallback ===
function setFallbackContent() {
  umo.value?.setHTML?.(FALLBACK_HTML) ?? umo.value?.editor?.setHTML?.(FALLBACK_HTML)
}

const id = route.query.id as string
watch(
  umo, 
  async (editor) => {

    if (!id) return
    if (reading.value) return
    if (!editor) return
    if (!editor.setContent) return

    reading.value = true

    try {
      const { content } = await getFileFromWalrus(id)
      editor.setContent(content)
    } catch (e: any) {
      console.warn('Walrus load failed:', e.message)
      setFallbackContent()
    } finally {
      reading.value = false
    }
  },
  { immediate: true } // in case umo is already set when this watch is created
)

</script>

<template>
  <UmoEditor ref="umo" v-bind="options" :document="{ title: 'Word Doc', content: id ? '<h1>Loading...</h1>' : FALLBACK_HTML }" />
</template>
