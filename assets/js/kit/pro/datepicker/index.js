import Popper from 'popper.js';
import Data from '../../mdb/dom/data';
import EventHandler from '../../mdb/dom/event-handler';
import Manipulator from '../../mdb/dom/manipulator';
import SelectorEngine from '../../mdb/dom/selector-engine';
import {getjQuery, getUID, typeCheckConfig} from '../../mdb/util/index';
import FocusTrap from '../../mdb/util/focusTrap';
import {
	addDays,
	addMonths,
	addYears,
	areDatesInSameView,
	convertStringToDate,
	createDate,
	getDate,
	getDayNumber,
	getDaysInMonth,
	getMonth,
	getYear,
	getYearsOffset,
	isDateDisabled,
	isMonthDisabled,
	isNextDateDisabled,
	isPreviousDateDisabled,
	isSameDate,
	isValidDate,
	isYearDisabled,
} from './date-utils';
import {
	createDayViewTemplate,
	createMonthViewTemplate,
	createYearViewTemplate,
	getBackdropTemplate,
	getDatepickerTemplate,
	getToggleButtonTemplate,
} from './templates';
import {
	DOWN_ARROW,
	END,
	ENTER,
	ESCAPE,
	HOME,
	LEFT_ARROW,
	PAGE_DOWN,
	PAGE_UP,
	RIGHT_ARROW,
	SPACE,
	UP_ARROW,
} from '../../mdb/util/keycodes';

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const YEARS_IN_VIEW = 24;
const YEARS_IN_ROW = 4;
const MONTHS_IN_ROW = 4;

const NAME = 'datepicker';
const DATA_KEY = 'mdb.datepicker';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';

