// récupérer l'objet navigator.battery en fonction du préfixe utilisé par le navigateur
var battery = navigator.battery || navigator.mozBattery || navigator.webkitBattery;
// récupérer les éléments dont on a besoin et les mettre dans des variables
var indicator1 = document.getElementById('indicator1');
var indicator2 = document.getElementById('indicator2');
var batteryCharge = document.getElementById('battery-charge');
var batteryTop = document.getElementById('battery-top');
var chargeIcon = document.getElementById('battery-charging');

// Drapeaux pour vérifier si la notification batterie charged/not charged a 
// déjà été notifiée une fois
// 0 pour la première notification,
// 1 signifie que "charged" a déjà été notifié,
// 2 signifie que "not charged" a déjà été notifié
// On assigne la valeur opposée à chaque notification de façon à ne pas recevoir
// des notifications répétées concernant le même état de charge
var chargingState = 0;

function updateBatteryStatus() {
  // battery.level peut être utilisé pour donner un pourcentage 
  // de l'état de charge de la batterie à l'utilisateur
  var percentage = Math.round(battery.level * 100);
  indicator1.innerHTML = "Battery charge at " + percentage + "%";
  batteryCharge.style.width = percentage + '%';

  if(percentage >= 99) {
    // notifier que la batterie est chargée, plus ou moins ;-)
    batteryTop.style.backgroundColor = 'limegreen';
    batteryCharge.style.backgroundColor = 'limegreen';
    createNotification("La batterie est chargée");
  }

  if(battery.charging) {
  // Si la batterie est en charge :
    if(chargingState == 1 || chargingState == 0) {
    // et que notre drapeau chargingState vaut 0 ou 1
      // on change les styles pour montrer que la batterie charge
      batteryTop.style.backgroundColor = 'gold';
      batteryCharge.style.backgroundColor = 'gold';
      indicator2.innerHTML = "Battery is charging";
      chargeIcon.style.visibility = 'visible';
      // on prévient l'utilisateur
      createNotification("La batterie est maintenant en charge");

      // on change le valeur de chargingState à 2
      chargingState = 2;
    }
  } else if(!battery.charging) {
  // Si la batterie ne charge pas
    if(chargingState == 2 || chargingState == 0) {
    // et que notre drapeau chargingState vaut 0 ou 2
      // on change les styles pour montrer que la batterie ne charge PAS
      batteryTop.style.backgroundColor = 'yellow';
      batteryCharge.style.backgroundColor = 'yellow';
      indicator2.innerHTML = "Battery not charging";
      chargeIcon.style.visibility = 'hidden';
      // on prévient l'utilisateur
      createNotification("La batterie ne charge pas.");

      // on change le valeur de chargingState à 1
      chargingState = 1;
    }
  }
}

function createNotification(message) {
  // On vérifie que le navigateur supporte les notifications
  if (!("Notification" in window)) {
    console.log("Ce navigateur ne supporte pas les notifications.");
  }
  // On vérifie que l'utilisateur accepte de recevoir des notifications
  else if (Notification.permission === "granted") {
    // S'il est d'accord, on créer une notification

    // afficher la notification
    var notification = new Notification('Battery status', { body: message });
    // et faire vibrer le périphérique s'il supporte l'API Vibration
    window.navigator.vibrate(500);
  }
  // Sinon, nous devons demander la permission à l'utilisateur
  // Note : Chrome n'implémente pas la propriété statique 'permission'
  // Nous devons donc vérifier NOT 'denied' plutôt que 'default'
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // Quelque soit la réponse de l'utilisateur, on s'assure que Chrome
      // stocke l'information
      if(!('permission' in Notification)) {
        Notification.permission = permission;
      }
      // Si l'utilisateur est d'accord, on créer une notification
      if (permission === "granted") {

        // afficher la notification
        var notification = new Notification('Battery status', { body: message });
        // et faire vibrer le périphérique s'il supporte l'API Vibration
        window.navigator.vibrate(500);
      }
    });
  }
}

// Event handler : vérifier si la batterie a commencé à charger ou a arrêté de charger
battery.addEventListener("chargingchange", updateBatteryStatus, false);
// Event handler : vérifier si le niveau de charge de la batterie a changé
battery.addEventListener("levelchange", updateBatteryStatus, false);

// lancer la méthode principale une fois au premier chargement de l'application 
updateBatteryStatus();