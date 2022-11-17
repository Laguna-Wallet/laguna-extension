import KusamaIcon from "assets/imgs/NetworkIcons/KusamaCircle.png";
import MoonriverIcon from "assets/svgComponents/MoonriverIcon";
import PolkadotPinkIcon from "assets/imgs/NetworkIcons/polkadotPink.png";
import PolkadotIcon from "assets/imgs/NetworkIcons/PolkadotIcon.png";

import AstarIcon from "assets/imgs/NetworkIcons/AstarIcon.png";
import AvalancheIcon from "assets/imgs/NetworkIcons/Avalanche.png";
import USDCIcon from "assets/imgs/NetworkIcons/USDC.png";
import USDTIcon from "assets/imgs/NetworkIcons/USDT.png";
// import SmallPolkadotIcon from "assets/svgComponents/SmallPolkadotIcon";
// import SmallKusamaIcon from "assets/svgComponents/SmallKusamaIcon";
import SmallMonriverIcon from "assets/svgComponents/SmallMonriverIcon";
import EthereumIcon from "assets/imgs/ethereum.png";
import styled from "styled-components";
import { EVMNetwork } from "networks/evm";
import { TokenSymbols } from "utils/types";

type Props = {
  width?: string;
  height?: string;
  chain: string;
  token?: string;
  fill?: string;
  isSmallIcon?: boolean;
  iconType?: "full" | "thin";
};

export default function NetworkIcons({
  width,
  height,
  chain,
  token,
  isSmallIcon = false,
  iconType,
}: Props) {
  if ((chain === "polkadot" || chain === "westend") && iconType === "thin") {
    return <IconContainer width={width} height={height} img={PolkadotIcon} />;
  }

  if (chain === "polkadot" || chain === "westend") {
    return <IconContainer width={width} height={height} img={PolkadotPinkIcon} />;
  }

  if (chain === "kusama") {
    return <IconContainer width={width} height={height} img={KusamaIcon} />;
  }

  if (chain === "moonriver") {
    return isSmallIcon ? <SmallMonriverIcon /> : <MoonriverIcon />;
  }

  if (chain === "astar") {
    return <IconContainer width={width} height={height} img={AstarIcon} />;
  }

  // if (chain === EVMNetwork.AVALANCHE_TESTNET_FUJI) {
  //   return <IconContainer width={width} height={height} img={AvalancheIcon} />;
  // }

  if (chain === EVMNetwork.AVALANCHE_TESTNET_FUJI) {
    return <IconContainer width={width} height={height} img={AvalancheIcon} />;
  }

  if (chain === "ETHEREUM") {
    if (token === TokenSymbols.USDC) {
      return <IconContainer width={width} height={height} img={USDCIcon} />;
    } else if (token === TokenSymbols.USDT) {
      return <IconContainer width={width} height={height} img={USDTIcon} />;
    }
    return <IconContainer width={width} height={height} img={EthereumIcon} />;
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
