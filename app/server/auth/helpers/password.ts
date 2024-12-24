import { argon2id } from "hash-wasm";
import zxcvbn from "zxcvbn";

export const passwordStrength = (password: string) => {
	const result = zxcvbn(password);
	return result.score;
};

export const hashPassword = async (password: string) => {
	return await argon2id({
		password,
		salt: crypto.getRandomValues(new Uint8Array(16)),
		parallelism: 1,
		iterations: 2,
		memorySize: 19456,
		hashLength: 32,
		outputType: "encoded",
	});
};
