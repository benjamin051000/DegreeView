import Firestore from '@google-cloud/firestore';

/* Setup DB */
const db = new Firestore({
    projectId: 'swamphacks-2021',
    keyFilename: 'server/config/SwampHacks 2021-af160589d296.json',
  });

export default db;