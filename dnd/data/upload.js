const firestoreService = require("firestore-export-import");
const serviceAccount = require("./serviceAccountKey.json");

const databaseUrl = "https://playground-dnd.firebaseio.com";

firestoreService.initializeApp(serviceAccount, databaseUrl);
firestoreService.restore("./data/spells.json");
