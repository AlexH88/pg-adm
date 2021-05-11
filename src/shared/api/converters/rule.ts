import {IRule} from 'shared/types/policy';
import {Namespace as NSPolicyModule} from 'modules/Policy';

interface IConvertActionsConfig {
  ignore: string;
  block: string;
  permit: string;
  forceDuplex: string;
  forceGrayscale: string;
  addWatermark: string;
  addSign: string;
  [ key: string ]: string;
}

function getRuleDataConverter(data: NSPolicyModule.IRuleResponse[]): IRule[] {
  if (!1) console.log('Call getRuleDataConverter ')
  return data.map((rule: NSPolicyModule.IRuleResponse) => ({
    id: rule.id,
    policyId: rule.policy_id,
    usergroups: rule.usergroups,
    printergroups: rule.printergroups,
    hours: rule.hours,
    days: rule.days,
    action: rule.action,
    alert: rule.alert,
    counter: rule.counter,
    seq: rule.seq,
  }));
}

function sendRuleDataConverter(data: IRule[]): NSPolicyModule.IRuleRequest[] {
  const convertActionsConfig: IConvertActionsConfig = {
    ignore : 'ignore',
    block : 'block',
    permit : 'permit',
    forceDuplex : 'force_duplex',
    forceGrayscale : 'force_grayscale',
    addWatermark : 'add_watermark',
    addSign : 'add_sign',
  };

  return data.map((rule: IRule) => ({
    id: rule.id,
    policy_id: rule.policyId,
    usergroups: rule.usergroups.map(group => group.id),
    printergroups: rule.printergroups.map(group => group.id),
    hours: rule.hours,
    days: rule.days,
    action: convertActionsConfig[rule.action],
    alert: rule.alert,
    counter: rule.counter,
  }));
};

export {
  sendRuleDataConverter,
  getRuleDataConverter,
}
