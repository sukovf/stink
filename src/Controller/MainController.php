<?php

namespace App\Controller;

use App\Entity\Report;
use App\Entity\Severity;
use App\Mapbox\MapFactory;
use App\Types\ReportFormType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
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
	public function index(Request $request, MapFactory $mapFactory, EntityManagerInterface $entityManager): Response
	{
		$map = $mapFactory->create();

		$report = new Report();
		$reportForm = $this->createForm(ReportFormType::class, $report)
			->handleRequest($request);

		$severities = $entityManager->getRepository(Severity::class)->findAll();

		if ($reportForm->isSubmitted() && $reportForm->isValid()) {
			$this->redirect('this');
		}

		return $this->render('base.html.twig', [
			'map'			=> $map,
			'severities'	=> $severities,
			'reportForm'	=> $reportForm->createView()
		]);
	}
}