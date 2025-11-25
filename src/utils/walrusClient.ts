import { WalrusClient,WalrusFile } from "@mysten/walrus"
import { Transaction } from '@mysten/sui/transactions'
import request from "./request";


// const sendTipConfig = await request('https://upload-relay.testnet.walrus.space/v1/tip-config')

// console.log(sendTipConfig)


// exmplae:
// {
//     "send_tip": {
//         "address": "0x4b6a7439159cf10533147fc3d678cf10b714f2bc998f6cb1f1b0b9594cdc52b6",
//         "kind": {
//             "const": 105
//         }
//     }
// }


// export const initWalrusClient = () => new WalrusClient({
//   network: "testnet",
//   suiClient: window.suiMaster.client,
//   uploadRelay: {
//     timeout: 600_000,
//     host: "https://upload-relay.testnet.walrus.space",
//     sendTip: sendTipConfig.send_tip,
//   },
// });

// export const _uploadToWalrus = async (name: string, type: string, content: string) => {
//     const files = [
//         WalrusFile.from({
// 	        contents: new TextEncoder().encode(content),
//           identifier: name || 'tmep.txt',
//           tags: {
//             contentType: type || 'text/plain',
//           },
//         }),
//       ];

//       const flow = window.client.writeFilesFlow({
//         files,
//       })

//       // TODO: USE ICP TO decode or something
//       await flow.encode()

//       const transaction = flow.register({
//           epochs: 10,
//           deletable: true,
//           owner: window.suiMaster.address,
//         })

//         const originalToJSON = transaction.toJSON.bind(transaction);

//         transaction.toJSON = async (options = {}) => {
//           // Merge your custom options with whatever was passed
//           const mergedOptions = { 
//             client: window.suiMaster.client,
//             ...options 
//           };

//           const val = await originalToJSON(mergedOptions)
          
//           return val;
//         };

//       const { digest } = await window.adapter.signAndExecuteTransaction({ 
//         transaction,
//         chain: 'sui:testnet',
//         account: {
//           address: window.suiMaster.address
//         }
//       });

//       await flow.upload({ digest })

//       await window.adapter.signAndExecuteTransaction({
//         transaction: flow.certify(),
//         chain: 'sui:testnet',
//         account: {
//           address: window.suiMaster.address
//         }
//       });

//       return flow.listFiles();
// }

export const uploadToWalrus = async (name: string, type: string, content: string) => {
  const reponse = await request(`https://publisher.walrus-testnet.walrus.space/v1/blobs?send_object_to=${window.suiMaster.address}`, 'PUT', { name, type, content })

  return reponse
}



export const listFilesFromWalrus = async (address: string) => {
    const { data } = await window.suiMaster.client.getOwnedObjects({
        owner: address,
        filter: {
            StructType: "0xd84704c17fc870b8764832c535aa6b11f21a95cd6f5bb38a9b07d2cf42220c66::blob::Blob",
        },
        options: {
            showType: true,
            showContent: true,
            showDisplay: true,
            showOwner: true,
            showPreviousTransaction: true,
            showBcs: true,
        },
    })

    return data.map((f) => ({
       ...f,
       id: decimalBlobIdToBase64Url(f.data.content.fields.blob_id)
    })).sort(({ data: a }, { data: b }) => {
    // strategy: first by registered_epoch, then by version
    const epochA = a.content?.fields?.registered_epoch
      ? Number(a.content.fields.registered_epoch)
      : 0;
    const epochB = b.content?.fields?.registered_epoch
      ? Number(b.content.fields.registered_epoch)
      : 0;

    if (epochA !== epochB) {
      return epochB - epochA;
    }

    // fallback: use version
    const versionA = Number(a.version);
    const versionB = Number(b.version);
    return versionB - versionA;
  })
}

export const getFileFromWalrus = async (fileId: string) => {
    const response = await request(`https://aggregator.walrus-testnet.walrus.space/v1/blobs/${fileId}`)

    return response
}


function decimalBlobIdToBase64Url(decimal: string): string {
  const bn = BigInt(decimal);

  // Convert BigInt to hex (big-endian hex string)
  let hex = bn.toString(16);
  if (hex.length % 2 !== 0) {
    hex = "0" + hex;
  }

  // Convert hex → byte array (big-endian)
  const bigEndianBytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bigEndianBytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }

  // Reverse to little-endian
  const littleEndianBytes = bigEndianBytes.reverse();

  // Convert little-endian bytes → base64url
  let binary = "";
  for (const b of littleEndianBytes) {
    binary += String.fromCharCode(b);
  }

  // btoa works in browser; in Node.js use Buffer
  const b64 = typeof window !== "undefined"
    ? btoa(binary)
    : Buffer.from(littleEndianBytes).toString("base64");

  const b64url = b64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return b64url;
}
