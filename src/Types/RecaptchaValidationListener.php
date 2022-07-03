<?php

namespace App\Types;

use ReCaptcha\ReCaptcha;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Form\FormError;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\ConstraintViolation;

/**
 *
 */
class RecaptchaValidationListener implements EventSubscriberInterface
{
	/** @var ReCaptcha */
	private ReCaptcha $reCaptcha;

	/**
	 *
	 */
	public function __construct(ReCaptcha $reCaptcha)
	{
		$this->reCaptcha = $reCaptcha;
	}

	/**
	 *
	 */
	public static function getSubscribedEvents(): array
	{
		return [
			FormEvents::POST_SUBMIT => 'onPostSubmit'
		];
	}

	/**
	 *
	 */
	public function onPostSubmit(FormEvent $event)
	{
		$request = Request::createFromGlobals();

		$result = $this->reCaptcha
			->setExpectedHostname($request->getHost())
			->verify($request->request->get('g-recaptcha-response'), $request->getClientIp());

		if (!$result->isSuccess()) {
			$event->getForm()->addError(
				new FormError(
					'You are a robot!',
					cause: new ConstraintViolation(
						'You are a robot!',
						'',
						[],
						false,
						'recaptcha',
						false
					)));
		}
	}
}