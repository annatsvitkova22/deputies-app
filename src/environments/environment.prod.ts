export const environment = {
  production: true,
  // firebaseConfig : {
  //   apiKey: 'AIzaSyDcmDxbIzrx6TJLX8_3WIRHxl4ey8ODK9Q',
  //   authDomain: 'deputy-app.firebaseapp.com',
  //   databaseURL: 'https://deputy-app.firebaseio.com',
  //   projectId: 'deputy-app',
  //   storageBucket: 'deputy-app.appspot.com',
  //   messagingSenderId: '1007048503532',
  //   appId: '1:1007048503532:web:d31131019442a79b1bf5c9',
  //   measurementId: 'G-YW0E58STPW'
  // },
  firebaseConfig: {
    apiKey: "AIzaSyAqPvANRKtGUaGlet3qRR8dXdND-JguPlI",
    authDomain: "deputies-apps.firebaseapp.com",
    databaseURL: "https://deputies-apps.firebaseio.com",
    projectId: "deputies-apps",
    storageBucket: "deputies-apps.appspot.com",
    messagingSenderId: "305771251450",
    appId: "1:305771251450:web:e18f869d6bba9fcf7a2b43",
    measurementId: "G-K51M9YS86S"
  },
  checkTokenPath: 'https://us-central1-deputy-app.cloudfunctions.net/checkToken',
  changeEmail: 'https://us-central1-deputy-app.cloudfunctions.net/updateEmail',
  blockAppealPath: 'https://us-central1-deputy-app.cloudfunctions.net/blockAppeal'
};
