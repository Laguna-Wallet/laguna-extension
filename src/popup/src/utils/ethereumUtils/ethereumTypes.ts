 
 export interface ethereumHoldingState {
    list: TokenData[]
 }

 export interface TokenData {
    address: string;
    balances: Balance[];
 }

 export interface Balance {
  contractAddress: string
  amount: string
 };
