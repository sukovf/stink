<?php

namespace App\Types;

use ReCaptcha\ReCaptcha;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RecaptchaType extends AbstractType
{
	private ReCaptcha $reCaptcha;

	public function __construct(ReCaptcha $reCaptcha)
	{
		$this->reCaptcha = $reCaptcha;
	}

	public function buildView(FormView $view, FormInterface $form, array $options): void
	{
		$view->vars['type'] = $options['type'];
	}

	public function buildForm(FormBuilderInterface $builder, array $options): void
	{
		$builder->addEventSubscriber(new RecaptchaValidationListener($this->reCaptcha));
	}

	public function configureOptions(OptionsResolver $resolver): void
	{
		$resolver
			->setDefault('mapped', false)
			->setDefault('type', 'invisible')
			->setAllowedValues('type', ['checkbox', 'invisible']);
	}
}