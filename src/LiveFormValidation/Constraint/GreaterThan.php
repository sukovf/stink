<?php

namespace App\LiveFormValidation\Constraint;

use App\LiveFormValidation\Exception\InvalidArgumentException;
use App\LiveFormValidation\Message\MessageBuilder;
use App\LiveFormValidation\Rule\Rule;
use App\LiveFormValidation\Rule\RuleOperations;
use Symfony\Component\Validator\Constraint;

/**
 *
 */
class GreaterThan implements ConstraintInterface
{
	/**
	 *
	 */
	public function generateValidationRules(MessageBuilder $messageBuilder, Constraint $constraint): array
	{
		if (!($constraint instanceof \Symfony\Component\Validator\Constraints\GreaterThan)) {
			throw new InvalidArgumentException(
				sprintf('Expected an object of type "%s", "%s" given',
					\Symfony\Component\Validator\Constraints\GreaterThan::class, get_class($constraint)));
		}

		$rules = [];
		if (isset($constraint->value)) {
			$rules[] = new Rule(
				RuleOperations::GREATER_THAN,
				$constraint->value,
				$messageBuilder->build($constraint->message, $constraint->value)
			);
		}

		return $rules;
	}
}