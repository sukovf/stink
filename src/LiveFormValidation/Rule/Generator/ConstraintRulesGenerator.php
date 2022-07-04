<?php

namespace App\LiveFormValidation\Rule\Generator;

use App\LiveFormValidation\Constraint\ConstraintInterface;
use App\LiveFormValidation\Message\MessageBuilder;
use App\LiveFormValidation\Rule\Rule;
use Symfony\Component\Form\FormBuilder;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\Constraints\NotBlank;

/**
 *
 */
class ConstraintRulesGenerator
{
	const CONSTRAINT_RULE_CLASS_BASE = 'App\\LiveFormValidation\\Constraint\\';

    /** @var MetadataProvider */
    private MetadataProvider $metadataProvider;

    /** @var MessageBuilder */
    private MessageBuilder $messageBuilder;

    /**
     *
     */
    public function __construct(MetadataProvider $metadataProvider, MessageBuilder $messageBuilder)
    {
        $this->metadataProvider = $metadataProvider;
        $this->messageBuilder = $messageBuilder;
    }

    /**
     *
     */
    public function generateConstraintRules(FormBuilderInterface $builder): void
    {
		foreach ($builder as $element) {
			if (!($element instanceof FormBuilder)) {
				continue;
			}

			$options = $element->getOptions();

			if (isset($options['mapped']) && !$options['mapped']) {
				continue;
			}

			// collect all constraints
			$constraints = array_merge(
				$this->collectOptionsConstraints($options),
				$this->collectEntityConstraints($builder, $element->getName()));

			$options['constraints'] = $constraints;

			// generate and serialize constraint rules
			if ($rulesStr = $this->serializeConstraintRules($constraints)) {
				if (is_array($options['attr'])) {
					$options['attr']['data-validation-rules'] = $rulesStr;
				}
			}

			$builder->add($element->getName(), $element->getType()->getInnerType()::class, $options);
		}
    }

	/**
	 * @param array<string, mixed> $options
	 *
	 * @return Constraint[]
	 */
	private function collectOptionsConstraints(array $options): array
	{
		/** @var Constraint[] $constraints */
		$constraints = [];
		if (is_array($options['constraints'])) {
			$constraints = $options['constraints'];

			if (count(array_filter($options['constraints'], function($constraint) {
					return $constraint instanceof NotBlank;
				})) === 0) {
				if ($options['required'] === true) {
					$constraints[] = new NotBlank();
				}
			}
		}

		return $constraints;
	}

	/**
	 * @param FormBuilderInterface $builder
	 * @param string $elementName
	 *
	 * @return Constraint[]
	 */
	private function collectEntityConstraints(FormBuilderInterface $builder, string $elementName): array
	{
		/** @var Constraint[] $constraints */
		$constraints = [];
		if ($builder->getData() !== null && is_object($builder->getData())) {
			$constraints = $this->metadataProvider->getEntityPropertyConstraints(get_class($builder->getData()), $elementName);
		}

		return $constraints;
	}

	/**
	 * @param Constraint[] $constraints
	 *
	 * @return ?string
	 */
	private function serializeConstraintRules(array $constraints): ?string
	{
		/** @var Rule[] $rules */
		$rules = [];

		foreach ($constraints as $constraint) {
			$constraintName = [];
			if (preg_match('/[\w\d]+$/', get_class($constraint), $constraintName) === 1) {
				if (count($constraintName) === 1) {
					$constraintName = $constraintName[0];
					$constraintRuleClass = self::CONSTRAINT_RULE_CLASS_BASE . $constraintName;

					if (class_exists($constraintRuleClass) && is_subclass_of($constraintRuleClass, ConstraintInterface::class)) {
						/** @var ConstraintInterface $constraintRule */
						$constraintRule = new $constraintRuleClass;
						$rules = array_merge($rules, $constraintRule->generateValidationRules($this->messageBuilder, $constraint));
					}
				}
			}
		}

		if (count($rules) > 0) {
			$rulesStr = json_encode($rules);
			if ($rulesStr !== false) {
				return $rulesStr;
			}
		}

		return null;
	}
}