# Extension is divided into two separate projects, Background and Popup

Background manages communication with 3rd party apis and saving data into localStorage,alongside saving some persistent state
in the memory, user logged in or opened keyRings.

Popup consists of ui components, routing and managing application state, partially grabbed from localStorage.

Communication is held by sending messages to each other via [chrome.runtime.sendMessage]

# Background

On Extension install background.js will start polling data from apis.
PRICES_UPDATED
COIN_INFO_UPDATED
ACCOUNTS_BALANCE_UPDATED
TOKEN_DECIMALS_UPDATED

coin prices, meta information are grabbed from Coingecko
token decimals, balances for account from Subscan.

for generating keyRings, mnemonics we are using Polkadot.js utils
https://polkadot.js.org/docs/api/start/keyring
https://polkadot.js.org/docs/util-crypto/examples/create-mnemonic

Transaction data is passed from popup to background, signAndSend is happening from background.ts, after sending appropriate message is send to Popup.

# Popup

For routing popup uses third party package ->
https://www.npmjs.com/package/react-chrome-extension-router

application uses Redux for state managment, Redux-from for managing complex forms, some of the components use Formik for managing forms.

formik can be removed altogather, this will be refactored in the future.

# Build And Development server

after loading unpacked in the browser,running script "yarn watch" with fire up dev server,popup in the chrome will be automatically updated according to changes in the code, background.ts will be updated as well, but it needs to be refreshed from the chrome extensions page, in order to affect changes.

for uploading build to drive in zipped format it's enough to run script "yarn drive-upload-dev"

Webpack is used as a bundler in background.js, bundle will get in dist folder

Popup is CRA(create react application) and it's bundled in the dist folder as weel,

maybe in the future releases Yarn Workspaces will be introduced.

# Accounts

Polkadot.js saves encoded Keyrings in the localStorage.

Active account is saved in localStorage alongside with React Context.
after user logs in pairs from localStorage are grabbed in background js, unlocked(in order to make transaction pairs should be unlocked) and saved into variable, this will be persistent, till user will be logged out.

One keyring can be used on multiple chains: [kusama, westend, polkadot], all the corresponding balances for the user are saved in the localStorage with key [account-balances]
