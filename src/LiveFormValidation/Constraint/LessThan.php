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
class LessThan implements ConstraintInterface
{
	/**
	 *
	 */
	public function generateValidationRules(MessageBuilder $messageBuilder, Constraint $constraint): array
	{
		if (!($constraint instanceof \Symfony\Component\Validator\Constraints\LessThan)) {
			throw new InvalidArgumentException(
				sprintf('Expected an object of type "%s", "%s" given',
					\Symfony\Component\Validator\Constraints\LessThan::class, get_class($constraint)));
		}

		$rules = [];
		if (isset($constraint->value)) {
			$rules[] = new Rule(
				RuleOperations::LESS_THAN,
				$constraint->value,
				$messageBuilder->build($constraint->message, $constraint->value)
			);
		}

		return $rules;
	}
}