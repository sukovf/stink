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
class NotBlank implements ConstraintInterface
{
    /**
     * @param MessageBuilder $messageBuilder
	 * @param \Symfony\Component\Validator\Constraints\NotBlank $constraint
	 *
	 * @return Rule[]
     */
    public function generateValidationRules(MessageBuilder $messageBuilder, Constraint $constraint): array
    {
		if (!($constraint instanceof \Symfony\Component\Validator\Constraints\NotBlank)) {
			throw new InvalidArgumentException(
				sprintf('Expected an object of type "%s", "%s" given',
					\Symfony\Component\Validator\Constraints\NotBlank::class, get_class($constraint)));
		}

        return [
            new Rule(RuleOperations::NOT_BLANK,
                message: $messageBuilder->build($constraint->message))
        ];
    }
}