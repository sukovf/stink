<?php

namespace App\LiveFormValidation\Constraint;

use App\LiveFormValidation\Message\MessageBuilder;
use App\LiveFormValidation\Rule\Rule;
use Symfony\Component\Validator\Constraint;

interface ConstraintInterface
{
    /**
     * @return Rule[]
     */
    public function generateValidationRules(MessageBuilder $messageBuilder, Constraint $constraint): array;
}