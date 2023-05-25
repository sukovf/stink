<?php

namespace App\LiveFormValidation\Constraint;

use App\LiveFormValidation\Exception\InvalidArgumentException;
use App\LiveFormValidation\Message\MessageBuilder;
use App\LiveFormValidation\Rule\Rule;
use App\LiveFormValidation\Rule\RuleOperations;
use Symfony\Component\Validator\Constraint;

class Email implements ConstraintInterface
{
	/**
	 * @param \Symfony\Component\Validator\Constraints\Email $constraint
	 */
	public function generateValidationRules(MessageBuilder $messageBuilder, Constraint $constraint): array
	{
		if (!($constraint instanceof \Symfony\Component\Validator\Constraints\Email)) {
			throw new InvalidArgumentException(
				sprintf('Expected an object of type "%s", "%s" given',
					\Symfony\Component\Validator\Constraints\Email::class, get_class($constraint)));
		}

		$rules = [];
			$rules[] = new Rule(
				RuleOperations::EMAIL,
				message: $messageBuilder->build($constraint->message)
			);


		return $rules;
	}
}