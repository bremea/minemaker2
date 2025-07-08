import type RestClient from "@minemaker/caller";
import type { ApiGuest, ApiUser } from "@minemaker/types";

let loggedIn: boolean = $state(false);

export function getLoggedIn() {
	return loggedIn;
}

export function setLoggedIn(newValue: boolean) {
	loggedIn = newValue;
}

let userState: ApiUser | ApiGuest | undefined = $state();

export function getUserState(): ApiUser | ApiGuest | undefined {
	return userState;
}

export function setUserState(newValue: ApiUser | ApiGuest) {
	userState = newValue;
}

let apiClient: RestClient | undefined = $state();

export function getApiClient() {
	return apiClient;
}

export function setApiClient(newValue: RestClient) {
	apiClient = newValue;
}