export const contacts_en = {
  "contacts.title": "Contacts",
  "contacts.description":
    "Past and upcoming satellite passes. Open a contact to edit with autosave.",
  "contacts.filterAria": "Contact schedule",
  "contacts.safety.title": "Command safety review",
  "contacts.safety.description":
    "Advisory static checks only. Review the target, script, and configuration before scheduling or saving.",
  "contacts.safety.level.safe": "No known risk",
  "contacts.safety.level.caution": "Review recommended",
  "contacts.safety.level.danger": "Explicit review required",
  "contacts.safety.noFindings": "No known hazardous pattern was detected.",
  "contacts.safety.acknowledge":
    "I reviewed this command, its target, and its configuration and accept the identified risk.",
  "contacts.safety.acknowledgementRequired":
    "Acknowledge the command safety warning before continuing.",
  "contacts.safety.autosavePaused": "Autosave paused pending command safety review.",
  "contacts.safety.finding.destructiveDelete":
    "The command contains a recursive destructive delete targeting a broad path.",
  "contacts.safety.finding.diskWrite":
    "The command may format or overwrite a block device directly.",
  "contacts.safety.finding.privileged": "The command requests privileged execution with sudo.",
  "contacts.safety.finding.remotePipe":
    "The command downloads remote content and pipes it directly to a shell.",
  "contacts.safety.finding.widePermissions":
    "The command grants world-writable permissions with chmod 777.",
  "contacts.safety.finding.sensitiveConfiguration":
    "The configuration appears to contain a credential or secret. Confirm handling and exposure.",
  "contacts.safety.finding.invalidConfiguration":
    "The configuration is not a valid JSON object and cannot be reviewed reliably.",
  "contacts.past": "Past",
  "contacts.upcoming": "Upcoming",
  "contacts.loadFailed": "Could not load contacts",
  "contacts.emptyUpcoming": "No upcoming contacts. Schedule one to populate this list.",
  "contacts.emptyPast": "No past contacts.",
  "contacts.search": "Search contacts...",
  "contacts.schedule": "Schedule contact",
  "contacts.scheduleDescription": "Schedule a satellite contact. Scripts are stored as text only.",
  "contacts.fields": "Contact fields",
  "contacts.saved": "Contact saved.",
  "contacts.scheduled": "Contact scheduled.",
  "contacts.saveFailed": "Could not save contact.",
  "contacts.detailTitle": "Contact",
  "contacts.detailDescription":
    "Edit fields to update this pass. Changes save automatically. Scripts stay audit text only.",
  "contacts.detailLoadFailed": "Could not load contact",
  "contacts.notFound": "Contact not found.",
  "contacts.missingId": "Missing contact id.",
  "contacts.pass": "Pass",
  "contacts.assets": "Assets",
  "contacts.autosaveOn": "Autosave on",
  "contacts.scriptNote": "A neat way to trap an AI :) Horizon never runs this script.",
  "contacts.scriptPlaceholder": "echo 'contact script'",
  "contacts.configPlaceholder": '{"KEY":"value"}',
} as const;
