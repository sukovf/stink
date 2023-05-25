<?php

namespace App\LiveFormValidation\Constraint;

use App\LiveFormValidation\Exception\InvalidArgumentException;
use App\LiveFormValidation\Message\MessageBuilder;
use App\LiveFormValidation\Rule\Rule;
use App\LiveFormValidation\Rule\RuleOperations;
use Symfony\Component\Validator\Constraint;

class Range implements ConstraintInterface
{
	/**
	 * @param \Symfony\Component\Validator\Constraints\Range $constraint
	 */
	public function generateValidationRules(MessageBuilder $messageBuilder, Constraint $constraint): array
	{
		if (!($constraint instanceof \Symfony\Component\Validator\Constraints\Range)) {
			throw new InvalidArgumentException(
				sprintf('Expected an object of type "%s", "%s" given',
					\Symfony\Component\Validator\Constraints\Range::class, get_class($constraint)));
		}

		$rules = [];
		if (isset($constraint->min, $constraint->max)) {
			$rules[] = new Rule(
				RuleOperations::RANGE,
				[$constraint->min, $constraint->max],
				$messageBuilder->build($constraint->notInRangeMessage, [$constraint->min, $constraint->max])
			);
		}

		return $rules;
	}
}