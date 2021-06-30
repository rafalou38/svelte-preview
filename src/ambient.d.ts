declare var acquireVsCodeApi: () => {
	getState: () => any;
	postMessage: (msg: any) => void;
	setState: (newState: any) => void;
};

