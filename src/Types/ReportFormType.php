<?php

namespace App\Types;

use App\Entity\Severity;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;

/**
 *
 */
class ReportFormType extends AbstractType
{
	/**
	 *
	 */
	public function buildForm(FormBuilderInterface $builder, array $options)
	{
		$builder
			->add('severity', EntityType::class, [
				'class' 		=> Severity::class,
				'choice_label'	=> 'label',
				'label'			=> 'Severity'
			])
			->add('reporterName', TextType::class, [
				'label' => 'Name',
				'required'	=> true
			])
			->add('reporterSurname', TextType::class, [
				'label' => 'Surname',
				'required'	=> true
			])
			->add('reporterEmail', EmailType::class, [
				'label' => 'Email'
			])
			->add('comment', TextareaType::class, [
				'label' => 'Comment'
			])
			->add('long', NumberType::class, [
				'label' => 'Longitude'
			])
			->add('lat', NumberType::class, [
				'label' => 'Latitude'
			]);
	}
}