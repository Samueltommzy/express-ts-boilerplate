import type { Balance } from "../apis/stripe/types";

export type LoginResponse = {
	token: string;
	balance?: Balance;
};
