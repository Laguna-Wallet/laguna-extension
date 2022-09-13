import styled from "styled-components/macro";
import { useAccount } from "context/AccountContext";
import activityBg from "assets/imgs/activity-bg.png";
import Header from "pages/Wallet/Header";
import Footer from "pages/Wallet/Footer";
import { recodeAddress } from "utils/polkadot";
import { ReactChild, useEffect, useState } from "react";
import ThreeDotsIcon from "assets/svgComponents/ThreeDotsIcon";
import ActivityInfo from "./ActivityInfo";
import { useSelector } from "react-redux";
import { truncateString } from "utils";
import { format } from "date-fns";
import RightArrow from "assets/svgComponents/RightArrow";
import { PlusIcon } from "@heroicons/react/outline";
import PolkadotLogoIcon from "assets/svgComponents/PolkadotLogoIcon";
import KusamaLogoIcon from "assets/svgComponents/KusamaLogoIcon";
import { networks, TokenSymbols, Transaction } from "utils/types";
import { fetchAccountTransactionsByChain } from "utils/fetchTransactions";
import Popup from "components/Popup/Popup";
import Loader from "components/Loader/Loader";
import InactiveField from "components/InactiveField/InactiveField";
import { router } from "router/router";
import { useHistory } from "react-router-dom";
import Select, { components } from "react-select";
import NetworkIcons from "components/primitives/NetworkIcons";

type Props = {
  isMenuOpen?: boolean;
  transaction: Transaction;
  onClick?: () => void;
  bgColor?: string;
};

export const ActivityItem = ({ transaction, onClick, bgColor }: Props) => {
  const account = useAccount();

  const handleIsSent = (accountAddress: string, from: string) => {
    if (recodeAddress(accountAddress, 0) === recodeAddress(from, 0)) return true;
    return false;
  };

  const currAccountAddress = account?.getActiveAccount()?.address;

  const isSent = handleIsSent(currAccountAddress, transaction.from);

  return (
    <ActivityItemContainer bgColor={bgColor} onClick={onClick}>
      {/* <StyledLink component={ActivityInfo} props={{ transaction }}> */}
      <Icon>
        {/* <NetworkIcons chain={transaction.chain} /> */}
        {handleIcons(transaction.chain)}
        {isSent ? (
          <IconContainer bgColor="#0324ff">
            <RightArrow width={15} stroke="#fff" />
          </IconContainer>
        ) : (
          <IconContainer bgColor="#b9e260">
            <PlusIcon width={15} stroke="#fff" />
          </IconContainer>
        )}
      </Icon>
      <Info>
        <InfoTop>
          {transaction.amount} <span>{TokenSymbols[transaction?.chain]} </span>{" "}
        </InfoTop>
        <InfoBottom>
          {isSent
            ? "to " + truncateString(transaction.to)
            : "from " + truncateString(transaction.from)}
          {"  "} {format(Number(transaction.timestamp) * 1000, "dd MMM yyyy")}
        </InfoBottom>
      </Info>
      <Actions>
        <ThreeDotsIcon />
      </Actions>
      {/* </StyledLink> */}
    </ActivityItemContainer>
  );
};

export default function Activity() {
  const account = useAccount();
  const history = useHistory();

  const wallet = useSelector((state: any) => state.wallet);
  // const transactions = wallet?.transactions[account.getActiveAccount().address];
  const [transactions, setTransactions] = useState<Transaction[] | []>([]);
  const [transaction, setTransaction] = useState<Transaction>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [chain, setChain] = useState<{
    value: { chain: string; token: string };
    label: string;
    icon: ReactChild;
  }>({
    value: { chain: "polkadot", token: "DOT" },
    label: "polkadot",
    icon: <NetworkIcons isSmallIcon={true} width="20px" height="20px" chain={"polkadot"} />,
  });

  const address = account.getActiveAccount().address;

  const sortedTransactions =
    transactions &&
    transactions.sort(
      (a: any, b: any) => (new Date(b.timestamp) as any) - (new Date(a.timestamp) as any),
    );

  useEffect(() => {
    async function go() {
      setLoading(true);
      const transactions = (await fetchAccountTransactionsByChain(
        address,
        chain.value.chain,
        chain.value.token,
      )) as Transaction[];
      setTransactions(transactions);
      setLoading(false);
    }

    go();
  }, [address, chain]);

  const handleClick = (transaction: Transaction) => {
    setIsPopupOpen(true);
    setTransaction(transaction);
  };

  const { Option } = components;

  const options = networks.map((network) => ({
    value: { chain: network.chain, token: network.symbol },
    label: network.chain.toUpperCase(),
    icon: (
      <NetworkIcons
        isSmallIcon={true}
        width="20px"
        height="20px"
        chain={network.chain}
        token={network.symbol}
      />
    ),
  }));

  // useEffect(() => {
  //   setChain(options.find((option) => option.value === 'polkadot') as any);
  // }, []);

  const IconOption = (props: any) => (
    <Option {...props}>
      {/* <img src={require('./' + props?.data?.icon)} style={{ width: 36 }} /> */}
      <SelectIconsContainer>
        <SelectIcon>{props?.data?.icon}</SelectIcon>
        <SelectLabel>{props?.data?.label}</SelectLabel>
      </SelectIconsContainer>
    </Option>
  );

  const customSingleValue = ({ data }: any) => (
    <ValueContainer>
      <ValueContentContainer>
        <SelectIcon>{data?.icon}</SelectIcon>
        <SelectLabel>{data?.label}</SelectLabel>
      </ValueContentContainer>
    </ValueContainer>
  );

  const styles = {
    singleValue: (provided: any, state: any) => ({
      ...provided,
      display: "flex",
    }),
  };

  return (
    <Container bg={activityBg} isEmpty={!transactions?.length}>
      <Header backAction={() => history.push(router.home)} title="Activity" />
      <>
        <Content>
          <SelectContainer>
            <span>Network</span>
            <Select
              styles={styles}
              isSearchable={false}
              menuPlacement="auto"
              menuPosition="fixed"
              onChange={(value: any) => {
                setChain(value);
              }}
              value={{
                value: { chain: chain.value.chain, token: chain.value.token },
                label: chain.label,
                icon: (
                  <NetworkIcons
                    isSmallIcon={true}
                    width="15px"
                    height="15px"
                    chain={chain.value.chain}
                    token={chain.value.token}
                  />
                ),
              }}
              options={options}
              components={{ Option: IconOption, SingleValue: customSingleValue }}
            />
          </SelectContainer>
          {transactions?.length ? (
            <ListContentParent>
              <ListContentChild>
                {sortedTransactions.map((transaction: any) => {
                  return (
                    <ActivityItem
                      key={transaction.hex}
                      onClick={() => handleClick(transaction)}
                      transaction={transaction}
                    />
                  );
                })}
              </ListContentChild>
            </ListContentParent>
          ) : (
            <InactiveField />
          )}
        </Content>
      </>
      {isPopupOpen && transaction && (
        <Popup justify="center" align="center" onClose={() => setIsPopupOpen(false)}>
          <ActivityContainer>
            <ActivityInfo transaction={transaction} />
          </ActivityContainer>
        </Popup>
      )}
      <Footer activeItem="activity" />
      {loading && <Loader />}
    </Container>
  );
}

