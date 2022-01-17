import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Account_Search, Price_Converter } from 'utils/Api';
import { getApiInstance } from 'utils/polkadot';
import { Asset } from 'utils/types';

type Props = {
  accountAddress: string;
  // Todo Appropriate typing
  asset: Asset;
};

export default function ChainItem({ asset, accountAddress }: Props) {
  return (
    <Container>
      <ListItemIcon></ListItemIcon>
      <ListItemText>
        <Title>{asset.name}</Title>
        <Tag>{asset.chain}</Tag>
      </ListItemText>
      <ListItemText>
        <Title>
          {Number(asset?.balance) || 0} {asset.symbol}
        </Title>
        <Value>${asset.calculatedPrice}</Value>
      </ListItemText>
    </Container>
  );
}

const Container = styled.div`
  width: 99%;
  height: 65px;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  margin-bottom: 10px;
  padding: 14px 12px;
  box-sizing: border-box;
  border-radius: 4px;
  font-family: 'Sequel100Wide55Wide';
`;

const ListItemIcon = styled.div`
  width: 36px;
  height: 36px;
  background-color: #eeeeee;
  border-radius: 100%;
`;

const ListItemText = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15px;
  text-align: left;

  :nth-child(3) {
    text-align: right;
    margin-left: auto;
  }
`;

const Title = styled.div`
  font-size: 14px;
`;

const Tag = styled.div`
  font-size: 10px;
  background-color: #eeeeee;
  text-align: center;
  padding: 2px 5px;
  box-sizing: border-box;
  border-radius: 50px;
  color: #757575;
  font-family: 'SFCompactDisplayRegular';
  margin-top: 3px;
`;

const Value = styled.div`
  font-size: 12px;
  font-family: 'SFCompactDisplayRegular';
`;
