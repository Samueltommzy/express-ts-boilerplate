const x = {
	object: "balance",
	available: [
		{
			amount: 666670,
			currency: "usd",
			source_types: {
				card: 666670,
			},
		},
	],
	connect_reserved: [
		{
			amount: 0,
			currency: "usd",
		},
	],
	livemode: false,
	pending: [
		{
			amount: 61414,
			currency: "usd",
			source_types: {
				card: 61414,
			},
		},
	],
};
type AvailableBalanceSourceTypes = {
	bank_account?: number;
	card?: number;
	fpx?: number;
};
type AvailableBalance = {
	amount: number;
	currency: string;
	source_types?: AvailableBalanceSourceTypes;
};
export type Balance = {
	object: string;
	available: AvailableBalance[];
	connected_reserved?: AvailableBalance[];
	livemode: boolean;
	pending?: AvailableBalance[];
};
