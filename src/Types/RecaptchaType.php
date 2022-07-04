<?php

namespace App\Types;

use ReCaptcha\ReCaptcha;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 *
 */
class RecaptchaType extends AbstractType
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
	public function buildView(FormView $view, FormInterface $form, array $options)
	{
		$view->vars['type'] = $options['type'];
	}

	/**
	 *
	 */
	public function buildForm(FormBuilderInterface $builder, array $options)
	{
		$builder->addEventSubscriber(new RecaptchaValidationListener($this->reCaptcha));
	}

	/**
	 *
	 */
	public function configureOptions(OptionsResolver $resolver)
	{
		$resolver
			->setDefault('mapped', false)
			->setDefault('type', 'invisible')
			->setAllowedValues('type', ['checkbox', 'invisible']);
	}
}