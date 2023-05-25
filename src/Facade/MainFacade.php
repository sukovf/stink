<?php

namespace App\Facade;

use Symfony\Component\Form\FormInterface;
use Symfony\Component\Validator\ConstraintViolationInterface;

class MainFacade
{
	public function shouldDetailCardBeVisible(FormInterface $form): bool
	{
		if (!$form->isSubmitted() || $form->isValid()) {
			return false;
		}

		foreach ($form->getErrors(true) as $error) {
			if (!($error->getCause() instanceof ConstraintViolationInterface)) {
				continue;
			}

			$propertyPath = $error->getCause()->getPropertyPath();
			if (str_contains($propertyPath, 'severity') ||
				str_contains($propertyPath, 'reporterName') ||
				str_contains($propertyPath, 'reporterSurname') ||
				str_contains($propertyPath, 'reporterEmail')) {
				return true;
			}
		}

		return false;
	}

	public function shouldLocationCardBeVisible(FormInterface $form): bool
	{
		if (!$form->isSubmitted() || $form->isValid()) {
			return false;
		}

		foreach ($form->getErrors(true) as $error) {
			if (!($error->getCause() instanceof ConstraintViolationInterface)) {
				continue;
			}

			$propertyPath = $error->getCause()->getPropertyPath();
			if (str_contains($propertyPath, 'longitude') ||
				str_contains($propertyPath, 'latitude')) {
				return true;
			}
		}

		return false;
	}

	public function isUserRobot(FormInterface $form): bool
	{
		if (!$form->isSubmitted() || $form->isValid()) {
			return false;
		}

		foreach ($form->getErrors(true) as $error) {
			if (!($error->getCause() instanceof ConstraintViolationInterface)) {
				continue;
			}

			$propertyPath = $error->getCause()->getPropertyPath();
			if (str_contains($propertyPath, 'recaptcha')) {
				return true;
			}
		}

		return false;
	}
}