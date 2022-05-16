import {
  createContext,
  FunctionComponent,
  memo,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { mnemonicGenerate } from '@polkadot/util-crypto/mnemonic';
import { getFromStorage, saveToStorage } from 'utils/chrome';
import { StorageKeys } from 'utils/types';
import keyring from '@polkadot/ui-keyring';
import { encryptPassword } from 'utils';
import type { KeyringPair } from '@polkadot/keyring/types';

// todoProperTyping
interface IAccountCtx {
  mnemonics: string[];
  generateMnemonics: () => string[];
  setMnemonics: (mnemonics: string[]) => void;
  encryptedPassword: string | null;
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
  generateMnemonics: () => [],
  setMnemonics: () => undefined,
  setPassword: () => undefined,
  encryptedPassword: null,
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

const AccountProvider = ({ children }: { children?: ReactNode }) => {
  const [json, setJson] = useState<any>('');

  // todo typing
  const [activeAccount, setActiveAccount] = useState<KeyringPair>();
  const [encryptedPassword, setEncryptedPassword] = useState<string | null>(null);
  const [mnemonics, setMnemonics] = useState<string[]>([]);

  useEffect(() => {
    getFromStorage(StorageKeys.ActiveAccount).then((data) => {
      if (!data) {
        const accounts = keyring.getPairs();
        if (!accounts.length) return undefined;

        saveToStorage({ key: StorageKeys.ActiveAccount, value: JSON.stringify(accounts[0]) });
        setActiveAccount(accounts[0]);
        return accounts[0];
      }

      setActiveAccount(JSON.parse(data));
    });

    getFromStorage(StorageKeys.Encoded).then((data) => {
      setEncryptedPassword(data);
    });
  }, []);

  const generateMnemonics = useCallback(() => {
    const mnemonics = mnemonicGenerate().split(' ');
    setMnemonics(mnemonics);
    return mnemonics;
  }, []);

  const getActiveAccount = () => {
    return activeAccount;
  };

  const saveActiveAccount = async (account: any) => {
    await saveToStorage({ key: StorageKeys.ActiveAccount, value: JSON.stringify(account) });
    setActiveAccount(account);
  };

  const setPassword = (password: string) => {
    const encoded = encryptPassword({ password });
    setEncryptedPassword(encoded);
    saveToStorage({ key: StorageKeys.Encoded, value: encoded });
  };

  const value: IAccountCtx = {
    mnemonics,
    generateMnemonics,
    setMnemonics,
    setPassword,
    encryptedPassword,
    json,
    setJson,
    getActiveAccount,
    saveActiveAccount
  };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};

export { AccountProvider, useAccount };