const EVENT_CLOSE = `close${EVENT_KEY}`;
const EVENT_OPEN = `open${EVENT_KEY}`;
const EVENT_DATE_CHANGE = `dateChange${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;

const SELECTOR_DATA_TOGGLE = '[data-toggle="datepicker"]';
const SELECTOR_MODAL_CONTAINER = '.datepicker-modal-container';
const SELECTOR_DROPDOWN_CONTAINER = '.datepicker-dropdown-container';
const SELECTOR_VIEW_CHANGE_BUTTON = '.datepicker-view-change-button';
const SELECTOR_PREVIOUS_BUTTON = '.datepicker-previous-button';
const SELECTOR_NEXT_BUTTON = '.datepicker-next-button';
const SELECTOR_OK_BUTTON = '.datepicker-ok-btn';
const SELECTOR_CANCEL_BUTTON = '.datepicker-cancel-btn';
const SELECTOR_CLEAR_BUTTON = '.datepicker-clear-btn';
const SELECTOR_DATES_CONTAINER = '.datepicker-view';

const Default = {
	title: 'Select date',
	monthsFull: [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	],
	monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	weekdaysFull: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
	weekdaysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
	weekdaysNarrow: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
	okBtnText: 'Ok',
	clearBtnText: 'Clear',
	cancelBtnText: 'Cancel',

	okBtnLabel: 'Confirm selection',
	clearBtnLabel: 'Clear selection',
	cancelBtnLabel: 'Cancel selection',
	nextMonthLabel: 'Next month',
	prevMonthLabel: 'Previous month',
	nextYearLabel: 'Next year',
	prevYearLabel: 'Previous year',
	nextMultiYearLabel: 'Next 24 years',
	prevMultiYearLabel: 'Previous 24 years',
	switchToMultiYearViewLabel: 'Choose year and month',
	switchToMonthViewLabel: 'Choose date',
	switchToDayViewLabel: 'Choose date',

	startDate: null,
	format: 'dd/mm/yyyy',
	view: 'days',

	min: null,
	max: null,
	filter: null,

	inline: false,
	toggleButton: true,
	disableToggleButton: false,
	disableInput: false,
};

const DefaultType = {
	title: 'string',
	monthsFull: 'array',
	monthsShort: 'array',
	weekdaysFull: 'array',
	weekdaysShort: 'array',
	weekdaysNarrow: 'array',

	okBtnText: 'string',
	clearBtnText: 'string',
	cancelBtnText: 'string',
	okBtnLabel: 'string',
	clearBtnLabel: 'string',
	cancelBtnLabel: 'string',
	nextMonthLabel: 'string',
	prevMonthLabel: 'string',
	nextYearLabel: 'string',
	prevYearLabel: 'string',
	nextMultiYearLabel: 'string',
	prevMultiYearLabel: 'string',
	switchToMultiYearViewLabel: 'string',
	switchToMonthViewLabel: 'string',
	switchToDayViewLabel: 'string',

	startDate: '(null|date)',
	format: 'string',
	view: 'string',

	min: '(null|date|string)',
	max: '(null|date|string)',
	filter: '(null|function)',

	inline: 'boolean',
	toggleButton: 'boolean',
	disableToggleButton: 'boolean',
	disableInput: 'boolean',
};

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Datepicker {
	constructor(element, options) {
		this._element = element;
		this._input = SelectorEngine.findOne('input', this._element);
		this._options = this._getConfig(options);
		this._activeDate = new Date();
		this._selectedDate = null;
		this._selectedYear = null;
		this._selectedMonth = null;
		this._view = this._options.view;
		this._popper = null;
		this._focusTrap = null;
		this._isOpen = false;
		this._toggleButtonId = getUID('datepicker-toggle-');

		if (this._element) {
			Data.setData(element, DATA_KEY, this);
		}

		this._init();

		if (this.toggleButton && this._options.disableToggle) {
			this.toggleButton.disabled = 'true';
		}

		if (this._options.disableInput) {
			this._input.disabled = 'true';
		}
	}

	// Getters

	static get NAME() {
		return NAME;
	}

	get container() {
		return (
			SelectorEngine.findOne(SELECTOR_MODAL_CONTAINER) ||
			SelectorEngine.findOne(SELECTOR_DROPDOWN_CONTAINER)
		);
	}

	get options() {
		return this._options;
	}

	get activeCell() {
		let activeCell;

		if (this._view === 'days') {
			activeCell = this._getActiveDayCell();
		}

		if (this._view === 'months') {
			activeCell = this._getActiveMonthCell();
		}

		if (this._view === 'years') {
			activeCell = this._getActiveYearCell();
		}

		return activeCell;
	}

	get activeDay() {
		return getDate(this._activeDate);
	}

	get activeMonth() {
		return getMonth(this._activeDate);
	}

	get activeYear() {
		return getYear(this._activeDate);
	}

	get firstYearInView() {
		return this.activeYear - getYearsOffset(this._activeDate, YEARS_IN_VIEW);
	}

	get lastYearInView() {
		return this.firstYearInView + YEARS_IN_VIEW - 1;
	}

	get viewChangeButton() {
		return SelectorEngine.findOne(SELECTOR_VIEW_CHANGE_BUTTON);
	}

	get previousButton() {
		return SelectorEngine.findOne(SELECTOR_PREVIOUS_BUTTON);
	}

	get nextButton() {
		return SelectorEngine.findOne(SELECTOR_NEXT_BUTTON);
	}

	get okButton() {
		return SelectorEngine.findOne(SELECTOR_OK_BUTTON);
	}

	get cancelButton() {
		return SelectorEngine.findOne(SELECTOR_CANCEL_BUTTON);
	}

	get clearButton() {
		return SelectorEngine.findOne(SELECTOR_CLEAR_BUTTON);
	}

	get datesContainer() {
		return SelectorEngine.findOne(SELECTOR_DATES_CONTAINER, this.container);
	}

	get toggleButton() {
		return SelectorEngine.findOne('.datepicker-toggle-button', this._element);
	}

	_getConfig(config) {
		const dataAttributes = Manipulator.getDataAttributes(this._element);

		config = {
			...Default,
			...dataAttributes,
			...config,
		};

		typeCheckConfig(NAME, config, DefaultType);

		if (config.max && typeof config.max === 'string') {
			config.max = convertStringToDate(config.max);
		}

		if (config.min && typeof config.min === 'string') {
			config.min = convertStringToDate(config.min);
		}

		return config;
	}

	_init() {
		if (!this.toggleButton && this._options.toggleButton) {
			this._appendToggleButton();
		}

		this._listenToUserInput();
		this._listenToToggleClick();
		this._listenToToggleKeydown();
	}

	_appendToggleButton() {
		const toggleButton = getToggleButtonTemplate(this._toggleButtonId);
		this._element.insertAdjacentHTML('beforeend', toggleButton);
	}

	open() {
		const openEvent = EventHandler.trigger(this._element, EVENT_OPEN);

		if (this._isOpen || openEvent.defaultPrevented) {
			return;
		}

		this._setInitialDate();

		const backdrop = getBackdropTemplate();
		const template = getDatepickerTemplate(
			this._activeDate,
			this._selectedDate,
			this._selectedYear,
			this._selectedMonth,
			this._options,
			MONTHS_IN_ROW,
			YEARS_IN_VIEW,
			YEARS_IN_VIEW
		);

		if (this._options.inline) {
			this._openDropdown(template);
		} else {
			this._openModal(backdrop, template);
		}

		this._setFocusTrap(this.container);

		this._listenToDateSelection();
		this._addControlsListeners();
		this._listenToEscapeClick();
		this._listenToKeyboardNavigation();
		this._listenToDatesContainerFocus();
		this._listenToDatesContainerBlur();

		// We need to wait for popper initialization to avoid bug with
		// focusing dates container, otherwise dates container will be
		// focused before popper position update which can change the
		// scroll position on the page
		this._asyncFocusDatesContainer();
		this._updateViewControlsAndAttributes(this._view);
		this._isOpen = true;

		// Wait for the component to open to prevent immediate calling of the
		// close method upon detecting a click on toggle element (input/button)
		setTimeout(() => {
			this._listenToOutsideClick();
		}, 0);
	}

	_openDropdown(template) {
		this._popper = new Popper(this._input, template, {
			placement: 'bottom-start',
		});
		document.body.appendChild(template);
	}

	_openModal(backdrop, template) {
		document.body.appendChild(backdrop);
		document.body.appendChild(template);
		const hasVerticalScroll = window.innerWidth > document.documentElement.clientWidth;
		const scrollHeight = '15px';

		if (hasVerticalScroll) {
			document.body.style.overflow = 'hidden';
			document.body.style.paddingRight = scrollHeight;
		}
	}

	_setFocusTrap(element) {
		this._focusTrap = new FocusTrap(element, {
			event: 'keydown',
			condition: (event) => event.key === 'Tab',
		});
		this._focusTrap.trap();
	}

	_listenToUserInput() {
		EventHandler.on(this._input, 'input', (event) => {
			this._handleUserInput(event.target.value);
		});
	}

	_listenToToggleClick() {
		EventHandler.on(this._element, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, (event) => {
			event.preventDefault();
			this.open();
		});
	}

	_listenToToggleKeydown() {
		EventHandler.on(this._element, 'keydown', SELECTOR_DATA_TOGGLE, (event) => {
			if (event.keyCode === ENTER && !this._isOpen) {
				this.open();
			}
		});
	}

	_listenToDateSelection() {
		EventHandler.on(this.datesContainer, 'click', (e) => {
			const dataset = e.target.nodeName === 'DIV' ? e.target.parentNode.dataset : e.target.dataset;
			const cell = e.target.nodeName === 'DIV' ? e.target.parentNode : e.target;

			if (dataset.date) {
				this._pickDay(dataset.date, cell);
			}

			if (dataset.month && dataset.year) {
				const month = parseInt(dataset.month, 10);
				const year = parseInt(dataset.year, 10);
				this._pickMonth(month, year);
			}

			if (dataset.year && !dataset.month) {
				const year = parseInt(dataset.year, 10);
				this._pickYear(year);
			}

			if (!this._options.inline) {
				this._updateHeaderDate(
					this._activeDate,
					this._options.monthsShort,
					this._options.weekdaysShort
				);
			}
		});
	}

	_updateHeaderDate(date, monthNames, dayNames) {
		const headerDateEl = SelectorEngine.findOne('.datepicker-date-text');
		const month = getMonth(date);
		const day = getDate(date);
		const dayNumber = getDayNumber(date);
		headerDateEl.innerHTML = `${dayNames[dayNumber]}, ${monthNames[month]} ${day}`;
	}

	_addControlsListeners() {
		EventHandler.on(this.nextButton, 'click', () => {
			if (this._view === 'days') {
				this.nextMonth();
			} else if (this._view === 'years') {
				this.nextYears();
			} else {
				this.nextYear();
			}
			this._updateControlsDisabledState();
		});

		EventHandler.on(this.previousButton, 'click', () => {
			if (this._view === 'days') {
				this.previousMonth();
			} else if (this._view === 'years') {
				this.previousYears();
			} else {
				this.previousYear();
			}
			this._updateControlsDisabledState();
		});

		EventHandler.on(this.viewChangeButton, 'click', () => {
			if (this._view === 'days') {
				this._changeView('years');
			} else if (this._view === 'years' || this._view === 'months') {
				this._changeView('days');
			}
		});

		if (!this._options.inline) {
			this._listenToFooterButtonsClick();
		}
	}

	_listenToFooterButtonsClick() {
		EventHandler.on(this.okButton, 'click', () => this.handleOk());
		EventHandler.on(this.cancelButton, 'click', () => this.handleCancel());
		EventHandler.on(this.clearButton, 'click', () => this.handleClear());
	}

	_listenToOutsideClick() {
		EventHandler.on(document, EVENT_CLICK_DATA_API, (e) => {
			const isContainer = e.target === this.container;
			const isContainerContent = this.container && this.container.contains(e.target);

			if (!isContainer && !isContainerContent) {
				this.close();
			}
		});
	}

	_listenToEscapeClick() {
		EventHandler.on(document, 'keydown', (event) => {
			if (event.keyCode === ESCAPE && this._isOpen) {
				this.close();
			}
		});
	}

	_listenToKeyboardNavigation() {
		EventHandler.on(this.datesContainer, 'keydown', (event) => {
			this._handleKeydown(event);
		});
	}

	_listenToDatesContainerFocus() {
		EventHandler.on(this.datesContainer, 'focus', () => {
			this._focusActiveCell(this.activeCell);
		});
	}

	_listenToDatesContainerBlur() {
		EventHandler.on(this.datesContainer, 'blur', () => {
			this._removeCurrentFocusStyles();
		});
	}

	_handleKeydown(event) {
		if (this._view === 'days') {
			this._handleDaysViewKeydown(event);
		}

		if (this._view === 'months') {
			this._handleMonthsViewKeydown(event);
		}

		if (this._view === 'years') {
			this._handleYearsViewKeydown(event);
		}
	}

	_handleDaysViewKeydown(event) {
		const oldActiveDate = this._activeDate;
		const previousActiveCell = this.activeCell;

		switch (event.keyCode) {
			case LEFT_ARROW:
				this._activeDate = addDays(this._activeDate, -1);
				break;
			case RIGHT_ARROW:
				this._activeDate = addDays(this._activeDate, 1);
				break;
			case UP_ARROW:
				this._activeDate = addDays(this._activeDate, -7);
				break;
			case DOWN_ARROW:
				this._activeDate = addDays(this._activeDate, 7);
				break;
			case HOME:
				this._activeDate = addDays(this._activeDate, 1 - getDate(this._activeDate));
				break;
			case END:
				this._activeDate = addDays(
					this._activeDate,
					getDaysInMonth(this._activeDate) - getDate(this._activeDate)
				);
				break;
			case PAGE_UP:
				this._activeDate = addMonths(this._activeDate, -1);
				break;
			case PAGE_DOWN:
				this._activeDate = addMonths(this._activeDate, 1);
				break;
			case ENTER:
			case SPACE:
				if (!this._options.filter || this._options.filter(this._activeDate)) {
					this._selectDate(this._activeDate);
					event.preventDefault();
				}
				return;
			default:
				return;
		}

		if (
			!areDatesInSameView(
				oldActiveDate,
				this._activeDate,
				this._view,
				YEARS_IN_VIEW,
				this._options.min,
				this._options.max
			)
		) {
			this._changeView('days');
		}

		this._removeHighlightFromCell(previousActiveCell);
		this._focusActiveCell(this.activeCell);
		event.preventDefault();
	}

	_asyncFocusDatesContainer() {
		setTimeout(() => {
			this.datesContainer.focus();
		}, 0);
	}

	_focusActiveCell(cell) {
		if (cell) {
			Manipulator.addClass(cell, 'focused');
		}
	}

	_removeHighlightFromCell(cell) {
		if (cell) {
			cell.classList.remove('focused');
		}
	}

	_getActiveDayCell() {
		const cells = SelectorEngine.find('td', this.datesContainer);

		return Array.from(cells).find((cell) => {
			const cellDate = convertStringToDate(cell.dataset.date);
			return isSameDate(cellDate, this._activeDate);
		});
	}

	_handleMonthsViewKeydown(event) {
		const oldActiveDate = this._activeDate;
		const previousActiveCell = this.activeCell;

		switch (event.keyCode) {
			case LEFT_ARROW:
				this._activeDate = addMonths(this._activeDate, -1);
				break;
			case RIGHT_ARROW:
				this._activeDate = addMonths(this._activeDate, 1);
				break;
			case UP_ARROW:
				this._activeDate = addMonths(this._activeDate, -4);
				break;
			case DOWN_ARROW:
				this._activeDate = addMonths(this._activeDate, 4);
				break;
			case HOME:
				this._activeDate = addMonths(this._activeDate, -this.activeMonth);
				break;
			case END:
				this._activeDate = addMonths(this._activeDate, 11 - this.activeMonth);
				break;
			case PAGE_UP:
				this._activeDate = addYears(this._activeDate, -1);
				break;
			case PAGE_DOWN:
				this._activeDate = addYears(this._activeDate, 1);
				break;
			case ENTER:
			case SPACE:
				this._selectMonth(this.activeMonth);
				return;
			default:
				return;
		}

		if (
			!areDatesInSameView(
				oldActiveDate,
				this._activeDate,
				this._view,
				YEARS_IN_VIEW,
				this._options.min,
				this._options.max
			)
		) {
			this._changeView('months');
		}

		this._removeHighlightFromCell(previousActiveCell);
		this._focusActiveCell(this.activeCell);
		event.preventDefault();
	}

	_getActiveMonthCell() {
		const cells = SelectorEngine.find('td', this.datesContainer);

		return Array.from(cells).find((cell) => {
			const cellYear = parseInt(cell.dataset.year, 10);
			const cellMonth = parseInt(cell.dataset.month, 10);
			return cellYear === this.activeYear && cellMonth === this.activeMonth;
		});
	}

	_handleYearsViewKeydown(event) {
		const oldActiveDate = this._activeDate;
		const previousActiveCell = this.activeCell;
		const yearsPerRow = 4;
		const yearsPerPage = 24;

		switch (event.keyCode) {
			case LEFT_ARROW:
				this._activeDate = addYears(this._activeDate, -1);
				break;
			case RIGHT_ARROW:
				this._activeDate = addYears(this._activeDate, 1);
				break;
			case UP_ARROW:
				this._activeDate = addYears(this._activeDate, -yearsPerRow);
				break;
			case DOWN_ARROW:
				this._activeDate = addYears(this._activeDate, yearsPerRow);
				break;
			case HOME:
				this._activeDate = addYears(
					this._activeDate,
					-getYearsOffset(this._activeDate, yearsPerPage)
				);
				break;
			case END:
				this._activeDate = addYears(
					this._activeDate,
					yearsPerPage - getYearsOffset(this._activeDate, yearsPerPage) - 1
				);
				break;
			case PAGE_UP:
				this._activeDate = addYears(this._activeDate, -yearsPerPage);
				break;
			case PAGE_DOWN:
				this._activeDate = addYears(this._activeDate, yearsPerPage);
				break;
			case ENTER:
			case SPACE:
				this._selectYear(this.activeYear);
				return;
			default:
				return;
		}

		if (
			!areDatesInSameView(
				oldActiveDate,
				this._activeDate,
				this._view,
				YEARS_IN_VIEW,
				this._options.min,
				this._options.max
			)
		) {
			this._changeView('years');
		}

		this._removeHighlightFromCell(previousActiveCell);
		this._focusActiveCell(this.activeCell);
		event.preventDefault();
	}

	_getActiveYearCell() {
		const cells = SelectorEngine.find('td', this.datesContainer);

		return Array.from(cells).find((cell) => {
			const cellYear = parseInt(cell.dataset.year, 10);
			return cellYear === this.activeYear;
		});
	}

	_setInitialDate() {
		if (this._input.value) {
			this._handleUserInput(this._input.value);
		} else if (this._options.startDate) {
			this._activeDate = this._options.startDate;
		} else {
			this._activeDate = new Date();
		}
	}

	close() {
		const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);

		if (!this._isOpen || closeEvent.defaultPrevented) {
			return;
		}

		this._removeDatepickerListeners();

		if (this._options.inline) {
			this._closeDropdown();
		} else {
			this._closeModal();
		}

		this._isOpen = false;
		this._view = this._options.view;

		if (this.toggleButton) {
			this.toggleButton.focus();
		} else {
			this._input.focus();
		}
	}

	_closeDropdown() {
		const datepicker = SelectorEngine.findOne('.datepicker-dropdown-container');

		if (datepicker) {
			document.body.removeChild(datepicker);
		}

		if (this._popper) {
			this._popper.destroy();
		}

		this._removeFocusTrap();
	}

	_closeModal() {
		const backdrop = SelectorEngine.findOne('.datepicker-backdrop');
		const datepicker = SelectorEngine.findOne('.datepicker-modal-container');

		if (datepicker && backdrop) {
			document.body.removeChild(backdrop);
			document.body.removeChild(datepicker);
			document.body.style.overflow = '';
			document.body.style.paddingRight = '';
		}
	}

	_removeFocusTrap() {
		if (this._focusTrap) {
			this._focusTrap.disable();
			this._focusTrap = null;
		}
	}

	_removeDatepickerListeners() {
		EventHandler.off(this.nextButton, 'click');
		EventHandler.off(this.previousButton, 'click');
		EventHandler.off(this.viewChangeButton, 'click');
		EventHandler.off(this.okButton, 'click');
		EventHandler.off(this.cancelButton, 'click');
		EventHandler.off(this.clearButton, 'click');

		EventHandler.off(this.datesContainer, 'click');
		EventHandler.off(this.datesContainer, 'keydown');
		EventHandler.off(this.datesContainer, 'focus');
		EventHandler.off(this.datesContainer, 'blur');

		EventHandler.off(document, EVENT_CLICK_DATA_API);
	}

	dispose() {
		if (this._isOpen) {
			this.close();
		}

		this._removeInputAndToggleListeners();

		const generatedToggleButton = SelectorEngine.findOne(`#${this._toggleButtonId}`);

		if (generatedToggleButton) {
			this._element.removeChild(generatedToggleButton);
		}

		Data.removeData(this._element, DATA_KEY);

		this._element = null;
		this._input = null;
		this._options = null;
		this._activeDate = null;
		this._selectedDate = null;
		this._selectedYear = null;
		this._selectedMonth = null;
		this._view = null;
		this._popper = null;
		this._focusTrap = null;
	}

	_removeInputAndToggleListeners() {
		EventHandler.off(this._input, 'input');
		EventHandler.off(this._element, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE);
		EventHandler.off(this._element, 'keydown', SELECTOR_DATA_TOGGLE);
	}

	handleOk() {
		this._confirmSelection(this._selectedDate);
		this.close();
	}

	_selectDate(date, cell = this.activeCell) {
		this._removeCurrentSelectionStyles();
		this._removeCurrentFocusStyles();
		this._addSelectedStyles(cell);
		this._selectedDate = date;

		if (this._options.inline) {
			this._confirmSelection(date);
			this.close();
		}
	}

	_selectYear(year, cell = this.activeCell) {
		this._removeCurrentSelectionStyles();
		this._removeCurrentFocusStyles();
		this._addSelectedStyles(cell);
		this._selectedYear = year;

		this._asyncChangeView('months');
	}

	_selectMonth(month, cell = this.activeCell) {
		this._removeCurrentSelectionStyles();
		this._removeCurrentFocusStyles();
		this._addSelectedStyles(cell);
		this._selectedMonth = month;

		this._asyncChangeView('days');
	}

	_removeSelectedStyles(cell) {
		if (cell) {
			cell.classList.remove('selected');
		}
	}

	_addSelectedStyles(cell) {
		if (cell) {
			Manipulator.addClass(cell, 'selected');
		}
	}

	_confirmSelection(date) {
		if (date) {
			this._input.value = this.formatDate(date);
			Manipulator.addClass(this._input, 'active');
			EventHandler.trigger(this._element, EVENT_DATE_CHANGE, { date });
		}
	}

	handleCancel() {
		this._selectedDate = null;
		this._selectedYear = null;
		this._selectedMonth = null;
		this.close();
	}

	handleClear() {
		this._selectedDate = null;
		this._selectedMonth = null;
		this._selectedYear = null;
		this._removeCurrentSelectionStyles();
		this._input.value = '';
		this._input.classList.remove('active');
		this._setInitialDate();
		this._changeView('days');
	}

	_removeCurrentSelectionStyles() {
		const currentSelected = SelectorEngine.findOne('.selected', this.container);

		if (currentSelected) {
			currentSelected.classList.remove('selected');
		}
	}

	_removeCurrentFocusStyles() {
		const currentFocused = SelectorEngine.findOne('.focused', this.container);

		if (currentFocused) {
			currentFocused.classList.remove('focused');
		}
	}

	formatDate(date) {
		const d = getDate(date);
		const dd = this._addLeadingZero(getDate(date));
		const ddd = this._options.weekdaysShort[getDayNumber(date)];
		const dddd = this._options.weekdaysFull[getDayNumber(date)];
		const m = getMonth(date);
		const mm = this._addLeadingZero(getMonth(date) + 1);
		const mmm = this._options.monthsShort[getMonth(date)];
		const mmmm = this._options.monthsFull[getMonth(date)];
		const yy =
			getYear(date).toString().length === 2 ? getYear(date) : getYear(date).toString().slice(2, 4);
		const yyyy = getYear(date);

		const preformatted = this._options.format.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g);
		let formatted = '';
		preformatted.forEach((datePart) => {
			switch (datePart) {
				case 'dddd':
					datePart = datePart.replace(datePart, dddd);
					break;
				case 'ddd':
					datePart = datePart.replace(datePart, ddd);
					break;
				case 'dd':
					datePart = datePart.replace(datePart, dd);
					break;
				case 'd':
					datePart = datePart.replace(datePart, d);
					break;
				case 'mmmm':
					datePart = datePart.replace(datePart, mmmm);
					break;
				case 'mmm':
					datePart = datePart.replace(datePart, mmm);
					break;
				case 'mm':
					datePart = datePart.replace(datePart, mm);
					break;
				case 'm':
					datePart = datePart.replace(datePart, m);
					break;
				case 'yyyy':
					datePart = datePart.replace(datePart, yyyy);
					break;
				case 'yy':
					datePart = datePart.replace(datePart, yy);
					break;
				default:
			}
			formatted += datePart;
		});

		return formatted;
	}

	_addLeadingZero(value) {
		return parseInt(value, 10) < 10 ? `0${value}` : value;
	}

	_pickDay(day, el) {
		const date = convertStringToDate(day);
		const { min, max, filter } = this._options;

		if (isDateDisabled(date, min, max, filter)) {
			return;
		}

		this._activeDate = date;
		this._selectDate(date, el);
	}

	_pickYear(year) {
		const { min, max } = this._options;

		if (isYearDisabled(year, min, max)) {
			return;
		}

		this._activeDate = createDate(year, this.activeMonth, this.activeDay);
		this._selectYear(year);
	}

	_pickMonth(month, year) {
		const { min, max } = this._options;

		if (isMonthDisabled(month, year, min, max) || isYearDisabled(year, min, max)) {
			return;
		}

		this._activeDate = createDate(year, month, this.activeDay);
		this._selectMonth(month);
	}

	nextMonth() {
		const nextMonth = addMonths(this._activeDate, 1);
		const template = createDayViewTemplate(nextMonth, this._selectedDate, this._options);
		this._activeDate = nextMonth;
		this.viewChangeButton.textContent = `${this._options.monthsFull[this.activeMonth]} ${
			this.activeYear
		}`;
		this.datesContainer.innerHTML = template;
	}

	previousMonth() {
		const previousMonth = addMonths(this._activeDate, -1);
		this._activeDate = previousMonth;
		const template = createDayViewTemplate(previousMonth, this._selectedDate, this._options);
		this.viewChangeButton.textContent = `${this._options.monthsFull[this.activeMonth]} ${
			this.activeYear
		}`;
		this.datesContainer.innerHTML = template;
	}

	nextYear() {
		this._activeDate = addYears(this._activeDate, 1);
		this.viewChangeButton.textContent = `${this.activeYear}`;
		this.datesContainer.innerHTML = createMonthViewTemplate(
			this.activeYear,
			this._selectedYear,
			this._selectedMonth,
			this._options,
			MONTHS_IN_ROW
		);
	}

	previousYear() {
		this._activeDate = addYears(this._activeDate, -1);
		this.viewChangeButton.textContent = `${this.activeYear}`;
		this.datesContainer.innerHTML = createMonthViewTemplate(
			this.activeYear,
			this._selectedYear,
			this._selectedMonth,
			this._options,
			MONTHS_IN_ROW
		);
	}

	nextYears() {
		const nextYear = addYears(this._activeDate, 24);
		this._activeDate = nextYear;
		const template = createYearViewTemplate(
			nextYear,
			this._selectedYear,
			this._options,
			YEARS_IN_VIEW,
			YEARS_IN_ROW
		);
		this.viewChangeButton.textContent = `${this.firstYearInView} - ${this.lastYearInView}`;
		this.datesContainer.innerHTML = template;
	}

	previousYears() {
		const previousYear = addYears(this._activeDate, -24);
		this._activeDate = previousYear;
		const template = createYearViewTemplate(
			previousYear,
			this._selectedYear,
			this._options,
			YEARS_IN_VIEW,
			YEARS_IN_ROW
		);
		this.viewChangeButton.textContent = `${this.firstYearInView} - ${this.lastYearInView}`;
		this.datesContainer.innerHTML = template;
	}

	_asyncChangeView(view) {
		setTimeout(() => {
			this._changeView(view);
		}, 0);
	}

	_changeView(view) {
		this._view = view;
		// We need to add blur event here to reapply focus to
		// dates container when switching from years to months
		// view after selecting year
		this.datesContainer.blur();

		if (view === 'days') {
			this.datesContainer.innerHTML = createDayViewTemplate(
				this._activeDate,
				this._selectedDate,
				this._options
			);
		}

		if (view === 'months') {
			this.datesContainer.innerHTML = createMonthViewTemplate(
				this.activeYear,
				this._selectedYear,
				this._selectedMonth,
				this._options,
				MONTHS_IN_ROW
			);
		}

		if (view === 'years') {
			this.datesContainer.innerHTML = createYearViewTemplate(
				this._activeDate,
				this._selectedYear,
				this._options,
				YEARS_IN_VIEW,
				YEARS_IN_ROW
			);
		}

		this.datesContainer.focus();
		this._updateViewControlsAndAttributes(view);
		this._updateControlsDisabledState();
	}

	_updateViewControlsAndAttributes(view) {
		if (view === 'days') {
			this.viewChangeButton.textContent = `${this._options.monthsFull[this.activeMonth]} ${
				this.activeYear
			}`;
			this.viewChangeButton.setAttribute('aria-label', this._options.switchToMultiYearViewLabel);
			this.previousButton.setAttribute('aria-label', this._options.prevMonthLabel);
			this.nextButton.setAttribute('aria-label', this._options.nextMonthLabel);
		}

		if (view === 'months') {
			this.viewChangeButton.textContent = `${this.activeYear}`;
			this.viewChangeButton.setAttribute('aria-label', this._options.switchToDayViewLabel);
			this.previousButton.setAttribute('aria-label', this._options.prevYearLabel);
			this.nextButton.setAttribute('aria-label', this._options.nextYearLabel);
		}

		if (view === 'years') {
			this.viewChangeButton.textContent = `${this.firstYearInView} - ${this.lastYearInView}`;
			this.viewChangeButton.setAttribute('aria-label', this._options.switchToMonthViewLabel);
			this.previousButton.setAttribute('aria-label', this._options.prevMultiYearLabel);
			this.nextButton.setAttribute('aria-label', this._options.nextMultiYearLabel);
		}
	}

	_updateControlsDisabledState() {
		this.nextButton.disabled = !!isNextDateDisabled(
			this._activeDate,
			this._view,
			YEARS_IN_VIEW,
			this._options.min,
			this._options.max
		);

		this.previousButton.disabled = !!isPreviousDateDisabled(
			this._activeDate,
			this._view,
			YEARS_IN_VIEW,
			this._options.min,
			this._options.max
		);
	}

	_handleUserInput(input) {
		const delimeters = this._getDelimeters(this._options.format);
		const date = this._parseDate(input, this._options.format, delimeters);

		if (isValidDate(date)) {
			this._activeDate = date;
			this._selectedDate = date;
		} else {
			this._activeDate = new Date();
			this._selectedDate = null;
			this._selectedMonth = null;
			this._selectedYear = null;
		}
	}

	_getDelimeters(format) {
		return format.match(/[^(dmy)]{1,}/g);
	}

	_parseDate(dateString, format, delimeters) {
		let delimeterPattern;

		if (delimeters[0] !== delimeters[1]) {
			delimeterPattern = delimeters[0] + delimeters[1];
		} else {
			delimeterPattern = delimeters[0];
		}

		const regExp = new RegExp(`[${delimeterPattern}]`);
		const dateParts = dateString.split(regExp);
		const formatParts = format.split(regExp);
		const isMonthString = format.indexOf('mmm') !== -1;

		const datesArray = [];

		for (let i = 0; i < formatParts.length; i++) {
			if (formatParts[i].indexOf('yy') !== -1) {
				datesArray[0] = { value: dateParts[i], format: formatParts[i] };
			}
			if (formatParts[i].indexOf('m') !== -1) {
				datesArray[1] = { value: dateParts[i], format: formatParts[i] };
			}
			if (formatParts[i].indexOf('d') !== -1 && formatParts[i].length <= 2) {
				datesArray[2] = { value: dateParts[i], format: formatParts[i] };
			}
		}

		let monthsNames;

		if (format.indexOf('mmmm') !== -1) {
			monthsNames = this._options.monthsFull;
		} else {
			monthsNames = this._options.monthsShort;
		}

		const year = Number(datesArray[0].value);
		const month = isMonthString
			? this.getMonthNumberByMonthName(datesArray[1].value, monthsNames)
			: Number(datesArray[1].value) - 1;
		const day = Number(datesArray[2].value);

		return createDate(year, month, day);
	}

	getMonthNumberByMonthName(monthValue, monthLabels) {
		return monthLabels.findIndex((monthLabel) => monthLabel === monthValue);
	}

	static jQueryInterface(config, options) {
		return this.each(function () {
			let data = Data.getData(this, DATA_KEY);
			const _config = typeof config === 'object' && config;

			if (!data && /dispose/.test(config)) {
				return;
			}

			if (!data) {
				data = new Datepicker(this, _config);
			}

			if (typeof config === 'string') {
				if (typeof data[config] === 'undefined') {
					throw new TypeError(`No method named "${config}"`);
				}

				data[config](options);
			}
		});
	}

	static getInstance(element) {
		return Data.getData(element, DATA_KEY);
	}
}

export default Datepicker;

const $ = getjQuery();

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .timepicker to jQuery only if jQuery is present
 */

if ($) {
	const JQUERY_NO_CONFLICT = $.fn[NAME];
	$.fn[NAME] = Datepicker.jQueryInterface;
	$.fn[NAME].Constructor = Datepicker;
	$.fn[NAME].noConflict = () => {
		$.fn[NAME] = JQUERY_NO_CONFLICT;
		return Datepicker.jQueryInterface;
	};
}
