import type RestClient from '@minemaker/caller';
import type { ApiVerifiedUser } from '@minemaker/types';

let loggedIn: boolean = $state(false);

export function getLoggedIn() {
	return loggedIn;
}

export function setLoggedIn(newValue: boolean) {
	loggedIn = newValue;
}

let userState: ApiVerifiedUser | undefined = $state();

export function getUserState(): ApiVerifiedUser | undefined {
	return userState;
}

export function setUserState(newValue: ApiVerifiedUser) {
	userState = newValue;
}

let apiClient: RestClient | undefined = $state();

export function getApiClient() {
	return apiClient;
}

export function setApiClient(newValue: RestClient) {
	apiClient = newValue;
}
