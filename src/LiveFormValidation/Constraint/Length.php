<?php

namespace App\LiveFormValidation\Constraint;

use App\LiveFormValidation\Exception\InvalidArgumentException;
use App\LiveFormValidation\Message\MessageBuilder;
use App\LiveFormValidation\Rule\Rule;
use App\LiveFormValidation\Rule\RuleOperations;
use Symfony\Component\Validator\Constraint;

class Length implements ConstraintInterface
{
    /**
	 * @param \Symfony\Component\Validator\Constraints\Length $constraint
     */
    public function generateValidationRules(MessageBuilder $messageBuilder, Constraint $constraint): array
    {
		if (!($constraint instanceof \Symfony\Component\Validator\Constraints\Length)) {
			throw new InvalidArgumentException(
				sprintf('Expected an object of type "%s", "%s" given',
					\Symfony\Component\Validator\Constraints\Length::class, get_class($constraint)));
		}

        $rules = [];
        if (isset($constraint->min)) {
            $rules[] = new Rule(
                RuleOperations::MIN_LENGTH,
                $constraint->min,
                $messageBuilder->build($constraint->minMessage, $constraint->min));
        }

        if (isset($constraint->max)) {
            $rules[] = new Rule(
                RuleOperations::MAX_LENGTH,
                $constraint->max,
                $messageBuilder->build($constraint->maxMessage, $constraint->max));
        }

        return $rules;
    }
}