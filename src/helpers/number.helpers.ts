type FormatOptions = {
	digit?: number;
};

export const formatter = new Intl.NumberFormat('en-US', {
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
});

export const format = (number?: number, options?: FormatOptions) => {
	if (!number) return 0
	const { digit = 3 } = options || {};
	let formatFn = formatter
	if (number < 1) {
		formatFn = new Intl.NumberFormat('en-US', {
			minimumFractionDigits: digit,
			maximumFractionDigits: digit,
		})
	}
	return formatFn.format(number);
};
