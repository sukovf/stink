<?php

namespace App\LiveFormValidation\Rule;

/**
 *
 */
enum RuleOperations: string
{
    case NONE = 'NONE';
    case NOT_BLANK = 'NOT_BLANK';
    case MIN_LENGTH = 'MIN_LENGTH';
    case MAX_LENGTH = 'MAX_LENGTH';
	case GREATER_THAN = 'GREATER_THAN';
	case LESS_THAN = 'LESS_THAN';
	case RANGE = 'RANGE';
	case EMAIL = 'EMAIL';
}