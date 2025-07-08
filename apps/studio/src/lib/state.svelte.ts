import type RestClient from '@minemaker/caller';
import type { ApiGuest, ApiUser } from '@minemaker/types';

let loggedIn: boolean = $state(false);

export function getLoggedIn() {
	return loggedIn;
}

export function setLoggedIn(newValue: boolean) {
	loggedIn = newValue;
}

let userState: ApiUser | undefined = $state();

export function getUserState(): ApiUser | undefined {
	return userState;
}

export function setUserState(newValue: ApiUser) {
	userState = newValue;
}

let apiClient: RestClient | undefined = $state();

export function getApiClient() {
	return apiClient;
}

export function setApiClient(newValue: RestClient) {
	apiClient = newValue;
}
