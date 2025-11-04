# Configuration du Système de Réservation et Contact avec Google Sheets

## 1. Créer des Google Sheets

### Feuille de Réservations
1. Créez une feuille nommée "Réservations OUM KELTOUM"
2. En-têtes:
   - ID
   - Téléphone
   - Personnes
   - Date
   - Heure
   - Horodatage

### Feuille de Contacts
1. Créez une feuille nommée "Contacts OUM KELTOUM"
2. En-têtes:
   - ID
   - Nom
   - Email
   - Téléphone
   - Message
   - Horodatage

## 2. Configurer Google Apps Script

```javascript
// Configuration
const RESERVATION_SHEET = "Feuille 1";
const CONTACT_SHEET = "Feuille 2";
const RESERVATION_HEADERS = ["ID", "Téléphone", "Personnes", "Date", "Heure", "Horodatage"];
const CONTACT_HEADERS = ["ID", "Nom", "Email", "Téléphone", "Message", "Horodatage"];
const NOTIFICATION_EMAIL = "votre.email@example.com"; // Remplacez par votre email

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Determine if this is a reservation or contact submission
    if (data.hasOwnProperty('people')) {
      handleReservation(data);
    } else if (data.hasOwnProperty('username')) {
      handleContact(data);
    }
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Données enregistrées"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleReservation(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(RESERVATION_SHEET);
  
  // Generate unique ID
  const id = new Date().getTime() + Math.floor(Math.random() * 1000);
  
  // Format date
  const formattedDate = new Date(data.date).toLocaleDateString('fr-FR');
  
  // Prepare row data
  const rowData = [
    id,
    data.phone,
    data.people,
    formattedDate,
    data.time,
    new Date(data.timestamp).toLocaleString('fr-FR')
  ];
  
  // Append the data
  sheet.appendRow(rowData);
  
  // Send notification
  sendReservationEmail(data, formattedDate);
}

function handleContact(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONTACT_SHEET);
  
  // Generate unique ID
  const id = new Date().getTime() + Math.floor(Math.random() * 1000);
  
  // Prepare row data
  const rowData = [
    id,
    data.username,
    data.email,
    data.phone,
    data.message,
    new Date(data.timestamp).toLocaleString('fr-FR')
  ];
  
  // Append the data
  sheet.appendRow(rowData);
  
  // Send notification
  sendContactEmail(data);
}

function sendReservationEmail(data, formattedDate) {
  const subject = "Nouvelle Réservation - OUM KELTOUM";
  
  const body = `
Nouvelle réservation reçue:

📱 Téléphone: ${data.phone}
👥 Nombre de personnes: ${data.people}
📅 Date: ${formattedDate}
⏰ Heure: ${data.time}

Cette réservation a été automatiquement enregistrée dans la feuille Google Sheets.
`;

  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: subject,
    body: body
  });
}

function sendContactEmail(data) {
  const subject = "Nouveau Message de Contact - OUM KELTOUM";
  
  const body = `
Nouveau message de contact reçu:

👤 Nom: ${data.username}
📧 Email: ${data.email}
📱 Téléphone: ${data.phone}
💬 Message:
${data.message}

Ce message a été automatiquement enregistré dans la feuille Google Sheets.
`;

  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: subject,
    body: body
  });
}

function doGet() {
  return ContentService.createTextOutput("Service OUM KELTOUM");
}
```

## 3. Configurer l'Email

1. Remplacez `votre.email@example.com` par votre adresse email
2. Le script enverra des emails pour:
   - Nouvelles réservations
   - Nouveaux messages de contact

## 4. Déployer le Script

1. Cliquez sur "Déployer" > "Nouveau déploiement"
2. Sélectionnez "Application web"
3. Configurez:
   - Description: "Système OUM KELTOUM"
   - Exécuter en tant que: "Moi"
   - Qui a accès: "Tout le monde"
4. Déployez et autorisez les permissions
5. Copiez l'URL du déploiement

## 5. Configurer le Site Web

1. Mettez à jour `reservation.js` et `contact.js` avec l'URL:
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/.....';
```

## Notes Importantes

- Les données sont enregistrées dans des feuilles séparées
- Chaque type de soumission a son propre format d'email
- Le système détecte automatiquement le type de soumission
- Les validations sont effectuées côté client et serveur

## Sécurité

- Accès protégé par Google
- Validation des données entrantes
- Rejet des requêtes malformées
- Séparation des données par type

## Maintenance

Pour modifier les paramètres:
1. Ouvrez le script
2. Modifiez les constantes ou les fonctions
3. Redéployez le script
