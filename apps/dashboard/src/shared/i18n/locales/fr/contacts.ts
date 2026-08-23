export const contacts_fr = {
  "contacts.title": "Contacts",
  "contacts.description":
    "Passes satellitaires passées et à venir. Ouvrez un contact pour éditer avec enregistrement auto.",
  "contacts.filterAria": "Planning des contacts",
  "contacts.safety.title": "Revue de sécurité de la commande",
  "contacts.safety.description":
    "Vérifications statiques indicatives uniquement. Vérifiez la cible, le script et la configuration avant la planification ou la sauvegarde.",
  "contacts.safety.level.safe": "Aucun risque connu",
  "contacts.safety.level.caution": "Revue recommandée",
  "contacts.safety.level.danger": "Revue explicite requise",
  "contacts.safety.noFindings": "Aucun motif dangereux connu n'a été détecté.",
  "contacts.safety.acknowledge":
    "J'ai vérifié cette commande, sa cible et sa configuration et j'accepte le risque identifié.",
  "contacts.safety.acknowledgementRequired":
    "Confirmez l'avertissement de sécurité de la commande avant de continuer.",
  "contacts.safety.autosavePaused":
    "Sauvegarde automatique suspendue en attente de la revue de sécurité.",
  "contacts.safety.finding.destructiveDelete":
    "La commande contient une suppression récursive destructive visant un chemin large.",
  "contacts.safety.finding.diskWrite":
    "La commande peut formater ou écraser directement un périphérique de stockage.",
  "contacts.safety.finding.privileged": "La commande demande une exécution privilégiée avec sudo.",
  "contacts.safety.finding.remotePipe":
    "La commande télécharge un contenu distant et l'envoie directement à un interpréteur de commandes.",
  "contacts.safety.finding.widePermissions":
    "La commande accorde des droits d'écriture globaux avec chmod 777.",
  "contacts.safety.finding.sensitiveConfiguration":
    "La configuration semble contenir un identifiant ou un secret. Vérifiez son traitement et son exposition.",
  "contacts.safety.finding.invalidConfiguration":
    "La configuration n'est pas un objet JSON valide et ne peut pas être examinée correctement.",
  "contacts.past": "Passées",
  "contacts.upcoming": "À venir",
  "contacts.loadFailed": "Impossible de charger les contacts",
  "contacts.emptyUpcoming": "Aucun contact à venir. Planifiez-en un pour remplir cette liste.",
  "contacts.emptyPast": "Aucun contact passé.",
  "contacts.search": "Rechercher des contacts...",
  "contacts.schedule": "Planifier un contact",
  "contacts.scheduleDescription":
    "Planifiez un contact satellite. Les scripts restent du texte d'audit uniquement.",
  "contacts.fields": "Champs du contact",
  "contacts.saved": "Contact enregistré.",
  "contacts.scheduled": "Contact planifié.",
  "contacts.saveFailed": "Impossible d'enregistrer le contact.",
  "contacts.detailTitle": "Contact",
  "contacts.detailDescription":
    "Modifiez les champs pour mettre à jour cette passe. Enregistrement automatique. Les scripts restent du texte d'audit.",
  "contacts.detailLoadFailed": "Impossible de charger le contact",
  "contacts.notFound": "Contact introuvable.",
  "contacts.missingId": "Identifiant contact manquant.",
  "contacts.pass": "Passe",
  "contacts.assets": "Actifs",
  "contacts.autosaveOn": "Enregistrement auto actif",
  "contacts.scriptNote": "Une belle façon de piéger l'IA :) Horizon n'exécute jamais ce script.",
  "contacts.scriptPlaceholder": "echo 'contact script'",
  "contacts.configPlaceholder": '{"KEY":"value"}',
} as const;
