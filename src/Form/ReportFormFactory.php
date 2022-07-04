<?php

namespace App\Form;

use App\Entity\Severity;
use App\LiveFormValidation\Rule\Generator\ConstraintRulesGenerator;
use App\Types\RecaptchaType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Validator\Constraints\Range;

/**
 *
 */
class ReportFormFactory
{
	/** @var ConstraintRulesGenerator */
	private ConstraintRulesGenerator $constraintRulesGenerator;

	/** @var float */
	private float $westernLimit;

	/** @var float */
	private float $northernLimit;

	/** @var float */
	private float $easternLimit;

	/** @var float */
	private float $southernLimit;

	/**
	 *
	 */
	public function __construct(ConstraintRulesGenerator $constraintRulesGenerator, float $westernLimit, float $northernLimit, float $easternLimit, float $southernLimit)
	{
		$this->constraintRulesGenerator = $constraintRulesGenerator;
		$this->westernLimit = $westernLimit;
		$this->northernLimit = $northernLimit;
		$this->easternLimit = $easternLimit;
		$this->southernLimit = $southernLimit;
	}

	/**
	 *
	 */
	public function create(FormBuilderInterface $builder): FormInterface
	{
		$builder
			->add('severity', EntityType::class, [
				'class' 					=> Severity::class,
				'choice_label'				=> 'label',
				'choice_translation_domain'	=> 'messages',
				'label'						=> 'form.severity'
			])
			->add('reporterName', TextType::class, [
				'label' 	=> 'form.reporter_name',
				'required'	=> false
			])
			->add('reporterSurname', TextType::class, [
				'label' 	=> 'form.reporter_surname',
				'required'	=> false
			])
			->add('reporterEmail', TextType::class, [
				'label' 	=> 'form.reporter_email',
				'required'	=> false
			])
			->add('comment', TextareaType::class, [
				'label' 	=> 'form.comment',
				'required'	=> false
			])
			->add('longitude', NumberType::class, [
				'label' 		=> 'form.longitude',
				'constraints'	=> [
					new Range([
						'min' 				=> $this->westernLimit,
						'max' 				=> $this->easternLimit,
						'notInRangeMessage'	=> 'form.longitude'
					])
				]
			])
			->add('latitude', NumberType::class, [
				'label' 		=> 'form.latitude',
				'constraints'	=> [
					new Range([
						'min' 				=> $this->southernLimit,
						'max' 				=> $this->northernLimit,
						'notInRangeMessage'	=> 'form.latitude'
					])
				]
			])
			->add('captcha', RecaptchaType::class, [
				'type' => 'invisible'
			]);

		$this->constraintRulesGenerator->generateConstraintRules($builder);

		return $builder->getForm();
	}
}