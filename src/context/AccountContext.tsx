import {
  createContext,
  FunctionComponent,
  memo,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import { mnemonicGenerate } from '@polkadot/util-crypto/mnemonic';
import { getFromStorage, saveToStorage } from 'utils/chrome';
import { StorageKeys } from 'utils/types';
import keyring from '@polkadot/ui-keyring';

// todoProperTyping
interface IAccountCtx {
  mnemonics: string[];
  password: string;
  getEncryptedPassword: () => string | null;
  setPassword: (password: string) => void;
  pair?: any;
  json: any;
  setJson: (password: string) => void;
  getActiveAccount: () => any;
  saveActiveAccount: (account: any) => void;
}

// todoProperTyping
const initialContextValue = {
  mnemonics: [],
  password: '',
  setPassword: () => undefined,
  getEncryptedPassword: () => null,
  pair: {},
  json: {},
  setJson: () => undefined,
  getActiveAccount: () => undefined,
  saveActiveAccount: (account: any) => undefined
};

const AccountContext = createContext<IAccountCtx>(initialContextValue);

const useAccount = () => {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error('AccountContext must be used within a AccountStateProvider');
  }

  return context;
};

const AccountProvider: FunctionComponent = ({ children }: { children?: ReactNode }) => {
  const [password, setPassword] = useState<string>('');
  const [json, setJson] = useState<any>('');

  const accountFromStorage = getFromStorage(StorageKeys.ActiveAccount);
  const [activeAccount, setActiveAccount] = useState<any>(
    accountFromStorage && JSON.parse(accountFromStorage)
  );

  const getEncryptedPassword = useMemo(() => getFromStorage(StorageKeys.Encoded), []);

  const getActiveAccount = () => {
    // if no account in the storage than insert first one from keyring
    if (!activeAccount) {
      const accounts = keyring.getAccounts();
      if (!accounts.length) return undefined;

      saveToStorage({ key: StorageKeys.ActiveAccount, value: JSON.stringify(accounts[0]) });
      return accounts[0];
    }

    return activeAccount;
  };

  const saveActiveAccount = (account: any) => {
    saveToStorage({ key: StorageKeys.ActiveAccount, value: JSON.stringify(account) });

    setActiveAccount(account);
  };

  const value: IAccountCtx = {
    mnemonics: mnemonicGenerate().split(' '),
    password,
    setPassword,
    getEncryptedPassword: useCallback(() => getEncryptedPassword, []),
    json,
    setJson,
    getActiveAccount,
    saveActiveAccount
  };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};

export { AccountProvider, useAccount };
