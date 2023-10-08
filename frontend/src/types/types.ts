type UserTokens = {
	access_token: string;
	refresh_token: string;	
}

type UserData = {
	name: string;
	email: string;
	picture: string;
	authMode: string;
}

type User = {
	userInfo: UserData;
	userTokens: UserTokens;
}

export type { User, UserTokens, UserData };
