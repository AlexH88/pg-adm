export default {
  id: 1,
  login: "admin",
  email: "",
  role_id: 1,
  role_name: "admins",
  access_rules: {
    public_access: true,
    ['features.put']: true,
    ['smtp.put']: true,
    ['smtp.get']: true,
    ['action_events.get']: true,
    ['printer_api_events.get']: true,
    ['blocked_printers.get']: true,
    ['blocked_printers.post']: true,
    ['blocked_printers.delete']: true,
    ['policy_script.get']: true,
    ['policy_script.put']: true,
    ['users.membersip']: true,
    ['printers.membersip']: true,
    ['operators.get']: true,
    ['reports.get']: true,
    ['reports.pdf']: true,
    ['roles.get']: true,
    ['policy.rules.get']: true,
    ['policy.rules.post']: true,
    ['snmp.get']: true,
    ['snmp.put']: true,
    ['snmp_oid.get']: true,
    ['snmp_oid.post']: true,
    ['snmp_oid.put']: true,
    ['catalogs.put']: true,
    ['catalogs.sync']: true,
    ['printers.sync']: true,
    ['license.get']: true,
    ['license.put']: true,
    ['agent_policies.get']: true,
    ['agent_policies.post']: true,
    ['agent_policies.put']: true,
    ['agent_policies.delete']: true,
    ['catalogs.get']: true,
    ['catalogs.post']: true,
    ['catalogs.delete']: true,
    ['copy_policies.get']: true,
    ['copy_policies.post']: true,
    ['copy_policies.put']: true,
    ['copy_policies.delete']: true,
    ['host_groups.get']: true,
    ['host_groups.post']: true,
    ['host_groups.put']: true,
    ['host_groups.delete']: true,
    ['hosts.get']: true,
    ['hosts.post']: true,
    ['hosts.put']: true,
    ['hosts.delete']: true,
    ['network_hosts.get']: true,
    ['network_hosts.post']: true,
    ['network_hosts.put']: true,
    ['network_hosts.delete']: true,
    ['local_hosts.get']: true,
    ['local_hosts.post']: true,
    ['local_hosts.put']: true,
    ['local_hosts.delete']: true,
    ['images.get']: true,
    ['images.post']: true,
    ['images.put']: true,
    ['images.delete']: true,
    ['jobs.get']: true,
    ['jobs.post']: true,
    ['jobs.put']: true,
    ['jobs.delete']: true,
    ['text_labels.get']: true,
    ['text_labels.post']: true,
    ['text_labels.put']: true,
    ['text_labels.delete']: true,
    ['label_policies.get']: true,
    ['label_policies.post']: true,
    ['label_policies.put']: true,
    ['label_policies.delete']: true,
    ['operators.post']: true,
    ['report.post']: true,
    ['operators.put']: true,
    ['operators.delete']: true,
    ['policies.get']: true,
    ['policies.post']: true,
    ['policies.put']: true,
    ['policies.delete']: true,
    ['printergroups.get']: true,
    ['printergroups.post']: true,
    ['printergroups.put']: true,
    ['printergroups.delete']: true,
    ['printers.get']: true,
    ['printers.post']: true,
    ['printers.put']: true,
    ['printers.delete']: true,
    ['regular_reports.get']: true,
    ['regular_reports.post']: true,
    ['regular_reports.put']: true,
    ['regular_reports.delete']: true,
    ['rfidreaders.get']: true,
    ['rfidreaders.post']: true,
    ['rfidreaders.put']: true,
    ['rfidreaders.delete']: true,
    ['roles.post']: true,
    ['roles.put']: true,
    ['roles.delete']: true,
    ['rules.get']: true,
    ['rules.post']: true,
    ['rules.put']: true,
    ['rules.delete']: true,
    ['usergroups.get']: true,
    ['usergroups.post']: true,
    ['usergroups.put']: true,
    ['usergroups.delete']: true,
    ['users.get']: true,
    ['users.post']: true,
    ['floor.post']: true,
    ['users.put']: true,
    ['users.delete']: true,
    ['all_policies.get']: true,
    ['all_policies.post']: true,
    ['all_policies.put']: true,
    ['all_policies.delete']: true,
    ['journal.get']: true,
    ['report.get']: true,
    ['actions.get']: true,
    ['errors.get']: true,
    ['status.get']: true,
    ['policies.rules.post']: true,
    ['policies.rules.put']: true,
    ['policies.rules.delete']: true,
    ['hosts.sync']: true,
    ['readers.get']: true,
    ['readers.post']: true,
    ['readers.put']: true,
    ['readers.delete']: true,
  },
  features: {
    port: "1025",
    enabled: true,
    per_page_printing: true,
    ask_card_id: true,
    active: {},
    rfid: true,
    username: "admin",
    secure: false,
    local_agent_start_delay: 0,
    password: "22223",
    snmp: false,
    hostname: "['smtp.kakotkin.ru']"
  },
  server_rules: {},
  all_rules: [
    "public_access",
    "['features.put']",
    "['smtp.put']",
    "['smtp.get']",
    "['action_events.get']",
    "['printer_api_events.get']",
    "['blocked_printers.get']",
    "['blocked_printers.post']",
    "['blocked_printers.delete']",
    "['policy_script.get']",
    "['policy_script.put']",
    "['users.membersip']",
    "['printers.membersip']",
    "['operators.get']",
    "['reports.get']",
    "['reports.pdf']",
    "['roles.get']",
    "['policy.rules.get']",
    "['policy.rules.post']",
    "['snmp.get']",
    "['snmp.put']",
    "['snmp_oid.get']",
    "['snmp_oid.post']",
    "['snmp_oid.put']",
    "['catalogs.put']",
    "['catalogs.sync']",
    "['printers.sync']",
    "['license.get']",
    "['license.put']",
    "['agent_policies.get']",
    "['agent_policies.post']",
    "['agent_policies.put']",
    "['agent_policies.delete']",
    "['catalogs.get']",
    "['catalogs.post']",
    "['catalogs.delete']",
    "['copy_policies.get']",
    "['copy_policies.post']",
    "['copy_policies.put']",
    "['copy_policies.delete']",
    "['host_groups.get']",
    "['host_groups.post']",
    "['host_groups.put']",
    "['host_groups.delete']",
    "['hosts.get']",
    "['hosts.post']",
    "['hosts.put']",
    "['hosts.delete']",
    "['network_hosts.get']",
    "['network_hosts.post']",
    "['network_hosts.put']",
    "['network_hosts.delete']",
    "['local_hosts.get']",
    "['local_hosts.post']",
    "['local_hosts.put']",
    "['local_hosts.delete']",
    "['images.get']",
    "['images.post']",
    "['images.put']",
    "['images.delete']",
    "['jobs.get']",
    "['jobs.post']",
    "['jobs.put']",
    "['jobs.delete']",
    "['text_labels.get']",
    "['text_labels.post']",
    "['text_labels.put']",
    "['text_labels.delete']",
    "['label_policies.get']",
    "['label_policies.post']",
    "['label_policies.put']",
    "['label_policies.delete']",
    "['operators.post']",
    "['report.post']",
    "['operators.put']",
    "['operators.delete']",
    "['policies.get']",
    "['policies.post']",
    "['policies.put']",
    "['policies.delete']",
    "['printergroups.get']",
    "['printergroups.post']",
    "['printergroups.put']",
    "['printergroups.delete']",
    "['printers.get']",
    "['printers.post']",
    "['printers.put']",
    "['printers.delete']",
    "['regular_reports.get']",
    "['regular_reports.post']",
    "['regular_reports.put']",
    "['regular_reports.delete']",
    "['rfidreaders.get']",
    "['rfidreaders.post']",
    "['rfidreaders.put']",
    "['rfidreaders.delete']",
    "['roles.post']",
    "['roles.put']",
    "['roles.delete']",
    "['rules.get']",
    "['rules.post']",
    "['rules.put']",
    "['rules.delete']",
    "['usergroups.get']",
    "['usergroups.post']",
    "['usergroups.put']",
    "['usergroups.delete']",
    "['users.get']",
    "['users.post']",
    "['floor.post']",
    "['users.put']",
    "['users.delete']",
    "['all_policies.get']",
    "['all_policies.post']",
    "['all_policies.put']",
    "['all_policies.delete']"
  ]
};
