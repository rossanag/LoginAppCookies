type GTokens = {
	access_token: string;
	refresh_token: string;
	id_token: string;
	expiry_date: number;
}

type User = {
	name: string;
	email: string;
	picture: string;
	gtokens: GTokens;	
}

export type { User, GTokens };
