import type RestClient from "@minemaker/caller";
import type { User } from "@minemaker/caller";

let loggedIn: boolean = $state(false);

export function getLoggedIn() {
	return loggedIn;
}

export function setLoggedIn(newValue: boolean) {
	loggedIn = newValue;
}

let userState: User | undefined = $state();

export function getUserState(): User | undefined {
	return userState;
}

export function setUserState(newValue: User) {
	userState = newValue;
}

let apiClient: RestClient | undefined = $state();

export function getApiClient() {
	return apiClient;
}

export function setApiClient(newValue: RestClient) {
	apiClient = newValue;
}