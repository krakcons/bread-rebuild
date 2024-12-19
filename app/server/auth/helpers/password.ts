import zxcvbn from "zxcvbn";

export const passwordStrength = (password: string) => {
	const result = zxcvbn(password);
	return result.score;
};
