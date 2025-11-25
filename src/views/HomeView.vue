<template>
  <div class="home-view">
    <h1>My Walrus Files</h1>

    <div v-if="loading" class="loading">Loading files…</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <ul v-else-if="files?.length" class="file-list">
+        <li v-for="file in files" :key="file.id" class="file-item" @click="router.push({ path: '/doc', query: { id: file.id } })">
        <div class="file-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#4285F4"/>
            <polygon points="14,2 14,8 20,8" fill="#3367D6"/>
          </svg>
        </div>

        <div class="file-info">
          <div class="file-name" :title="file.name">{{ file.id }}</div>
          <!-- <div class="file-name" :title="file.name">{{ formatName(file.name) }}</div> -->
          <div class="file-meta">
            <span class="blob-id">{{ file.blobId }}</span>
            <span class="separator">•</span>
            <span class="date">{{ formatDate(file.createdAt) }}</span>
          </div>
        </div>

        <div class="file-size">{{ formatBytes(file.size) }}</div>
      </li>
    </ul>

    <div v-else class="empty">No files found in this vault.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import request from '@/utils/request';
import { listFilesFromWalrus } from '@/utils/walrusClient';

const router = useRouter();

interface TuskyFile {
  id: string;
  name: string;
  size: number;
  blobId: string;
  createdAt: string;
  mimeType: string;
}

interface TuskyFileResponse {
  items: TuskyFile[];
  nextToken?: string | null;
}

const files = ref<TuskyFileResponse | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function formatDate(timestamp: string): string {
  const date = new Date(Number(timestamp));
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatName(encryptedName: string): string {
  try {
    const decoded = atob(encryptedName);
    const parsed = JSON.parse(decoded);
    const decrypted = atob(parsed.encryptedData.ciphertext);
    return decrypted || 'Untitled';
  } catch {
    return 'Encrypted File';
  }
}

onMounted(async () => {
  try {
    await sleep(2000);

    const response = await listFilesFromWalrus(window.suiMaster.address)

    files.value = response;
  } catch (err: any) {
    error.value = err.message || 'Failed to load files';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.home-view {
  padding: 2rem;
  font-family: 'Roboto', sans-serif;
}

h1 {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  color: #202124;
}

.loading,
.error,
.empty {
  color: #5f6368;
  font-size: 0.9rem;
  padding: 1rem 0;
}

.error { color: #d93025; }

.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #dadce0;
  transition: background 0.1s;
}

.file-item:hover {
  background: #f8f9fa;
}

.file-icon {
  margin-right: 1rem;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-weight: 500;
  color: #3c4043;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.95rem;
}

.file-meta {
  font-size: 0.8rem;
  color: #5f6368;
  margin-top: 0.15rem;
}

.blob-id {
  font-family: monospace;
  background: #e8f0fe;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-size: 0.75rem;
}

.separator {
  margin: 0 0.4rem;
}

.file-size {
  color: #5f6368;
  font-size: 0.8rem;
  margin-left: 1rem;
}
</style>