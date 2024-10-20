// src/storageUtils.ts
import db from "./db";

export async function storeCredential(credential) {
  await db.credentials.add({
    type: "cryptokey",
    publicKey: credential.publicKey,
    privateKey: credential.privateKey, // If you want to store the private key too
  });
}

export async function fetchCredentials() {
  const credentials = await db.credentials.toArray();
  return credentials.map(({ publicKey, privateKey }) => ({
    publicKey,
    privateKey, // Include the private key if needed
  }));
}

export async function storePermissionContext(context) {
  await db.permissionContexts.add({ context });
}

export async function fetchPermissionContexts() {
  const contexts = await db.permissionContexts.toArray();
  return contexts.map(({ context }) => context);
}
