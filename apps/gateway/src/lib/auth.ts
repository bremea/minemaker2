import * as jose from 'jose';

export async function verifyAuth(
	token: string
): Promise<{ success: false } | { success: true; id: string }> {
	if (!process.env.JWT_SECRET) throw new Error('Missing JWT_SECRET');
	const secret = new TextEncoder().encode(process.env.JWT_SECRET);
	try {
		const data = await jose.jwtVerify(token, secret);
		return { success: true, id: data.payload.id as string };
	} catch (e) {
		return { success: false };
	}
}