function handleIcons(chain: any) {
  switch (chain) {
    case "westend":
      return (
        <PolkadotLogoIcon
        // width={20} height={20}
        />
      );
    // break;
    case "polkadot":
      return (
        <PolkadotLogoIcon
        //  width={20} height={20}
        />
      );
    // break;
    case "kusama":
      return <KusamaLogoIcon fill="#111" stroke="#111" />;
    // break;
    default:
  }
}

const Container = styled.div<{ bg: string; isEmpty: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f1f1f1;
  box-sizing: border-box;
  position: relative;
  background-image: ${({ bg }) => `url(${bg})`};
  background-size: cover;
  padding-top: ${({ isEmpty }) => (isEmpty ? "88px" : "50px")};
  padding-bottom: 50px;
  overflow: hidden;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-sizing: border-box;
`;

const SelectContainer = styled.div`
  width: 100% !important;
  display: flex;
  align-items: space-between;
  /* margin-top: 45px; */
  align-items: center;
  span {
    letter-spacing: 0.25px;
    color: #62768a;
    font-size: 14px;
    margin-right: auto;
  }
`;

const SelectLabel = styled.span`
  font-family: "Inter";
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.25px;
  color: #000000;
`;

const ValueContainer = styled.div`
  display: flex;
  position: relative;
  min-width: 120px;
`;

const ValueContentContainer = styled.div`
  display: flex;
  position: absolute;
  top: -15px;
  left: 5px;
`;

const ListContentParent = styled.div`
  width: 100%;
  height: 570px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  overflow-y: hidden;
  position: relative;
`;

const ListContentChild = styled.div`
  width: 100%;
  overflow-y: scroll;
  position: absolute;
  top: 0;
  left: 0px;
  bottom: -20px;
  right: -20px;
  overflow: scroll;
  padding-bottom: 15px;
  /* padding-right: 20px; */
`;

const SelectIconsContainer = styled.div`
  display: flex;
`;
const SelectIcon = styled.div`
  margin-right: 5px;
`;

// const ActivityItemsContainer = styled.div`
//   width: 100%;
//   height: 100%;
//   overflow-y: scroll;
//   height: auto;
//   display: flex;
//   flex-direction: column;
//   margin-top: 75px;
//   padding-bottom: 20px;
// `;

const ActivityItemContainer = styled.div<{ bgColor?: string }>`
  height: 60px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  padding: 14px;
  box-sizing: border-box;
  text-decoration: none;
  background-color: ${({ bgColor }) => bgColor || "#fff"};
  border-radius: 4px;
  cursor: pointer;
`;

const Icon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 100%;
  background-color: #eeeeee;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconContainer = styled.div<{ bgColor?: string }>`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background-color: ${({ bgColor }) => bgColor};
  position: absolute;
  bottom: -4px;
  right: -4px;
`;

const Info = styled.span`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const InfoTop = styled.span`
  font-family: "IBM Plex Sans";
  font-size: 14px;
  font-weight: 500;
  color: #18191a;

  span {
    text-transform: capitalize;
  }
`;

const InfoBottom = styled.div`
  font-family: "IBM Plex Sans";
  font-size: 12px;
  color: #777e90;
`;

const Actions = styled.div`
  cursor: pointer;
  margin-left: auto;
`;

const ActivityContainer = styled.div`
  width: 323px;
  height: 429px;
`;
