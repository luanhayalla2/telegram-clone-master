---
description: 
---

API FIREBASE AUTH

  apiKey: "AIzaSyAiv5JTF__u_23EtX1Py3COeZWaQOenR7U",
  authDomain: "telegram-clone-c76d7.firebaseapp.com",
  projectId: "telegram-clone-c76d7",
  storageBucket: "telegram-clone-c76d7.firebasestorage.app",
  messagingSenderId: "339478520967",
  appId: "1:339478520967:web:217e4b6bf3aeb806644422",
  measurementId: "G-VQRELK3S9C"

REGRAS FIRESTORE (ESSAS REGRAS PODEM MUDAR)

rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // This rule allows anyone with your Firestore database reference to view, edit,
    // and delete all data in your Firestore database. It is useful for getting
    // started, but it is configured to expire after 30 days because it
    // leaves your app open to attackers. At that time, all client
    // requests to your Firestore database will be denied.
    //
    // Make sure to write security rules for your app before that time, or else
    // all client requests to your Firestore database will be denied until you Update
    // your rules
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 3, 29);
    }
  }
}

App ID
1676419301a16a280

Auth Keys
3ca2ff5441470437a4a2a954f6c7aae5a5c77b10

Region
US

Rest API Keys

9351040a137b117b346272b253c34547f4341c82

as chaves corretas do comentchat