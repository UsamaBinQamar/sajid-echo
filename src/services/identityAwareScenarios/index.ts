
import { authenticLeadershipScenarios } from './authenticLeadershipScenarios';
import { boundariesBurnoutScenarios } from './boundariesBurnoutScenarios';
import { powerIdentityPoliticsScenarios } from './powerIdentityPoliticsScenarios';
import { powerIdentityAdvancedScenarios } from './powerIdentityAdvancedScenarios';
import { boundariesAdvancedScenarios } from './boundariesAdvancedScenarios';

export const identityAwareScenarios = [
  ...authenticLeadershipScenarios,
  ...boundariesBurnoutScenarios,
  ...powerIdentityPoliticsScenarios,
  ...powerIdentityAdvancedScenarios,
  ...boundariesAdvancedScenarios
];
