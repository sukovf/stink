export function getDate(date) {
	return date.getDate();
}

export function getDayNumber(date) {
	return date.getDay();
}

export function getMonth(date) {
	return date.getMonth();
}

export function getYear(date) {
	return date.getFullYear();
}

export function getFirstDayOfWeek(year, month, firstDay) {
	const sundayIndex = firstDay > 0 ? 7 - firstDay : 0;
	const date = new Date();
	date.setDate(1);
	date.setMonth(month - 1);
	date.setFullYear(year);
	const index = date.getDay() + sundayIndex;
	return index >= 7 ? index - 7 : index;
}

export function getDaysInMonth(date) {
	return getMonthEnd(date).getDate();
}

export function getMonthEnd(date) {
	return createDate(date.getFullYear(), date.getMonth() + 1, 0);
}

export function getToday() {
	return new Date();
}

export function addYears(date, years) {
	return addMonths(date, years * 12);
}

export function addMonths(date, months) {
	const month = createDate(date.getFullYear(), date.getMonth() + months, date.getDate());
	const dayOfPreviousMonth = getDate(date);
	const dayOfNewMonth = getDate(month);

	// Solution for edge cases, like moving from a month with a greater number
	// of days than the destination month. For example, when we move from 31 Mar 2020 to
	// February, createDate(2020, 2, 31) will return 2 Mar 2020, not the desired 29 Feb 2020.
	// We need to use setDate(0) to move back to the last day of the previous month (29 Feb 2020)
	if (dayOfPreviousMonth !== dayOfNewMonth) {
		month.setDate(0);
	}

	return month;
}

export function addDays(date, days) {
	return createDate(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function createDate(year, month, day) {
	const result = new Date(year, month, day);

	// In js native date years from 0 to 99 are treated as abbreviation
	// for dates like 19xx
	if (year >= 0 && year < 100) {
		result.setFullYear(result.getFullYear() - 1900);
	}
	return result;
}

export function convertStringToDate(dateString) {
	const dateArr = dateString.split('-');
	const year = dateArr[0];
	const month = dateArr[1];
	const day = dateArr[2];

	return createDate(year, month, day);
}

export function isValidDate(date) {
	return !Number.isNaN(date.getTime());
}

export function compareDates(date1, date2) {
	return (
		getYear(date1) - getYear(date2) ||
		getMonth(date1) - getMonth(date2) ||
		getDate(date1) - getDate(date2)
	);
}

export function isSameDate(date1, date2) {
	date1.setHours(0, 0, 0, 0);
	date2.setHours(0, 0, 0, 0);

	return date1.getTime() === date2.getTime();
}

export function getYearsOffset(activeDate, yearsInView) {
	const activeYear = getYear(activeDate);
	const yearsDifference = activeYear - getStartYear();
	return modulo(yearsDifference, yearsInView);
}

function modulo(a, b) {
	return ((a % b) + b) % b;
}

export function getStartYear(yearsInView, minDate, maxDate) {
	let startYear = 0;

	if (maxDate) {
		const maxYear = getYear(maxDate);
		startYear = maxYear - yearsInView + 1;
	} else if (minDate) {
		startYear = getYear(minDate);
	}

	return startYear;
}

export function isDateDisabled(date, minDate, maxDate, filter) {
	const isBeforeMin = minDate && compareDates(date, minDate) <= 0;
	const isAfterMax = maxDate && compareDates(date, maxDate) >= 0;

	const isDisabled = filter && filter(date) === false;

	return isBeforeMin || isAfterMax || isDisabled;
}

export function isMonthDisabled(month, year, minDate, maxDate) {
	const maxYear = maxDate && getYear(maxDate);
	const maxMonth = maxDate && getMonth(maxDate);
	const minYear = minDate && getYear(minDate);
	const minMonth = minDate && getMonth(minDate);

	const isMonthAndYearAfterMax =
		maxMonth && maxYear && (year > maxYear || (year === maxYear && month > maxMonth));

	const isMonthAndYearBeforeMin =
		minMonth && minYear && (year < minYear || (year === minYear && month < minMonth));

	return isMonthAndYearAfterMax || isMonthAndYearBeforeMin;
}

export function isYearDisabled(year, minDate, maxDate) {
	const min = minDate && getYear(minDate);
	const max = maxDate && getYear(maxDate);

	const isAfterMax = max && year > max;
	const isBeforeMin = min && year < min;

	return isAfterMax || isBeforeMin;
}

export function isNextDateDisabled(activeDate, view, yearsInView, minDate, maxDate) {
	return maxDate && areDatesInSameView(activeDate, maxDate, view, yearsInView, minDate, maxDate);
}

export function isPreviousDateDisabled(activeDate, view, yearsInView, minDate, maxDate) {
	return minDate && areDatesInSameView(activeDate, minDate, view, yearsInView, minDate, maxDate);
}

export function areDatesInSameView(date1, date2, view, yearsInView, minDate, maxDate) {
	if (view === 'days') {
		return getYear(date1) === getYear(date2) && getMonth(date1) === getMonth(date2);
	}

	if (view === 'months') {
		return getYear(date1) === getYear(date2);
	}

	if (view === 'years') {
		const startYear = getStartYear(yearsInView, minDate, maxDate);

		return (
			Math.floor((getYear(date1) - startYear) / yearsInView) ===
			Math.floor((getYear(date2) - startYear) / yearsInView)
		);
	}

	return false;
}
