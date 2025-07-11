export * from './queries';

export async function wait(ms: number): Promise<void> {
	return new Promise((_, resolve) => {
		setTimeout(resolve, ms);
	});
}
