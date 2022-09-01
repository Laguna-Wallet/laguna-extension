import { ConfirmSecuritySkip } from "components/popups/ConfirmSecuritySkip";
import { MnemonicsDescription } from "components/popups/MnemonicsDescription";
import { SecurityOptions, SecurityOptionsEnum } from "utils/types";

type Props = {
  securityType: SecurityOptions;
};

export default function SecurityInfo({ securityType }: Props) {
  // if (!securityType) return <></>;
  // if (securityType === SecurityOptionsEnum.Secured) return <MnemonicsDescription />;
  // return <ConfirmSecuritySkip />;
}
