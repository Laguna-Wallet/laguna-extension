import KusamaIcon from "assets/svgComponents/KusamaIcon";
import MoonriverIcon from "assets/svgComponents/MoonriverIcon";
import PolkadotIcon from "assets/svgComponents/PolkadotIcon";
import AstarIcon from "../../assets/imgs/NetworkIcons/AstarIcon.png";
import SmallPolkadotIcon from "assets/svgComponents/SmallPolkadotIcon";
import SmallKusamaIcon from "assets/svgComponents/SmallKusamaIcon";
import SmallMonriverIcon from "assets/svgComponents/SmallMonriverIcon";
import styled from "styled-components";

type Props = {
  width?: string;
  height?: string;
  chain: string;
  fill?: string;
  isSmallIcon?: boolean;
};

export default function NetworkIcons({ width, height, chain, isSmallIcon = false, fill }: Props) {
  if (chain === "polkadot" || chain === "westend") {
    return isSmallIcon ? <SmallPolkadotIcon fill={fill} /> : <PolkadotIcon />;
  }

  if (chain === "kusama") {
    return isSmallIcon ? <SmallKusamaIcon /> : <KusamaIcon />;
  }

  if (chain === "moonriver") {
    return isSmallIcon ? <SmallMonriverIcon /> : <MoonriverIcon />;
  }

  if (chain === "astar") {
    return <IconContainer width={width} height={height} img={AstarIcon} />;
  }

  return <PlaceHolder />;
}

const PlaceHolder = styled.div`
  width: 36px;
  height: 36px;
  background-color: #111;
  border-radius: 100%;
`;

const IconContainer = styled.div<{ width?: string; height?: string; img: string }>`
  width: ${({ width }) => width || "36px"};
  height: ${({ height }) => height || "36px"};
  min-width: ${({ width }) => width || "36px"};
  min-height: ${({ height }) => height || "36px"};
  background-image: ${({ img }) => `url(${img})`};
  background-size: 100% 100%;
  background-position: center center;
  background-repeat: no-repeat;
`;
