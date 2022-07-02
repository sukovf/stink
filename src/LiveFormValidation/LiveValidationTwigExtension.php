<?php

namespace App\LiveFormValidation;

use App\LiveFormValidation\Rule\RuleOperations;
use Symfony\Component\Form\FormView;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

/**
 *
 */
class LiveValidationTwigExtension extends AbstractExtension
{
	/**
	 *
	 */
	public function getFunctions(): array
	{
		return [
			new TwigFunction('is_input_required', [$this, 'isInputRequired'])
		];
	}

	/**
	 * @param FormView $formView
	 *
	 * @return bool
	 */
	public function isInputRequired(FormView $formView): bool
	{
		if (!isset($formView->vars['attr']['data-validation-rules'])) {
			return false;
		}

		$parsedAttributes = json_decode($formView->vars['attr']['data-validation-rules'], true);
		if ($parsedAttributes === null) {
			return false;
		}

		if (!is_array($parsedAttributes)) {
			return false;
		}

		foreach ($parsedAttributes as $parsedAttribute) {
			if (isset($parsedAttribute['op']) && $parsedAttribute['op'] === RuleOperations::NOT_BLANK) {
				return true;
			}
		}

		return false;
	}
}