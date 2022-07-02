<?php

namespace App\Form;

use App\Entity\Severity;
use App\LiveFormValidation\Rule\Generator\ConstraintRulesGenerator;
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
				'class' 		=> Severity::class,
				'choice_label'	=> 'label',
				'label'			=> 'Severity'
			])
			->add('reporterName', TextType::class, [
				'label' => 'Name'
			])
			->add('reporterSurname', TextType::class, [
				'label' => 'Surname'
			])
			->add('reporterEmail', TextType::class, [
				'label' => 'Email'
			])
			->add('comment', TextareaType::class, [
				'label' 	=> 'Comment',
				'required'	=> false
			])
			->add('longitude', NumberType::class, [
				'label' 		=> 'Longitude',
				'constraints'	=> [
					new Range([
						'min' 				=> $this->westernLimit,
						'max' 				=> $this->easternLimit,
						'notInRangeMessage'	=> 'This value should be between {{ min }} and {{ max }}. You are probably outside the permitted area.'
					])
				]
			])
			->add('latitude', NumberType::class, [
				'label' 		=> 'Latitude',
				'constraints'	=> [
					new Range([
						'min' 				=> $this->southernLimit,
						'max' 				=> $this->northernLimit,
						'notInRangeMessage'	=> 'This value should be between {{ min }} and {{ max }}. You are probably outside the permitted area.'
					])
				]
			]);

		$this->constraintRulesGenerator->generateConstraintRules($builder);

		return $builder->getForm();
	}
}