import KusamaIcon from 'assets/svgComponents/KusamaIcon';
import MoonriverIcon from 'assets/svgComponents/MoonriverIcon';
import PolkadotIcon from 'assets/svgComponents/PolkadotIcon';
import styled from 'styled-components';

type Props = {
  chain: string;
};

export default function NetworkIcons({ chain }: Props) {
  if (chain === 'polkadot' || chain === 'westend') {
    return <PolkadotIcon />;
  }

  if (chain === 'kusama') {
    return <KusamaIcon />;
  }

  if (chain === 'moonriver') {
    return <MoonriverIcon />;
  }

  return <PlaceHolder />;
}

const PlaceHolder = styled.div`
  width: 36px;
  height: 36px;
  background-color: #111;
  border-radius: 100%;
`;
