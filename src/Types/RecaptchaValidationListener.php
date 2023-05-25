<?php

namespace App\Types;

use ReCaptcha\ReCaptcha;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Form\FormError;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\ConstraintViolation;

class RecaptchaValidationListener implements EventSubscriberInterface
{
	private ReCaptcha $reCaptcha;

	public function __construct(ReCaptcha $reCaptcha)
	{
		$this->reCaptcha = $reCaptcha;
	}

	public static function getSubscribedEvents(): array
	{
		return [
			FormEvents::POST_SUBMIT => 'onPostSubmit'
		];
	}

	public function onPostSubmit(FormEvent $event): void
	{
		$request = Request::createFromGlobals();

		$result =
			$this->reCaptcha
				->setExpectedHostname($request->getHost())
				->verify(
					strval($request->request->get('g-recaptcha-response')),
					$request->getClientIp()
				);

		if ($result->isSuccess()) {
			return;
		}

		$event
			->getForm()
			->addError(
				new FormError(
					'You are a robot!',
					cause: new ConstraintViolation(
						'You are a robot!',
						'',
						[],
						false,
						'recaptcha',
						false
					)
				)
			);
	}
}