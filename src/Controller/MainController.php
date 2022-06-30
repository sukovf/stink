<?php

namespace App\Controller;

use App\Mapbox\MapFactory;
use App\Types\ReportFormType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 *
 */
class MainController extends AbstractController
{
	/**
	 * @Route("/", name="main")
	 */
	public function index(MapFactory $mapFactory): Response
	{
		$map = $mapFactory->create();

		$reportForm = $this->createForm(ReportFormType::class);

		return $this->render('base.html.twig', [
			'map'			=> $map,
			'reportForm'	=> $reportForm->createView()
		]);
	}
}