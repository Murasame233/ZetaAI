/// <reference types="vite/client" />
interface Window {
  ethereum: any;
  xfi: any;
  BitcoinProvider: {
    requestAccounts(): Promise<any>;
    request: any;
  };
}
