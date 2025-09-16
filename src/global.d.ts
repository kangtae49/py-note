declare global {
  interface Window {
    pywebview: {
        api: {
            sayHelloTo: (name: string) => Promise<string>
        }
    };
  }
}

export {};
