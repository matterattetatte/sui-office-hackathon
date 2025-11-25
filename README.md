# Sui Office

[![Vue](https://img.shields.io/badge/vue-3.0+-%2341B883?logo=vue&logoColor=white)](https://vuejs.org/)  
[![TypeScript](https://img.shields.io/badge/typescript-4.0+-%23007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)  
[![Walrus](https://img.shields.io/badge/walrus-decentralized‑storage-blue)](https://walrus.xyz)  
[![Sui](https://img.shields.io/badge/sui-blockchain-4DA2FF?logo=sui&logoColor=white)](https://sui.io)  

---

## 🚀 What Is Sui Office

Sui Office is a **decentralized alternative** to Google Docs and Microsoft Office — a Web3-native document editor built **on Sui + Walrus**. It gives you full ownership of your documents, letting you create, edit, and fetch them via blob storage on Walrus, with no centralized back-end.

---

## ✅ Current Features

- **Wallet-based auth**: Connect your Sui wallet — no username / password needed.  
- **Create & Save Documents**: Write rich text docs using the Emo Editor.  
- **Persist on Walrus**: Documents are stored as blobs on Walrus.  
- **Fetch via Aggregator**: Retrieve document content through the Walrus aggregator.  

---

## 🔭 Tech Stack

- **Frontend**: Vue.js + TypeScript  
- **Editor**: Emo Editor  
- **Blockchain / Storage**: Sui + Walrus  
- **Sui Integration**: SuiDouble for wallet interactions  

---

## 🌱 Future Vision

- Permission system: read / write access per wallet  
- End‑to‑end encryption: secure your documents  
- Real-time collaboration: CRDT or WebRTC-based live editing  
- Friendly filenames + metadata (not just blob IDs)  
- Version history and document rollback  
- Support for images, tables, and rich file types  

---

## 🧠 How It Works

1. You connect your Sui wallet to the app.  
2. You write a document in Emo Editor.  
3. When you save, it publishes the content as a **blob** to Walrus.  
4. You get a blob ID that references your document.  
5. To read your document later, you fetch it via the Walrus aggregator.  
6. (Future) Documents might be encrypted & shared / collaborated on.

---

## 🏃 Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/sui-office.git  
cd sui-office  

# Install
npm install  

# Run dev server
npm run dev  


## Competition

Read more about this:

https://officex.app/